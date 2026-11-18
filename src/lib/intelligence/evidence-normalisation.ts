import { createHash } from "node:crypto";

import {
  DossierRevisionConflictError,
  type LocalAgentRun,
  LocalIntelligenceStore,
} from "./local-store";
import { evidenceClasses, type EvidenceClass, type EvidenceRecord } from "./types";

const PUBLIC_TEST_CLASSIFICATIONS = new Set(["fictional-test-data", "public-only-test"]);
const ALLOWED_ITEM_KEYS = new Set([
  "code",
  "sourceId",
  "evidenceClass",
  "observation",
  "locator",
  "observedAt",
]);
const SCHEMA_VERSION = "evidence-normalisation-v1";
const MAX_ITEMS = 100;

export interface EvidenceNormalisationInput {
  dossierId: string;
  runnerRef: string;
  items: unknown[];
}

export interface EvidenceNormalisationResult {
  run: LocalAgentRun;
  evidence: EvidenceRecord[];
  schemaVersion: typeof SCHEMA_VERSION;
  modelUsed: false;
  estimatedCostMicros: 0;
}

interface NormalisedItem {
  code: string;
  sourceId: string;
  evidenceClass: EvidenceClass;
  observation: string;
  locator: string;
  observedAt?: string;
  contentSha256: string;
}

export class EvidenceNormalisationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvidenceNormalisationError";
  }
}

export function runEvidenceNormalisationAgent(
  store: LocalIntelligenceStore,
  input: EvidenceNormalisationInput,
): EvidenceNormalisationResult {
  const dossier = store.getDossier(input.dossierId);
  if (!dossier) throw new EvidenceNormalisationError("Dossier not found.");
  if (!PUBLIC_TEST_CLASSIFICATIONS.has(String(dossier.scope.classification ?? ""))) {
    throw new EvidenceNormalisationError(
      "Evidence normalisation is limited to fictional-test-data or public-only-test dossiers.",
    );
  }
  const runnerRef = requireBoundedText(input.runnerRef, "runnerRef", 200);
  const sourceIds = new Set(store.getBundle(dossier.id).sources.map((source) => source.id));
  const items = validateItems(input.items, sourceIds);
  const inputHash = hashJson({
    dossierId: dossier.id,
    schemaVersion: SCHEMA_VERSION,
    items: items.map((item) => ({
      code: item.code,
      sourceId: item.sourceId,
      evidenceClass: item.evidenceClass,
      locator: item.locator,
      observedAt: item.observedAt,
      contentSha256: item.contentSha256,
    })),
  });
  const actor = { type: "agent" as const, ref: runnerRef };
  const run = store.beginAgentRun({
    dossierId: dossier.id,
    jobKey: "evidence",
    agentRole: "evidence_normalisation",
    runnerRef,
    inputHash,
    modelProvider: "none",
    modelName: SCHEMA_VERSION,
  });
  const completionRevision = store.getDossierRevision(dossier.id);

  try {
    let evidence: EvidenceRecord[] = [];
    let completedRun: LocalAgentRun | undefined;
    const outputHash = hashJson({
      schemaVersion: SCHEMA_VERSION,
      records: items.map((item) => ({
        code: item.code,
        sourceId: item.sourceId,
        evidenceClass: item.evidenceClass,
        contentSha256: item.contentSha256,
      })),
    });
    store.withExpectedDossierRevision(dossier.id, completionRevision, () => {
      evidence = items.map((item) =>
        store.addNormalisedEvidence(
          dossier.id,
          {
            ...item,
            normalisationRunId: run.id,
            normalisationSchemaVersion: SCHEMA_VERSION,
          },
          actor,
        ),
      );
      completedRun = store.completeAgentRun({
        dossierId: dossier.id,
        runId: run.id,
        outputHash,
        inputTokens: 0,
        outputTokens: 0,
        estimatedCostMicros: 0,
        actor,
      });
      store.updateResearchJobStatus({
        dossierId: dossier.id,
        jobKey: "evidence",
        status: "completed",
        actor,
      });
    });
    return {
      run: completedRun!,
      evidence,
      schemaVersion: SCHEMA_VERSION,
      modelUsed: false,
      estimatedCostMicros: 0,
    };
  } catch (error) {
    safeFailRun(
      store,
      dossier.id,
      run.id,
      error instanceof DossierRevisionConflictError ? "stale_output" : "validation_failure",
      actor,
    );
    throw error;
  }
}

function validateItems(values: unknown, sourceIds: Set<string>): NormalisedItem[] {
  if (!Array.isArray(values) || values.length === 0 || values.length > MAX_ITEMS) {
    throw new EvidenceNormalisationError(`Evidence input must contain 1 to ${MAX_ITEMS} records.`);
  }
  const codes = new Set<string>();
  const hashes = new Set<string>();
  return values.map((value, index) => {
    if (!isRecord(value)) {
      throw new EvidenceNormalisationError(`Evidence record ${index + 1} must be an object.`);
    }
    const unknownKey = Object.keys(value).find((key) => !ALLOWED_ITEM_KEYS.has(key));
    if (unknownKey) {
      throw new EvidenceNormalisationError(
        `Evidence record ${index + 1} contains an unsupported field: ${unknownKey}.`,
      );
    }
    const code = requireBoundedText(value.code, `items[${index}].code`, 60).toUpperCase();
    if (!/^E-[0-9]{2,6}$/.test(code)) {
      throw new EvidenceNormalisationError(`Evidence code must match E-[0-9]{2,6}: ${code}.`);
    }
    if (codes.has(code)) throw new EvidenceNormalisationError(`Duplicate evidence code: ${code}.`);
    codes.add(code);
    const sourceId = requireBoundedText(value.sourceId, `items[${index}].sourceId`, 100);
    if (!sourceIds.has(sourceId)) {
      throw new EvidenceNormalisationError(
        `Evidence source ID is not registered in this dossier: ${sourceId}.`,
      );
    }
    const evidenceClass = requireEvidenceClass(value.evidenceClass, index);
    const observation = requireBoundedText(value.observation, `items[${index}].observation`, 8_000);
    const locator = requireBoundedText(value.locator, `items[${index}].locator`, 1_000);
    const observedAt = optionalIsoDate(value.observedAt, `items[${index}].observedAt`);
    const contentSha256 = hashJson({
      sourceId,
      evidenceClass,
      observation,
      locator,
      observedAt,
    });
    if (hashes.has(contentSha256)) {
      throw new EvidenceNormalisationError(`Evidence record ${index + 1} duplicates earlier content.`);
    }
    hashes.add(contentSha256);
    return { code, sourceId, evidenceClass, observation, locator, observedAt, contentSha256 };
  });
}

function requireEvidenceClass(value: unknown, index: number): EvidenceClass {
  if (typeof value !== "string" || !evidenceClasses.includes(value as EvidenceClass)) {
    throw new EvidenceNormalisationError(`items[${index}].evidenceClass is invalid.`);
  }
  return value as EvidenceClass;
}

function optionalIsoDate(value: unknown, label: string): string | undefined {
  if (value === undefined) return undefined;
  const text = requireBoundedText(value, label, 50);
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) throw new EvidenceNormalisationError(`${label} is invalid.`);
  return date.toISOString();
}

function requireBoundedText(value: unknown, label: string, maxLength: number): string {
  if (typeof value !== "string") throw new EvidenceNormalisationError(`${label} must be text.`);
  const text = value.trim();
  if (!text || text.length > maxLength) {
    throw new EvidenceNormalisationError(`${label} must contain 1 to ${maxLength} characters.`);
  }
  return text;
}

function safeFailRun(
  store: LocalIntelligenceStore,
  dossierId: string,
  runId: string,
  reasonCode: "validation_failure" | "stale_output",
  actor: { type: "agent"; ref: string },
): void {
  const current = store.listAgentRuns(dossierId).find((candidate) => candidate.id === runId);
  if (current?.status !== "started") return;
  try {
    store.failAgentRun({ dossierId, runId, reasonCode, actor });
  } catch {
    // Preserve the original failure; integrity verification exposes a run that could not be closed.
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
