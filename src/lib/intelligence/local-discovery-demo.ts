import { runEvidenceNormalisationAgent } from "./evidence-normalisation";
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
  if (!finding) {
    finding = store.addFinding(
      dossier.id,
      {
        code: "F-101",
        statement: "The fictional public records consistently describe a bounded Tamarind test.",
        type: "assessment",
        confidence: "moderate",
        rationale: "Two fictional records describe the same bounded test and its conditions.",
        material: true,
        createdBy: "fictional-tamarind-analyst",
        status: "evidence_linked",
        informationGaps: ["No live implementation evidence exists in this fictional fixture."],
      },
      { type: "agent", ref: "fictional-tamarind-analyst" },
    );
  }
  for (const item of evidence) {
    store.linkEvidence(dossier.id, finding.id, item.id, "supports", {
      type: "agent",
      ref: "fictional-tamarind-analyst",
    });
  }
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
  const finalBundle = store.getBundle(dossier.id);
  return {
    dossier,
    reused,
    acceptedSources: finalBundle.sources.length,
    rejectedCandidates,
    normalisedEvidence: finalBundle.evidence.filter((item) => item.normalisationRunId).length,
    redTeamReviews: finalBundle.reviews.filter((review) => review.reviewType === "red_team").length,
    runStatus: "completed",
  };
}
