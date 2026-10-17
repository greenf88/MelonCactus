# Phase 1 architecture and safeguards

## Outcome

Phase 1 establishes a private evidence system before it introduces a general-purpose agent runtime. The public website remains a stateless acquisition surface. The active Phase 1 Control Room is offline-first and uses a local SQLite file plus restricted local exports. A dedicated MelonCactus Supabase project is now an optional later synchronisation or multi-user layer, not a prerequisite.

```text
Public website                 Local private Control Room (Phase 1)
no database access             operating-system user boundary
        │                                 │
        │ no automatic intake             ▼
        │                        deterministic workflow core
        │                                 │
        │                   ┌─────────────┼─────────────┐
        │                   ▼             ▼             ▼
        │                research      red team      report draft
        │                   │             │             │
        │                   └──── evidence gates ───────┘
        │                                 │
        │                           human approval
        │                                 │
        └──────────────────── no automatic delivery ────┘

               Local SQLite database and restricted files
       dossiers · sources · evidence · jobs · findings · reviews
              approvals · report drafts · hash-linked audit
```

## Data boundaries

The Git repository contains only code, migrations, fictional test fixtures and operating documentation. It must never contain:

- client or prospect identities;
- enquiry or mailbox content;
- captured source files or screenshots;
- private storage URLs or signed URLs;
- raw prompts or model responses;
- draft or final client reports;
- API keys, database URLs, tokens or session material.

The database schema accepts restricted pointers so large or sensitive artefacts can later live in encrypted object storage. Audit events contain only table/action/object metadata. Agent-run records contain hashes, accounting data and restricted pointers, not prompt or output bodies.

## Local database security

- `.meloncactus-intelligence/` and compiled runner output are ignored by Git.
- The local schema uses strict tables, foreign keys, full synchronous writes and WAL journaling.
- Audit rows are append-only and linked with SHA-256 hashes recalculated by the verifier.
- SQLite's online backup API creates consistent snapshots without copying a live database file.
- Retention deletion is human-only and gated by due dates, legal holds, a distinct second approver and exact dossier-number confirmation. A separate hash-linked register causes an older restored backup to reapply recorded deletions before verification.
- Generated HTML has no scripts, remote assets or network calls and escapes dossier content.
- The default local directory is for fictional verification only. Real client use requires an encrypted, access-controlled path outside the repository.
- The runtime has no command for email, LinkedIn, publication, deployment or client delivery.

## Optional online database security

- `mc_intel` is absent from `supabase/config.toml` Data API schemas.
- Schema, table, sequence and function privileges are revoked from `public`, `anon` and `authenticated`.
- Tables have RLS enabled and forced as defence in depth, with no public policies.
- The initial server path is `service_role` only. That key must remain server-side and is never safe in a browser bundle.
- Business functions use `SECURITY INVOKER`. The private audit trigger is the sole `SECURITY DEFINER` function, has an empty search path and is not executable directly by application roles; this lets normal writes append audit events while the service role has read-only access to the audit table.
- Composite foreign keys prevent jobs, sources, evidence, findings and reviews from being linked across dossiers.
- Report-readiness checks run again in Postgres, so a future UI cannot skip them accidentally.
- Dossier allocation is atomic and uses the Europe/Amsterdam month boundary.
- Foreign keys are indexed and material status queries use composite indexes.

## Evidence contract

Every material conclusion is a `finding`. A finding states its type (`observation`, `assessment`, `inference` or `unknown`), confidence, rationale, information gaps and lifecycle state. Evidence links declare whether an item supports, contradicts or only contextualises the finding.

A material assessment or inference cannot reach `review_ready` unless:

1. it has supporting evidence;
2. it has an independent red-team review;
3. the red team did not reject it;
4. contradicting evidence has an explicit treatment;
5. a high-confidence label has at least two independent supporting sources; and
6. the finding is marked verified.

An approved report additionally requires a recorded human approval. An agent is never an approval authority.

## Agent authority model

Allowed Phase 1 roles are scope, source discovery, technical research, corporate research, evidence normalisation, red team, analyst, report draft and QA. The deterministic plan ends in a human task.

Agents may propose and structure work. They may not:

- send or publish anything;
- operate LinkedIn or another social account;
- contact a person or company;
- accept terms, sign contracts or make purchases;
- delete or release records;
- change production or approve their own work.

Prompt injection is treated as untrusted source content. A source document cannot change tool permissions, system rules, scope, approval requirements or output destinations.

## First bounded agent runtime

The first source-discovery runner is deliberately framework-independent and local. It maps directly onto `research_jobs` and `agent_runs`, calls exactly one injected `public_search` capability and cannot send, publish, fetch arbitrary URLs or invoke another tool. It runs only for `fictional-test-data` or `public-only-test` dossiers after human scope approval. Queries are supplied explicitly rather than derived from confidential dossier content.

Every candidate is treated as untrusted data. Only HTTPS URLs on an explicit exact/subdomain allowlist survive; credentials, custom ports, IP literals, localhost/local hosts and lookalike suffixes are rejected. Snippets are never persisted or interpreted. Accepted items are source candidates, not evidence. If the dossier changes while the tool is running, the entire agent output is rejected as stale. Agent-run records retain only hashes, status and accounting metadata; raw provider failures and content stay out of the audit chain.

The current executable demonstration uses an in-process fictional fixture and no network or model. This proves the control boundary without introducing a provider credential or framework dependency. A future runtime adapter can retain these same contracts if durable orchestration becomes necessary.

The next evaluation is evidence normalisation of already captured public material, with schema validation and source-ID enforcement. LangGraph 1.x LTS and Mastra core remain candidates only if durable orchestration becomes necessary; Eve can be reconsidered after GA/security review. Bellingcat Auto Archiver remains a separate capture-worker candidate rather than the orchestration core.
