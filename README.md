# Lemon Cactus — Industrial Intelligence

Production-ready first website for Lemon Cactus, built with Next.js App Router, TypeScript and Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Configuration before launch

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the verified production origin.
2. Replace the placeholder email, legal entity and postal address in `src/config/site.ts`.
3. Connect a server-side enquiry provider at `src/lib/enquiry-provider.ts`, then update the privacy statement.
4. Test delivery, retention and error states before changing the form copy to say that submission is active.

## Import into Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected framework preset as **Next.js** and the root directory as the repository root.
4. Add `NEXT_PUBLIC_SITE_URL` for Production with the final `https://` origin.
5. Deploy to a preview first. Check every route, `robots.txt` and `sitemap.xml`.
6. Add the production domain only after the placeholders and enquiry integration are complete.

No database, authentication, CMS, analytics or advertising trackers are included.

