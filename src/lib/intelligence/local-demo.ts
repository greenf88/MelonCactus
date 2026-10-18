import { createHash } from "node:crypto";

import { runEvidenceNormalisationAgent } from "./evidence-normalisation";
import { LocalIntelligenceStore, type LocalDossier } from "./local-store";

export const DEMO_DECISION_QUESTION =
  "Fictional demonstration only: is Project Juniper ready for a controlled pilot decision?";

const systemActor = { type: "system" as const, ref: "fictional-demo-loader" };
const analystActor = { type: "agent" as const, ref: "fictional-analyst-agent" };
const redTeamActor = { type: "agent" as const, ref: "fictional-red-team-agent" };

export interface DemoResult {
  dossier: LocalDossier;
  draftPath: string;
  draftStatus: string;
  auditEvents: number;
  auditValid: boolean;
  reused: boolean;
}

export function ensureFictionalDemo(store: LocalIntelligenceStore): DemoResult {
  let dossier = store.findDossierByDecisionQuestion(DEMO_DECISION_QUESTION);
  const reused = Boolean(dossier);
  if (!dossier) {
    dossier = store.registerDossier({
      // A far-future period keeps fictional numbering away from reserved or live dossiers.
      receivedAt: "2099-12-17T08:00:00.000Z",
      decisionQuestion: DEMO_DECISION_QUESTION,
      scope: {
        classification: "fictional-test-data",
        externalActionsAllowed: false,
        clientData: false,
        purpose: "local-control-room-verification",
      },
      actor: systemActor,
    });
  }

  store.ensureResearchPlan(dossier.id, systemActor);
  store.approveScope({
    dossierId: dossier.id,
    decidedBy: "fictional-fixture-human",
    rationale: "Fictional fixture scope approved only to verify the local workflow.",
  });
  let discoveryRun = store.listAgentRuns(dossier.id).find(
    (run) => run.agentRole === "source_discovery" && run.status === "completed",
  );
  if (!discoveryRun) {
    const discoveryJob = store.listResearchJobs(dossier.id).find((job) => job.key === "discover");
    if (discoveryJob?.status === "completed") {
      // Upgrade only this known fictional fixture from the pre-agent-run demo format.
      store.updateResearchJobStatus({
        dossierId: dossier.id,
        jobKey: "discover",
        status: "pending",
        actor: systemActor,
      });
    }
    discoveryRun = store.beginAgentRun({
      dossierId: dossier.id,
      jobKey: "discover",
      agentRole: "source_discovery",
      runnerRef: analystActor.ref,
      inputHash: sha("fictional demo source-discovery input v1"),
      modelProvider: "none",
      modelName: "offline-fictional-fixture-v1",
    });
  }
  const sourceOne = store.addSource(
    dossier.id,
    {
      code: "SRC-001",
      title: "Fictional municipal pilot register",
      canonicalUrl: "https://example.invalid/juniper/pilot-register",
      publisher: "Example Municipality",
      sourceType: "public_register",
      publishedAt: "2026-09-18T00:00:00.000Z",
      retrievedAt: "2026-10-17T08:15:00.000Z",
      sha256: sha("fictional municipal pilot register v1"),
    },
    analystActor,
  );
  const sourceTwo = store.addSource(
    dossier.id,
    {
      code: "SRC-002",
      title: "Fictional independent technical assessment",
      canonicalUrl: "https://example.invalid/juniper/technical-assessment",
      publisher: "Example Technical Institute",
      sourceType: "technical_assessment",
      publishedAt: "2026-10-02T00:00:00.000Z",
      retrievedAt: "2026-10-17T08:20:00.000Z",
      sha256: sha("fictional technical assessment v1"),
    },
    analystActor,
  );
  if (discoveryRun.status === "started") {
    store.completeAgentRun({
      dossierId: dossier.id,
      runId: discoveryRun.id,
      outputHash: sha("fictional demo source-discovery output v1"),
      inputTokens: 0,
      outputTokens: 0,
      estimatedCostMicros: 0,
      actor: analystActor,
    });
  }
  store.updateResearchJobStatus({
    dossierId: dossier.id,
    jobKey: "discover",
    status: "completed",
    actor: analystActor,
  });
  store.updateResearchJobStatus({
    dossierId: dossier.id,
    jobKey: "technical",
    status: "completed",
    actor: analystActor,
  });
  store.updateResearchJobStatus({
    dossierId: dossier.id,
    jobKey: "corporate",
    status: "completed",
    actor: analystActor,
  });

  let evidenceRun = store.listAgentRuns(dossier.id).find(
    (run) => run.agentRole === "evidence_normalisation" && run.status === "completed",
  );
  if (!evidenceRun) {
    const evidenceJob = store.listResearchJobs(dossier.id).find((job) => job.key === "evidence");
    if (evidenceJob?.status === "completed") {
      // Upgrade only this known fictional fixture from the pre-normalisation-run demo format.
      store.updateResearchJobStatus({
        dossierId: dossier.id,
        jobKey: "evidence",
        status: "pending",
        actor: systemActor,
      });
    }
    const result = runEvidenceNormalisationAgent(store, {
      dossierId: dossier.id,
      runnerRef: "fictional-evidence-normalisation-agent",
      items: [
        {
          code: "E-001",
          sourceId: sourceOne.id,
          evidenceClass: "statement",
          observation:
            "The fictional register records a limited pilot approval with three explicit conditions.",
          locator: "entry J-17, conditions 1-3",
          observedAt: "2026-09-18T00:00:00.000Z",
        },
        {
          code: "E-002",
          sourceId: sourceTwo.id,
          evidenceClass: "measurement",
          observation:
            "The fictional independent assessment reports that all three stated conditions passed controlled testing.",
          locator: "section 4.2",
          observedAt: "2026-10-02T00:00:00.000Z",
        },
      ],
    });
    evidenceRun = result.run;
  }
  const normalisedEvidence = store
    .getBundle(dossier.id)
    .evidence.filter((item) => item.normalisationRunId === evidenceRun.id);
  const evidenceOne = normalisedEvidence.find((item) => item.code === "E-001");
  const evidenceTwo = normalisedEvidence.find((item) => item.code === "E-002");
  if (!evidenceOne || !evidenceTwo) {
    throw new Error("The fictional evidence-normalisation fixture is incomplete.");
  }

  let finding = store.getBundle(dossier.id).findings.find((item) => item.code === "F-001");
  let proposalRun = store.listAgentRuns(dossier.id).find(
    (run) => run.agentRole === "analyst" && run.status === "completed",
  );
  if (!proposalRun) {
    proposalRun = store.beginAgentRun({
      dossierId: dossier.id,
      jobKey: "propose-findings",
      agentRole: "analyst",
      runnerRef: analystActor.ref,
      inputHash: sha("fictional demo finding-proposal input v1"),
      modelProvider: "none",
      modelName: "offline-fictional-finding-proposal-v1",
    });
    if (!finding) {
      finding = store.addProposedFinding(
        dossier.id,
        {
          code: "F-001",
          statement: "Project Juniper appears ready for a limited, monitored pilot.",
          type: "assessment",
          confidence: "high",
          rationale:
            "Two independent fictional sources align on the approval conditions and their controlled verification.",
          material: true,
          createdBy: analystActor.ref,
          informationGaps: ["Live operational performance remains outside this fictional evidence set."],
          proposalRunId: proposalRun.id,
          proposalSchemaVersion: "finding-proposal-v1",
          contentSha256: sha("fictional demo F-001 proposal v1"),
          evidenceLinks: [
            { evidenceId: evidenceOne.id, direction: "supports" },
            { evidenceId: evidenceTwo.id, direction: "supports" },
          ],
        },
        analystActor,
      );
    } else if (!finding.proposalRunId) {
      store.backfillFictionalFindingProvenance(
        dossier.id,
        {
          findingId: finding.id,
          proposalRunId: proposalRun.id,
          proposalSchemaVersion: "finding-proposal-v1-legacy-fixture-backfill",
          contentSha256: sha("fictional demo F-001 legacy proposal backfill v1"),
        },
        analystActor,
      );
    }
    store.completeAgentRun({
      dossierId: dossier.id,
      runId: proposalRun.id,
      outputHash: sha("fictional demo finding-proposal output v1"),
      inputTokens: 0,
      outputTokens: 0,
      estimatedCostMicros: 0,
      actor: analystActor,
    });
    store.updateResearchJobStatus({
      dossierId: dossier.id,
      jobKey: "propose-findings",
      status: "completed",
      actor: analystActor,
    });
  }
  if (!finding) throw new Error("The fictional finding-proposal fixture is incomplete.");
  store.addVerificationReview(
    dossier.id,
    {
      findingId: finding.id,
      reviewType: "red_team",
      reviewerKind: "agent",
      reviewerRef: redTeamActor.ref,
      verdict: "qualified",
      confidenceBefore: "high",
      confidenceAfter: "high",
      alternativeExplanations: [
        "The assessment could describe a lab configuration rather than the intended pilot environment.",
      ],
      unresolvedGaps: ["Live operational performance has not been observed."],
      notes: "Fictional red-team review; no external action or source access occurred.",
      completedAt: "2026-10-17T09:00:00.000Z",
    },
    redTeamActor,
  );
  store.updateResearchJobStatus({
    dossierId: dossier.id,
    jobKey: "red-team",
    status: "completed",
    actor: redTeamActor,
  });
  store.approveFinding({
    dossierId: dossier.id,
    findingId: finding.id,
    decidedBy: "fictional-fixture-human-approver",
    decision: "approved",
    rationale: "Fictional human approval after evidence linkage and independent red-team review.",
  });
  store.updateResearchJobStatus({
    dossierId: dossier.id,
    jobKey: "analysis",
    status: "completed",
    actor: analystActor,
  });

  const existingDraft = store.getLatestDraft(dossier.id);
  const draft =
    existingDraft ??
    store.createDraft({
      dossierId: dossier.id,
      title: "Project Juniper — fictional pilot-readiness review",
      createdBy: "fictional-report-agent",
      actor: { type: "agent", ref: "fictional-report-agent" },
    });
  store.updateDossierStatus(dossier.id, "drafted", {
    type: "system",
    ref: "fictional-demo-loader",
  });
  store.updateResearchJobStatus({
    dossierId: dossier.id,
    jobKey: "report",
    status: "completed",
    actor: { type: "agent", ref: "fictional-report-agent" },
  });
  store.updateResearchJobStatus({
    dossierId: dossier.id,
    jobKey: "qa",
    status: "completed",
    actor: { type: "agent", ref: "fictional-qa-agent" },
  });
  const draftPath = store.exportLatestDraft(dossier.id);
  const audit = store.verifyAuditChain(dossier.id);
  return {
    dossier,
    draftPath,
    draftStatus: draft.status,
    auditEvents: audit.events,
    auditValid: audit.valid,
    reused,
  };
}

function sha(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
