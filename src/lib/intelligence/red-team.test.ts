import { describe, expect, it } from "vitest";
import { buildRedTeamBrief } from "./red-team";

describe("red-team brief", () => {
  it("contains the claim and evidence but no dossier or client identity", () => {
    const brief = buildRedTeamBrief({
      finding: {
        id: "finding-1",
        code: "F-001",
        statement: "A production capability may have moved in-house.",
        type: "inference",
        confidence: "moderate",
        rationale: "Illustrative rationale.",
        material: true,
        createdBy: "analyst-agent",
        status: "evidence_linked",
      },
      evidence: [
        {
          id: "evidence-1",
          code: "E-001",
          sourceId: "source-1",
          observation: "A vacancy requests coating-process experience.",
          locator: "Requirements section",
        },
      ],
      sources: [
        {
          id: "source-1",
          code: "S-01",
          title: "Illustrative vacancy",
          sourceType: "job_posting",
          retrievedAt: "2026-10-16T18:00:00.000Z",
        },
      ],
      links: [{ findingId: "finding-1", evidenceId: "evidence-1", direction: "supports" }],
    });

    expect(brief.supportingEvidence[0]).toMatchObject({ evidenceCode: "E-001", sourceCode: "S-01" });
    expect(brief).not.toHaveProperty("dossierId");
    expect(brief.questions).toHaveLength(5);
  });
});
