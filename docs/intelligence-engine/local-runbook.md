# Local Control Room runbook

## Purpose and boundary

Phase 1 runs offline first. The local Control Room uses the SQLite engine included with Node.js 24 and does not need Supabase, Vercel, an LLM API or another hosted service. The public MelonCactus website is not part of this runtime.

The default working directory is `.meloncactus-intelligence/`. It is ignored by Git and contains:

- `control-room.sqlite` — the operational database;
- `control-room.html` — a generated read-only overview;
- `exports/<dossier-number>/` — internal Markdown drafts;
- `backups/<timestamp>/control-room.sqlite` — point-in-time database backups.

The code repository may contain only source code, fictional fixtures and documentation. Never force-add the local working directory to Git. Before real client use, point `--home` to an access-controlled, encrypted folder outside the repository and verify the device's full-disk encryption and backup policy.

## First local verification

From the repository root:

```powershell
npm run intelligence:demo
npm run intelligence:verify
npm run intelligence:status
```

The demo is idempotent. It creates or resumes one entirely fictional dossier in the intentionally remote `9912` test period, so it cannot consume the reserved October 2026 number `2610001`. It records two fictional independent sources, two evidence records, a verified high-confidence assessment, an independent red-team review, a review-ready draft, a valid hash-linked audit chain and a SQLite backup.

The final approval remains open. The demo never sends, publishes, emails, deploys or calls an external service.

Open `.meloncactus-intelligence/control-room.html` locally to inspect the generated overview. Regenerate it after changes with:

```powershell
npm run intelligence:dashboard
```

## Regular checks

```powershell
npm run intelligence:status
npm run intelligence:verify
npm run intelligence:backup
```

`verify` checks SQLite integrity and recalculates every audit-event hash from the previous event. A failed check blocks reliance on the dossier until the cause is understood. It must not be fixed by deleting audit records.

## Explicit human boundaries

- Scope jobs with an approval requirement cannot complete without a stored human scope decision.
- Human workflow jobs cannot be completed through the generic job-status method.
- A report cannot be approved until all material findings pass the evidence and red-team gates.
- Report approval is a separate, explicit human operation.
- Approval never means automatic delivery. Phase 1 has no delivery command.

## Recovery

Backups are created through SQLite's online backup API so the source database remains internally consistent. Restoring is deliberately not automated yet: choose the exact backup, preserve the current database, restore into an isolated path, then run `verify` before replacing anything. This avoids an accidental rollback over newer evidence.

## Current limitations

- The generated HTML is read-only. Data entry still uses the TypeScript store until a protected local form is implemented.
- SQLite file contents are not application-encrypted. Use an encrypted device/folder and restricted Windows account before real client data.
- The local database is single-operator Phase 1 infrastructure; multi-user access and synchronisation are not implemented.
- No live source discovery, browsing or model runtime is connected yet.
- The prepared Supabase migration remains an optional later synchronisation/deployment path and has not been applied.
