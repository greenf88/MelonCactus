import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { ensureFictionalDemo } from "./local-demo";
import { writeLocalDashboard } from "./local-dashboard";
import { LocalIntelligenceStore, restoreBackupToIsolatedHome } from "./local-store";

describe("LocalIntelligenceStore", () => {
  const stores: LocalIntelligenceStore[] = [];
  const directories: string[] = [];

  afterEach(() => {
    for (const store of stores.splice(0)) store.close();
    for (const directory of directories.splice(0)) {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  function createStore(): LocalIntelligenceStore {
    const directory = mkdtempSync(path.join(tmpdir(), "meloncactus-intelligence-test-"));
    directories.push(directory);
    const store = new LocalIntelligenceStore(directory);
    stores.push(store);
    return store;
  }

  it("runs a fictional dossier through evidence, red team, draft, export and audit verification", () => {
    const store = createStore();

    const result = ensureFictionalDemo(store);
    const jobs = store.listResearchJobs(result.dossier.id);
    const finalApproval = jobs.find((job) => job.key === "approval");

    expect(result.dossier.dossierNumber).toBe("9912001");
    expect(result.draftStatus).toBe("review_ready");
    expect(result.auditValid).toBe(true);
    expect(result.auditEvents).toBe(31);
    expect(existsSync(result.draftPath)).toBe(true);
    expect(jobs.filter((job) => job.execution === "agent").every((job) => job.status === "completed")).toBe(
      true,
    );
    expect(finalApproval?.status).toBe("waiting_for_approval");
    expect(store.getStatus()).toMatchObject({
      dossiers: 1,
      sources: 2,
      evidence: 2,
      findings: 1,
      pendingHumanApprovals: 1,
      auditEvents: 31,
    });
  });

  it("is idempotent when the fictional demo is resumed", () => {
    const store = createStore();

    const first = ensureFictionalDemo(store);
    const second = ensureFictionalDemo(store);

    expect(first.reused).toBe(false);
    expect(second.reused).toBe(true);
    expect(second.dossier.id).toBe(first.dossier.id);
    expect(second.auditEvents).toBe(first.auditEvents);
    expect(store.getStatus().dossiers).toBe(1);
  });

  it("writes a local-only dashboard and escapes dossier content", () => {
    const store = createStore();
    const dossier = store.registerDossier({
      receivedAt: "2026-11-02T10:00:00.000Z",
      decisionQuestion: "Could <script>alert('unsafe')</script> alter the dashboard?",
      actor: { type: "human", ref: "test-operator" },
    });
    store.ensureResearchPlan(dossier.id, { type: "system", ref: "test-system" });

    const dashboardPath = writeLocalDashboard(store);
    const dashboard = readFileSync(dashboardPath, "utf8");

    expect(dashboard).toContain("&lt;script&gt;alert(&#039;unsafe&#039;)&lt;/script&gt;");
    expect(dashboard).not.toContain("<script>alert('unsafe')</script>");
    expect(dashboard).not.toContain("https://");
  });

  it("blocks approval when evidence and verification gates are incomplete", () => {
    const store = createStore();
    const dossier = store.registerDossier({
      receivedAt: "2026-11-01T10:00:00.000Z",
      decisionQuestion: "Is this intentionally incomplete test dossier ready?",
      actor: { type: "human", ref: "test-operator" },
    });
    const draft = store.createDraft({
      dossierId: dossier.id,
      title: "Incomplete test draft",
      createdBy: "test-report-agent",
      actor: { type: "agent", ref: "test-report-agent" },
    });

    expect(draft.status).toBe("red_team_required");
    expect(() =>
      store.approveDraft({
        dossierId: dossier.id,
        draftId: draft.id,
        decidedBy: "test-human",
        rationale: "This must remain blocked.",
      }),
    ).toThrow(/NO_FINDINGS/);
  });

  it("does not create a report before its research dependencies complete", () => {
    const store = createStore();
    const dossier = store.registerDossier({
      receivedAt: "2026-11-03T10:00:00.000Z",
      decisionQuestion: "Can a report bypass the research plan?",
      actor: { type: "human", ref: "test-operator" },
    });
    store.ensureResearchPlan(dossier.id, { type: "system", ref: "test-system" });

    expect(() =>
      store.createDraft({
        dossierId: dossier.id,
        title: "Premature draft",
        createdBy: "test-report-agent",
        actor: { type: "agent", ref: "test-report-agent" },
      }),
    ).toThrow(/incomplete job: analysis/);
  });

  it("atomically rejects stale dossier revisions without retaining partial writes", () => {
    const store = createStore();
    const dossier = store.registerDossier({
      receivedAt: "2026-11-03T11:00:00.000Z",
      decisionQuestion: "Can a stale local screen overwrite newer dossier work?",
      actor: { type: "human", ref: "test-operator" },
    });
    const initialRevision = store.getDossierRevision(dossier.id);

    expect(() =>
      store.withExpectedDossierRevision(dossier.id, initialRevision, () => {
        store.addSource(
          dossier.id,
          {
            code: "SRC-ROLLBACK",
            title: "Rolled-back synthetic source",
            sourceType: "public_web",
            retrievedAt: "2026-11-03T11:05:00.000Z",
          },
          { type: "human", ref: "test-operator" },
        );
        throw new Error("Synthetic failure after a nested store mutation.");
      }),
    ).toThrow(/Synthetic failure/);
    expect(store.getBundle(dossier.id).sources).toHaveLength(0);
    expect(store.getDossierRevision(dossier.id)).toBe(initialRevision);

    store.withExpectedDossierRevision(dossier.id, initialRevision, () =>
      store.addSource(
        dossier.id,
        {
          code: "SRC-CURRENT",
          title: "Current synthetic source",
          sourceType: "public_web",
          retrievedAt: "2026-11-03T11:10:00.000Z",
        },
        { type: "human", ref: "test-operator" },
      ),
    );
    expect(store.getDossierRevision(dossier.id)).toBeGreaterThan(initialRevision);
    expect(() =>
      store.withExpectedDossierRevision(dossier.id, initialRevision, () =>
        store.addSource(
          dossier.id,
          {
            code: "SRC-STALE",
            title: "Stale synthetic source",
            sourceType: "public_web",
            retrievedAt: "2026-11-03T11:15:00.000Z",
          },
          { type: "human", ref: "stale-operator" },
        ),
      ),
    ).toThrow(/revision conflict/i);
    expect(store.getBundle(dossier.id).sources.map((source) => source.code)).toEqual([
      "SRC-CURRENT",
    ]);
  });

  it("requires a released hold and separate human approval before deletion, then reapplies it after restore", async () => {
    const store = createStore();
    const result = ensureFictionalDemo(store);
    const item = store.addRetentionItem(
      result.dossier.id,
      {
        category: "research_working_files",
        triggerAt: "2024-09-01T00:00:00.000Z",
        deadlineAt: "2026-09-01T00:00:00.000Z",
        storageLocations: ["local-control-room", "restricted-export"],
        createdBy: "retention-owner",
      },
      { type: "human", ref: "retention-owner" },
    );
    expect(() =>
      store.proposeDossierDeletion({
        dossierId: result.dossier.id,
        reviewedAt: "2099-10-17T00:00:00.000Z",
        requestedBy: "retention-owner",
        rationale: "A future review timestamp must not make a deadline appear due.",
      }),
    ).toThrow(/cannot be in the future/);
    store.placeRetentionHold({
      dossierId: result.dossier.id,
      retentionItemId: item.id,
      reason: "Synthetic claim hold for a deletion-gate test.",
      nextReviewAt: "2026-11-01T00:00:00.000Z",
      placedBy: "legal-reviewer",
    });

    expect(() =>
      store.proposeDossierDeletion({
        dossierId: result.dossier.id,
        reviewedAt: "2026-10-17T00:00:00.000Z",
        requestedBy: "retention-owner",
        rationale: "Synthetic deletion request while a hold is active.",
      }),
    ).toThrow(/legal hold/);

    store.releaseRetentionHold({
      dossierId: result.dossier.id,
      retentionItemId: item.id,
      rationale: "Synthetic hold is resolved.",
      releasedBy: "legal-reviewer",
    });
    const request = store.proposeDossierDeletion({
      dossierId: result.dossier.id,
      reviewedAt: "2026-10-17T00:00:00.000Z",
      requestedBy: "retention-owner",
      rationale: "The synthetic retention deadline has passed.",
    });
    expect(() =>
      store.approveDossierDeletion({
        dossierId: result.dossier.id,
        requestId: request.id,
        decidedBy: "RETENTION-OWNER",
        rationale: "Self-approval must remain blocked.",
      }),
    ).toThrow(/different human reviewer/);
    store.approveDossierDeletion({
      dossierId: result.dossier.id,
      requestId: request.id,
      decidedBy: "independent-retention-reviewer",
      rationale: "Synthetic independent approval after deadline and hold checks.",
    });
    store.placeRetentionHold({
      dossierId: result.dossier.id,
      retentionItemId: item.id,
      reason: "A late synthetic legal hold must still stop execution.",
      nextReviewAt: "2026-12-01T00:00:00.000Z",
      placedBy: "legal-reviewer",
    });
    expect(() =>
      store.executeApprovedDeletion({
        dossierId: result.dossier.id,
        requestId: request.id,
        executedBy: "retention-operator",
        confirmation: result.dossier.dossierNumber,
      }),
    ).toThrow(/legal hold/);
    store.releaseRetentionHold({
      dossierId: result.dossier.id,
      retentionItemId: item.id,
      rationale: "Late synthetic hold resolved after review.",
      releasedBy: "legal-reviewer",
    });
    const backupPath = await store.createBackup("before-approved-deletion");

    const entry = store.executeApprovedDeletion({
      dossierId: result.dossier.id,
      requestId: request.id,
      executedBy: "retention-operator",
      confirmation: result.dossier.dossierNumber,
    });

    expect(entry.dossierNumber).toBe("9912001");
    expect(store.verifyDeletionRegister()).toEqual({ valid: true, entries: 1 });
    expect(store.listDeletionRegister()).toHaveLength(1);
    expect(store.getBundle(result.dossier.id)).toMatchObject({
      sources: [],
      evidence: [],
      findings: [],
      links: [],
      reviews: [],
    });
    expect(store.listResearchJobs(result.dossier.id)).toHaveLength(0);
    expect(store.getLatestDraft(result.dossier.id)).toBeUndefined();
    expect(store.listRetentionItems(result.dossier.id)).toHaveLength(0);
    expect(store.listDeletionRequests(result.dossier.id)).toHaveLength(0);
    expect(store.getDossier(result.dossier.id)).toMatchObject({
      status: "closed",
      decisionQuestion: "[deleted under approved retention request]",
      createdBy: "retention-deleted",
    });
    expect(() =>
      store.addSource(
        result.dossier.id,
        {
          code: "SRC-REPOPULATE",
          title: "Deleted dossiers must not accept replacement content",
          sourceType: "synthetic_test",
          retrievedAt: "2026-10-17T01:00:00.000Z",
        },
        { type: "human", ref: "test-operator" },
      ),
    ).toThrow(/cannot receive new content/);
    expect(store.verifyAuditChain(result.dossier.id).valid).toBe(true);
    expect(existsSync(path.dirname(result.draftPath))).toBe(false);

    const restoreHome = path.join(directories[directories.length - 1], "deletion-replay-restore");
    const restored = restoreBackupToIsolatedHome(
      backupPath,
      restoreHome,
      store.deletionRegisterPath,
    );
    expect(restored.reappliedDeletions).toBe(1);
    const restoredStore = new LocalIntelligenceStore(restoreHome);
    stores.push(restoredStore);
    expect(restoredStore.getStatus()).toMatchObject({ sources: 0, evidence: 0, findings: 0 });
    expect(restoredStore.getDossier("9912001")?.decisionQuestion).toBe(
      "[deleted under approved retention request]",
    );
    expect(restoredStore.verifyDeletionRegister()).toEqual({ valid: true, entries: 1 });
    expect(restoredStore.verifyAuditChain(result.dossier.id).valid).toBe(true);
    rmSync(restoredStore.deletionRegisterPath);
    expect(restoredStore.verifyDeletionRegister()).toMatchObject({ valid: false, entries: 0 });
  });

  it("upgrades the additive local schema from version 1 to version 2", () => {
    const store = createStore();
    const homePath = store.homePath;
    store.setMeta("schema_version", "1");
    store.close();

    const reopened = new LocalIntelligenceStore(homePath);
    stores.push(reopened);
    expect(reopened.getMeta("schema_version")).toBe("2");
    expect(reopened.listDeletionRegister()).toEqual([]);
    expect(reopened.verifyDatabase()).toEqual({ valid: true, message: "ok" });
  });

  it("does not complete red-team work without a reviewer independent from the finding author", () => {
    const store = createStore();
    const dossier = store.registerDossier({
      receivedAt: "2026-11-04T10:00:00.000Z",
      decisionQuestion: "Can a finding author satisfy their own red-team gate?",
      actor: { type: "human", ref: "test-operator" },
    });
    store.ensureResearchPlan(dossier.id, { type: "system", ref: "test-system" });
    store.approveScope({
      dossierId: dossier.id,
      decidedBy: "test-human",
      rationale: "Synthetic public-only test scope.",
    });
    for (const jobKey of ["discover", "technical", "corporate"]) {
      store.updateResearchJobStatus({
        dossierId: dossier.id,
        jobKey,
        status: "completed",
        actor: { type: "agent", ref: `test-${jobKey}` },
      });
    }
    const source = store.addSource(
      dossier.id,
      {
        code: "SRC-1",
        title: "Synthetic source",
        sourceType: "public_web",
        retrievedAt: "2026-11-04T10:30:00.000Z",
      },
      { type: "human", ref: "test-human" },
    );
    const evidence = store.addEvidence(
      dossier.id,
      { sourceId: source.id, code: "EV-1", observation: "Synthetic observation." },
      { type: "human", ref: "test-human" },
    );
    store.updateResearchJobStatus({
      dossierId: dossier.id,
      jobKey: "evidence",
      status: "completed",
      actor: { type: "agent", ref: "test-evidence" },
    });
    const finding = store.addFinding(
      dossier.id,
      {
        code: "F-1",
        statement: "Synthetic finding.",
        type: "assessment",
        confidence: "low",
        rationale: "Synthetic rationale.",
        material: true,
        createdBy: "finding-author",
        status: "evidence_linked",
        informationGaps: [],
      },
      { type: "agent", ref: "finding-author" },
    );
    store.linkEvidence(dossier.id, finding.id, evidence.id, "supports", {
      type: "agent",
      ref: "finding-author",
    });
    const review = {
      findingId: finding.id,
      reviewType: "red_team" as const,
      reviewerKind: "human" as const,
      verdict: "pass" as const,
      confidenceBefore: "low" as const,
      confidenceAfter: "low" as const,
      alternativeExplanations: [],
      unresolvedGaps: [],
      completedAt: "2026-11-04T11:00:00.000Z",
    };
    store.addVerificationReview(
      dossier.id,
      { ...review, reviewerRef: "finding-author" },
      { type: "human", ref: "finding-author" },
    );

    expect(() =>
      store.updateResearchJobStatus({
        dossierId: dossier.id,
        jobKey: "red-team",
        status: "completed",
        actor: { type: "human", ref: "finding-author" },
      }),
    ).toThrow(/independent red-team review/);

    store.addVerificationReview(
      dossier.id,
      { ...review, reviewerRef: "independent-reviewer" },
      { type: "human", ref: "independent-reviewer" },
    );
    store.updateResearchJobStatus({
      dossierId: dossier.id,
      jobKey: "red-team",
      status: "completed",
      actor: { type: "human", ref: "independent-reviewer" },
    });
    expect(store.listResearchJobs(dossier.id).find((job) => job.key === "red-team")?.status).toBe(
      "completed",
    );
  });

  it("records an explicit human report approval and creates a restorable backup", async () => {
    const store = createStore();
    const result = ensureFictionalDemo(store);
    const draft = store.getLatestDraft(result.dossier.id);
    expect(draft).toBeDefined();

    store.approveDraft({
      dossierId: result.dossier.id,
      draftId: draft!.id,
      decidedBy: "fictional-test-human",
      rationale: "Test-only approval to exercise the explicit human gate.",
    });
    const backupPath = await store.createBackup("test-backup");

    expect(store.getLatestDraft(result.dossier.id)?.status).toBe("approved");
    expect(store.listResearchJobs(result.dossier.id).find((job) => job.key === "approval")?.status).toBe(
      "completed",
    );
    expect(store.verifyAuditChain(result.dossier.id).valid).toBe(true);
    expect(store.verifyDatabase()).toEqual({ valid: true, message: "ok" });
    expect(existsSync(backupPath)).toBe(true);

    const restoreHome = path.join(directories[directories.length - 1], "isolated-restore");
    const restored = restoreBackupToIsolatedHome(backupPath, restoreHome);
    expect(restored).toMatchObject({ dossiers: 1, auditEvents: 33 });
    expect(existsSync(restored.databasePath)).toBe(true);
    expect(() => restoreBackupToIsolatedHome(backupPath, restoreHome)).toThrow(/new or empty directory/);
  });
});
