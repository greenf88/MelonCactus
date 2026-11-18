# Staging activation runbook

This runbook starts only after an authorised owner selects the Supabase organisation and accepts any non-zero quoted cost. It does not authorise production changes.

## 1. Provision isolated services

1. Create a project named clearly for MelonCactus in an EU region. Do not reuse either LumiScore project.
2. Create an isolated development branch if the plan and quoted cost are acceptable.
3. Create a separate Vercel project or custom environment for the Control Room. Protect it with identity-based access; a secret URL is not access control.
4. Keep the public website project disconnected from the private database until an authenticated server-only boundary has been reviewed.

## 2. Apply and inspect the migration

1. Apply `supabase/migrations/20261016201124_intelligence_engine_phase1.sql` to staging only.
2. Confirm that `mc_intel` is not in the Data API's exposed schemas.
3. Confirm that `anon` and `authenticated` have no schema, table, sequence or function privileges.
4. Confirm every operational table has RLS enabled and forced.
5. Run Supabase security and performance advisors and retain only the advisory links/status, not credentials or customer data.
6. Generate TypeScript types from staging only after the schema is accepted.

## 3. Transactional verification

Use fictional test data inside a transaction and roll it back:

1. Register two October 2026 dossiers concurrently and verify unique sequential numbers.
2. Verify the Europe/Amsterdam month boundary with a UTC timestamp near midnight.
3. Insert two independent sources, evidence and a material assessment.
4. Prove `review_ready` fails without supporting evidence.
5. Prove it fails without a red-team review.
6. Prove high confidence fails with only one source.
7. Add the second source and a qualified red-team result; verify `review_ready` succeeds.
8. Prove `approved` fails until a human approval row exists.
9. Verify the audit chain by recomputing hashes in event order.
10. Roll back the complete fixture transaction.

Before any live allocation, separately register the already reserved October dossier `2610001` from the restricted owner-held record. Confirm that the resulting pointer, receipt date and status are correct without placing the client identity or case content in source control. Only then may a later October 2026 record receive `2610002`.

## 4. Add the server adapter

- Use exact, pinned Supabase packages and commit the lockfile.
- Keep the service key in a server-only staging variable. Never prefix it with `NEXT_PUBLIC_`.
- Validate every command at the server boundary; do not expose generic SQL or unrestricted RPC tools to a model.
- Set `mc_intel.actor_type` and `mc_intel.actor_ref` per transaction so audit entries identify the responsible human, agent or system without storing personal content.
- Use short transactions. Perform model and network calls before or after a database transaction, never while holding database locks.

## 5. Release gate

Before any production proposal, require evidence for all of the following:

- authenticated and unauthenticated end-to-end tests;
- cross-dossier access isolation;
- no private content in browser bundles, logs, traces or analytics;
- backup restore and deletion-on-restore procedure;
- retention job/report with human review;
- per-agent tool allowlists and outbound network restrictions;
- model/provider data-processing and retention review;
- cost caps and alerts;
- explicit confirmation that LinkedIn, email, outreach and client delivery remain unavailable.

Production migration and promotion require a separate, explicit owner decision.
