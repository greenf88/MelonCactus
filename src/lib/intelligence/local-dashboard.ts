import { chmodSync, writeFileSync } from "node:fs";
import path from "node:path";

import type { LocalIntelligenceStore } from "./local-store";

export function writeLocalDashboard(store: LocalIntelligenceStore): string {
  const status = store.getStatus();
  const dossierCards = store.listDossiers().map((dossier) => {
    const jobs = store.listResearchJobs(dossier.id);
    const draft = store.getLatestDraft(dossier.id);
    const audit = store.verifyAuditChain(dossier.id);
    const auditRows = store
      .listAuditEvents(dossier.id, 12)
      .map(
        (event) => `
          <li>
            <time datetime="${escapeHtml(event.occurredAt)}">${escapeHtml(formatDate(event.occurredAt))}</time>
            <span>${escapeHtml(event.actorType)} · ${escapeHtml(event.actorRef)}</span>
            <strong>${escapeHtml(event.action)} ${escapeHtml(event.objectType)}</strong>
            <code>${escapeHtml(event.eventHash.slice(0, 12))}</code>
          </li>`,
      )
      .join("");
    const jobRows = jobs
      .map(
        (job) => `
          <li>
            <span>${escapeHtml(job.title)}</span>
            <span class="pill ${escapeHtml(job.status)}">${escapeHtml(job.status.replaceAll("_", " "))}</span>
          </li>`,
      )
      .join("");

    return `
      <article class="dossier">
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
          <div><dt>Ontvangen</dt><dd>${escapeHtml(formatDate(dossier.receivedAt))}</dd></div>
        </dl>
        <h3>Onderzoeksworkflow</h3>
        <ol class="jobs">${jobRows || "<li>Nog geen onderzoeksplan.</li>"}</ol>
        <details>
          <summary>Laatste metadata-auditgebeurtenissen</summary>
          <ol class="timeline">${auditRows}</ol>
        </details>
      </article>`;
  });

  const html = `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>MelonCactus lokale Control Room</title>
  <style>
    :root { color-scheme: dark; --bg: #101716; --panel: #182321; --line: #30423e; --ink: #f3f1e8; --muted: #aebdb7; --lime: #c8f37a; --amber: #f5c56b; --red: #ff8d7f; }
    * { box-sizing: border-box; }
    body { margin: 0; background: radial-gradient(circle at top left, #20332e, var(--bg) 44%); color: var(--ink); font: 16px/1.55 system-ui, sans-serif; }
    main { width: min(1120px, calc(100% - 32px)); margin: 0 auto; padding: 56px 0 80px; }
    header { display: grid; gap: 14px; margin-bottom: 32px; }
    h1, h2, h3, p { margin-top: 0; }
    h1 { max-width: 760px; font-size: clamp(2rem, 5vw, 4.5rem); line-height: .98; letter-spacing: -.04em; }
    h2 { font-size: clamp(1.3rem, 2.5vw, 2rem); line-height: 1.15; max-width: 780px; }
    h3 { margin: 28px 0 12px; font-size: 1rem; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }
    .eyebrow { margin: 0 0 8px; color: var(--lime); font-size: .76rem; font-weight: 750; letter-spacing: .13em; text-transform: uppercase; }
    .notice { max-width: 760px; color: var(--muted); }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 28px 0 36px; }
    .metric, .dossier { border: 1px solid var(--line); background: color-mix(in srgb, var(--panel) 94%, transparent); box-shadow: 0 24px 70px rgba(0,0,0,.2); }
    .metric { padding: 18px; border-radius: 18px; }
    .metric strong { display: block; font-size: 2rem; }
    .metric span { color: var(--muted); font-size: .85rem; }
    .dossier { margin-top: 18px; padding: clamp(20px, 4vw, 36px); border-radius: 24px; }
    .dossier-heading { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; }
    .audit { flex: 0 0 auto; padding: 7px 11px; border-radius: 999px; font-size: .8rem; border: 1px solid currentColor; }
    .audit.valid { color: var(--lime); } .audit.invalid { color: var(--red); }
    dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px; }
    dl div { padding: 13px 15px; background: rgba(255,255,255,.035); border-radius: 12px; }
    dt { color: var(--muted); font-size: .76rem; } dd { margin: 3px 0 0; font-weight: 700; }
    .jobs { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
    .jobs li { display: flex; justify-content: space-between; align-items: center; gap: 18px; padding: 12px 14px; border-top: 1px solid var(--line); }
    .pill { flex: 0 0 auto; padding: 4px 9px; border-radius: 999px; background: #273532; color: var(--muted); font-size: .75rem; }
    .pill.completed { background: #29422d; color: var(--lime); }
    .pill.waiting_for_approval, .pill.blocked { background: #4b3b21; color: var(--amber); }
    details { margin-top: 24px; border-top: 1px solid var(--line); padding-top: 18px; }
    summary { color: var(--muted); cursor: pointer; font-weight: 700; }
    .timeline { list-style: none; padding: 14px 0 0; margin: 0; display: grid; gap: 8px; }
    .timeline li { display: grid; grid-template-columns: 150px minmax(150px, 1fr) minmax(160px, 1fr) auto; gap: 10px; align-items: center; color: var(--muted); font-size: .76rem; }
    .timeline strong { color: var(--ink); font-weight: 650; }
    code { color: var(--lime); }
    footer { margin-top: 28px; color: var(--muted); font-size: .8rem; }
    @media (max-width: 680px) { .dossier-heading { display: grid; } .audit { justify-self: start; } .jobs li { align-items: flex-start; } .timeline li { grid-template-columns: 1fr; gap: 2px; } }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="eyebrow">MelonCactus Intelligence Engine · lokaal</p>
      <h1>Private Control Room</h1>
      <p class="notice">Dit bestand leest geen netwerkbronnen en verzendt niets. Bewijs, rapporten en klantgegevens horen uitsluitend in de genegeerde lokale werkmap en nooit in GitHub.</p>
    </header>
    <section class="metrics" aria-label="Samenvatting">
      <div class="metric"><strong>${status.dossiers}</strong><span>dossiers</span></div>
      <div class="metric"><strong>${status.sources}</strong><span>bronnen</span></div>
      <div class="metric"><strong>${status.evidence}</strong><span>bewijsstukken</span></div>
      <div class="metric"><strong>${status.findings}</strong><span>bevindingen</span></div>
      <div class="metric"><strong>${status.agentRuns}</strong><span>agentuitvoeringen</span></div>
      <div class="metric"><strong>${status.pendingHumanApprovals}</strong><span>menselijke besluiten open</span></div>
    </section>
    <section aria-label="Dossiers">
      ${dossierCards.join("") || '<article class="dossier"><h2>Nog geen dossiers</h2><p>Maak eerst een lokaal dossier of voer de fictieve demonstratie uit.</p></article>'}
    </section>
    <footer>Gegenereerd ${escapeHtml(formatDate(new Date().toISOString()))} · Alleen lokaal openen · Geen klantlevering</footer>
  </main>
</body>
</html>`;

  const target = path.join(store.homePath, "control-room.html");
  writeFileSync(target, html, { encoding: "utf8", mode: 0o600 });
  try {
    chmodSync(target, 0o600);
  } catch {
    // Windows ACLs remain the controlling boundary.
  }
  return target;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(value));
}
