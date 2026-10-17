import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { ensureFictionalDemo } from "./local-demo";
import { writeLocalDashboard } from "./local-dashboard";
import { LocalIntelligenceStore } from "./local-store";

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
  });
});
