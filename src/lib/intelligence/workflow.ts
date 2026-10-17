import type {
  DraftReadiness,
  DraftReadinessInput,
  ResearchJobDefinition,
  ResearchPlan,
} from "./types";

export function buildPhaseOneResearchPlan(input: {
  dossierId: string;
  decisionQuestion: string;
}): ResearchPlan {
  const dossierId = input.dossierId.trim();
  const decisionQuestion = input.decisionQuestion.trim();

  if (!dossierId || !decisionQuestion) {
    throw new TypeError("A dossier ID and decision question are required.");
  }

  const jobs: ResearchJobDefinition[] = [
    job("scope", "scope", "Confirm scope and evidence boundary", [], true),
    job("discover", "source_discovery", "Discover lawful public sources", ["scope"]),
    job("technical", "technical_research", "Review technical and production evidence", ["discover"]),
    job("corporate", "corporate_research", "Review corporate and market signals", ["discover"]),
    job("evidence", "evidence_normalisation", "Normalise observations into evidence records", [
      "technical",
      "corporate",
    ]),
    job("propose-findings", "analyst", "Propose evidence-backed findings for human review", [
      "evidence",
    ]),
    job("red-team", "red_team", "Challenge material findings and alternatives", ["evidence"]),
    job("analysis", "analyst", "Synthesize approved evidence-backed findings", [
      "propose-findings",
      "red-team",
    ]),
    job("report", "report_draft", "Assemble internal draft report", ["analysis"]),
    job("qa", "qa", "Verify citations, contradictions and missing evidence", ["report"]),
    {
      key: "approval",
      role: "human_approval",
      title: "Human approval before any client delivery",
      execution: "human",
      dependsOn: ["qa"],
      approvalRequired: true,
    },
  ];

  return { dossierId, decisionQuestion, jobs };
}

function job(
  key: string,
  role: Exclude<ResearchJobDefinition["role"], "human_approval">,
  title: string,
  dependsOn: string[],
  approvalRequired = false,
): ResearchJobDefinition {
  return { key, role, title, execution: "agent", dependsOn, approvalRequired };
}

export function evaluateDraftReadiness(input: DraftReadinessInput): DraftReadiness {
  const blockers: DraftReadiness["blockers"] = [];
  const evidenceById = new Map(input.evidence.map((item) => [item.id, item]));

  if (input.findings.length === 0) {
    blockers.push({ code: "NO_FINDINGS", message: "At least one finding is required." });
    return { ready: false, blockers };
  }

  for (const finding of input.findings.filter((item) => item.material)) {
    const links = input.links.filter((link) => link.findingId === finding.id);
    const supporting = links.filter((link) => link.direction === "supports");
    const contradicting = links.filter((link) => link.direction === "contradicts");
    const redTeamReviews = input.reviews.filter(
      (review) =>
        review.findingId === finding.id &&
        review.reviewType === "red_team" &&
        review.reviewerRef !== finding.createdBy,
    );

    if (finding.type !== "unknown" && supporting.length === 0) {
      blockers.push({
        code: "MISSING_SUPPORT",
        findingCode: finding.code,
        message: `${finding.code} has no supporting evidence link.`,
      });
    }

    if (finding.type !== "observation" && redTeamReviews.length === 0) {
      blockers.push({
        code: "MISSING_INDEPENDENT_RED_TEAM",
        findingCode: finding.code,
        message: `${finding.code} has not received a red-team review from someone other than its author.`,
      });
    }

    if (redTeamReviews.some((review) => review.verdict === "reject")) {
      blockers.push({
        code: "REJECTED_BY_RED_TEAM",
        findingCode: finding.code,
        message: `${finding.code} was rejected by red-team review.`,
      });
    }

    if (contradicting.length > 0 && !finding.contradictionResolution?.trim()) {
      blockers.push({
        code: "UNRESOLVED_CONTRADICTION",
        findingCode: finding.code,
        message: `${finding.code} has contradicting evidence without a documented resolution.`,
      });
    }

    if (finding.confidence === "high") {
      const independentSources = new Set(
        supporting.map((link) => evidenceById.get(link.evidenceId)?.sourceId).filter(Boolean),
      );
      if (independentSources.size < 2) {
        blockers.push({
          code: "HIGH_CONFIDENCE_NOT_TRIANGULATED",
          findingCode: finding.code,
          message: `${finding.code} needs at least two independent supporting sources for high confidence.`,
        });
      }
    }

    if (finding.status !== "verified") {
      blockers.push({
        code: "FINDING_NOT_VERIFIED",
        findingCode: finding.code,
        message: `${finding.code} is not in verified status.`,
      });
    }
  }

  return { ready: blockers.length === 0, blockers };
}
