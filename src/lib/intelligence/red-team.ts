import type { EvidenceLink, EvidenceRecord, FindingRecord, SourceRecord } from "./types";

export interface RedTeamBrief {
  findingCode: string;
  claim: string;
  currentConfidence: FindingRecord["confidence"];
  supportingEvidence: Array<{
    evidenceCode: string;
    sourceCode: string;
    observation: string;
    locator?: string;
  }>;
  questions: string[];
}

export function buildRedTeamBrief(input: {
  finding: FindingRecord;
  links: EvidenceLink[];
  evidence: EvidenceRecord[];
  sources: SourceRecord[];
}): RedTeamBrief {
  const evidenceById = new Map(input.evidence.map((item) => [item.id, item]));
  const sourceById = new Map(input.sources.map((item) => [item.id, item]));

  const supportingEvidence = input.links
    .filter((link) => link.findingId === input.finding.id && link.direction === "supports")
    .map((link) => evidenceById.get(link.evidenceId))
    .filter((item): item is EvidenceRecord => Boolean(item))
    .map((item) => ({
      evidenceCode: item.code,
      sourceCode: sourceById.get(item.sourceId)?.code ?? "UNRESOLVED-SOURCE",
      observation: item.observation,
      locator: item.locator,
    }));

  return {
    findingCode: input.finding.code,
    claim: input.finding.statement,
    currentConfidence: input.finding.confidence,
    supportingEvidence,
    questions: [
      "What plausible alternative explanation fits the same evidence?",
      "Could any source be outdated, duplicated, promotional or about another location?",
      "Which observation is inferred rather than directly visible?",
      "What contradicting public evidence should be sought?",
      "What single missing fact would most change the confidence level?",
    ],
  };
}
