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

No database, authentication, CMS, analytics or advertising trackers are included.
