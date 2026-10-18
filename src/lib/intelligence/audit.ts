import { createHash } from "node:crypto";

const allowedMetadataKeys = new Set([
  "approvalDecision",
  "dossierNumber",
  "evidenceCode",
  "findingCode",
  "jobKind",
  "modelName",
  "modelProvider",
  "reasonCode",
  "retentionAction",
  "retentionCategory",
  "retentionCategoryCount",
  "sourceCode",
  "statusFrom",
  "statusTo",
  "version",
]);

export interface AuditEventInput {
  occurredAt: string;
  actorType: "human" | "agent" | "system";
  actorRef: string;
  action: string;
  objectType: string;
  objectId: string;
  metadata?: Record<string, string | number | boolean | null>;
  previousHash?: string;
}

export interface AuditEvent extends AuditEventInput {
  metadata: Record<string, string | number | boolean | null>;
  eventHash: string;
}

export function buildAuditEvent(input: AuditEventInput): AuditEvent {
  const metadata = sanitizeAuditMetadata(input.metadata ?? {});
  const previousHash = input.previousHash?.toLowerCase();

  if (previousHash && !/^[a-f0-9]{64}$/.test(previousHash)) {
    throw new TypeError("Previous audit hash must be a SHA-256 hex digest.");
  }

  const occurredAt = new Date(input.occurredAt);
  if (Number.isNaN(occurredAt.getTime())) {
    throw new TypeError("Audit event requires a valid timestamp.");
  }

  for (const [label, value] of [
    ["actorRef", input.actorRef],
    ["action", input.action],
    ["objectType", input.objectType],
    ["objectId", input.objectId],
  ] as const) {
    if (!value.trim()) throw new TypeError(`${label} must not be empty.`);
  }

  const canonical = canonicalJson({
    previousHash: previousHash ?? null,
    occurredAt: occurredAt.toISOString(),
    actorType: input.actorType,
    actorRef: input.actorRef,
    action: input.action,
    objectType: input.objectType,
    objectId: input.objectId,
    metadata,
  });

  return {
    ...input,
    occurredAt: occurredAt.toISOString(),
    previousHash,
    metadata,
    eventHash: createHash("sha256").update(canonical).digest("hex"),
  };
}

export function sanitizeAuditMetadata(
  metadata: Record<string, string | number | boolean | null>,
): Record<string, string | number | boolean | null> {
  const sanitized: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (!allowedMetadataKeys.has(key)) {
      throw new TypeError(`Audit metadata key is not allowed: ${key}`);
    }
    sanitized[key] = value;
  }
  return sanitized;
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) =>
      left.localeCompare(right),
    );
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
