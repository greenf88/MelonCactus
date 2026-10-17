import type { LocalIntelligenceStore, LocalResearchJob } from "./local-store";

export interface LocalControlRoomPageOptions {
  csrfToken: string;
  editMode: boolean;
  mutationsEnabled: boolean;
  notice?: string;
  error?: string;
}

export function renderLocalControlRoomPage(
  store: LocalIntelligenceStore,
  options: LocalControlRoomPageOptions,
): string {
  const status = store.getStatus();
  const canEdit = options.mutationsEnabled && options.editMode;
  const dossiers = store.listDossiers();
  const dossierCards = dossiers
    .map((dossier) => {
      const bundle = store.getBundle(dossier.id);
      const jobs = store.listResearchJobs(dossier.id);
      const draft = store.getLatestDraft(dossier.id);
      const audit = store.verifyAuditChain(dossier.id);
      const auditRows = store.listAuditEvents(dossier.id, 20);
      const scopeJob = jobs.find((job) => job.key === "scope");
      const qaJob = jobs.find((job) => job.key === "qa");

      return `
      <article class="dossier" id="dossier-${escapeHtml(dossier.dossierNumber)}">
        <div class="dossier-heading">
          <div>
            <p class="eyebrow">Dossier ${escapeHtml(dossier.dossierNumber)}</p>
            <h2>${escapeHtml(dossier.decisionQuestion)}</h2>
          </div>
          <span class="audit ${audit.valid ? "valid" : "invalid"}">
            Audit ${audit.valid ? "geldig" : "ongeldig"} · ${audit.events} events
          </span>
        </div>
        <dl>
          <div><dt>Dossierstatus</dt><dd>${escapeHtml(dossier.status)}</dd></div>
          <div><dt>Conceptrapport</dt><dd>${escapeHtml(draft?.status ?? "nog niet aangemaakt")}</dd></div>
          <div><dt>Bronnen</dt><dd>${bundle.sources.length}</dd></div>
          <div><dt>Bewijsstukken</dt><dd>${bundle.evidence.length}</dd></div>
          <div><dt>Bevindingen</dt><dd>${bundle.findings.length}</dd></div>
        </dl>

        <section class="section-block">
          <h3>Onderzoeksworkflow</h3>
          <ol class="jobs">${jobs.map((job) => renderJob(job, dossier.id, options, canEdit)).join("")}</ol>
          ${
            canEdit && scopeJob?.status === "waiting_for_approval"
              ? form(
                  `/dossiers/${encodeURIComponent(dossier.id)}/scope-approve`,
                  options.csrfToken,
                  `<div class="form-grid compact">
                    ${input("decidedBy", "Menselijke beoordelaar", "text", "", true, 200)}
                    ${input("rationale", "Reden scopegoedkeuring", "text", "", true, 1000)}
                   </div>
                   <button type="submit">Scope expliciet goedkeuren</button>`,
                  "approval-form",
                )
              : ""
          }
        </section>

        <details class="section-block" open>
          <summary>Bronnen en bewijs</summary>
          ${renderSources(bundle.sources)}
          ${renderEvidence(bundle.evidence, bundle.sources)}
          ${
            canEdit
              ? `${sourceForm(dossier.id, options.csrfToken)}${evidenceForm(
                  dossier.id,
                  options.csrfToken,
                  bundle.sources,
                )}`
              : ""
          }
        </details>

        <details class="section-block" open>
          <summary>Bevindingen en verificatie</summary>
          ${renderFindings(bundle.findings, bundle.links, bundle.evidence, bundle.reviews)}
          ${
            canEdit
              ? `${findingForm(dossier.id, options.csrfToken)}${linkForm(
                  dossier.id,
                  options.csrfToken,
                  bundle.findings,
                  bundle.evidence,
                )}${reviewForm(dossier.id, options.csrfToken, bundle.findings)}`
              : ""
          }
        </details>

        <details class="section-block" open>
          <summary>Intern conceptrapport</summary>
          ${
            draft
              ? `<p><strong>Versie ${draft.version}</strong> · ${escapeHtml(draft.status)} · ${escapeHtml(
                  draft.title,
                )}</p>`
              : "<p>Nog geen concept beschikbaar.</p>"
          }
          ${
            canEdit
              ? form(
                  `/dossiers/${encodeURIComponent(dossier.id)}/drafts`,
                  options.csrfToken,
                  `<div class="form-grid compact">
                    ${input("title", "Rapporttitel", "text", draft?.title ?? "", true, 300)}
                    ${input("createdBy", "Opsteller", "text", "local-report-operator", true, 200)}
                   </div>
                   <button type="submit">Nieuwe interne conceptversie maken</button>`,
                )
              : ""
          }
          ${
            canEdit && draft?.status === "review_ready" && qaJob?.status === "completed"
              ? form(
                  `/dossiers/${encodeURIComponent(dossier.id)}/report-approve`,
                  options.csrfToken,
                  `<input type="hidden" name="draftId" value="${escapeHtml(draft.id)}">
                   <div class="form-grid compact">
                    ${input("decidedBy", "Menselijke beoordelaar", "text", "", true, 200)}
                    ${input("rationale", "Goedkeuringsreden", "text", "", true, 1000)}
                   </div>
                   <button class="danger" type="submit">Rapport expliciet goedkeuren</button>
                   <p class="hint">Goedkeuring verzendt of publiceert niets.</p>`,
                  "approval-form",
                )
              : ""
          }
        </details>

        <details class="section-block audit-details">
          <summary>Metadata-audittijdlijn</summary>
          <ol class="timeline">${auditRows
            .map(
              (event) => `<li>
                <time datetime="${escapeHtml(event.occurredAt)}">${escapeHtml(formatDate(event.occurredAt))}</time>
                <span>${escapeHtml(event.actorType)} · ${escapeHtml(event.actorRef)}</span>
                <strong>${escapeHtml(event.action)} ${escapeHtml(event.objectType)}</strong>
                <code>${escapeHtml(event.eventHash.slice(0, 12))}</code>
              </li>`,
            )
            .join("")}</ol>
        </details>
      </article>`;
    })
    .join("");

  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>MelonCactus lokale Control Room</title>
  <style>${styles}</style>
</head>
<body>
  <main>
    <header>
      <p class="eyebrow">MelonCactus Intelligence Engine · uitsluitend lokaal</p>
      <h1>Private Control Room</h1>
      <p class="notice">Deze server luistert alleen op 127.0.0.1, gebruikt geen externe assets en verzendt niets. Edit-modus vervalt zodra de server stopt.</p>
      <p class="path">Opslag: ${escapeHtml(status.databasePath)}</p>
      <div class="mode ${canEdit ? "editing" : "readonly"}">
        <strong>${canEdit ? "Edit-modus actief" : "Alleen-lezen"}</strong>
        <span>${
          options.mutationsEnabled
            ? canEdit
              ? "Lokale wijzigingen zijn mogelijk; controleer ieder formulier vóór opslaan."
              : "Private opslag is bevestigd, maar wijzigingen zijn nog vergrendeld."
            : "Start met een expliciete externe private opslagmap om wijzigingen toe te staan."
        }</span>
      </div>
      ${
        options.mutationsEnabled
          ? form(
              "/edit-mode",
              options.csrfToken,
              `<input type="hidden" name="state" value="${canEdit ? "off" : "on"}">
               <button type="submit">${canEdit ? "Edit-modus sluiten" : "Edit-modus openen"}</button>`,
              "mode-form",
            )
          : ""
      }
    </header>
    ${options.notice ? `<p class="flash success">${escapeHtml(options.notice)}</p>` : ""}
    ${options.error ? `<p class="flash error">${escapeHtml(options.error)}</p>` : ""}
    <section class="metrics" aria-label="Samenvatting">
      <div class="metric"><strong>${status.dossiers}</strong><span>dossiers</span></div>
      <div class="metric"><strong>${status.sources}</strong><span>bronnen</span></div>
      <div class="metric"><strong>${status.evidence}</strong><span>bewijsstukken</span></div>
      <div class="metric"><strong>${status.findings}</strong><span>bevindingen</span></div>
      <div class="metric"><strong>${status.pendingHumanApprovals}</strong><span>menselijke besluiten open</span></div>
    </section>
    ${canEdit ? newDossierForm(options.csrfToken) : ""}
    <section aria-label="Dossiers">
      ${dossierCards || '<article class="dossier"><h2>Nog geen dossiers</h2><p>Open edit-modus om een dossier te registreren.</p></article>'}
    </section>
    <footer>Alleen lokaal · Geen automatische levering · Geen LinkedIn · Geen e-mail · Geen publicatie</footer>
  </main>
</body>
</html>`;
}

function renderJob(
  job: LocalResearchJob,
  dossierId: string,
  options: LocalControlRoomPageOptions,
  canEdit: boolean,
): string {
  const action =
    canEdit && job.execution === "agent" && job.status !== "completed"
      ? form(
          `/dossiers/${encodeURIComponent(dossierId)}/jobs/${encodeURIComponent(job.key)}/complete`,
          options.csrfToken,
          `<button class="small" type="submit">Markeer voltooid</button>`,
          "inline-form",
        )
      : "";
  return `<li>
    <span>${escapeHtml(job.title)}</span>
    <span class="job-actions"><span class="pill ${escapeHtml(job.status)}">${escapeHtml(
      job.status.replaceAll("_", " "),
    )}</span>${action}</span>
  </li>`;
}

function newDossierForm(csrfToken: string): string {
  return `<section class="create-panel">
    <p class="eyebrow">Nieuwe registratie</p>
    <h2>Nieuw lokaal dossier</h2>
    ${form(
      "/dossiers/new",
      csrfToken,
      `<div class="form-grid">
        ${input("receivedAt", "Ontvangstmoment", "datetime-local", localDateTimeValue(), true)}
        ${input("operatorRef", "Operatorreferentie", "text", "local-operator", true, 200)}
        ${select("classification", "Classificatie", ["restricted", "confidential", "public-only-test"])}
        <label class="wide">Beslisvraag<textarea name="decisionQuestion" maxlength="4000" required></textarea></label>
        <label class="wide">Scope-opmerking<textarea name="scopeNote" maxlength="4000"></textarea></label>
      </div>
      <button type="submit">Dossier registreren</button>`,
    )}
  </section>`;
}

function sourceForm(dossierId: string, csrfToken: string): string {
  return form(
    `/dossiers/${encodeURIComponent(dossierId)}/sources`,
    csrfToken,
    `<fieldset><legend>Bron registreren</legend><div class="form-grid">
      ${input("code", "Broncode", "text", "", true, 60)}
      ${input("title", "Titel", "text", "", true, 500)}
      ${input("canonicalUrl", "Canonieke URL", "url", "", false, 2000)}
      ${input("publisher", "Uitgever", "text", "", false, 300)}
      ${input("sourceType", "Brontype", "text", "public_web", true, 100)}
      ${input("publishedAt", "Publicatiedatum", "date")}
      ${input("retrievedAt", "Ophaalmoment", "datetime-local", localDateTimeValue(), true)}
      ${input("sha256", "SHA-256 (optioneel)", "text", "", false, 64)}
    </div><button type="submit">Bron opslaan</button></fieldset>`,
  );
}

function evidenceForm(
  dossierId: string,
  csrfToken: string,
  sources: ReturnType<LocalIntelligenceStore["getBundle"]>["sources"],
): string {
  if (sources.length === 0) return "";
  return form(
    `/dossiers/${encodeURIComponent(dossierId)}/evidence`,
    csrfToken,
    `<fieldset><legend>Bewijsstuk registreren</legend><div class="form-grid">
      ${selectFromRecords("sourceId", "Bron", sources.map((source) => [source.id, `${source.code} — ${source.title}`]))}
      ${input("code", "Bewijscode", "text", "", true, 60)}
      <label class="wide">Directe observatie<textarea name="observation" maxlength="8000" required></textarea></label>
      ${input("locator", "Vindplaats/pagina", "text", "", false, 1000)}
      ${input("observedAt", "Waargenomen op", "datetime-local")}
    </div><button type="submit">Bewijs opslaan</button></fieldset>`,
  );
}

function findingForm(dossierId: string, csrfToken: string): string {
  return form(
    `/dossiers/${encodeURIComponent(dossierId)}/findings`,
    csrfToken,
    `<fieldset><legend>Bevinding registreren</legend><div class="form-grid">
      ${input("code", "Bevindingscode", "text", "", true, 60)}
      ${select("type", "Type", ["observation", "assessment", "inference", "unknown"])}
      ${select("confidence", "Confidence", ["unknown", "low", "moderate", "high"])}
      ${select("status", "Status", ["proposed", "evidence_linked", "red_teamed", "verified", "rejected"])}
      ${input("createdBy", "Opsteller", "text", "local-analyst", true, 200)}
      ${select("material", "Materieel", ["yes", "no"])}
      <label class="wide">Stelling<textarea name="statement" maxlength="8000" required></textarea></label>
      <label class="wide">Onderbouwing<textarea name="rationale" maxlength="12000" required></textarea></label>
      <label class="wide">Informatiegaten (één per regel)<textarea name="informationGaps" maxlength="8000"></textarea></label>
      <label class="wide">Behandeling tegenbewijs<textarea name="contradictionResolution" maxlength="8000"></textarea></label>
    </div><button type="submit">Bevinding opslaan</button></fieldset>`,
  );
}

function linkForm(
  dossierId: string,
  csrfToken: string,
  findings: ReturnType<LocalIntelligenceStore["getBundle"]>["findings"],
  evidence: ReturnType<LocalIntelligenceStore["getBundle"]>["evidence"],
): string {
  if (!findings.length || !evidence.length) return "";
  return form(
    `/dossiers/${encodeURIComponent(dossierId)}/links`,
    csrfToken,
    `<fieldset><legend>Bewijs koppelen</legend><div class="form-grid compact">
      ${selectFromRecords("findingId", "Bevinding", findings.map((item) => [item.id, `${item.code} — ${item.statement}`]))}
      ${selectFromRecords("evidenceId", "Bewijs", evidence.map((item) => [item.id, `${item.code} — ${item.observation}`]))}
      ${select("direction", "Richting", ["supports", "contradicts", "context"])}
    </div><button type="submit">Koppeling opslaan</button></fieldset>`,
  );
}

function reviewForm(
  dossierId: string,
  csrfToken: string,
  findings: ReturnType<LocalIntelligenceStore["getBundle"]>["findings"],
): string {
  if (!findings.length) return "";
  return form(
    `/dossiers/${encodeURIComponent(dossierId)}/reviews`,
    csrfToken,
    `<fieldset><legend>Onafhankelijke review registreren</legend><div class="form-grid">
      ${selectFromRecords("findingId", "Bevinding", findings.map((item) => [item.id, `${item.code} — ${item.statement}`]))}
      ${select("reviewType", "Reviewtype", ["red_team", "source_verification", "qa"])}
      ${input("reviewerRef", "Reviewer", "text", "local-red-team", true, 200)}
      ${select("verdict", "Oordeel", ["pass", "qualified", "inconclusive", "reject"])}
      ${select("confidenceBefore", "Confidence vóór", ["unknown", "low", "moderate", "high"])}
      ${select("confidenceAfter", "Confidence na", ["unknown", "low", "moderate", "high"])}
      <label class="wide">Alternatieve verklaringen (één per regel)<textarea name="alternatives" maxlength="8000"></textarea></label>
      <label class="wide">Openstaande gaten (één per regel)<textarea name="unresolvedGaps" maxlength="8000"></textarea></label>
      <label class="wide">Reviewnotitie<textarea name="notes" maxlength="12000"></textarea></label>
    </div><button type="submit">Review opslaan</button></fieldset>`,
  );
}

function renderSources(sources: ReturnType<LocalIntelligenceStore["getBundle"]>["sources"]): string {
  if (!sources.length) return "<p>Nog geen bronnen geregistreerd.</p>";
  return `<div class="records">${sources
    .map(
      (source) => `<div><strong>${escapeHtml(source.code)}</strong><span>${escapeHtml(source.title)}</span><small>${escapeHtml(
        source.sourceType,
      )}</small></div>`,
    )
    .join("")}</div>`;
}

function renderEvidence(
  evidence: ReturnType<LocalIntelligenceStore["getBundle"]>["evidence"],
  sources: ReturnType<LocalIntelligenceStore["getBundle"]>["sources"],
): string {
  const sourceCodes = new Map(sources.map((source) => [source.id, source.code]));
  if (!evidence.length) return "<p>Nog geen bewijsstukken geregistreerd.</p>";
  return `<div class="records">${evidence
    .map(
      (item) => `<div><strong>${escapeHtml(item.code)}</strong><span>${escapeHtml(item.observation)}</span><small>${escapeHtml(
        sourceCodes.get(item.sourceId) ?? "onbekende bron",
      )}</small></div>`,
    )
    .join("")}</div>`;
}

function renderFindings(
  findings: ReturnType<LocalIntelligenceStore["getBundle"]>["findings"],
  links: ReturnType<LocalIntelligenceStore["getBundle"]>["links"],
  evidence: ReturnType<LocalIntelligenceStore["getBundle"]>["evidence"],
  reviews: ReturnType<LocalIntelligenceStore["getBundle"]>["reviews"],
): string {
  if (!findings.length) return "<p>Nog geen bevindingen geregistreerd.</p>";
  const evidenceCodes = new Map(evidence.map((item) => [item.id, item.code]));
  return `<div class="finding-list">${findings
    .map((finding) => {
      const findingLinks = links.filter((link) => link.findingId === finding.id);
      const findingReviews = reviews.filter((review) => review.findingId === finding.id);
      return `<article>
        <p class="eyebrow">${escapeHtml(finding.code)} · ${escapeHtml(finding.type)}</p>
        <h4>${escapeHtml(finding.statement)}</h4>
        <p>${escapeHtml(finding.rationale)}</p>
        <p class="hint">Confidence ${escapeHtml(finding.confidence)} · status ${escapeHtml(finding.status)} · ${
          finding.material ? "materieel" : "niet-materieel"
        }</p>
        <ul>${findingLinks
          .map(
            (link) => `<li>${escapeHtml(link.direction)}: ${escapeHtml(
              evidenceCodes.get(link.evidenceId) ?? link.evidenceId,
            )}</li>`,
          )
          .join("")}</ul>
        <p class="hint">Reviews: ${findingReviews
          .map((review) => `${escapeHtml(review.reviewType)} / ${escapeHtml(review.verdict)}`)
          .join(", ") || "geen"}</p>
      </article>`;
    })
    .join("")}</div>`;
}

function form(action: string, csrfToken: string, body: string, className = "data-form"): string {
  return `<form class="${className}" method="post" action="${escapeHtml(action)}">
    <input type="hidden" name="_csrf" value="${escapeHtml(csrfToken)}">${body}
  </form>`;
}

function input(
  name: string,
  label: string,
  type: string,
  value = "",
  required = false,
  maxlength?: number,
): string {
  return `<label>${escapeHtml(label)}<input name="${escapeHtml(name)}" type="${escapeHtml(type)}" value="${escapeHtml(
    value,
  )}"${required ? " required" : ""}${maxlength ? ` maxlength="${maxlength}"` : ""}></label>`;
}

function select(name: string, label: string, options: string[]): string {
  return selectFromRecords(
    name,
    label,
    options.map((option) => [option, option]),
  );
}

function selectFromRecords(name: string, label: string, options: string[][]): string {
  return `<label>${escapeHtml(label)}<select name="${escapeHtml(name)}" required>${options
    .map(([value, text]) => `<option value="${escapeHtml(value)}">${escapeHtml(text)}</option>`)
    .join("")}</select></label>`;
}

function localDateTimeValue(): string {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(value));
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const styles = `
  :root { color-scheme: dark; --bg: #0e1514; --panel: #182321; --panel-2: #202d2a; --line: #334642; --ink: #f3f1e8; --muted: #aebdb7; --lime: #c8f37a; --amber: #f5c56b; --red: #ff8d7f; }
  * { box-sizing: border-box; }
  body { margin: 0; background: radial-gradient(circle at top left, #20332e, var(--bg) 44%); color: var(--ink); font: 16px/1.55 system-ui, sans-serif; }
  main { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 50px 0 80px; }
  header { display: grid; gap: 12px; margin-bottom: 28px; }
  h1, h2, h3, h4, p { margin-top: 0; }
  h1 { max-width: 800px; margin-bottom: 6px; font-size: clamp(2.2rem, 6vw, 5rem); line-height: .96; letter-spacing: -.05em; }
  h2 { font-size: clamp(1.3rem, 2.5vw, 2rem); line-height: 1.15; }
  h3 { margin-bottom: 12px; color: var(--muted); font-size: .85rem; letter-spacing: .08em; text-transform: uppercase; }
  h4 { margin-bottom: 8px; font-size: 1.05rem; }
  .eyebrow { margin: 0 0 7px; color: var(--lime); font-size: .74rem; font-weight: 750; letter-spacing: .13em; text-transform: uppercase; }
  .notice, .path, .hint { color: var(--muted); }
  .path { font: .78rem ui-monospace, monospace; overflow-wrap: anywhere; }
  .mode { display: grid; gap: 3px; max-width: 760px; padding: 14px 16px; border: 1px solid var(--line); border-radius: 14px; }
  .mode.readonly { color: var(--amber); } .mode.editing { color: var(--lime); }
  .mode span { color: var(--muted); font-size: .85rem; }
  .mode-form { margin-top: 4px; }
  .flash { padding: 13px 16px; border-radius: 12px; border: 1px solid currentColor; }
  .flash.success { color: var(--lime); } .flash.error { color: var(--red); }
  .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 26px 0 34px; }
  .metric, .dossier, .create-panel { border: 1px solid var(--line); background: color-mix(in srgb, var(--panel) 96%, transparent); box-shadow: 0 24px 70px rgba(0,0,0,.2); }
  .metric { padding: 17px; border-radius: 16px; }
  .metric strong { display: block; font-size: 1.9rem; }
  .metric span { color: var(--muted); font-size: .82rem; }
  .create-panel, .dossier { margin-top: 18px; padding: clamp(20px, 4vw, 34px); border-radius: 22px; }
  .dossier-heading { display: flex; justify-content: space-between; gap: 22px; align-items: flex-start; }
  .audit { flex: 0 0 auto; padding: 7px 11px; border: 1px solid currentColor; border-radius: 999px; font-size: .78rem; }
  .audit.valid { color: var(--lime); } .audit.invalid { color: var(--red); }
  dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 9px; }
  dl div { padding: 12px 14px; background: rgba(255,255,255,.035); border-radius: 11px; }
  dt { color: var(--muted); font-size: .72rem; } dd { margin: 3px 0 0; font-weight: 700; }
  .section-block { margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--line); }
  details > summary { color: var(--muted); cursor: pointer; font-size: .86rem; font-weight: 750; letter-spacing: .05em; text-transform: uppercase; }
  .jobs { list-style: none; padding: 0; margin: 0; display: grid; gap: 7px; }
  .jobs > li { display: flex; justify-content: space-between; align-items: center; gap: 18px; min-height: 48px; padding: 9px 12px; border-top: 1px solid var(--line); }
  .job-actions { display: flex; align-items: center; gap: 8px; }
  .pill { flex: 0 0 auto; padding: 4px 9px; border-radius: 999px; background: #273532; color: var(--muted); font-size: .72rem; }
  .pill.completed { background: #29422d; color: var(--lime); }
  .pill.waiting_for_approval, .pill.blocked { background: #4b3b21; color: var(--amber); }
  form { margin-top: 16px; }
  fieldset { margin: 16px 0 0; padding: 18px; border: 1px solid var(--line); border-radius: 14px; }
  legend { padding: 0 8px; color: var(--lime); font-weight: 750; }
  .form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .form-grid.compact { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
  label { display: grid; gap: 5px; color: var(--muted); font-size: .78rem; font-weight: 650; }
  label.wide { grid-column: 1 / -1; }
  input, textarea, select { width: 100%; border: 1px solid #435853; border-radius: 9px; background: #111a18; color: var(--ink); padding: 10px 11px; font: inherit; }
  textarea { min-height: 90px; resize: vertical; }
  input:focus, textarea:focus, select:focus { outline: 2px solid var(--lime); outline-offset: 1px; }
  button { border: 0; border-radius: 999px; background: var(--lime); color: #112019; padding: 10px 15px; font-weight: 800; cursor: pointer; }
  button.small { padding: 6px 10px; font-size: .72rem; }
  button.danger { background: var(--amber); }
  .inline-form { margin: 0; }
  .records { display: grid; gap: 7px; margin-top: 14px; }
  .records > div { display: grid; grid-template-columns: 90px 1fr 150px; gap: 12px; padding: 10px 12px; border-radius: 10px; background: rgba(255,255,255,.03); }
  .records small { color: var(--muted); }
  .finding-list { display: grid; gap: 10px; margin-top: 15px; }
  .finding-list article { padding: 15px; border-radius: 13px; background: rgba(255,255,255,.03); }
  .finding-list ul { color: var(--muted); }
  .timeline { list-style: none; padding: 14px 0 0; margin: 0; display: grid; gap: 8px; }
  .timeline li { display: grid; grid-template-columns: 150px minmax(150px, 1fr) minmax(160px, 1fr) auto; gap: 10px; color: var(--muted); font-size: .74rem; }
  .timeline strong { color: var(--ink); } code { color: var(--lime); }
  footer { margin-top: 30px; color: var(--muted); font-size: .78rem; }
  @media (max-width: 700px) { .dossier-heading, .jobs > li { display: grid; } .audit { justify-self: start; } .job-actions { justify-content: space-between; } .form-grid { grid-template-columns: 1fr; } .records > div, .timeline li { grid-template-columns: 1fr; gap: 3px; } }
`;
