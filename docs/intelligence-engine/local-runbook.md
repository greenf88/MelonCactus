# Local Control Room runbook

## Purpose and boundary

Phase 1 runs offline first. The local Control Room uses the SQLite engine included with Node.js 24 and does not need Supabase, Vercel, an LLM API or another hosted service. The public MelonCactus website is not part of this runtime.

The default working directory is `.meloncactus-intelligence/`. It is ignored by Git and contains:

- `control-room.sqlite` — the operational database;
- `control-room.html` — a generated read-only overview;
- `exports/<dossier-number>/` — internal Markdown drafts;
- `backups/<timestamp>/control-room.sqlite` — point-in-time database backups.
- `deletion-register.jsonl` — a minimal, hash-linked record used to prevent restored backups from reviving deleted dossier content.

The code repository may contain only source code, fictional fixtures and documentation. Never force-add the local working directory to Git. Before real client use, point `--home` to an access-controlled, encrypted folder outside the repository and verify the device's full-disk encryption and backup policy.

## First local verification

From the repository root:

```powershell
npm run intelligence:demo
npm run intelligence:discovery-demo
npm run intelligence:verify
npm run intelligence:status
```

The demo is idempotent. It creates or resumes one entirely fictional dossier in the intentionally remote `9912` test period, so it cannot consume the reserved October 2026 number `2610001`. It records two fictional independent sources, two evidence records, a verified high-confidence assessment, an independent red-team review, a review-ready draft, a valid hash-linked audit chain and a SQLite backup.

The final approval remains open. The demo never sends, publishes, emails, deploys or calls an external service.

`intelligence:discovery-demo` creates or resumes a separate fictional dossier and executes the bounded source-discovery runner against an in-process fixture. It accepts two `example.invalid` candidates, rejects a lookalike domain, records input/output hashes and records zero model tokens/cost. It performs no DNS lookup, HTTP request, model call or account action.

Open `.meloncactus-intelligence/control-room.html` locally to inspect the generated overview. Regenerate it after changes with:

```powershell
npm run intelligence:dashboard
```

## Secure local input screen

Start the Control Room in read-only mode with:

```powershell
npm run intelligence:serve
```

The terminal prints a one-time access URL. Open that exact URL locally; it is exchanged for an `HttpOnly`, `SameSite=Strict` session cookie and immediately removed from the browser address. The server binds only to `127.0.0.1`, chooses a random port by default, accepts no remote connections, loads no external assets and applies no-cache, anti-framing and restrictive content-security headers.

Read-only is the safe default. Browser editing is available only when all of the following are true:

1. the storage path is explicitly supplied with `--home`;
2. that path is outside this Git repository;
3. the operator confirms that the path is private and encrypted with `--confirm-private-storage`;
4. the operator opens edit mode in the browser for the current server session.

After first running `npm run intelligence:build`, the edit-capable command is:

```powershell
node .intelligence-build/scripts/intelligence-engine.js serve --home E:\MelonCactus-Private --confirm-private-storage
```

Replace the example path with the verified, access-controlled location. Do not use the edit flag merely to bypass the guard: verify Windows full-disk or folder encryption and the backup destination first. Edit mode is held in memory and closes automatically when the server stops.

Every mutation is a local form post protected by the session cookie, an origin check and a per-process CSRF token. The input screen covers dossier registration, scope approval, workflow status, source and evidence registration, findings, evidence links, independent review, internal draft creation, final human report approval and controlled retention. Workflow prerequisites remain enforced in the store; the screen cannot mark evidence, analysis, red-team or report jobs complete without the required records. Approval never sends or publishes anything.

Every dossier form also carries the latest audit-event sequence as its dossier revision. The server acquires a SQLite write transaction and compares that revision before making any change. If another browser tab or operator session changed the dossier first, the complete stale operation is rolled back and the screen returns a conflict message. Review the newly rendered dossier and submit again; do not bypass the conflict by editing the hidden revision field.

## Regular checks

```powershell
npm run intelligence:status
npm run intelligence:verify
npm run intelligence:backup
```

`verify` checks SQLite integrity and recalculates every audit-event hash from the previous event. A failed check blocks reliance on the dossier until the cause is understood. It must not be fixed by deleting audit records. The local HTML overview contains a collapsed metadata-only timeline with actor, action, object type and hash prefix; it never includes source or report bodies.

`verify` also verifies the external deletion register from its first entry to its last. A missing register is valid only when there have been no controlled deletions. A present register with a broken hash chain blocks reliance on restore or deletion state and must be investigated rather than rewritten.

## Retention and controlled deletion

Deletion is never automatic. For each dossier, first register every applicable category, start date, deadline and known storage location. Use role-based operator references rather than personal data. The Control Room then enforces this sequence:

1. every registered deadline must have passed at the stated review time;
2. a legal hold blocks a proposal, approval or execution; a new hold can still stop an already approved deletion;
3. one human proposes deletion and a different human approves it;
4. approval alone removes nothing;
5. execution requires a separate action and the exact seven-digit dossier number.

Execution removes the dossier's sources, evidence, findings, reviews, jobs, drafts, approvals, retention rows and generated dossier exports from the active local Control Room. It replaces the decision question and scope with a minimal deletion marker, closes the dossier and retains the hash-linked audit metadata plus the minimal deletion register. Deleted dossiers reject new content.

This operation is not a claim of forensic secure erase. SQLite pages, operating-system snapshots, provider backups and copies in mailboxes or other listed locations need their own controls. Before executing a real deletion, inspect every recorded location and the applicable fiscal or legal exception. The public repository must never contain the live deletion register.

## Explicit human boundaries

- Scope jobs with an approval requirement cannot complete without a stored human scope decision.
- Human workflow jobs cannot be completed through the generic job-status method.
- A report cannot be approved until all material findings pass the evidence and red-team gates.
- Report approval is a separate, explicit human operation.
- Approval never means automatic delivery. Phase 1 has no delivery command.

## Bounded source discovery

The current runner is a tested adapter boundary, not live web research. It can call only a typed `public_search` tool supplied by trusted application code. Before the call it requires an approved scope and a dossier classified as `fictional-test-data` or `public-only-test`. The caller supplies one to five explicit queries and an exact domain allowlist; the runner never constructs a query from confidential dossier text.

Candidate results remain untrusted. The runner saves only title, optional publisher/date and a canonical HTTPS URL when the host is the allowed domain or a real subdomain. It refuses HTTP, embedded credentials, custom ports, IP literals, localhost/local hosts and suffix-lookalike domains. Search snippets are discarded, so instructions embedded in result text cannot become tool instructions. Accepted candidates are not evidence and do not satisfy later evidence or report gates.

Agent-run rows store status, SHA-256 input/output hashes, provider/model labels and token/cost counters. The shipped runner uses `modelProvider=none`, zero tokens and zero cost. Raw queries, snippets, provider error payloads and outputs are not stored in the audit timeline. A dossier-revision check rejects the whole result if another operator changes the dossier while search is running.

## Recovery

Backups are created through SQLite's online backup API so the source database remains internally consistent. A restore check always requires a new or empty directory and never replaces the active database:

```powershell
node .intelligence-build/scripts/intelligence-engine.js restore-check <backup-file> --target <new-empty-directory>
```

The command opens the restored copy, reapplies every valid entry from the active deletion register (or the register next to the backup), runs SQLite integrity verification and recalculates every dossier audit chain. This prevents an older backup from silently reviving content that was deleted later. Promotion of a restored copy over the active database remains deliberately manual and requires explicit approval; this prevents an accidental rollback over newer evidence.

## Current limitations

- SQLite file contents are not application-encrypted. Use an encrypted device/folder and restricted Windows account before real client data.
- The local database is single-operator Phase 1 infrastructure; multi-user access and synchronisation are not implemented.
- The local access cookie protects against accidental browser access on the same account, but it is not a substitute for a locked Windows session or full operator authentication in a future online deployment.
- Phase 1 records source and evidence metadata and text through forms; it does not ingest file uploads, crawl sites or archive external content.
- The deletion workflow controls the local Control Room and its generated exports only. Mailboxes, synced folders, archives and provider-held copies must be checked separately against the recorded storage locations.
- No live search provider, arbitrary browser/fetch tool or model is connected. Source discovery currently runs only with the offline fictional fixture or a separately injected, reviewed tool implementation.
- The prepared Supabase migration remains an optional later synchronisation/deployment path and has not been applied.
