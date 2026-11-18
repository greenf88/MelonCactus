import { runEvidenceNormalisationAgent } from "./evidence-normalisation";
import { runFindingProposalAgent } from "./finding-proposal-runner";
import { LocalIntelligenceStore, type LocalDossier } from "./local-store";
import { runRedTeamAgent } from "./red-team-runner";
import { runSourceDiscoveryAgent } from "./source-discovery";

export const SALES_ENGINEER_DEMO_QUESTION = "Moeten we een sales engineer aannemen?";

const EXPECTED_SOURCE_URLS = [
  "https://commercial.example.invalid/sales-engineering/workload-review",
  "https://revenue.example.invalid/sales-engineering/opportunity-review",
  "https://finance.example.invalid/sales-engineering/hiring-threshold",
] as const;

export interface SalesEngineerDemoResult {
  dossier: LocalDossier;
  reused: boolean;
  acceptedSources: number;
  rejectedCandidates: number;
  normalisedEvidence: number;
  proposedFindings: number;
  humanApprovedFindings: number;
  redTeamReviews: number;
  agentRuns: number;
  estimatedCostMicros: number;
  draftStatus: string;
  draftPath: string;
  auditValid: boolean;
  auditEvents: number;
}

export async function ensureFictionalSalesEngineerDemo(
  store: LocalIntelligenceStore,
  dossierNumber: string,
): Promise<SalesEngineerDemoResult> {
  const dossier = store.getDossier(dossierNumber);
  if (!dossier) throw new Error(`Fictional sales-engineer dossier not found: ${dossierNumber}`);
  if (dossier.decisionQuestion !== SALES_ENGINEER_DEMO_QUESTION) {
    throw new Error("The fictional sales-engineer fixture refuses a different decision question.");
  }
  if (!["fictional-test-data", "public-only-test"].includes(String(dossier.scope.classification))) {
    throw new Error("The fictional sales-engineer fixture requires a test-only classification.");
  }
  if (dossier.scope.externalActionsAllowed !== false) {
    throw new Error("The fictional sales-engineer fixture requires external actions to remain disabled.");
  }

  store.ensureResearchPlan(dossier.id, { type: "system", ref: "fictional-sales-engineer-fixture" });
  const scopeJob = store.listResearchJobs(dossier.id).find((job) => job.key === "scope");
  if (scopeJob?.status !== "completed") {
    throw new Error("The fictional sales-engineer fixture requires explicit human scope approval.");
  }

  const reused = store.listAgentRuns(dossier.id).some((run) => run.status === "completed");
  let rejectedCandidates = 0;
  const discoveryRun = store
    .listAgentRuns(dossier.id)
    .find((run) => run.agentRole === "source_discovery" && run.status === "completed");
  if (!discoveryRun) {
    const result = await runSourceDiscoveryAgent(
      store,
      {
        dossierId: dossier.id,
        queries: ["fictional sales engineering capacity and conversion fixture"],
        runnerRef: "fictional-sales-source-agent",
        policy: {
          allowedDomains: ["example.invalid"],
          maxQueries: 1,
          maxResultsPerQuery: 5,
          maxAcceptedSources: 3,
          timeoutMs: 1_000,
        },
      },
      {
        kind: "public_search",
        name: "offline-fictional-sales-search-fixture",
        async search() {
          return [
            {
              url: EXPECTED_SOURCE_URLS[0],
              title: "Fictional commercial workload review",
              publisher: "Example Commercial Operations",
              publishedAt: "2026-10-01",
            },
            {
              url: EXPECTED_SOURCE_URLS[1],
              title: "Fictional opportunity conversion review",
              publisher: "Example Revenue Operations",
              publishedAt: "2026-10-08",
            },
            {
              url: EXPECTED_SOURCE_URLS[2],
              title: "Fictional hiring-threshold memorandum",
              publisher: "Example Finance Team",
              publishedAt: "2026-10-12",
            },
            {
              url: "https://example.invalid.evil.test/sales-engineering/lookalike",
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
      actor: { type: "agent", ref: `fictional-sales-${jobKey}-agent` },
    });
  }

  const sources = store.getBundle(dossier.id).sources;
  const sourcesByUrl = new Map(sources.map((source) => [source.canonicalUrl, source]));
  const workloadSource = sourcesByUrl.get(EXPECTED_SOURCE_URLS[0]);
  const conversionSource = sourcesByUrl.get(EXPECTED_SOURCE_URLS[1]);
  const thresholdSource = sourcesByUrl.get(EXPECTED_SOURCE_URLS[2]);
  if (!workloadSource || !conversionSource || !thresholdSource) {
    throw new Error("The fictional sales-engineer fixture requires its three synthetic sources.");
  }

  let evidenceRun = store
    .listAgentRuns(dossier.id)
    .find((run) => run.agentRole === "evidence_normalisation" && run.status === "completed");
  if (!evidenceRun) {
    evidenceRun = runEvidenceNormalisationAgent(store, {
      dossierId: dossier.id,
      runnerRef: "fictional-sales-evidence-agent",
      items: [
        {
          code: "E-201",
          sourceId: workloadSource.id,
          evidenceClass: "measurement",
          observation:
            "The fictional workload review records 18 technical discovery requests in eight weeks, of which seven were delayed by limited pre-sales capacity.",
          locator: "synthetic table 2, workload and delay counts",
          observedAt: "2026-10-01",
        },
        {
          code: "E-202",
          sourceId: conversionSource.id,
          evidenceClass: "measurement",
          observation:
            "The fictional review records a 54 percent qualified-proposal rate with technical pre-sales support versus 31 percent without it, in a non-random sample of 26 opportunities.",
          locator: "synthetic section 3, conversion comparison",
          observedAt: "2026-10-08",
        },
        {
          code: "E-203",
          sourceId: thresholdSource.id,
          evidenceClass: "statement",
          observation:
            "The fictional memorandum states that the forward demand forecast covers only three months and does not yet establish signed annual volume sufficient for an unconditional permanent hire.",
          locator: "synthetic recommendation paragraph",
          observedAt: "2026-10-12",
        },
      ],
    }).run;
  }
  const evidence = store
    .getBundle(dossier.id)
    .evidence.filter((item) => item.normalisationRunId === evidenceRun.id);
  if (!["E-201", "E-202", "E-203"].every((code) => evidence.some((item) => item.code === code))) {
    throw new Error("The fictional sales-engineer evidence fixture is incomplete.");
  }

  const proposalRun = store
    .listAgentRuns(dossier.id)
    .find((run) => run.agentRole === "analyst" && run.status === "completed");
  if (!proposalRun) {
    await runFindingProposalAgent(
      store,
      {
        dossierId: dossier.id,
        proposerRef: "fictional-sales-analyst-agent",
        timeoutMs: 1_000,
      },
      {
        kind: "finding_proposal",
        name: "offline-fictional-sales-finding-fixture",
        modelProvider: "none",
        modelName: "deterministic-sales-finding-fixture-v1",
        async propose({ brief }) {
          if ("dossierId" in brief || "dossierNumber" in brief) {
            throw new Error("The fictional evaluator received dossier identity.");
          }
          return {
            findings: [
              {
                code: "F-201",
                statement:
                  "The fictional evidence supports a time-boxed sales-engineering pilot, but not yet an unconditional permanent hire.",
                type: "assessment",
                confidence: "moderate",
                rationale:
                  "The synthetic workload and conversion signals indicate a capacity problem and possible commercial benefit, while the short forecast horizon leaves permanent demand unproven.",
                material: true,
                supportingEvidenceCodes: ["E-201", "E-202"],
                contradictingEvidenceCodes: [],
                contextEvidenceCodes: ["E-203"],
                informationGaps: [
                  "The fully loaded employment cost has not been tested against gross-margin contribution.",
                  "The repeatability of qualified pipeline beyond three months remains unknown.",
                  "A contractor or founder-process intervention has not been compared in a controlled pilot.",
                ],
              },
            ],
            usage: { inputTokens: 0, outputTokens: 0, estimatedCostMicros: 0 },
          };
        },
      },
    );
  }

  let finding = store.getBundle(dossier.id).findings.find((item) => item.code === "F-201");
  if (!finding?.proposalRunId) {
    throw new Error("The fictional sales-engineer proposal fixture is incomplete.");
  }
  const redTeamRun = store
    .listAgentRuns(dossier.id)
    .find((run) => run.agentRole === "red_team" && run.status === "completed");
  if (!redTeamRun) {
    await runRedTeamAgent(
      store,
      {
        dossierId: dossier.id,
        reviewerRef: "isolated-fictional-sales-red-team-agent",
        timeoutMs: 1_000,
      },
      {
        kind: "red_team_evaluation",
        name: "offline-fictional-sales-red-team-fixture",
        modelProvider: "none",
        modelName: "deterministic-sales-red-team-fixture-v1",
        async evaluate({ brief }) {
          if (brief.findingCode !== "F-201") {
            throw new Error("The fictional red-team fixture received an unexpected finding.");
          }
          return {
            verdict: "qualified",
            confidenceAfter: "moderate",
            alternativeExplanations: [
              "The delay and conversion pattern could reflect weak qualification or founder scheduling rather than a missing sales-engineering role.",
              "The observed uplift could be selection bias because technically stronger opportunities may have received support first.",
            ],
            unresolvedGaps: [
              "No annualised, signed demand evidence exists in the synthetic dataset.",
              "No controlled comparison with a contractor or improved qualification process exists.",
            ],
            notes:
              "Fictional independent review. The recommendation remains a reversible pilot, not approval to recruit or contact candidates.",
            usage: { inputTokens: 0, outputTokens: 0, estimatedCostMicros: 0 },
          };
        },
      },
    );
  }

  finding = store.getBundle(dossier.id).findings.find((item) => item.code === "F-201");
  if (!finding) throw new Error("The fictional sales-engineer finding is missing.");
  store.approveFinding({
    dossierId: dossier.id,
    findingId: finding.id,
    decidedBy: "fictional-sales-human-approver",
    decision: "approved",
    rationale:
      "Fictional human test decision after source-bound evidence and an independent qualified red-team review.",
  });
  store.updateResearchJobStatus({
    dossierId: dossier.id,
    jobKey: "analysis",
    status: "completed",
    actor: { type: "human", ref: "fictional-sales-human-approver" },
  });

  const draft = store.getLatestDraft(dossier.id) ?? store.createDraft({
    dossierId: dossier.id,
    title: "Fictieve beoordeling — inzet van een sales engineer",
    createdBy: "fictional-sales-report-agent",
    actor: { type: "agent", ref: "fictional-sales-report-agent" },
  });
  store.updateResearchJobStatus({
    dossierId: dossier.id,
    jobKey: "report",
    status: "completed",
    actor: { type: "agent", ref: "fictional-sales-report-agent" },
  });
  store.updateResearchJobStatus({
    dossierId: dossier.id,
    jobKey: "qa",
    status: "completed",
    actor: { type: "agent", ref: "fictional-sales-qa-agent" },
  });

  const finalBundle = store.getBundle(dossier.id);
  const agentRuns = store.listAgentRuns(dossier.id);
  const audit = store.verifyAuditChain(dossier.id);
  return {
    dossier: finalBundle.dossier,
    reused,
    acceptedSources: finalBundle.sources.length,
    rejectedCandidates,
    normalisedEvidence: finalBundle.evidence.filter((item) => item.normalisationRunId).length,
    proposedFindings: finalBundle.findings.filter((item) => item.proposalRunId).length,
    humanApprovedFindings: store
      .listFindingApprovals(dossier.id)
      .filter((approval) => approval.decision === "approved").length,
    redTeamReviews: finalBundle.reviews.filter((review) => review.reviewType === "red_team").length,
    agentRuns: agentRuns.length,
    estimatedCostMicros: agentRuns.reduce(
      (total, run) => total + (run.estimatedCostMicros ?? 0),
      0,
    ),
    draftStatus: draft.status,
    draftPath: store.exportLatestDraft(dossier.id),
    auditValid: audit.valid,
    auditEvents: audit.events,
  };
}
