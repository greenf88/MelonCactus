# Retention and deletion procedure — draft for operation

This document records policy choices and a **written procedure**, not evidence that deletion, backups or monthly reviews already operate. Rick Groeneveld is the responsible owner. Do not put client files, mailbox exports, account evidence or the live deletion register in this public repository. No data was deleted while preparing this document.

| Category | Start of period | Active-file rule | Status |
| --- | --- | --- | --- |
| Enquiry not converted to an assignment, including related correspondence | Last substantive contact | Delete by 12 months, sooner if follow-up is no longer needed | Owner-approved maximum, 1 October 2026 |
| Research working files | Final delivery of the assignment | Delete by 24 months, sooner if no longer needed | Owner-approved maximum, 1 October 2026 |
| Final report | Final delivery | Keep only while needed for corrections or proportionate contractual claims; review separately from working files | **Five years is a proposal, not expressly confirmed by the owner. Decide a justified maximum before publication.** |
| Scope confirmation and necessary financial records | Relevant transaction / financial year | Keep only records needed for the applicable statutory accounting duty, generally seven years in the Netherlands | Legal category; check the exact record and trigger, not every research file |
| Records connected to a concrete claim or other legal duty | Date and nature of the claim/duty | Restrict the hold to relevant records; document reason and next review date | Exception requiring case-specific decision, not an indefinite whole-dossier hold |

## Monthly review to put into operation

1. **Proposed cadence:** Rick reviews due items once each month. First identify the business mailbox (OVHcloud Zimbra Starter), its inbox, sent items, archive and trash; relevant Outlook local/synchronised copies and exports; local research folders and final reports. Confirm the actual Outlook storage mode and whether other copies exist. OneDrive is not a current store.
2. Assign each enquiry/project its existing shared monthly dossier number. Record category, last substantive contact or final-delivery date, calculated deadline and the relevant storage locations in a restricted internal register. Do not include enquiry text or report content in the register.
3. At each review, delete or anonymise expired active copies in all relevant locations, **after** checking whether a necessary fiscal record or documented concrete claim requires a limited exception. Record the exception, owner and next review date. Do not delete financial records simply because a research-file period ended.
4. Keep a minimal private deletion log: dossier number, category, deadline, review date, action (`deleted`, `anonymised`, `held with reason`), locations checked, completion date and Rick's initials. No personal names, message contents or file attachments. Periodically verify that the log itself remains access-restricted and is not retained longer than needed for accountability.
5. Check mailbox trash/archive and Outlook synchronisation after deletion. For an erasure request, assess active copies and any known backups; if a backup is restored, reapply recorded deletions before general use. Record completion privately.

**Implementation status:** The categories and two approved maxima above are documented, but a first inventory, actual monthly reviews, deletion log, Outlook-copy check and restored-backup procedure have not been observed. Rick must set these up and test them before the public wording is approved as an operational promise. This procedure authorises no deletion in this PR.

## Backup proposal, not an installed control

No GFNI-controlled backup or periodic mailbox export has been confirmed. Propose an encrypted, access-restricted backup of the necessary local project files and, where technically feasible and justified, mailbox data, with a documented restore test and a record of what was backed up. Select the product and schedule only after checking data location, DPA, transfer and access terms. A target of no more than **90 days** for GFNI-controlled backup copies after active deletion is a proposal, not a legal rule or a verified provider period; test whether the chosen rotation and deletion-on-restore can achieve it. Do not activate OneDrive or another service by this document. OVHcloud Zimbra's technical service backups are **not** a confirmed customer backup or recovery arrangement. Provider copies follow their own contracts and technical cycles, not this proposed GFNI target.

The [Dutch Data Protection Authority](https://autoriteitpersoonsgegevens.nl/nl/over-privacy/persoonsgegevens/bewaren-van-persoonsgegevens) gives no universal GDPR retention period and requires a justified choice. Its [erasure guidance](https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/privacyrechten/recht-op-vergetelheid) also addresses backups. [Ondernemersplein](https://ondernemersplein.overheid.nl/wetten-en-regels/administratie-bijhouden-en-bewaren/) describes the general seven-year basic fiscal-record duty. These references do not certify this schedule or its implementation.
