import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  ensureFictionalSalesEngineerDemo,
  SALES_ENGINEER_DEMO_QUESTION,
} from "./local-sales-engineer-demo";
import { LocalIntelligenceStore } from "./local-store";

describe("fictional sales-engineer decision dry-run", () => {
  const stores: LocalIntelligenceStore[] = [];
  const directories: string[] = [];

  afterEach(() => {
    for (const store of stores.splice(0)) store.close();
    for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
  });

  it("runs idempotently from approved scope through review-ready draft at zero cost", async () => {
    const directory = mkdtempSync(path.join(tmpdir(), "meloncactus-sales-demo-test-"));
    directories.push(directory);
    const store = new LocalIntelligenceStore(directory);
    stores.push(store);
    const dossier = store.registerDossier({
      receivedAt: "2099-12-17T21:42:00.000Z",
      decisionQuestion: SALES_ENGINEER_DEMO_QUESTION,
      scope: { classification: "public-only-test", externalActionsAllowed: false },
      actor: { type: "human", ref: "fictional-test-owner" },
    });
    store.ensureResearchPlan(dossier.id, { type: "system", ref: "fictional-test" });
    store.approveScope({
      dossierId: dossier.id,
      decidedBy: "fictional-test-owner",
      rationale: "Explicitly approved fictional test scope.",
    });

    const first = await ensureFictionalSalesEngineerDemo(store, dossier.dossierNumber);
    const second = await ensureFictionalSalesEngineerDemo(store, dossier.dossierNumber);

    expect(first).toMatchObject({
      reused: false,
      acceptedSources: 3,
      rejectedCandidates: 1,
      normalisedEvidence: 3,
      proposedFindings: 1,
      humanApprovedFindings: 1,
      redTeamReviews: 1,
      agentRuns: 4,
      estimatedCostMicros: 0,
      draftStatus: "review_ready",
      auditValid: true,
    });
    expect(second).toMatchObject({
      reused: true,
      acceptedSources: 3,
      normalisedEvidence: 3,
      proposedFindings: 1,
      humanApprovedFindings: 1,
      redTeamReviews: 1,
      agentRuns: 4,
      estimatedCostMicros: 0,
      draftStatus: "review_ready",
      auditValid: true,
    });
    expect(second.dossier.id).toBe(first.dossier.id);
    expect(store.listResearchJobs(dossier.id).find((job) => job.key === "approval")?.status)
      .toBe("waiting_for_approval");
  });

  it("refuses to run against a different decision question", async () => {
    const directory = mkdtempSync(path.join(tmpdir(), "meloncactus-sales-demo-guard-test-"));
    directories.push(directory);
    const store = new LocalIntelligenceStore(directory);
    stores.push(store);
    const dossier = store.registerDossier({
      receivedAt: "2099-12-17T21:42:00.000Z",
      decisionQuestion: "Different fictional question",
      scope: { classification: "public-only-test", externalActionsAllowed: false },
      actor: { type: "human", ref: "fictional-test-owner" },
    });

    await expect(ensureFictionalSalesEngineerDemo(store, dossier.dossierNumber))
      .rejects.toThrow(/refuses a different decision question/);
    expect(store.getStatus().agentRuns).toBe(0);
  });
});
