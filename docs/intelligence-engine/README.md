# MelonCactus Intelligence Engine — Phase 1

This directory describes the private, evidence-led operating core prepared for MelonCactus. It is deliberately separate from the public website experience.

## Current state

- The domain rules and tests are implemented in `src/lib/intelligence/`.
- An offline-first SQLite adapter, resumable fictional demonstration, Markdown export,
  backup command, generated read-only HTML overview and token-protected loopback Control Room are implemented locally.
- The private Postgres design is in `supabase/migrations/20261016201124_intelligence_engine_phase1.sql`.
- The migration has **not** been applied to any database.
- No private Control Room route is exposed by the public Next.js application.
- Browser writes require an explicitly confirmed private storage path outside the repository and a session-local edit-mode action.
- Controlled local deletion requires due retention categories, no legal hold, a different human approver and exact dossier-number confirmation; a hash-linked register reapplies deletions after backup restore.
- No agent has email, LinkedIn, publication, contract, invoice or client-delivery authority.
- No client names, correspondence, source files, report content or credentials are stored in Git.

## Documents

- [Master to-do](master-todo.md)
- [Architecture and safeguards](architecture.md)
- [Open-source framework assessment](framework-assessment.md)
- [Repository and cloud audit](audit-2026-10-16.md)
- [Staging activation runbook](staging-runbook.md)
- [Local Control Room runbook](local-runbook.md)

The Phase 1 implementation is framework-independent on purpose. The local SQLite store is the active Phase 1 path; the Postgres design is an optional later online adapter. A durable agent runtime can be added later without changing the dossier, evidence, finding, verification, approval or audit contracts.
