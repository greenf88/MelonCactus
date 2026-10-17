import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { runEvidenceNormalisationAgent } from "./evidence-normalisation";
import { LocalIntelligenceStore } from "./local-store";
import { runRedTeamAgent, type RedTeamEvaluator } from "./red-team-runner";

describe("isolated red-team agent", () => {
  const stores: LocalIntelligenceStore[] = [];
  const directories: string[] = [];

  afterEach(() => {
    for (const store of stores.splice(0)) store.close();
    for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
  });

  function createReadyFinding() {
    const directory = mkdtempSync(path.join(tmpdir(), "meloncactus-red-team-runner-test-"));
    directories.push(directory);
    const store = new LocalIntelligenceStore(directory);
    stores.push(store);
    const dossier = store.registerDossier({
      receivedAt: "2026-10-17T16:00:00.000Z",
      decisionQuestion: "Can the fictional evidence support this bounded assessment?",
      scope: { classification: "public-only-test", externalActionsAllowed: false, synthetic: true },
      actor: { type: "human", ref: "fixture-registrar" },
    });
    store.ensureResearchPlan(dossier.id, { type: "system", ref: "fixture-planner" });
    store.approveScope({
      dossierId: dossier.id,
      decidedBy: "fixture-scope-reviewer",
      rationale: "Synthetic public-only red-team test.",
    });
    const discovery = store.beginAgentRun({
      dossierId: dossier.id,
      jobKey: "discover",
      agentRole: "source_discovery",
      runnerRef: "fixture-discovery-agent",
      inputHash: "a".repeat(64),
      modelProvider: "none",
      modelName: "offline-fixture",
    });
    const source = store.addSource(
      dossier.id,
      {
        code: "SRC-001",
        title: "Identity-bearing source title that must stay outside red-team context",
        canonicalUrl: "https://example.invalid/identity-bearing-path",
        sourceType: "public_web_candidate",
        retrievedAt: "2026-10-17T16:05:00.000Z",
      },
      { type: "agent", ref: "fixture-discovery-agent" },
    );
    store.completeAgentRun({
      dossierId: dossier.id,
      runId: discovery.id,
      outputHash: "b".repeat(64),
      inputTokens: 0,
      outputTokens: 0,
      estimatedCostMicros: 0,
      actor: { type: "agent", ref: "fixture-discovery-agent" },
    });
    for (const jobKey of ["discover", "technical", "corporate"]) {
      store.updateResearchJobStatus({
        dossierId: dossier.id,
        jobKey,
        status: "completed",
        actor: { type: "agent", ref: `fixture-${jobKey}-agent` },
      });
    }
    const evidence = runEvidenceNormalisationAgent(store, {
      dossierId: dossier.id,
      runnerRef: "fixture-evidence-normaliser",
      items: [
        {
          code: "E-001",
          sourceId: source.id,
          evidenceClass: "observation",
          observation: "The fictional record directly states that a bounded trial was approved.",
          locator: "approval paragraph",
        },
      ],
    }).evidence[0];
    const finding = store.addFinding(
      dossier.id,
      {
        code: "F-001",
        statement: "A bounded fictional trial appears to be approved.",
        type: "assessment",
        confidence: "moderate",
        rationale: "The fictional record contains an explicit approval statement.",
        material: true,
        createdBy: "originating-analyst-agent",
        status: "evidence_linked",
        informationGaps: ["Implementation was not observed."],
      },
      { type: "agent", ref: "originating-analyst-agent" },
    );
    store.linkEvidence(dossier.id, finding.id, evidence.id, "supports", {
      type: "agent",
      ref: "originating-analyst-agent",
    });
    return { store, dossier, source, finding };
  }

  function validEvaluator(overrides: Partial<RedTeamEvaluator> = {}): RedTeamEvaluator {
    return {
      kind: "red_team_evaluation",
      name: "offline-red-team-fixture",
      modelProvider: "none",
      modelName: "deterministic-red-team-v1",
      async evaluate() {
        return {
          verdict: "qualified",
          confidenceAfter: "low",
          alternativeExplanations: ["The approval may cover planning rather than execution."],
          unresolvedGaps: ["Implementation was not observed."],
          notes: "Synthetic independent review.",
        };
      },
      ...overrides,
    };
  }

  it("passes only an identity-stripped brief into a separate reviewer context", async () => {
    const { store, dossier } = createReadyFinding();
    let received = "";
    const evaluator = validEvaluator({
      async evaluate({ brief, signal }) {
        expect(signal.aborted).toBe(false);
        received = JSON.stringify(brief);
        return {
          verdict: "qualified",
          confidenceAfter: "low",
          alternativeExplanations: ["The record may describe intent rather than execution."],
          unresolvedGaps: ["No implementation observation."],
          usage: { inputTokens: 120, outputTokens: 40, estimatedCostMicros: 75 },
        };
      },
    });

    const result = await runRedTeamAgent(
      store,
      { dossierId: dossier.id, reviewerRef: "independent-red-team-agent" },
      evaluator,
    );

    expect(received).not.toContain(dossier.id);
    expect(received).not.toContain(dossier.dossierNumber);
    expect(received).not.toContain("Identity-bearing source title");
    expect(received).not.toContain("identity-bearing-path");
    expect(result).toMatchObject({ evaluatedFindings: 1 });
    expect(result.run).toMatchObject({
      status: "completed",
      agentRole: "red_team",
      inputTokens: 120,
      outputTokens: 40,
      estimatedCostMicros: 75,
    });
    expect(result.reviews[0]).toMatchObject({
      reviewerRef: "independent-red-team-agent",
      reviewerKind: "agent",
      reviewType: "red_team",
      verdict: "qualified",
    });
    expect(store.listResearchJobs(dossier.id).find((job) => job.key === "red-team")?.status).toBe(
      "completed",
    );
    expect(JSON.stringify(store.listAuditEvents(dossier.id))).not.toContain(
      "The record may describe intent",
    );
  });

  it("blocks the originating analyst before calling the evaluator", async () => {
    const { store, dossier } = createReadyFinding();
    let called = false;
    const evaluator = validEvaluator({
      async evaluate() {
        called = true;
        return {};
      },
    });

    await expect(
      runRedTeamAgent(
        store,
        { dossierId: dossier.id, reviewerRef: "ORIGINATING-ANALYST-AGENT" },
        evaluator,
      ),
    ).rejects.toThrow(/independent from the author/);
    expect(called).toBe(false);
    expect(store.listAgentRuns(dossier.id).filter((run) => run.agentRole === "red_team"))
      .toHaveLength(0);
  });

  it("rejects stale evaluator output atomically and retains only the concurrent human change", async () => {
    const { store, dossier } = createReadyFinding();
    const evaluator = validEvaluator({
      async evaluate() {
        store.addSource(
          dossier.id,
          {
            code: "SRC-CONCURRENT",
            title: "Concurrent synthetic human source",
            sourceType: "synthetic_test",
            retrievedAt: "2026-10-17T16:30:00.000Z",
          },
          { type: "human", ref: "concurrent-operator" },
        );
        return {
          verdict: "pass",
          confidenceAfter: "moderate",
          alternativeExplanations: [],
          unresolvedGaps: [],
        };
      },
    });

    await expect(
      runRedTeamAgent(
        store,
        { dossierId: dossier.id, reviewerRef: "independent-red-team-agent" },
        evaluator,
      ),
    ).rejects.toThrow(/revision conflict/i);
    expect(store.getBundle(dossier.id).reviews).toHaveLength(0);
    expect(store.getBundle(dossier.id).sources.map((source) => source.code)).toContain("SRC-CONCURRENT");
    expect(store.listAgentRuns(dossier.id).find((run) => run.agentRole === "red_team")?.status).toBe(
      "failed",
    );
    expect(
      store.listAuditEvents(dossier.id).some((event) => event.metadata.reasonCode === "stale_output"),
    ).toBe(true);
  });

  it("fails closed on invalid output without putting raw evaluator content in the audit trail", async () => {
    const { store, dossier } = createReadyFinding();
    const evaluator = validEvaluator({
      async evaluate() {
        return {
          verdict: "pass",
          confidenceAfter: "high",
          alternativeExplanations: [],
          unresolvedGaps: [],
          forbiddenAction: "send a confidential email",
        };
      },
    });

    await expect(
      runRedTeamAgent(
        store,
        { dossierId: dossier.id, reviewerRef: "independent-red-team-agent" },
        evaluator,
      ),
    ).rejects.toThrow(/unsupported field/);
    expect(store.getBundle(dossier.id).reviews).toHaveLength(0);
    const audit = store.listAuditEvents(dossier.id);
    expect(audit.some((event) => event.metadata.reasonCode === "validation_failure")).toBe(true);
    expect(JSON.stringify(audit)).not.toContain("confidential email");
  });
});
