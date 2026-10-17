import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "supabase", "migrations", "20261016201124_intelligence_engine_phase1.sql"),
  "utf8",
);

describe("intelligence engine migration security posture", () => {
  it("keeps the intelligence schema outside the exposed API schemas", () => {
    expect(migration).toContain("create schema if not exists mc_intel");
    expect(migration).toContain("revoke all on schema mc_intel from public, anon, authenticated");
    expect(migration).not.toMatch(/grant\s+usage\s+on\s+schema\s+mc_intel\s+to\s+(anon|authenticated)/i);
  });

  it("enables RLS and records evidence, red-team, report and audit primitives", () => {
    for (const table of [
      "dossiers",
      "sources",
      "research_jobs",
      "agent_runs",
      "evidence",
      "findings",
      "verification_reviews",
      "report_drafts",
      "audit_events",
    ]) {
      expect(migration).toContain(`alter table mc_intel.${table} enable row level security`);
    }
    expect(migration).toContain("create or replace function mc_intel.enforce_report_gate()");
    expect(migration).toContain("reviewer_kind = 'human'");
    expect(migration).toContain("review.reviewer_ref <> finding.created_by");
    expect(migration).toContain("finding_evidence_evidence_same_dossier");
    expect(migration).toContain("verification_reviews_finding_same_dossier");
    expect(migration).toContain("create unique index agent_runs_one_started_job_idx");
  });

  it("keeps audit events append-only for the application role", () => {
    expect(migration).toContain("security definer");
    expect(migration).toContain("grant select on table mc_intel.audit_events to service_role");
    expect(migration).not.toContain("grant select, insert, update on all tables in schema mc_intel");
  });

  it("does not seed a real dossier or client record into source control", () => {
    expect(migration).not.toContain("2610001");
    expect(migration).not.toMatch(/insert\s+into\s+mc_intel\.dossiers\s*\([^)]*\)\s*values\s*\(/i);
  });
});
