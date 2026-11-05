# Open-source framework assessment

Research snapshot: 16 October 2026. Scores are MelonCactus-specific, not general product rankings. Repository activity was checked on GitHub on the snapshot date.

## Decision

Do not import a full orchestration or OSINT platform in Phase 1. Keep the evidence and approval core framework-independent. Shortlist LangGraph and Mastra for the first durable runner after protected staging exists. Reassess Eve after general availability. Pilot Bellingcat Auto Archiver only as an isolated source-capture worker.

## Agent orchestration

| Candidate | License | Maintenance and reliability | Security and operating cost | MelonCactus fit | Decision |
| --- | --- | --- | --- | --- | --- |
| [LangGraph](https://github.com/langchain-ai/langgraph) | MIT | Very active; 1.0 is documented as LTS and the repository had same-day commits. Large ecosystem and durable graph/checkpoint model. | OSS runtime is free; managed LangSmith is optional and usage-priced. Recent server/auth advisories make strict version pinning and tenant tests essential. | Strong explicit state machine and human interrupts; Python-first core adds another runtime beside the current TypeScript site. | **Shortlist for durable worker.** |
| [Mastra](https://github.com/mastra-ai/mastra) | Apache-2.0 core; `ee/` uses a separate enterprise license | Very active with same-day commits and frequent releases. Native TypeScript/Next.js fit. | OSS core is free; cloud/enterprise features can add cost. Pin exact packages and lockfiles; the project has had supply-chain concerns around mutable published versions. | Lowest integration friction for this repository; workflow, eval and observability features are relevant. | **Shortlist after a pinned proof of concept.** |
| [Vercel Eve](https://github.com/vercel/eve) | Apache-2.0 | Extremely active and aligned with Vercel, but explicitly preview (`0.x`) and subject to API change. | OSS framework is free; Vercel Functions, Workflow, Sandbox, Blob, model calls and telemetry can add usage. Docs say telemetry is exported to Agent Runs by default and safeguards remain the deployer's responsibility. | Excellent future fit for filesystem-first agents, approvals and Vercel deployment, but premature for confidential operational data. | **Defer until GA/security review.** |
| [Microsoft AutoGen](https://github.com/microsoft/autogen) | MIT for code | The official repository now says maintenance mode and points new users to Microsoft Agent Framework. | OSS is free; Python/.NET runtime and migration path add operational cost. | No advantage over actively developed alternatives for a new TypeScript-centred build. | **Reject for new work.** |

## Evidence and OSINT platforms

| Candidate | License | Maintenance and security | MelonCactus fit | Decision |
| --- | --- | --- | --- | --- |
| [Bellingcat Auto Archiver](https://github.com/bellingcat/auto-archiver) | MIT | Active 2026 release cadence. Version 1.2.9 included a concrete authentication hardening fix, which is a positive maintenance signal and a warning to isolate credentials. | Strong, reusable public-web capture and archive component. Python/Docker and social-site credentials should remain outside the Next.js app. | **Pilot as Phase 2 capture sidecar.** |
| [IntelOwl](https://github.com/intelowlproject/IntelOwl) | AGPL-3.0 | Active 2026 releases and security automation. Large Django/Celery/Elasticsearch-style operational footprint. | Optimised for cyber indicators, malware and threat-intelligence enrichment, not industrial evidence dossiers. AGPL obligations need review before network deployment/modification. | **Reject.** |
| [OpenCTI](https://github.com/OpenCTI-Platform/opencti) | Apache-2.0 Community Edition plus separately licensed Enterprise files | Extremely active, but its own production guide says defaults are not strict and require security hardening. Heavy multi-service platform. | Excellent cyber-threat graph, poor match for light industrial OSINT and disproportionate hosting/maintenance cost. | **Reject.** |
| [Aleph](https://github.com/alephdata/aleph) | MIT core; some related components differ | Last repository change found was a December 2025 sunsetting-documentation update. Community support is intentionally focused on public-interest investigative users. | Valuable document/entity-search ideas, but not a safe new foundation for a commercial Phase 1. | **Reject; reuse concepts only.** |

## Cost envelope

- Open-source licenses above have no per-seat runtime fee, but infrastructure, storage, monitoring and model usage still cost money.
- The existing MelonCactus Vercel project is already on a paid team. Branch previews may fit inside current credits but remain usage-based.
- Supabase currently lists Pro from USD 25/month and additional Micro projects from roughly USD 10/month; Free allows two active projects. The connected account already shows two active projects, neither dedicated to MelonCactus, so the actual price must be quoted in the intended organisation before creation.
- Model calls are intentionally absent from Phase 1. Add a per-run budget and hard monthly cap before an agent runner is enabled.

## Reuse selected

Phase 1 reuses the existing MelonCactus dossier convention, scope template, retention rules, confidence language and article evidence discipline. It also adopts proven patterns from the reviewed projects—durable job state, explicit human gates, isolated source capture, content hashes and typed audit records—without importing their deployment footprint or licensing risk.
