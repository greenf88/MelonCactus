import { timingSafeEqual } from "node:crypto";
import { expandIndexNowPaths, submitIndexNow, validIndexNowKey, verifyIndexNowTargets } from "@/lib/indexnow";

function sameSecret(actual: string | null, expected: string) {
  if (!actual?.startsWith("Bearer ")) return false;
  const provided = Buffer.from(actual.slice(7));
  const configured = Buffer.from(expected);
  return provided.length === configured.length && timingSafeEqual(provided, configured);
}

export async function POST(request: Request) {
  const key = process.env.INDEXNOW_KEY;
  const hookToken = process.env.INDEXNOW_HOOK_TOKEN;
  if (process.env.VERCEL_ENV !== "production" || !validIndexNowKey(key) || !hookToken || hookToken.length < 24) {
    return Response.json({ ok: false, reason: "unavailable" }, { status: 503 });
  }
  if (!sameSecret(request.headers.get("authorization"), hookToken)) {
    return Response.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return Response.json({ ok: false, reason: "invalid-content-type" }, { status: 415 });
  }
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > 8_192) return Response.json({ ok: false, reason: "payload-too-large" }, { status: 413 });

  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > 8_192) {
      return Response.json({ ok: false, reason: "payload-too-large" }, { status: 413 });
    }
    const body = JSON.parse(rawBody) as { changed?: unknown; deleted?: unknown };
    if (!Array.isArray(body.changed) || (body.deleted !== undefined && !Array.isArray(body.deleted))) {
      return Response.json({ ok: false, reason: "invalid-payload" }, { status: 400 });
    }
    const targets = expandIndexNowPaths(body.changed, body.deleted ?? []);
    const urls = await verifyIndexNowTargets(targets);
    const result = await submitIndexNow(key, urls);
    console.info("[indexnow] Submission completed", { count: urls.length, status: result.status, accepted: result.ok });
    return Response.json({ ok: result.ok, count: urls.length, status: result.status }, { status: result.ok ? 202 : 502 });
  } catch (error) {
    console.error("[indexnow] Release submission rejected", { errorType: error instanceof Error ? error.name : typeof error });
    return Response.json({ ok: false, reason: "invalid-release-state" }, { status: 400 });
  }
}
