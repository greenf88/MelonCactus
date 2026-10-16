import { describe, expect, it } from "vitest";
import { buildDraftReport } from "./report";

describe("draft report builder", () => {
  it("renders evidence IDs and keeps the result explicitly internal", () => {
    const report = buildDraftReport({
      dossierNumber: "2610001",
      title: "Illustrative expansion assessment",
      decisionQuestion: "Does public evidence support a physical expansion?",
      sources: [
        {
          id: "source-1",
          code: "S-01",
          title: "Illustrative public record",
          canonicalUrl: "https://example.com/record",
          sourceType: "public_record",
          retrievedAt: "2026-10-16T18:00:00.000Z",
        },
      ],
      evidence: [
        {
          id: "evidence-1",
          code: "E-001",
          sourceId: "source-1",
          observation: "The record describes a building extension.",
        },
      ],
      findings: [
        {
          id: "finding-1",
          code: "F-001",
          statement: "A physical expansion is plausible.",
          type: "assessment",
          confidence: "moderate",
          rationale: "The public record is direct but has not been independently corroborated.",
          material: true,
          createdBy: "analyst-agent",
          status: "verified",
          informationGaps: ["No dated exterior image has been captured."],
        },
      ],
      links: [{ findingId: "finding-1", evidenceId: "evidence-1", direction: "supports" }],
      reviews: [
        {
          id: "review-1",
          findingId: "finding-1",
          reviewType: "red_team",
          reviewerKind: "agent",
          reviewerRef: "red-team-agent",
          verdict: "qualified",
          alternativeExplanations: ["The project may not have started."],
          unresolvedGaps: ["Current construction state is unknown."],
          completedAt: "2026-10-16T18:10:00.000Z",
        },
      ],
    });

    expect(report.status).toBe("review_ready");
    expect(report.markdown).toContain("DRAFT — INTERNAL REVIEW ONLY");
    expect(report.markdown).toContain("SUPPORTS: E-001 (S-01)");
    expect(report.markdown).toContain("Human approval remains mandatory");
  });
});
