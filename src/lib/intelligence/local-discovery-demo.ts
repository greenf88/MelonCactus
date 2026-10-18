import { createHash } from "node:crypto";

import { runEvidenceNormalisationAgent } from "./evidence-normalisation";
import { runFindingProposalAgent } from "./finding-proposal-runner";
import { type LocalDossier, LocalIntelligenceStore } from "./local-store";
import { runRedTeamAgent } from "./red-team-runner";
import { runSourceDiscoveryAgent, type SourceDiscoveryResult } from "./source-discovery";

export const DISCOVERY_DEMO_QUESTION =
  "Fictional source-discovery demonstration only: which public records describe Project Tamarind?";

export interface DiscoveryDemoResult {
  dossier: LocalDossier;
  reused: boolean;
  acceptedSources: number;
  rejectedCandidates: number;
  normalisedEvidence: number;
  proposedFindings: number;
  humanApprovedFindings: number;
  redTeamReviews: number;
  runStatus: "completed";
}

export async function ensureFictionalDiscoveryDemo(
  store: LocalIntelligenceStore,
): Promise<DiscoveryDemoResult> {
  let dossier = store.findDossierByDecisionQuestion(DISCOVERY_DEMO_QUESTION);
  const reused = Boolean(dossier);
  if (!dossier) {
    dossier = store.registerDossier({
      receivedAt: "2099-11-17T08:00:00.000Z",
      decisionQuestion: DISCOVERY_DEMO_QUESTION,
      scope: {
        classification: "fictional-test-data",
        externalActionsAllowed: false,
        clientData: false,
        purpose: "bounded-source-discovery-verification",
      },
      actor: { type: "system", ref: "fictional-discovery-demo" },
    });
  }
  store.ensureResearchPlan(dossier.id, { type: "system", ref: "fictional-discovery-demo" });
  store.approveScope({
    dossierId: dossier.id,
    decidedBy: "fictional-fixture-human",
    rationale: "Fictional public-only scope approved for the bounded discovery demonstration.",
  });

  const existing = store
    .listAgentRuns(dossier.id)
    .find((run) => run.agentRole === "source_discovery" && run.status === "completed");
  let rejectedCandidates = 0;
  if (!existing) {
    const result: SourceDiscoveryResult = await runSourceDiscoveryAgent(
      store,
      {
        dossierId: dossier.id,
        queries: ["fictional Project Tamarind public register"],
        runnerRef: "bounded-source-discovery-agent",
        policy: {
          allowedDomains: ["example.invalid"],
          maxQueries: 1,
          maxResultsPerQuery: 5,
          maxAcceptedSources: 2,
          timeoutMs: 1_000,
        },
      },
      {
        kind: "public_search",
        name: "offline-fictional-search-fixture",
        async search() {
          return [
            {
              url: "https://register.example.invalid/tamarind/permit-17",
              title: "Fictional Tamarind permit register",
              publisher: "Example Public Register",
              publishedAt: "2026-09-18",
            },
            {
              url: "https://board.example.invalid/tamarind/decision-44",
              title: "Fictional Tamarind technical-board decision",
              publisher: "Example Technical Board",
              publishedAt: "2026-10-02",
            },
            {
              url: "https://example.invalid.evil.test/tamarind/lookalike",
              title: "Rejected lookalike-domain fixture",
            },
          ];
        },
      },
    );
    rejectedCandidates = result.rejected.length;
  }

  for (const jobKey of ["technical", "corporate"]) {
    store.updateResearchJobStatus({
      dossierId: dossier.id,
      jobKey,
      status: "completed",
      actor: { type: "agent", ref: `fictional-${jobKey}-fixture` },
    });
  }
  const sources = store.getBundle(dossier.id).sources;
  if (sources.length !== 2) throw new Error("The fictional discovery fixture requires two sources.");
  let evidenceRun = store
    .listAgentRuns(dossier.id)
    .find((run) => run.agentRole === "evidence_normalisation" && run.status === "completed");
  if (!evidenceRun) {
    evidenceRun = runEvidenceNormalisationAgent(store, {
      dossierId: dossier.id,
      runnerRef: "bounded-evidence-normalisation-agent",
      items: [
        {
          code: "E-101",
          sourceId: sources[0].id,
          evidenceClass: "statement",
          observation: "The fictional register records a bounded Project Tamarind permit.",
          locator: "permit entry 17",
          observedAt: "2026-09-18",
        },
        {
          code: "E-102",
          sourceId: sources[1].id,
          evidenceClass: "document_excerpt",
          observation: "The fictional board decision records two conditions for the test project.",
          locator: "decision 44, conditions section",
          observedAt: "2026-10-02",
        },
      ],
    }).run;
  }
  const bundle = store.getBundle(dossier.id);
  const evidence = bundle.evidence.filter((item) => item.normalisationRunId === evidenceRun.id);
  if (evidence.length !== 2) {
    throw new Error("The fictional evidence-normalisation fixture requires two provenance records.");
  }
  let finding = bundle.findings.find((item) => item.code === "F-101");
  const existingProposal = store
    .listAgentRuns(dossier.id)
    .find((run) => run.agentRole === "analyst" && run.status === "completed");
  if (!existingProposal) {
    if (finding && !finding.proposalRunId) {
      const actor = { type: "agent" as const, ref: "fictional-tamarind-analyst" };
      const run = store.beginAgentRun({
        dossierId: dossier.id,
        jobKey: "propose-findings",
        agentRole: "analyst",
        runnerRef: actor.ref,
        inputHash: sha("fictional Tamarind legacy proposal input v1"),
        modelProvider: "none",
        modelName: "offline-fictional-finding-proposal-v1",
      });
      store.backfillFictionalFindingProvenance(
        dossier.id,
        {
          findingId: finding.id,
          proposalRunId: run.id,
          proposalSchemaVersion: "finding-proposal-v1-legacy-fixture-backfill",
          contentSha256: sha("fictional Tamarind F-101 legacy proposal backfill v1"),
        },
        actor,
      );
      store.completeAgentRun({
        dossierId: dossier.id,
        runId: run.id,
        outputHash: sha("fictional Tamarind legacy proposal output v1"),
        inputTokens: 0,
        outputTokens: 0,
        estimatedCostMicros: 0,
        actor,
      });
      store.updateResearchJobStatus({
        dossierId: dossier.id,
        jobKey: "propose-findings",
        status: "completed",
        actor,
      });
    } else {
      await runFindingProposalAgent(
        store,
        {
          dossierId: dossier.id,
          proposerRef: "fictional-tamarind-analyst",
          timeoutMs: 1_000,
        },
        {
        kind: "finding_proposal",
        name: "offline-fictional-finding-proposal-fixture",
        modelProvider: "none",
        modelName: "deterministic-finding-proposal-fixture-v1",
        async propose({ brief }) {
          if ("dossierId" in brief || "dossierNumber" in brief) {
            throw new Error("The fictional evaluator received dossier identity.");
          }
          return {
            findings: [
              {
                code: "F-101",
                statement: "The fictional public records consistently describe a bounded Tamarind test.",
                type: "assessment",
                confidence: "moderate",
                rationale: "Two fictional records describe the same bounded test and its conditions.",
                material: true,
                supportingEvidenceCodes: ["E-101", "E-102"],
                contradictingEvidenceCodes: [],
                contextEvidenceCodes: [],
                informationGaps: ["No live implementation evidence exists in this fictional fixture."],
              },
            ],
            usage: { inputTokens: 0, outputTokens: 0, estimatedCostMicros: 0 },
          };
        },
        },
      );
    }
  }
  finding = store.getBundle(dossier.id).findings.find((item) => item.code === "F-101");
  if (!finding) throw new Error("The fictional finding-proposal fixture is incomplete.");
  const existingRedTeam = store
    .listAgentRuns(dossier.id)
    .find((run) => run.agentRole === "red_team" && run.status === "completed");
  if (!existingRedTeam) {
    await runRedTeamAgent(
      store,
      {
        dossierId: dossier.id,
        reviewerRef: "isolated-fictional-red-team-agent",
        timeoutMs: 1_000,
      },
      {
        kind: "red_team_evaluation",
        name: "offline-fictional-red-team-fixture",
        modelProvider: "none",
        modelName: "deterministic-red-team-fixture-v1",
        async evaluate() {
          return {
            verdict: "qualified",
            confidenceAfter: "moderate",
            alternativeExplanations: [
              "The two fictional records could describe planning rather than completed activity.",
            ],
            unresolvedGaps: ["No live implementation evidence exists."],
            notes: "Offline fictional review in a separate identity-stripped context.",
          };
        },
      },
    );
  }
  store.approveFinding({
    dossierId: dossier.id,
    findingId: finding.id,
    decidedBy: "fictional-tamarind-human-approver",
    decision: "approved",
    rationale: "Fictional human approval after an independent red-team review.",
  });
  store.updateResearchJobStatus({
    dossierId: dossier.id,
    jobKey: "analysis",
    status: "completed",
    actor: { type: "human", ref: "fictional-tamarind-human-approver" },
  });
  const finalBundle = store.getBundle(dossier.id);
  return {
    dossier,
    reused,
    acceptedSources: finalBundle.sources.length,
    rejectedCandidates,
    normalisedEvidence: finalBundle.evidence.filter((item) => item.normalisationRunId).length,
    proposedFindings: finalBundle.findings.filter((item) => item.proposalRunId).length,
    humanApprovedFindings: store
      .listFindingApprovals(dossier.id)
      .filter((approval) => approval.decision === "approved").length,
    redTeamReviews: finalBundle.reviews.filter((review) => review.reviewType === "red_team").length,
    runStatus: "completed",
  };
}

function sha(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
