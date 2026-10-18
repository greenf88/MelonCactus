import { createHash } from "node:crypto";
import { isIP } from "node:net";

import {
  DossierRevisionConflictError,
  type LocalAgentRun,
  LocalIntelligenceStore,
} from "./local-store";
import type { SourceRecord } from "./types";

const PUBLIC_TEST_CLASSIFICATIONS = new Set(["fictional-test-data", "public-only-test"]);
const MAX_TOOL_RESULTS = 1_000;

export interface PublicSearchTool {
  readonly kind: "public_search";
  readonly name: string;
  search(input: {
    query: string;
    limit: number;
    signal: AbortSignal;
  }): Promise<unknown>;
}

export interface SourceDiscoveryPolicy {
  allowedDomains: string[];
  maxQueries?: number;
  maxResultsPerQuery?: number;
  maxAcceptedSources?: number;
  timeoutMs?: number;
}

export interface SourceDiscoveryInput {
  dossierId: string;
  queries: string[];
  runnerRef: string;
  policy: SourceDiscoveryPolicy;
}

export interface SourceDiscoveryRejection {
  queryIndex: number;
  resultIndex: number;
  reason:
    | "invalid_candidate"
    | "invalid_url"
    | "url_not_https"
    | "url_has_credentials"
    | "url_has_custom_port"
    | "host_not_public"
    | "domain_not_allowed"
    | "duplicate_url"
    | "result_limit_exceeded"
    | "accepted_limit_reached";
}

export interface SourceDiscoveryResult {
  run: LocalAgentRun;
  sources: SourceRecord[];
  rejected: SourceDiscoveryRejection[];
  queryCount: number;
  modelUsed: false;
  estimatedCostMicros: 0;
}

interface NormalizedPolicy {
  allowedDomains: string[];
  maxQueries: number;
  maxResultsPerQuery: number;
  maxAcceptedSources: number;
  timeoutMs: number;
}

interface CandidateSource {
  canonicalUrl: string;
  title: string;
  publisher?: string;
  publishedAt?: string;
}

export class SourceDiscoveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SourceDiscoveryError";
  }
}

class SourceDiscoveryToolError extends SourceDiscoveryError {
  constructor(message: string) {
    super(message);
    this.name = "SourceDiscoveryToolError";
  }
}

export async function runSourceDiscoveryAgent(
  store: LocalIntelligenceStore,
  input: SourceDiscoveryInput,
  tool: PublicSearchTool,
): Promise<SourceDiscoveryResult> {
  const dossier = store.getDossier(input.dossierId);
  if (!dossier) throw new SourceDiscoveryError("Dossier not found.");
  if (!PUBLIC_TEST_CLASSIFICATIONS.has(String(dossier.scope.classification ?? ""))) {
    throw new SourceDiscoveryError(
      "Source discovery is limited to fictional-test-data or public-only-test dossiers.",
    );
  }
  if (tool.kind !== "public_search") {
    throw new SourceDiscoveryError("Only the public_search tool capability is allowed.");
  }
  const toolName = requireBoundedText(tool.name, "tool.name", 100);
  const runnerRef = requireBoundedText(input.runnerRef, "runnerRef", 200);
  const queries = normalizeQueries(input.queries, input.policy.maxQueries ?? 3);
  const policy = normalizePolicy(input.policy);
  const inputHash = hashJson({
    dossierId: dossier.id,
    toolKind: tool.kind,
    toolName,
    queries,
    policy,
  });
  const actor = { type: "agent" as const, ref: runnerRef };
  const run = store.beginAgentRun({
    dossierId: dossier.id,
    jobKey: "discover",
    agentRole: "source_discovery",
    runnerRef,
    inputHash,
    modelProvider: "none",
    modelName: "deterministic-source-discovery-v1",
  });
  const completionRevision = store.getDossierRevision(dossier.id);

  try {
    const accepted = new Map<string, CandidateSource>();
    const rejected: SourceDiscoveryRejection[] = [];

    for (const [queryIndex, query] of queries.entries()) {
      const raw = await searchWithTimeout(tool, query, policy.maxResultsPerQuery, policy.timeoutMs);
      if (!Array.isArray(raw)) throw new SourceDiscoveryToolError("Public search tool returned a non-array result.");
      if (raw.length > MAX_TOOL_RESULTS) {
        throw new SourceDiscoveryToolError("Public search tool exceeded the absolute result safety limit.");
      }
      const bounded = raw.slice(0, policy.maxResultsPerQuery);
      for (let resultIndex = policy.maxResultsPerQuery; resultIndex < raw.length; resultIndex += 1) {
        rejected.push({ queryIndex, resultIndex, reason: "result_limit_exceeded" });
      }
      for (const [resultIndex, item] of bounded.entries()) {
        if (accepted.size >= policy.maxAcceptedSources) {
          rejected.push({ queryIndex, resultIndex, reason: "accepted_limit_reached" });
          continue;
        }
        const normalized = normalizeCandidate(item, policy.allowedDomains);
        if ("reason" in normalized) {
          rejected.push({ queryIndex, resultIndex, reason: normalized.reason });
          continue;
        }
        if (accepted.has(normalized.canonicalUrl)) {
          rejected.push({ queryIndex, resultIndex, reason: "duplicate_url" });
          continue;
        }
        accepted.set(normalized.canonicalUrl, normalized);
      }
    }

    if (accepted.size === 0) {
      safeFailRun(store, dossier.id, run.id, "no_allowed_sources", actor);
      throw new SourceDiscoveryError("No source candidate passed the public-domain policy.");
    }

    const retrievedAt = new Date().toISOString();
    const sourceInputs = [...accepted.values()].map((candidate) => ({
      code: sourceCode(candidate.canonicalUrl),
      title: candidate.title,
      canonicalUrl: candidate.canonicalUrl,
      publisher: candidate.publisher,
      sourceType: "public_web_candidate",
      publishedAt: candidate.publishedAt,
      retrievedAt,
    }));
    const outputHash = hashJson({
      sources: sourceInputs,
      rejectionCounts: countRejections(rejected),
    });
    let completedRun: LocalAgentRun | undefined;
    let sources: SourceRecord[] = [];
    store.withExpectedDossierRevision(dossier.id, completionRevision, () => {
      sources = sourceInputs.map((source) => store.addSource(dossier.id, source, actor));
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
        jobKey: "discover",
        status: "completed",
        actor,
      });
      const currentDossier = store.getDossier(dossier.id);
      if (currentDossier?.status === "scoped") {
        store.updateDossierStatus(dossier.id, "researching", actor);
      }
    });

    return {
      run: completedRun!,
      sources,
      rejected,
      queryCount: queries.length,
      modelUsed: false,
      estimatedCostMicros: 0,
    };
  } catch (error) {
    const reasonCode = error instanceof DossierRevisionConflictError
      ? "stale_output"
      : error instanceof SourceDiscoveryToolError || !(error instanceof SourceDiscoveryError)
        ? "tool_failure"
        : "policy_failure";
    safeFailRun(store, dossier.id, run.id, reasonCode, actor);
    throw error;
  }
}

function normalizePolicy(policy: SourceDiscoveryPolicy): NormalizedPolicy {
  const maxQueries = requireLimit(policy.maxQueries ?? 3, "maxQueries", 1, 5);
  const maxResultsPerQuery = requireLimit(
    policy.maxResultsPerQuery ?? 10,
    "maxResultsPerQuery",
    1,
    20,
  );
  const maxAcceptedSources = requireLimit(
    policy.maxAcceptedSources ?? 20,
    "maxAcceptedSources",
    1,
    50,
  );
  const timeoutMs = requireLimit(policy.timeoutMs ?? 10_000, "timeoutMs", 1, 30_000);
  const allowedDomains = [...new Set(policy.allowedDomains.map(normalizeAllowedDomain))].sort();
  if (allowedDomains.length === 0 || allowedDomains.length > 50) {
    throw new SourceDiscoveryError("The domain allowlist must contain between 1 and 50 domains.");
  }
  return { allowedDomains, maxQueries, maxResultsPerQuery, maxAcceptedSources, timeoutMs };
}

function normalizeQueries(queries: string[], maxQueries: number): string[] {
  const limit = requireLimit(maxQueries, "maxQueries", 1, 5);
  if (!Array.isArray(queries)) throw new SourceDiscoveryError("queries must be an array.");
  const normalized = [...new Set(queries.map((query) => requireBoundedText(query, "query", 300)))];
  if (normalized.length === 0 || normalized.length > limit) {
    throw new SourceDiscoveryError(`Source discovery requires 1 to ${limit} unique queries.`);
  }
  return normalized;
}

function normalizeAllowedDomain(value: string): string {
  const domain = requireBoundedText(value, "allowed domain", 253).toLowerCase().replace(/\.$/, "");
  if (
    domain.includes(":") ||
    domain.includes("/") ||
    domain.includes("*") ||
    isIP(domain) !== 0 ||
    domain === "localhost" ||
    domain.endsWith(".localhost") ||
    domain.endsWith(".local") ||
    !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(domain)
  ) {
    throw new SourceDiscoveryError(`Invalid public allowlist domain: ${value}`);
  }
  return domain;
}

function normalizeCandidate(
  value: unknown,
  allowedDomains: string[],
): CandidateSource | { reason: SourceDiscoveryRejection["reason"] } {
  if (!isRecord(value) || typeof value.url !== "string" || typeof value.title !== "string") {
    return { reason: "invalid_candidate" };
  }
  let parsed: URL;
  try {
    parsed = new URL(value.url);
  } catch {
    return { reason: "invalid_url" };
  }
  if (parsed.protocol !== "https:") return { reason: "url_not_https" };
  if (parsed.username || parsed.password) return { reason: "url_has_credentials" };
  if (parsed.port && parsed.port !== "443") return { reason: "url_has_custom_port" };
  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, "");
  const ipCandidate = hostname.startsWith("[") && hostname.endsWith("]")
    ? hostname.slice(1, -1)
    : hostname;
  if (
    isIP(ipCandidate) !== 0 ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    return { reason: "host_not_public" };
  }
  if (!allowedDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
    return { reason: "domain_not_allowed" };
  }
  const title = value.title.trim();
  if (!title || title.length > 500) return { reason: "invalid_candidate" };
  const publisher = optionalBoundedText(value.publisher, 300);
  if (publisher === null) return { reason: "invalid_candidate" };
  const publishedAt = optionalIsoDate(value.publishedAt);
  if (publishedAt === null) return { reason: "invalid_candidate" };
  parsed.hash = "";
  const canonicalUrl = parsed.toString();
  if (canonicalUrl.length > 2_000) return { reason: "invalid_url" };
  return {
    canonicalUrl,
    title,
    publisher: publisher ?? undefined,
    publishedAt: publishedAt ?? undefined,
  };
}

async function searchWithTimeout(
  tool: PublicSearchTool,
  query: string,
  limit: number,
  timeoutMs: number,
): Promise<unknown> {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new SourceDiscoveryToolError("Public search tool timed out."));
      controller.abort();
    }, timeoutMs);
  });
  try {
    return await Promise.race([
      tool.search({ query, limit, signal: controller.signal }),
      timeoutPromise,
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function safeFailRun(
  store: LocalIntelligenceStore,
  dossierId: string,
  runId: string,
  reasonCode: Parameters<LocalIntelligenceStore["failAgentRun"]>[0]["reasonCode"],
  actor: { type: "agent"; ref: string },
): void {
  const current = store.listAgentRuns(dossierId).find((run) => run.id === runId);
  if (current?.status !== "started") return;
  try {
    store.failAgentRun({ dossierId, runId, reasonCode, actor });
  } catch {
    // Preserve the original runner error; verification exposes a run that could not be closed.
  }
}

function sourceCode(canonicalUrl: string): string {
  return `DISC-${createHash("sha256").update(canonicalUrl).digest("hex").slice(0, 16).toUpperCase()}`;
}

function countRejections(rejected: SourceDiscoveryRejection[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of rejected) counts[item.reason] = (counts[item.reason] ?? 0) + 1;
  return counts;
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

function requireBoundedText(value: string, label: string, maxLength: number): string {
  if (typeof value !== "string") throw new SourceDiscoveryError(`${label} must be text.`);
  const result = value.trim();
  if (!result || result.length > maxLength) {
    throw new SourceDiscoveryError(`${label} must contain 1 to ${maxLength} characters.`);
  }
  return result;
}

function optionalBoundedText(value: unknown, maxLength: number): string | undefined | null {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return null;
  const result = value.trim();
  return result && result.length <= maxLength ? result : null;
}

function optionalIsoDate(value: unknown): string | undefined | null {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function requireLimit(value: number, label: string, minimum: number, maximum: number): number {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new SourceDiscoveryError(`${label} must be an integer from ${minimum} through ${maximum}.`);
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
