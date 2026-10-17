import { type LocalDossier, LocalIntelligenceStore } from "./local-store";
import { runSourceDiscoveryAgent, type SourceDiscoveryResult } from "./source-discovery";

export const DISCOVERY_DEMO_QUESTION =
  "Fictional source-discovery demonstration only: which public records describe Project Tamarind?";

export interface DiscoveryDemoResult {
  dossier: LocalDossier;
  reused: boolean;
  acceptedSources: number;
  rejectedCandidates: number;
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
  if (existing) {
    return {
      dossier,
      reused: true,
      acceptedSources: store.getBundle(dossier.id).sources.length,
      rejectedCandidates: 0,
      runStatus: "completed",
    };
  }

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
  return {
    dossier,
    reused,
    acceptedSources: result.sources.length,
    rejectedCandidates: result.rejected.length,
    runStatus: "completed",
  };
}
