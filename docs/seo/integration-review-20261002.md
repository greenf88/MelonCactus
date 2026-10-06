# Combined SEO and legal review — 2 October 2026

## Scope and source revisions

This review branch combines draft PR #14 at `73ae8acdda2983148ad9aad1e44c15f1c4ea54d6` with draft PR #13 at `36ba02d261bdde31f456ef2a083f6a46cf3f06ce`. Both target `main` at `16f3207f0bece1e66ef7bd40c1e7acfc96ea0440`. The source branches are unchanged. Integrating their code does not approve their legal content or authorise a production release.

## Conflict decisions

Thirteen files required explicit conflict resolution. Changes outside these conflicts were also retained and checked.

| Shared file area | Combined result |
| --- | --- |
| EN/NL layouts (2 files) | Keep the SEO entity graph and social metadata from #14, the origin-only referrer policy from #13, and `PrivacyAnalytics` from #13. Do not reintroduce unfiltered `Analytics` or a second standalone WebSite entity. |
| Central site config | Keep the structured address, E.164 phone, contact person and LinkedIn company URL from #14. The legal identity, address, VAT ID and phone agree with #13. No new business facts are inferred. |
| EN/NL contact pages (2 files) | Retain #14's direct-contact and operator wording; remove duplicate config imports. The shared form retains #13's localised privacy link. |
| EN/NL privacy pages (2 files) | Retain #13's expanded notices, including explicit unresolved provider/backup checks. These remain review copy and are not publication-ready. |
| EN/NL website terms (2 files) | Retain #13's distinction between website terms and paid assignments, VAT wording and content-use provisions, with the merged page metadata. No paid-engagement draft is activated. |
| EN/NL own-company scan (2 files) | Retain #14's breadcrumbs, Service/Offer schema and social metadata, and #13's visible VAT explanation. The fixed €499 own-company scan remains separate from external intelligence assessments. |
| Footer | Retain contact, address, registered identifiers and #14's company LinkedIn link; use #13's precise English Chamber of Commerce label. |
| README | Retain SEO webmaster-tool notes and document the combined review status. |

The service cards keep both the SEO detail links and VAT labels. Service overview pages and homepage price text retain #13's VAT explanations. Article summaries, honest editorial attribution, new services/topics, sitemap, language links, social images, llms.txt and localised 404s remain from #14.

## Analytics integration

`PrivacyAnalytics` uses the shared `routePairs` allowlist, which includes all 54 published EN/NL page paths, including the fourteen new service/topic pages. It strips query strings and fragments from pageview URLs and rejects custom events and unknown paths. The same component is used in both layouts. Regression coverage exercises every published route with sensitive query/fragment data and rejects unknown routes inside the new SEO families.

## Verification

ESLint, the standalone TypeScript check, all 58 tests, the production build and the client-bundle check passed. The latter inspected 13 browser bundle files for server-only markers. No contact form was submitted and no customer data was used for verification.

A local production HTTP check visited all 54 sitemap pages and all 54 distinct internal page destinations. It verified one H1, the canonical and three language alternatives, the page language, metadata/social references, the origin-only referrer policy, 116 parseable JSON-LD blocks and exactly one shared operator-backed organization per page. It also checked the localised form privacy links and the fixed scan's €499 excluding-VAT Offer versus the variable-fee services' omitted numeric price.

That check found an inherited homepage canonical on the source branch's 404 pages. Explicitly clearing alternates in both `not-found.tsx` boundaries fixes it. Both EN/NL missing routes now return HTTP 404, noindex, and no canonical link. This is an additional SEO correction discovered during integration; no normal page canonical was removed.

Visual browser verification of this combined branch is still open. Agent-browser could not start its daemon; its Chrome installer failed certificate validation, and the secure Playwright download did not deliver a valid archive. These failures are not treated as a browser pass. The HTTP checks above do not prove layout, hydration, actual analytics request payloads or client-side form preselection.

Rick reported a successful mobile check of PR #14 on 1 October 2026. This closes the outstanding mobile check for that source preview. It is owner-reported verification of #14, not a visual check of this combined branch.

Creating the remote integration branch through the connected GitHub app returned HTTP 403 (`Resource not accessible by integration`). A remote PR/preview has therefore not been created through that app. This is an access limitation, not a legal or content approval gate.

## Remaining work

- Confirm or update the MelonCactus trade name and intelligence activities within GFNI's registration, and review exact legal-entity wording.
- Complete the provider/DPA and transfer review, actual retention/deletion/backup procedures, legitimate-interest assessments and EN/NL legal review described in `docs/legal/release-audit.md`. Do not erase unresolved warnings merely to make the notices appear approved.
- Review the combined browser preview, particularly contact preselection, analytics payloads and both language versions; review mobile presentation after integration.
- Obtain content approval before merging into `main` or publishing to production. Draft paid-engagement terms require separate approval before use.
- Bing Webmaster Tools and repository visibility/access review remain separate tasks. No external listing, outreach or account-setting changes are included here.
