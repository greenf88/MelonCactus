import { createHash } from "node:crypto";

import {
  DossierRevisionConflictError,
  type LocalAgentRun,
  LocalIntelligenceStore,
} from "./local-store";
import { buildRedTeamBrief, type RedTeamBrief } from "./red-team";
import type { ConfidenceLevel, VerificationReview } from "./types";

const PUBLIC_TEST_CLASSIFICATIONS = new Set(["fictional-test-data", "public-only-test"]);
const MAX_FINDINGS = 25;
const ALLOWED_OUTPUT_KEYS = new Set([
  "verdict",
  "confidenceAfter",
  "alternativeExplanations",
  "unresolvedGaps",
  "notes",
  "usage",
]);

export interface RedTeamEvaluator {
  readonly kind: "red_team_evaluation";
  readonly name: string;
  readonly modelProvider: string;
  readonly modelName: string;
  evaluate(input: { brief: RedTeamBrief; signal: AbortSignal }): Promise<unknown>;
}

export interface RedTeamAgentInput {
  dossierId: string;
  reviewerRef: string;
  timeoutMs?: number;
}

export interface RedTeamAgentResult {
  run: LocalAgentRun;
  reviews: VerificationReview[];
  evaluatedFindings: number;
}

interface ValidatedEvaluation {
  verdict: VerificationReview["verdict"];
  confidenceAfter: ConfidenceLevel;
  alternativeExplanations: string[];
  unresolvedGaps: string[];
  notes?: string;
  usage: { inputTokens: number; outputTokens: number; estimatedCostMicros: number };
}

export class RedTeamAgentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RedTeamAgentError";
  }
}

class RedTeamToolError extends RedTeamAgentError {
  constructor(message: string) {
    super(message);
    this.name = "RedTeamToolError";
  }
}

export async function runRedTeamAgent(
  store: LocalIntelligenceStore,
  input: RedTeamAgentInput,
  evaluator: RedTeamEvaluator,
): Promise<RedTeamAgentResult> {
  const dossier = store.getDossier(input.dossierId);
  if (!dossier) throw new RedTeamAgentError("Dossier not found.");
  if (!PUBLIC_TEST_CLASSIFICATIONS.has(String(dossier.scope.classification ?? ""))) {
    throw new RedTeamAgentError(
      "Red-team execution is limited to fictional-test-data or public-only-test dossiers.",
    );
  }
  if (evaluator.kind !== "red_team_evaluation") {
    throw new RedTeamAgentError("Only the red_team_evaluation capability is allowed.");
  }
  const reviewerRef = requireBoundedText(input.reviewerRef, "reviewerRef", 200);
  const evaluatorName = requireBoundedText(evaluator.name, "evaluator.name", 100);
  const modelProvider = requireBoundedText(evaluator.modelProvider, "modelProvider", 100);
  const modelName = requireBoundedText(evaluator.modelName, "modelName", 200);
  const timeoutMs = requireInteger(input.timeoutMs ?? 15_000, "timeoutMs", 1, 30_000);
  const bundle = store.getBundle(dossier.id);
  const findings = bundle.findings.filter((finding) => finding.material);
  if (findings.length === 0 || findings.length > MAX_FINDINGS) {
    throw new RedTeamAgentError(`Red-team input must contain 1 to ${MAX_FINDINGS} material findings.`);
  }
  const sameAuthor = findings.find(
    (finding) => finding.createdBy.trim().toLowerCase() === reviewerRef.toLowerCase(),
  );
  if (sameAuthor) {
    throw new RedTeamAgentError(
      `Red-team reviewer must be independent from the author of ${sameAuthor.code}.`,
    );
  }
  const briefs = findings.map((finding) => ({
    finding,
    brief: buildRedTeamBrief({
      finding,
      links: bundle.links,
      evidence: bundle.evidence,
      sources: bundle.sources,
    }),
  }));
  const missingEvidence = briefs.find((item) => item.brief.supportingEvidence.length === 0);
  if (missingEvidence) {
    throw new RedTeamAgentError(`${missingEvidence.finding.code} has no supporting evidence.`);
  }

  const actor = { type: "agent" as const, ref: reviewerRef };
  const run = store.beginAgentRun({
    dossierId: dossier.id,
    jobKey: "red-team",
    agentRole: "red_team",
    runnerRef: reviewerRef,
    inputHash: hashJson({ evaluatorName, briefs: briefs.map((item) => item.brief) }),
    modelProvider,
    modelName,
  });
  const completionRevision = store.getDossierRevision(dossier.id);

  try {
    const evaluations: Array<{
      finding: (typeof findings)[number];
      evaluation: ValidatedEvaluation;
    }> = [];
    for (const item of briefs) {
      const raw = await evaluateWithTimeout(evaluator, item.brief, timeoutMs);
      evaluations.push({ finding: item.finding, evaluation: validateEvaluation(raw) });
    }
    const usage = evaluations.reduce(
      (total, item) => ({
        inputTokens: total.inputTokens + item.evaluation.usage.inputTokens,
        outputTokens: total.outputTokens + item.evaluation.usage.outputTokens,
        estimatedCostMicros:
          total.estimatedCostMicros + item.evaluation.usage.estimatedCostMicros,
      }),
      { inputTokens: 0, outputTokens: 0, estimatedCostMicros: 0 },
    );
    const outputHash = hashJson(
      evaluations.map(({ finding, evaluation }) => ({ findingCode: finding.code, ...evaluation })),
    );
    let reviews: VerificationReview[] = [];
    let completedRun: LocalAgentRun | undefined;
    store.withExpectedDossierRevision(dossier.id, completionRevision, () => {
      const completedAt = new Date().toISOString();
      reviews = evaluations.map(({ finding, evaluation }) =>
        store.addVerificationReview(
          dossier.id,
          {
            findingId: finding.id,
            reviewType: "red_team",
            reviewerKind: "agent",
            reviewerRef,
            verdict: evaluation.verdict,
            confidenceBefore: finding.confidence,
            confidenceAfter: evaluation.confidenceAfter,
            alternativeExplanations: evaluation.alternativeExplanations,
            unresolvedGaps: evaluation.unresolvedGaps,
            notes: evaluation.notes,
            completedAt,
          },
          actor,
        ),
      );
      completedRun = store.completeAgentRun({
        dossierId: dossier.id,
        runId: run.id,
        outputHash,
        ...usage,
        actor,
      });
      store.updateResearchJobStatus({
        dossierId: dossier.id,
        jobKey: "red-team",
        status: "completed",
        actor,
      });
    });
    return { run: completedRun!, reviews, evaluatedFindings: findings.length };
  } catch (error) {
    const reasonCode = error instanceof DossierRevisionConflictError
      ? "stale_output"
      : error instanceof RedTeamToolError || !(error instanceof RedTeamAgentError)
        ? "tool_failure"
        : "validation_failure";
    safeFailRun(store, dossier.id, run.id, reasonCode, actor);
    throw error;
  }
}

async function evaluateWithTimeout(
  evaluator: RedTeamEvaluator,
  brief: RedTeamBrief,
  timeoutMs: number,
): Promise<unknown> {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new RedTeamToolError("Red-team evaluator timed out."));
      controller.abort();
    }, timeoutMs);
  });
  try {
    return await Promise.race([evaluator.evaluate({ brief, signal: controller.signal }), timeoutPromise]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function validateEvaluation(value: unknown): ValidatedEvaluation {
  if (!isRecord(value)) throw new RedTeamAgentError("Red-team output must be an object.");
  const unknownKey = Object.keys(value).find((key) => !ALLOWED_OUTPUT_KEYS.has(key));
  if (unknownKey) throw new RedTeamAgentError(`Red-team output contains an unsupported field: ${unknownKey}.`);
  const verdict = oneOf(value.verdict, ["pass", "qualified", "inconclusive", "reject"] as const, "verdict");
  const confidenceAfter = oneOf(
    value.confidenceAfter,
    ["high", "moderate", "low", "unknown"] as const,
    "confidenceAfter",
  );
  return {
    verdict,
    confidenceAfter,
    alternativeExplanations: textList(value.alternativeExplanations, "alternativeExplanations"),
    unresolvedGaps: textList(value.unresolvedGaps, "unresolvedGaps"),
    notes: optionalText(value.notes, "notes", 4_000),
    usage: validateUsage(value.usage),
  };
}

function validateUsage(value: unknown): ValidatedEvaluation["usage"] {
  if (value === undefined) return { inputTokens: 0, outputTokens: 0, estimatedCostMicros: 0 };
  if (!isRecord(value)) throw new RedTeamAgentError("usage must be an object.");
  const keys = Object.keys(value);
  if (keys.some((key) => !["inputTokens", "outputTokens", "estimatedCostMicros"].includes(key))) {
    throw new RedTeamAgentError("usage contains an unsupported field.");
  }
  return {
    inputTokens: requireInteger(value.inputTokens, "usage.inputTokens", 0, 10_000_000),
    outputTokens: requireInteger(value.outputTokens, "usage.outputTokens", 0, 10_000_000),
    estimatedCostMicros: requireInteger(
      value.estimatedCostMicros,
      "usage.estimatedCostMicros",
      0,
      1_000_000_000,
    ),
  };
}

function textList(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.length > 10) {
    throw new RedTeamAgentError(`${label} must be an array with at most 10 items.`);
  }
  return value.map((item, index) => requireBoundedText(item, `${label}[${index}]`, 2_000));
}

function oneOf<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  label: string,
): T[number] {
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw new RedTeamAgentError(`${label} is invalid.`);
  }
  return value as T[number];
}

function optionalText(value: unknown, label: string, maxLength: number): string | undefined {
  if (value === undefined) return undefined;
  return requireBoundedText(value, label, maxLength);
}

function requireBoundedText(value: unknown, label: string, maxLength: number): string {
  if (typeof value !== "string") throw new RedTeamAgentError(`${label} must be text.`);
  const text = value.trim();
  if (!text || text.length > maxLength) {
    throw new RedTeamAgentError(`${label} must contain 1 to ${maxLength} characters.`);
  }
  return text;
}

function requireInteger(
  value: unknown,
  label: string,
  minimum: number,
  maximum: number,
): number {
  if (!Number.isInteger(value) || (value as number) < minimum || (value as number) > maximum) {
    throw new RedTeamAgentError(`${label} must be an integer from ${minimum} through ${maximum}.`);
  }
  return value as number;
}

function safeFailRun(
  store: LocalIntelligenceStore,
  dossierId: string,
  runId: string,
  reasonCode: "tool_failure" | "validation_failure" | "stale_output",
  actor: { type: "agent"; ref: string },
): void {
  const current = store.listAgentRuns(dossierId).find((candidate) => candidate.id === runId);
  if (current?.status !== "started") return;
  try {
    store.failAgentRun({ dossierId, runId, reasonCode, actor });
  } catch {
    // Preserve the original runner failure; integrity verification exposes an unclosed run.
  }
}

function hashJson(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
