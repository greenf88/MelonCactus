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

## Why no agent framework is installed yet

The current repository is a small Next.js public site. Adding a durable framework before the private database, authentication and approval rules exist would widen the attack surface while making later migration harder. The Phase 1 core therefore exposes plain TypeScript contracts and Postgres invariants. A future runtime adapter can map a framework's steps and traces onto `research_jobs` and `agent_runs` without changing the evidence model.

The likely next evaluation is a narrowly scoped source-discovery runner after the local evidence gates and real-data storage boundary are approved. LangGraph 1.x LTS and Mastra core remain candidates; Eve can be reconsidered when an online durable runtime is actually needed. Bellingcat Auto Archiver remains a separate capture-worker candidate rather than the orchestration core.
