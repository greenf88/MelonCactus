export const confidenceLevels = ["high", "moderate", "low", "unknown"] as const;
export type ConfidenceLevel = (typeof confidenceLevels)[number];

export const findingTypes = ["observation", "assessment", "inference", "unknown"] as const;
export type FindingType = (typeof findingTypes)[number];

export type EvidenceDirection = "supports" | "contradicts" | "context";

export interface SourceRecord {
  id: string;
  code: string;
  title: string;
  canonicalUrl?: string;
  publisher?: string;
  sourceType: string;
  publishedAt?: string;
  retrievedAt: string;
  sha256?: string;
}

export interface EvidenceRecord {
  id: string;
  code: string;
  sourceId: string;
  observation: string;
  locator?: string;
  observedAt?: string;
}

export interface EvidenceLink {
  findingId: string;
  evidenceId: string;
  direction: EvidenceDirection;
}

export interface FindingRecord {
  id: string;
  code: string;
  statement: string;
  type: FindingType;
  confidence: ConfidenceLevel;
  rationale: string;
  material: boolean;
  createdBy: string;
  status: "proposed" | "evidence_linked" | "red_teamed" | "verified" | "rejected";
  contradictionResolution?: string;
  informationGaps?: string[];
}

export interface VerificationReview {
  id: string;
  findingId: string;
  reviewType: "source_verification" | "red_team" | "qa";
  reviewerKind: "agent" | "human";
  reviewerRef: string;
  verdict: "pass" | "qualified" | "inconclusive" | "reject";
  alternativeExplanations: string[];
  unresolvedGaps: string[];
  completedAt: string;
}

export interface DraftReadinessInput {
  findings: FindingRecord[];
  evidence: EvidenceRecord[];
  links: EvidenceLink[];
  reviews: VerificationReview[];
}

export interface DraftBlocker {
  code:
    | "NO_FINDINGS"
    | "MISSING_SUPPORT"
    | "MISSING_INDEPENDENT_RED_TEAM"
    | "REJECTED_BY_RED_TEAM"
    | "UNRESOLVED_CONTRADICTION"
    | "HIGH_CONFIDENCE_NOT_TRIANGULATED"
    | "FINDING_NOT_VERIFIED";
  findingCode?: string;
  message: string;
}

export interface DraftReadiness {
  ready: boolean;
  blockers: DraftBlocker[];
}

export const researchAgentRoles = [
  "scope",
  "source_discovery",
  "technical_research",
  "corporate_research",
  "evidence_normalisation",
  "red_team",
  "analyst",
  "report_draft",
  "qa",
] as const;

export type ResearchAgentRole = (typeof researchAgentRoles)[number];

export interface ResearchJobDefinition {
  key: string;
  role: ResearchAgentRole | "human_approval";
  title: string;
  execution: "agent" | "human";
  dependsOn: string[];
  approvalRequired: boolean;
}

export interface ResearchPlan {
  dossierId: string;
  decisionQuestion: string;
  jobs: ResearchJobDefinition[];
}
