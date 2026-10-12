# GEO operations and evidence register

Status: implementation guidance, not proof that external dashboards or IndexNow are active.

Version: 1.0

Reviewed: 12 October 2026 (Europe/Amsterdam)

## Current evidence

| Evidence ID | Observation | Boundary |
| --- | --- | --- |
| `GEO-20261012-LIVE-CRAWL` | The live sitemap contained 56 canonical URLs (28 English and 28 Dutch). All returned HTTP 200. The crawl found 18 Article pages, 122 parseable JSON-LD blocks and no future publication dates. Ten Article pages had a visible source register, matching `Article.citation` and a localized explanatory visual before this change. | A point-in-time HTTP crawl, not an indexation or ranking guarantee. |
| `GEO-20261012-UA-EQUIVALENCE` | The homepage returned the same title, canonical, main content and exact response-body SHA-256 for a normal browser user agent, OAI-SearchBot, GPTBot, PerplexityBot, Claude-SearchBot, Googlebot and bingbot. | User-agent strings were simulated. This does not verify crawler IP ownership or every edge/WAF path. |
| `GEO-20261012-SOURCE-LINKS` | The four newly sourced article pairs were checked against five primary-source URLs. The Infineon and European Commission pages responded to the automated client. Both ASML URLs resolved to official ASML investor pages but returned 403 to the automated client; their content remained available through a normal browser. | A 403 caused by publisher bot protection is not treated as a broken editorial link. Availability can change. |
| `GEO-20261012-LH-BEFORE` | Three mobile Lighthouse runs were recorded for the homepage, services, insights hub and an article before this change. Median CLS was `0.0003` for every template. | Local production build on the test workstation; not field data. |
| `GEO-20261012-LOCAL-AFTER` | A production-build crawl returned 200 for all 56 sitemap URLs, zero canonical or hreflang mismatches, 122 parseable JSON-LD blocks, and 18/18 Article pages with visible sources, matching citations and visuals. A real unknown URL returned 404. | Local production build; production must be rechecked after a separately approved release. |
| `GEO-20261012-BROWSER-AFTER` | Eighteen representative EN/NL routes were checked at 1440×900 and 390×844. Languages, headings, two-way language switching, source registers and responsive article images were present; no horizontal overflow or browser console errors were found. | Local browser rendering. The browser blocked direct display of `robots.txt`; its content and status were covered by the HTTP crawl and tests. |

The four article pairs added in this change retain their original publication dates and record 12 October 2026 as their substantive modification date. Claims remain bounded to what the cited publisher states. Company announcements are described as company claims, plans are not presented as realised production, and the article text states the relevant unknowns.

## Source and crawler references

Primary documentation reviewed on 12 October 2026:

- Google Search Central, AI features and your website: <https://developers.google.com/search/docs/fundamentals/ai-optimization-guide>. Google states that ordinary Search requirements and best practices apply, no special AI file or markup is required, and traffic is reported in Search Console's Web performance type.
- OpenAI crawler documentation: <https://developers.openai.com/api/docs/bots>.
- Perplexity crawler documentation: <https://docs.perplexity.ai/guides/bots>.
- Anthropic crawler documentation: <https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler>.
- IndexNow protocol and FAQ: <https://www.indexnow.org/documentation> and <https://www.indexnow.org/faq>.
- Bing Webmaster Tools, AI Performance public preview: <https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/>.

`llms.txt` is optional discovery guidance. It is not used as a substitute for crawlable HTML, canonical tags, sitemaps or structured data, and Google explicitly says it is not required for its AI features.

## Local performance comparison

Lighthouse 13.5.0 was run three times per template with the same simulated mobile configuration. Values below are medians; they are lab measurements rather than Chrome UX Report field data.

| Template | Performance before | Performance after | LCP before | LCP after | TBT before | TBT after | CLS before/after |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage | 92 | 93 | 2,733 ms | 2,777 ms | 234 ms | 197 ms | 0.0003 / 0.0003 |
| Services | 91 | 95 | 2,698 ms | 2,632 ms | 265 ms | 139 ms | 0.0003 / 0.0003 |
| Insights hub | 93 | 96 | 2,610 ms | 2,569 ms | 213 ms | 100 ms | 0.0003 / 0.0003 |
| Article | 95 | 96 | 2,725 ms | 2,571 ms | 129 ms | 66 ms | 0.0003 / 0.0003 |

The 44 ms homepage LCP movement is within normal local-run variance and does not indicate a field regression. CLS remains well below the 0.1 release guardrail on every representative template.
Median transferred script stayed unchanged: 144.3 KiB on the homepage and services templates, and 150.1 KiB on the insights and article templates. The article's median total transfer increased from 291.6 KiB to 295.3 KiB because of the added local explanatory SVG, without adding client JavaScript.

## Referral measurement

Treat a session as a known AI referral only when the recorded referrer hostname matches an allowlist. The initial allowlist is:

- `chatgpt.com` and legacy `chat.openai.com`;
- `perplexity.ai`;
- `claude.ai`;
- `copilot.microsoft.com`.

Record the original referrer and landing URL before grouping. Do not classify direct or unknown traffic as AI traffic. Google and Bing AI surfaces can share ordinary search referrers; use first-party Search Console or Bing Webmaster reporting where available instead of inferring an AI visit from the referrer alone.

Recommended monthly review, once access has been confirmed:

1. Export Search Console Web performance for relevant queries and landing pages, noting that Google's AI-feature traffic is not split into a separate public filter.
2. Export Bing Webmaster Tools AI Performance citations and cited pages when the account has that feature.
3. Review the known-referrer allowlist in the analytics export.
4. If server logs are available, group documented crawler user agents separately and validate IP ownership where the provider publishes a verification method. A user-agent string alone is not proof of crawler identity.
5. Store the prompt-monitoring result using `geo-prompt-set-v1.json`; do not manufacture a baseline for periods that were not measured.

No active Search Console, Bing Webmaster Tools, Vercel dashboard or server-log access was used in this implementation. Repository notes about earlier observations remain historical evidence, not a fresh dashboard check.

## IndexNow release procedure

The application contains a prepared server-only endpoint and key-file route. They are deliberately inactive unless all of the following production variables are configured after a reviewed release:

- `INDEXNOW_KEY`: a unique 8–128 character IndexNow key using only letters, digits and hyphens;
- `INDEXNOW_HOOK_TOKEN`: an unrelated high-entropy bearer token for the private release hook.

Activation checklist:

1. Add both values to the production environment without exposing them to client bundles or source control.
2. Redeploy and verify `https://meloncactus.com/indexnow-key.txt` returns only the configured public protocol key. Before activation, and outside production, it must return 404.
3. Invoke `POST /api/indexnow` only from the post-production release workflow. Send canonical site paths in `changed` and removed canonical paths in `deleted`; never send preview hosts, query strings, fragments or redirects.
4. The endpoint expands a known English or Dutch path to its counterpart, checks that changed URLs return 200 with a self-canonical, and accepts deleted URLs only after they return 404 or 410.
5. A release notification is non-blocking. Log only counts, response status and attempt number. Retry transient `429`/`5xx` responses twice with bounded backoff; never log either secret.
6. Do not repeatedly submit unchanged URLs. Sitemap submission remains the complete discovery mechanism.

No IndexNow secret, external job or production setting is created by this change.

## Release verification

After a separately approved deployment:

- crawl the production sitemap and compare status, canonical, hreflang, Article dates, visible source URLs and `Article.citation`;
- verify the eight adjusted article routes and their EN/NL switch on desktop and mobile;
- check `/robots.txt`, `/sitemap.xml`, `/llms.txt`, the inactive or configured key-file response and a real unknown URL;
- confirm changed Article URLs are sent once by the release workflow if IndexNow has been activated;
- retain the crawl date, commit SHA and raw report location with the evidence register.
