# MelonCactus Intelligence Engine — Phase 1

This directory describes the private, evidence-led operating core prepared for MelonCactus. It is deliberately separate from the public website experience.

## Current state

- The domain rules and tests are implemented in `src/lib/intelligence/`.
- The private Postgres design is in `supabase/migrations/20261016201124_intelligence_engine_phase1.sql`.
- The migration has **not** been applied to any database.
- No private Control Room route is exposed by the public Next.js application.
- No agent has email, LinkedIn, publication, contract, invoice or client-delivery authority.
- No client names, correspondence, source files, report content or credentials are stored in Git.

## Documents

- [Master to-do](master-todo.md)
- [Architecture and safeguards](architecture.md)
- [Open-source framework assessment](framework-assessment.md)
- [Repository and cloud audit](audit-2026-10-16.md)
- [Staging activation runbook](staging-runbook.md)

The Phase 1 implementation is framework-independent on purpose. A durable agent runtime can be added later without changing the dossier, evidence, finding, verification, approval or audit contracts.
