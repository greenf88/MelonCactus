import { evaluateDraftReadiness } from "./workflow";
import type { DraftReadinessInput, FindingRecord, SourceRecord } from "./types";

export interface DraftReportInput extends DraftReadinessInput {
  dossierNumber: string;
  title: string;
  decisionQuestion: string;
  sources: SourceRecord[];
}

export interface DraftReport {
  status: "red_team_required" | "review_ready";
  markdown: string;
  blockers: ReturnType<typeof evaluateDraftReadiness>["blockers"];
}

export function buildDraftReport(input: DraftReportInput): DraftReport {
  const readiness = evaluateDraftReadiness(input);
  const sources = new Map(input.sources.map((source) => [source.id, source]));
  const evidence = new Map(input.evidence.map((item) => [item.id, item]));

  const sections = input.findings.map((finding) =>
    renderFinding(
      finding,
      input.links.filter((link) => link.findingId === finding.id),
      evidence,
      sources,
    ),
  );

  const blockers = readiness.blockers.length
    ? [
        "## Open verification gates",
        "",
        ...readiness.blockers.map(
          (blocker) => `- ${blocker.findingCode ? `${blocker.findingCode}: ` : ""}${blocker.message}`,
        ),
        "",
      ]
    : [];

  const sourceRegister = input.sources.map((source) => {
    const url = source.canonicalUrl ? ` — ${source.canonicalUrl}` : "";
    const hash = source.sha256 ? ` — SHA-256 ${source.sha256}` : "";
    return `- ${source.code}: ${source.title}${url}${hash}`;
  });

  return {
    status: readiness.ready ? "review_ready" : "red_team_required",
    blockers: readiness.blockers,
    markdown: [
      "# DRAFT — INTERNAL REVIEW ONLY",
      "",
      `Dossier: ${input.dossierNumber}`,
      "",
      `# ${input.title.trim()}`,
      "",
      "## Decision question",
      "",
      input.decisionQuestion.trim(),
      "",
      ...blockers,
      "## Findings",
      "",
      ...sections,
      "## Source register",
      "",
      ...(sourceRegister.length ? sourceRegister : ["- No sources registered." ]),
      "",
      "---",
      "This draft is not approved for client delivery. Human approval remains mandatory.",
    ].join("\n"),
  };
}

function renderFinding(
  finding: FindingRecord,
  links: DraftReportInput["links"],
  evidence: Map<string, DraftReportInput["evidence"][number]>,
  sources: Map<string, SourceRecord>,
): string {
  const citations = links.map((link) => {
    const item = evidence.get(link.evidenceId);
    const source = item ? sources.get(item.sourceId) : undefined;
    const label = item?.code ?? link.evidenceId;
    return `- ${link.direction.toUpperCase()}: ${label}${source ? ` (${source.code})` : ""}`;
  });

  const gaps = finding.informationGaps?.length
    ? ["Information gaps:", ...finding.informationGaps.map((gap) => `- ${gap}`)]
    : ["Information gaps: none recorded."];

  return [
    `### ${finding.code} — ${finding.statement}`,
    "",
    `Type: ${finding.type}  `,
    `Confidence: ${finding.confidence}  `,
    `Status: ${finding.status}`,
    "",
    finding.rationale,
    "",
    ...(finding.contradictionResolution
      ? ["Contradiction treatment:", finding.contradictionResolution, ""]
      : []),
    ...gaps,
    "",
    "Evidence trail:",
    ...(citations.length ? citations : ["- No linked evidence."]),
    "",
  ].join("\n");
}
