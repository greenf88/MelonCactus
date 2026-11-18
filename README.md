# MelonCactus — Industrial Intelligence

The MelonCactus website is built with Next.js App Router, TypeScript and Tailwind CSS. MelonCactus is operated by GFNI.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The enquiry form shows an email fallback until the server-only Resend settings are configured.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:client-bundle
```

## Enquiry email setup

1. In Resend, add a sending domain that you control, such as `send.meloncactus.com`. Publish the exact DNS records shown by Resend and wait until it reports the domain as verified.
2. Create a Resend API key with sending permission. Keep it in an untracked `.env.local` file for local use or in the deployment environment. Never commit the key.
3. Configure the variables shown in `.env.example`:
   - `RESEND_API_KEY`: the private Resend key.
   - `CONTACT_TO_EMAIL`: `contact@meloncactus.com`.
   - `CONTACT_FROM_EMAIL`: a sender at the verified sending domain, for example `MelonCactus Website <website@send.meloncactus.com>` after that domain is verified.
   - `NEXT_PUBLIC_SITE_URL`: `https://meloncactus.com` for production canonical URLs.
4. Test delivery to the business inbox and confirm that replies address the visitor. The form never sends an automatic reply to the visitor.

The contact endpoint validates and limits inputs, treats visitor content as text, uses an invisible honeypot, and returns a generic failure if delivery is unavailable. It does not store enquiries in a database.

The public website uses no database, authentication or CMS and includes no advertising trackers. Vercel Web Analytics is included in both language layouts; the privacy pages describe this measurement. Search Console and Bing Webmaster Tools require separate owner-controlled verification and are not silently configured by this repository.

## Intelligence Engine Phase 1

The repository contains an offline-first private intelligence-engine core and an optional, non-deployed Supabase migration. It is not connected to the public site or to a live cloud database. Run the entirely fictional local proof with:

```bash
npm run intelligence:demo
npm run intelligence:verify
npm run intelligence:status
npm run intelligence:serve
```

The generated SQLite database, local Control Room, internal draft and backups stay in an ignored local directory. `intelligence:serve` starts a token-protected, loopback-only read view; browser editing requires a separately confirmed private storage path outside the repository. The bounded agent proof now covers source discovery, evidence normalisation, concept finding proposal, independent red team and explicit human finding approval; it still makes no network or model call. Start with [the Phase 1 overview](docs/intelligence-engine/README.md) and [the local runbook](docs/intelligence-engine/local-runbook.md). Never commit client data, source captures, prompts, report content or credentials.

## Combined SEO/legal review branch

The integration of draft PRs #13 and #14 is documented in [the integration review](docs/seo/integration-review-20261002.md). Both language layouts retain the SEO entity graph and social metadata and use the privacy-filtered Analytics component. This branch is for review: unresolved legal/provider/retention decisions remain publication gates in `docs/legal/release-audit.md`. Paid-engagement terms in `docs/legal` are drafts and are not operative website terms.
