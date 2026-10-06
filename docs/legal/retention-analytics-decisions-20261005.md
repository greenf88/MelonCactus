# Retention and Web Analytics — bounded decisions, 5 October 2026

Internal review material for draft PR #15. **6 October update:** Rick approved the 24-month maxima for non-fiscal assignment correspondence and final reports and the browser-bound prospective Analytics opt-out. He confirmed “Er zijn nog geen gegevens vervallen”; this is owner confirmation, not an inventory. The EN/NL pages contain the current text and real control; superseded 5 October public-copy proposals were removed here to prevent confusion and remain in Git history. The [bounded Analytics assessment](analytics-assessment.md) now supports legitimate interest and the Dutch low-impact exception for this design, with no extra banner recommended. The Vercel supplier-maxima question is parked. No merge/publication is authorised.

## What is already established

- Rick approved a maximum of **12 months after the last substantive contact** for an unsuccessful enquiry (including its correspondence), and **24 months after final delivery** for research working files, on 1 October 2026. These are policy choices, not proof of deletion. On 3 October Rick said he wants retention described generically for now and intends to organise sales/project correspondence after the first sale. That did **not** expressly revoke either maximum. A monthly reminder is a prompt, not an inventory or completed review.
- The current mailbox is OVHcloud Zimbra Starter; Outlook is a client and may hold synced, cached or exported copies. Its actual storage mode is unverified. Research files/reports currently reside locally. OneDrive is not a confirmed current store.
- Owner-shown Edge DevTools screenshots of **2 October 2026** showed genuine EN/NL preview contact pageview POSTs with `dp: "/contact"` and `dp: "/nl/contact"`, no fictitious query/fragment/form markers in those displayed bodies, and a displayed `Referer` limited to the preview origin. This is bounded evidence for those two requests, not a capture by Codex or proof for all production events.
- In a **read-only Vercel dashboard inspection on 3 October 2026**, the MelonCactus Production view had pageview data; no custom events were visible; the UTM tab offered an upgrade to Web Analytics Plus; and team Settings → Drains said no drains were associated with the team. The dashboard did not establish every network header, storage action or event in production. Do not repeat these checks without a concrete new reason.
- The protected preview's `_vercel_jwt` and Toolbar-related storage are separately attributed in [preview-storage-evidence.md](preview-storage-evidence.md); `vercel-feature-flags` remains unattributed. None is proven to be a Web Analytics cookie.

## Retention: choice, execution and proposed additions

| Category | Start and end / exception | Status |
| --- | --- | --- |
| Unsuccessful enquiry and related correspondence | Last substantive contact → at most 12 months; earlier when follow-up ends. A concrete claim or legal duty may justify only relevant records for as long as that reason lasts. | **Chosen policy**; active mailbox/Outlook/local inventory and deletion not verified. |
| Assignment correspondence | Written scope confirmation → through the assignment; maximum 24 months after final delivery for non-fiscal active copies, sooner when no correction or claim remains. Specific claim/necessary fiscal records separated. | **Owner-approved policy, 6 October**; execution unverified; not equated with an unsuccessful enquiry. |
| Research working files | Final delivery → at most 24 months, sooner if no longer necessary; specific documented claim/obligation limited to relevant files. | **Chosen policy**; execution not verified. |
| Final report | Final delivery → maximum 24 months, sooner when correction/contractual need ends; retain only the part necessary for a specific claim beyond that, with review on resolution. | **Owner-approved policy, 6 October**; execution unverified; no five-year rule. |
| Necessary basic fiscal records, e.g. invoices and corresponding scope confirmations where actually required | When a record ceases to have current administrative value → generally seven years under the ordinary Dutch basic-record rule; a different statutory duty may apply to a specific record. Do not treat the entire research dossier as fiscal administration. | Legal category; exact record/trigger assessed case by case. |

**Owner choice 1 approved on 6 October:** The 24-month outer limit for non-fiscal assignment correspondence and final reports applies, with earlier deletion when no longer needed and a narrow documented claim/legal-duty exception. Rick says no data have yet expired. Before publication he still needs a private first list of existing dates/locations, an earlier-necessity check and a scheduled first manual review. A completed inventory, log, deletion or backup test has not been observed. No data were deleted in this PR.

### Earlier retention proposal (superseded)

The 5 October bilingual proposed passages were replaced by the owner-approved 6 October policy and the current EN/NL site copy. Read the exact [side-by-side public version](privacy-publication-review-20261006.md). The earlier wording remains in Git history for provenance; no unapproved five-year report term was adopted.

## Web Analytics: supplier periods and objection

| Data or process | Substantiated on 5 October 2026 | Not substantiated |
| --- | --- | --- |
| Pro dashboard reporting window | Vercel documents **12 months**; Plus documents 24 months. The 3 October dashboard showed Plus not active. | A maximum deletion date: Vercel explicitly says data may be retained longer than the reporting window. |
| Visitor hash/session | Vercel describes a request-derived hash valid for one day and a visitor session discarded after 24 hours. | The exact hash inputs, deletion time of every derived/raw value, and a 24-hour period for all event data. |
| Event and aggregate data | Vercel describes pageview data points and aggregate dashboard results. | Separate maximum retention for raw request/event data, aggregate statistics and backups for this project. The DPA supplies broad service/termination criteria, not these product-specific maxima. |
| Individual history | Vercel says dashboard data are aggregated and not linked to an identifiable visitor. | A supported lookup or deletion of one person's past Analytics events. Do not demand an IP or fingerprint solely to attempt a lookup. |

The Vercel Web Analytics documentation inspected on **5 October 2026** did not identify a built-in per-visitor opt-out or individual historical deletion control. That was an absence in inspected docs, not proof no private mechanism exists. **Since then** the site's own browser-bound `on`/`off` preference and `beforeSend` gate were built and [tested against real Preview requests](analytics-optout-preview-check-20261006.md). A visitor can stop further measurement in that browser; clearing its storage can remove the choice. An email alone does not identify a browser or reliably remove past aggregate statistics.

**Owner choice 2 approved on 6 October:** implement and test a visible browser-bound Analytics opt-out on this preview, storing only an on/off preference, with no retrospective visitor identifier and a deliberate way to turn measurement on again. It applies only to this browser/device, may be lost when browser data are cleared, and does not identify or erase past aggregate statistics. Rick can receive objections by email and explain the browser control; do not ask for IP, account or fingerprint merely to find an Analytics visit. The code is in this draft PR and the [focused real Preview network check](analytics-optout-preview-check-20261006.md) observed the expected on/off contrast, including an already loaded script. If later legal or production checks do not support this configuration, a separately approved consent-before-load or Analytics-off decision remains necessary.

### Earlier Analytics proposal (superseded)

The 5 October proposal with a placeholder for an unbuilt setting was replaced by the real browser-bound control and current EN/NL copy. Read the [side-by-side public version](privacy-publication-review-20261006.md) and the [focused Preview test](analytics-optout-preview-check-20261006.md). No placeholder is part of the current public text.

## Consent assessment and supplier question

The observed no-Plus/no-Drains/no-visible-custom-events setup, site-side known-route filter, 2 October preview requests and 6 October opt-out test support the [bounded 6 October assessment](analytics-assessment.md): Article 6(1)(f) and the Dutch low-impact Analytics exception are defensible for this exact configuration, and an extra banner is not recommended. That is not legal certification or complete production observation. Referrer, IP, server enrichment and vendor retention retain documented limits; a material change in purpose, data, recipients or opt-out triggers reassessment. The unknown `vercel-feature-flags` writer alone is no proof of an Analytics leak.

**Question prepared for Vercel — parked on Rick's 6 October instruction; do not send now:** For this Pro Web Analytics project without Plus or Drains, distinguish (a) hash/session retention; (b) whether raw IP, full referrer, events and derived data persist and their maxima; (c) aggregate and backup deletion separately from the 12-month dashboard window; and (d) whether historical data about one visitor can be found or deleted without a new identifier. Keep existing contract and product evidence; do not infer a deletion guarantee.

## Concrete release boundary

1. **Before approval of current retention wording:** Rick's no-expiry statement is owner evidence, not a complete inventory. Privately list existing enquiry/project dates and Zimbra/possible Outlook/local locations, check any earlier-end-of-purpose cases and set the first manual review. The public copy promises maxima and earlier deletion, not automatic removal, a monthly log or tested backups. Build the log/backup handling as an operational follow-up; do not claim it is already operating.
2. **Analytics assessment:** The real Preview opt-out check is complete; the [bounded 6 October assessment](analytics-assessment.md) supports legitimate interest and the Dutch low-impact exception for the current configuration. No extra banner is recommended. Only a concrete material difference in purpose, data, recipients or opt-out reopens this decision.
3. **Supplier information parked, not an automatic publication block:** Rick chose to defer the product-specific Vercel maxima question. The 12-month dashboard window and 24-hour visitor session are not general deletion deadlines. Keep public wording truthful about what is known; no deletion guarantee is added.
4. **After a separately approved merge:** in a normal unauthenticated production browser capture real EN/NL pageview requests, payloads, URL/`Referer`, request/response headers and `Set-Cookie`; inspect cookies and relevant storage by origin. Distinguish Analytics from preview authentication/Toolbar. Do not submit a contact form or manufacture a POST. Correct any material discrepancy in a separate change.

## Primary sources consulted 5 October 2026

- [GDPR Articles 5, 6, 13, 17 and 21 (EUR-Lex)](https://eur-lex.europa.eu/eli/reg/2016/679/oj): retention, information, objection and erasure have distinct conditions.
- [Dutch Data Protection Authority — keeping personal data](https://autoriteitpersoonsgegevens.nl/nl/over-privacy/persoonsgegevens/bewaren-van-persoonsgegevens): justify periods, state them in the notice, and destroy/anonymise when no longer needed.
- [Dutch Tax Administration — seven- or ten-year administration retention](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/administratie_bewaren/administratie_bewaren): the ordinary seven years for basic data starts when current administrative value ceases; specific exceptions exist.
- [Vercel Analytics Privacy and Compliance](https://vercel.com/docs/analytics/privacy-policy), [Web Analytics overview](https://vercel.com/docs/analytics), [pricing/reporting windows](https://vercel.com/docs/analytics/limits-and-pricing), [advanced `beforeSend` configuration](https://vercel.com/docs/analytics/package) and [DPA](https://vercel.com/legal/dpa): supplier descriptions, not a measured maximum for all MelonCactus data or a legal consent opinion.
