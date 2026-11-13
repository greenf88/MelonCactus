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
        │                   research → finding proposal
        │                                 │
        │                          independent red team
        │                                 │
        │                     human finding approval
        │                                 │
        │                    analysis → report draft → QA
        │                                 │
        │                       human report approval
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
6. an agent-produced finding has a recorded human `approved` decision; and
7. the finding is marked verified only through that human decision.

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

The bounded agent pipeline is deliberately framework-independent and local. It maps directly onto `research_jobs` and `agent_runs`. Source discovery calls exactly one injected `public_search` capability and cannot send, publish, fetch arbitrary URLs or invoke another tool. Every executable agent step runs only for `fictional-test-data` or `public-only-test` dossiers after human scope approval. Queries are supplied explicitly rather than derived from confidential dossier content.

Every candidate is treated as untrusted data. Only HTTPS URLs on an explicit exact/subdomain allowlist survive; credentials, custom ports, IP literals, localhost/local hosts and lookalike suffixes are rejected. Snippets are never persisted or interpreted. Accepted items are source candidates, not evidence. If the dossier changes while the tool is running, the entire agent output is rejected as stale. Agent-run records retain only hashes, status and accounting metadata; raw provider failures and content stay out of the audit chain.

Evidence normalisation accepts only a strict, closed schema. Every record must use an `E-` code, a registered source ID from the same dossier, an allowed evidence class, a direct observation and a locator. The runtime computes the content hash itself and stores provenance linking evidence, source and the completed normalisation run. Unknown fields, duplicate content, foreign source IDs and partial batches are rejected. Evidence-job completion requires a completed hashed normalisation run with source-bound provenance.

Finding proposal uses one injected, typed `finding_proposal` capability. Its identity-minimised brief contains only evidence/source codes, evidence class, observation and locator; it omits dossier identifiers, the decision question, source titles and URLs. The closed response schema cannot express a lifecycle status, approval, delivery target or external action. The runtime resolves evidence codes locally, writes the proposal and all evidence links atomically, records run-linked provenance and always forces status `proposed`. Unknown fields (including an attempted `status`), unknown evidence, missing support, duplicate links, timeouts and stale output fail the whole run closed.

A proposal cannot become `verified` through an agent method. A distinct human identity must make an explicit finding decision. Approval is refused until supporting evidence and an independent non-rejecting red-team review exist. The analysis job remains blocked while a material agent proposal lacks that human approval. Rejection is terminal; a changes-requested decision returns the item to `proposed`. Neither decision sends or publishes anything.

The red-team runner receives a purpose-built brief containing the finding, source/evidence codes, observations and challenge questions. It never receives the dossier ID, dossier number, source title or URL. Its reviewer identity must differ case-insensitively from every originating material-finding author. It has exactly one typed evaluation capability, validates the complete response schema, aggregates token/cost accounting and rejects the whole result if the dossier changed while evaluation was running. Red-team job completion requires an independent review for every material finding.

The current executable demonstration uses in-process fictional fixtures and no network or paid model. It proves discovery → normalisation → proposal → separated red team → human finding approval without introducing a provider credential or framework dependency. A future runtime adapter can retain these same contracts if durable orchestration becomes necessary.

No live model provider is connected. LangGraph 1.x LTS and Mastra core remain candidates only if durable orchestration becomes necessary; Eve can be reconsidered after GA/security review. Bellingcat Auto Archiver remains a separate capture-worker candidate rather than the orchestration core.
