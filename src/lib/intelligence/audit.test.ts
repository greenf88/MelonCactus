import { describe, expect, it } from "vitest";
import { buildAuditEvent } from "./audit";

describe("audit event hashing", () => {
  it("builds a deterministic hash chain from allowlisted metadata", () => {
    const first = buildAuditEvent({
      occurredAt: "2026-10-16T18:00:00.000Z",
      actorType: "system",
      actorRef: "phase1-test",
      action: "insert",
      objectType: "dossier",
      objectId: "1",
      metadata: { dossierNumber: "2610001", statusTo: "enquiry" },
    });
    const second = buildAuditEvent({
      occurredAt: "2026-10-16T18:01:00.000Z",
      actorType: "human",
      actorRef: "operator-1",
      action: "status_changed",
      objectType: "dossier",
      objectId: "1",
      previousHash: first.eventHash,
      metadata: { statusFrom: "enquiry", statusTo: "scoped" },
    });

    expect(first.eventHash).toMatch(/^[a-f0-9]{64}$/);
    expect(second.previousHash).toBe(first.eventHash);
    expect(second.eventHash).not.toBe(first.eventHash);
    expect(buildAuditEvent({ ...first, eventHash: undefined } as never).eventHash).toBe(first.eventHash);
  });

  it("refuses client content and secrets in audit metadata", () => {
    expect(() =>
      buildAuditEvent({
        occurredAt: "2026-10-16T18:00:00.000Z",
        actorType: "agent",
        actorRef: "research-agent",
        action: "completed",
        objectType: "job",
        objectId: "1",
        metadata: { email: "confidential@example.com" },
      }),
    ).toThrow("Audit metadata key is not allowed");
  });
});
