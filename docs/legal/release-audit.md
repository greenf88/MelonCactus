# Legal/privacy release audit — 1 October 2026

This document accompanies a **draft PR only**. It is not legal certification or approval to merge. The English and Dutch privacy pages are separately changed in the PR; the paid-engagement terms and scope-confirmation templates are separately readable in this directory. No PDF is issued while the substantive contract choices remain unresolved.

## What the repository demonstrates

- The current `origin/main` has separate EN/NL layouts; both load `@vercel/analytics` 2.0.1. This branch restricts page-view URLs to known public paths, strips query strings and fragments, and rejects custom events in `beforeSend`. It adds a `referrer=origin` policy. No advertising tracker, third-party embed, consent store or marketing signup was found in the source inspected. Server access/security logging by Vercel remains provider-controlled.
- The contact form collects name, work email, company, role, decision, target and timing; assessment, geography, budget, context and NDA discussion are optional. Server code allows only known fields, imposes length limits, validates the timing value, uses a honeypot and limits request bytes. Resend sends the enquiry to `contact@meloncactus.com` only if configured to match; no contact request was sent during this audit. Delivery logs contain configuration flags or provider error name/status, not enquiry text.
- Business facts in `siteConfig`: GFNI, `contact@meloncactus.com`, telephone `0622328034` / `tel:+31622328034`, and **owner-supplied** KvK number `93879695`. The number was not independently linked to GFNI in accessible public search results. No postal address, registered full legal name, legal form or VAT ID is verified. DNS MX records point to `mail.ovh.net`, suggesting OVH involvement, but not proving the actual mailbox product, contractual entity or processing terms. The code proves use of Resend and Vercel, not execution of a DPA or transfer assessment.
- Current listed prices: own-company Public Profile Exposure Scan **fixed €499**; Focused Intelligence Assessment **from €995**; Technical & Competitive Intelligence **typically from €1,995**; Strategic Intelligence Engagement **from €3,995**. The current commercial model uses Standard, Priority and individually scoped Critical / 24–48-hour timing, **not** an automatic fee multiplier. No B2C checkout exists. Prices do not explicitly say inclusive or exclusive of VAT; this remains a commercial/fiscal decision.
- Sample report and example cases are explicitly fictional. The articles are public-source commentary, not fictional customer cases. The revised website terms distinguish this.

## Live observation and cookie decision

The public homepage loaded in the in-app browser on 1 October 2026 and its DOM included a Vercel Analytics script at a same-origin generated path (`/e3ffe1d2b830bc05/script.js`), consistent with the v2 resilient-intake design. The visible scripts were Next.js bundles plus this analytics script. No banner was present. The browser API used here did not expose cookie/storage/network inspection; the separate agent-browser could not start Chrome and failed to connect to Edge. **Consequently, this is not a completed live cookie or request-payload audit.** A clean-browser Network/Application check on production and preview remains required before approval. In particular inspect all cookies, local/session storage, analytics intake payloads on `/`, `/nl`, contact preselection URLs and language navigation, and referrers. Provider documentation alone does not prove this site's exact behavior.

**Provisional decision:** do not add a banner merely because analytics is present. Vercel describes cookie-free, aggregated page views with a short-lived hash. The new filtering reduces exposure from URLs and the site does not intentionally send custom events. If clean-browser inspection confirms no other tracking/storage and a documented legitimate-interest balancing test supports low impact, limited analytics can be disclosed without a consent banner. If a consent-requiring script or identifier is found, block it before consent and implement equally accessible accept/reject/withdraw controls before release. “No cookies” alone does not settle GDPR duties.

## Primary sources consulted on 1 October 2026

| Source | Relevant point | Configuration / review dependency |
| --- | --- | --- |
| [ACM — Cookies plaatsen](https://www.acm.nl/nl/verkoop-aan-consumenten/reclame-en-verleiden/online-beinvloeden/cookies-plaatsen) and [AP — Cookies](https://autoriteitpersoonsgegevens.nl/nl/onderwerpen/internet-telefoon-tv-en-post/cookies) | Limited-impact analytics may be exempt from consent, but privacy-sensitive tracking needs prior consent and clear information. | Actual cookie/storage and script behavior must be inspected. |
| [AP — heldere cookiebanners](https://autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-en-misleidende-cookiebanners) | Consent and legitimate interest are distinct; legitimate interest needs a demonstrable balancing assessment. | Record a real balancing test for form contacts, public-source personal data and analytics. |
| [Vercel Analytics privacy](https://vercel.com/docs/analytics/privacy-policy) and [redaction](https://vercel.com/docs/analytics/redacting-sensitive-data) | Vercel describes v2 aggregation, collected fields, 24-hour visitor session and supported `beforeSend` filtering. | Check exact production and preview request payloads, project configuration and retention. |
| [RVO — bedrijfscorrespondentie](https://ondernemersplein.overheid.nl/wetten-en-regels/regels-voor-bedrijfscorrespondentie/) | Website business-identification rules can require registered name, address, email, telephone, KvK and VAT ID depending on activity. | Verify the entity, address-disclosure exception if any, and VAT ID. Do not infer from KvK number. |
| [RVO — algemene voorwaarden](https://ondernemersplein.overheid.nl/wetten-en-regels/algemene-voorwaarden/) | Terms must be available before agreement in a form the other party can save. | Approve terms and send durable version with the proposal. |
| [RVO — administratie](https://ondernemersplein.overheid.nl/wetten-en-regels/administratie-bijhouden-en-bewaren/) | Basic fiscal records generally require seven years. | Confirm which actual records qualify; not a blanket retention period for every enquiry. |
| [Resend DPA](https://resend.com/legal/dpa) | Vendor terms describe processing and transfer provisions. | Verify account terms, actual DPA acceptance, subprocessors and transfer mechanism; the public DPA is not proof of execution. |

## Publication gates / decisions for Rick and adviser

1. Supply a recent KvK extract or official record confirming that **93879695** belongs to GFNI/MelonCactus and the full registered name, legal form and relevant address. Determine what address must be published or whether a lawful shield applies. Supply VAT ID only from an authoritative business record.
2. Confirm the actual mailbox provider/product and processing terms (MX currently points to OVH); confirm Vercel and Resend account contracts, DPA and international-transfer safeguards. Do not confuse an Outlook mail client with mailbox hosting.
3. Approve and operationalise a retention schedule: specific unconverted-enquiry period, project working-file period, deletion owner/process, backups and provider retention. The draft privacy pages explicitly flag the missing schedule; they are **not publication-ready** until this is resolved.
4. Document a legitimate-interest balancing test for B2B contact handling, limited analytics and public-source research; assess Article 14 information duties and controller/processor roles per assignment. Professional legal review is recommended.
5. Decide and state whether all website prices are inclusive or exclusive of VAT, and confirm the tax treatment for each proposal. Do not assume a VAT rate or fiscal status.
6. Approve payment term and invoice point, cancellation/part-work settlement, cure period, reasonable liability rule, any insurance facts, governing court and legal-entity-specific contract wording. Only then issue a durable PDF of approved terms and use the scope-confirmation template. The draft terms are **not linked as operative terms** from the website.
7. Complete clean-browser production and preview checks above. Reassess cookie consent if the observed configuration differs from the repository or Vercel's general description. Review NL and EN legal copy side by side before merge.

## Status classes

- **Technically checked:** source structure, two-language route/link patterns, form validation, provider call and safe logging, versioned analytics integration. Automated checks and browser checks are reported separately in the PR.
- **Owner-provided but unverified:** KvK number, phone, GFNI operating identity.
- **Commercial decisions:** VAT display, payment, cancellation, retention operations, liability.
- **Recommended legal review:** entity disclosure/address, GDPR grounds and data-subject information, cross-border processing, entire engagement terms.
