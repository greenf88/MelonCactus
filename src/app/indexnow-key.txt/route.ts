import { validIndexNowKey } from "@/lib/indexnow";

export function GET() {
  const configured = process.env.INDEXNOW_KEY;
  if (process.env.VERCEL_ENV !== "production" || !validIndexNowKey(configured)) {
    return new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  return new Response(configured, {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=300" },
  });
}
