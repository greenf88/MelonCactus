import { siteConfig } from "@/config/site";
import { counterpartPath, routePairs } from "@/lib/i18n";

export const indexNowEndpoint = "https://api.indexnow.org/indexnow";
const publicPaths = new Set(routePairs.flat());

function productionUrl(path: string) {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  return path === "/" ? base : `${base}${path}`;
}

export function validIndexNowKey(value: string | undefined): value is string {
  return Boolean(value && /^[A-Za-z0-9-]{8,128}$/.test(value));
}

function canonicalPath(value: unknown, allowMissing: boolean) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[?#]/.test(value)) {
    throw new Error("IndexNow paths must be origin-relative paths without query strings or fragments");
  }
  if (/^\/(?:api|_next|social)(?:\/|$)/.test(value)) throw new Error(`IndexNow path is not public content: ${value}`);
  if (!allowMissing && !publicPaths.has(value as (typeof routePairs)[number][number])) {
    throw new Error(`IndexNow path is not a published canonical route: ${value}`);
  }
  return value;
}

export function expandIndexNowPaths(changed: readonly unknown[], deleted: readonly unknown[] = []) {
  if (changed.length + deleted.length === 0 || changed.length + deleted.length > 100) {
    throw new Error("IndexNow requires between 1 and 100 changed or deleted paths per release hook");
  }
  const changedPaths = new Set<string>();
  for (const value of changed) {
    const path = canonicalPath(value, false);
    changedPaths.add(path);
    const counterpart = counterpartPath(path);
    if (!counterpart) throw new Error(`Missing language counterpart for ${path}`);
    changedPaths.add(counterpart);
  }
  const deletedPaths = new Set(deleted.map((value) => canonicalPath(value, true)));
  for (const path of changedPaths) {
    if (deletedPaths.has(path)) throw new Error(`Path cannot be both changed and deleted: ${path}`);
  }
  return {
    changed: [...changedPaths].map(productionUrl),
    deleted: [...deletedPaths].map(productionUrl),
  };
}

export function indexNowPayload(key: string, urls: readonly string[]) {
  if (!validIndexNowKey(key)) throw new Error("INDEXNOW_KEY must contain 8–128 letters, numbers or dashes");
  return {
    host: new URL(siteConfig.siteUrl).host,
    key,
    keyLocation: `${siteConfig.siteUrl.replace(/\/$/, "")}/indexnow-key.txt`,
    urlList: [...urls],
  };
}

export async function verifyIndexNowTargets(
  targets: ReturnType<typeof expandIndexNowPaths>,
  fetcher: typeof fetch = fetch,
) {
  for (const url of targets.changed) {
    const response = await fetcher(url, { method: "GET", redirect: "manual", headers: { Accept: "text/html" } });
    if (response.status !== 200) throw new Error(`Changed IndexNow URL must return 200 without redirect: ${url}`);
    const html = await response.text();
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
    if (canonical !== url) throw new Error(`Changed IndexNow URL must self-canonicalize: ${url}`);
  }
  for (const url of targets.deleted) {
    const response = await fetcher(url, { method: "GET", redirect: "manual" });
    if (![404, 410].includes(response.status)) throw new Error(`Deleted IndexNow URL must return 404 or 410 without redirect: ${url}`);
  }
  return [...targets.changed, ...targets.deleted];
}

export async function submitIndexNow(key: string, urls: readonly string[], fetcher: typeof fetch = fetch) {
  const payload = indexNowPayload(key, urls);
  const delays = [0, 500, 1_500];
  let lastStatus = 0;
  for (const delay of delays) {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    const response = await fetcher(indexNowEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    lastStatus = response.status;
    if ([200, 202].includes(response.status)) return { ok: true as const, status: response.status };
    if (response.status !== 429 && response.status < 500) break;
  }
  return { ok: false as const, status: lastStatus };
}
