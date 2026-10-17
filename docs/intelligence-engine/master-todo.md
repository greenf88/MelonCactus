# MelonCactus Intelligence Engine — prioritised master to-do

Status date: 17 October 2026. Scope: MelonCactus only.

Legend: `[x]` completed in the Phase 1 branch, `[~]` prepared but not activated, `[ ]` remaining, `OWNER` requires Rick or another authorised human.

## P0 — security and isolation

- [x] Audit the current GitHub repository, open pull requests, project documents and deployment shape.
- [x] Confirm that the GitHub repository is public and keep all customer data and restricted evidence out of it.
- [x] Audit Vercel read-only: project, latest deployments, protection posture, environment-variable names and custom environments.
- [x] Audit Supabase read-only and confirm that no dedicated MelonCactus project exists.
- [x] Leave LumiScore projects and data unchanged.
- [x] Create feature branch `feat/intelligence-engine-phase-1`.
- [x] Patch Next.js from 16.3.6 to 16.4.2 after the dependency audit identified affected releases.
- [x] Pin the patched `source-map-js` transitive dependency.
- [~] Create a dedicated MelonCactus Supabase project in an EU region. `OWNER`: select the organisation and explicitly accept any quoted recurring cost.
- [ ] Create a Supabase development branch or other isolated staging database after the project exists. `OWNER`: approve non-zero branch cost if quoted.
- [ ] Add a separate, access-controlled Vercel Control Room project or custom staging environment; do not expose it on the public custom domains.
- [ ] Configure operator authentication, short sessions and MFA before any private interface is enabled.
- [ ] Add secrets only to server-side staging variables; never use `NEXT_PUBLIC_` for database secrets.
- [ ] Run Supabase security and performance advisors after applying the migration; resolve or explicitly document every notice.

## P0 — governed operational core

- [x] Implement atomic `YYMMNNN` dossier allocation using Europe/Amsterdam time.
- [x] Preserve one sequence for enquiries and assignments; numbers are never recycled.
- [x] Model dossiers, sources, evidence, research jobs, dependencies, agent runs, findings, reviews, report drafts and approvals.
- [x] Keep the operational schema private and outside the configured Data API schemas.
- [x] Revoke access from `public`, `anon` and `authenticated`; allow only server-side `service_role` access for the first private implementation.
- [x] Enable and force RLS as defence in depth on all operational tables.
- [x] Add source and evidence checks, SHA-256 fields, timestamps, restricted storage pointers and indexes.
- [x] Add append-only, per-dossier hash-linked audit metadata without raw prompts, report text, client identity or source content.
- [x] Add deterministic report-readiness rules: supporting evidence, independent red team, contradiction treatment and two-source triangulation for high confidence.
- [x] Require a recorded human approval before a draft can become approved.
- [x] Generate an internal Markdown draft with evidence IDs, source register, gaps and an explicit non-delivery warning.
- [x] Generate red-team briefs without dossier or client identity.
- [x] Build a deterministic research-job DAG ending in human approval.
- [~] Apply the migration to isolated staging and run transactional verification. Blocked only by the absence of a dedicated MelonCactus Supabase project.
- [ ] Before live allocation, privately register the already reserved October 2026 dossier `2610001`; do not store its client identity or case content in Git. `OWNER`: verify its restricted pointer and receipt date.

## P1 — private Control Room

- [x] Implement an offline-first SQLite adapter using the same evidence and approval contracts.
- [x] Keep all generated databases, exports, dashboards and backups outside Git tracking.
- [x] Add a resumable fictional dossier that reaches a review-ready draft without external calls.
- [x] Add a read-only local HTML overview, Markdown export, integrity verification and consistent backups.
- [x] Add a token-protected, loopback-only Control Room with CSRF/origin checks and no external assets.
- [~] Implement a server-only Postgres adapter only if online or multi-user operation becomes necessary.
- [x] Build local operator screens for dossier registration, scope approval, job status, source/evidence entry, findings, red-team review and report review.
- [x] Make the UI read-only by default and require an explicit external private-storage confirmation plus session-local edit mode for writes.
- [x] Add audit-revision concurrency checks that atomically reject stale local forms before they can overwrite newer dossier work.
- [x] Add a visible, collapsed audit timeline containing metadata only.
- [x] Add export to a restricted working file; no email or client-delivery buttons exist in Phase 1.
- [ ] Verify browser → authenticated server → database → rendered response end to end on protected staging.
- [x] Verify token → local server → SQLite mutation → rendered response end to end with automated integration tests.
- [x] Add backup, restore and deletion tests aligned with `docs/legal/retention-schedule.md`: due-date checks, a legal hold (including a late hold after approval), separate requester/reviewer identities, exact dossier-number confirmation, minimal redaction, hash-linked deletion register and deletion replay after restoring an older backup.

## P1 — first agent execution

- [x] Select a minimal runtime after the deterministic gates: a framework-independent local TypeScript runner that uses the existing SQLite jobs/audit contracts and adds no live provider dependency.
- [x] Implement the source-discovery agent with exactly one typed `public_search` capability, an explicit HTTPS domain allowlist, public/synthetic dossier restriction, time/result limits, URL/SSRF guards and stale-output rejection. The current demonstration tool is offline and fictional; no live search provider is connected.
- [ ] Implement evidence normalisation with schema validation and source-ID enforcement.
- [ ] Run red team in a separate context from the originating analyst agent.
- [x] Store input/output hashes and optional restricted pointers for agent runs; raw queries, provider errors, snippets and outputs stay out of audit events.
- [x] Add token, model/provider and estimated-cost accounting per run; the tool-only runner records no model, zero tokens and zero model cost.
- [x] Create a small eval set with fictitious/public-only cases covering scope approval, lookalike domains, HTTP/credential/loopback URLs, prompt-injection snippets, empty allowlisted results, provider failure/timeout and stale output.
- [~] Require human approval for scope changes, model-produced findings and final report status. Scope and final-report approval are enforced; no model-produced finding path exists yet.
- [x] Enforce human approval methods for approved scope and final report status in the local adapter.

## P2 — evidence capture and search

- [ ] Pilot Bellingcat Auto Archiver as an isolated capture sidecar for supported public URLs; do not place its credentials or archive data in this repository.
- [ ] Validate robots, terms, copyright, personal-data minimisation and source-specific lawful access before enabling a connector.
- [ ] Add encrypted private object storage with retention tags and malware/content-type checks.
- [ ] Add embeddings only after the access boundary and deletion workflow are proven.
- [ ] Keep embeddings in the same dossier access boundary as the source text; deletion must remove both.
- [ ] Add entity resolution and a knowledge graph only after evidence provenance remains queryable and reversible.

## Explicitly prohibited

- [x] No LinkedIn access, scraping, posting, reacting or messaging.
- [x] No email, outreach, acknowledgement, proposal, invoice or client delivery by an agent.
- [x] No production database migration or destructive database operation.
- [x] No publication or production promotion.
- [x] No customer names, emails, enquiry contents, source captures, prompts or reports in GitHub.
- [x] No model may approve its own material finding or report.
