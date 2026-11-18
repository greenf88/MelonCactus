import { describe, expect, it } from "vitest";
import type { DraftReadinessInput } from "./types";
import { buildPhaseOneResearchPlan, evaluateDraftReadiness } from "./workflow";

const readyInput: DraftReadinessInput = {
  findings: [
    {
      id: "finding-1",
      code: "F-001",
      statement: "The public evidence supports a physical expansion.",
      type: "assessment",
      confidence: "high",
      rationale: "Two independent official records align in place and time.",
      material: true,
      createdBy: "analyst-agent",
      status: "verified",
      informationGaps: [],
    },
  ],
  evidence: [
    {
      id: "evidence-1",
      code: "E-001",
      sourceId: "source-1",
      observation: "A dated permit describes an extension.",
    },
    {
      id: "evidence-2",
      code: "E-002",
      sourceId: "source-2",
      observation: "A later official image shows the building shell.",
    },
  ],
  links: [
    { findingId: "finding-1", evidenceId: "evidence-1", direction: "supports" },
    { findingId: "finding-1", evidenceId: "evidence-2", direction: "supports" },
  ],
  reviews: [
    {
      id: "review-1",
      findingId: "finding-1",
      reviewType: "red_team",
      reviewerKind: "agent",
      reviewerRef: "red-team-agent",
      verdict: "qualified",
      alternativeExplanations: ["The extension could be used for storage."],
      unresolvedGaps: ["Installed equipment is not publicly visible."],
      completedAt: "2026-10-16T18:00:00.000Z",
    },
  ],
};

describe("Phase 1 research workflow", () => {
  it("keeps delivery behind a final human approval job", () => {
    const plan = buildPhaseOneResearchPlan({
      dossierId: "2610001",
      decisionQuestion: "What does the public evidence support?",
    });
    const finalJob = plan.jobs.at(-1);

    expect(finalJob).toMatchObject({
      role: "human_approval",
      execution: "human",
      approvalRequired: true,
      dependsOn: ["qa"],
    });
    expect(plan.jobs.map((item) => item.role)).not.toContain("outreach");
    expect(plan.jobs.find((item) => item.key === "propose-findings")).toMatchObject({
      role: "analyst",
      execution: "agent",
      dependsOn: ["evidence"],
    });
    expect(plan.jobs.find((item) => item.key === "analysis")?.dependsOn).toEqual([
      "propose-findings",
      "red-team",
    ]);
  });

  it("accepts a verified, triangulated and red-teamed finding", () => {
    expect(evaluateDraftReadiness(readyInput)).toEqual({ ready: true, blockers: [] });
  });

  it("blocks unsupported high confidence and missing red-team review", () => {
    const result = evaluateDraftReadiness({
      ...readyInput,
      evidence: readyInput.evidence.slice(0, 1),
      links: readyInput.links.slice(0, 1),
      reviews: [],
      findings: [{ ...readyInput.findings[0], status: "evidence_linked" }],
    });

    expect(result.ready).toBe(false);
    expect(result.blockers.map((item) => item.code)).toEqual(
      expect.arrayContaining([
        "MISSING_INDEPENDENT_RED_TEAM",
        "HIGH_CONFIDENCE_NOT_TRIANGULATED",
        "FINDING_NOT_VERIFIED",
      ]),
    );
  });

  it("does not allow a finding author to red-team their own finding", () => {
    const result = evaluateDraftReadiness({
      ...readyInput,
      reviews: [{ ...readyInput.reviews[0], reviewerRef: "analyst-agent" }],
    });

    expect(result.blockers.map((item) => item.code)).toContain(
      "MISSING_INDEPENDENT_RED_TEAM",
    );
  });
});
