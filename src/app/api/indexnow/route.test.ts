import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const token = "release-hook-token-with-at-least-24-characters";

function request(body: string, authorization = `Bearer ${token}`) {
  return new Request("https://meloncactus.com/api/indexnow", {
    method: "POST",
    headers: { authorization, "content-type": "application/json" },
    body,
  });
}

describe("IndexNow release route", () => {
  beforeEach(() => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("INDEXNOW_KEY", "IndexNow-1234");
    vi.stubEnv("INDEXNOW_HOOK_TOKEN", token);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("stays unavailable until production configuration is complete", async () => {
    vi.stubEnv("INDEXNOW_KEY", "");
    expect((await POST(request('{"changed":["/about"]}'))).status).toBe(503);
  });

  it("rejects unauthorized, oversized and non-allowlisted input", async () => {
    expect((await POST(request('{"changed":["/about"]}', "Bearer wrong-token-value-long-enough"))).status).toBe(401);
    expect((await POST(request(JSON.stringify({ changed: ["x".repeat(8_300)] })))).status).toBe(413);
    expect((await POST(request('{"changed":["/contact?report=scan"]}'))).status).toBe(400);
  });

  it("verifies both language URLs before one accepted submission", async () => {
    const fetcher = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url === "https://api.indexnow.org/indexnow") return new Response(null, { status: 202 });
      return new Response(`<link rel="canonical" href="${url}">`, { status: 200 });
    });
    vi.stubGlobal("fetch", fetcher);
    vi.spyOn(console, "info").mockImplementation(() => undefined);

    const response = await POST(request('{"changed":["/about"]}'));
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ ok: true, count: 2, status: 202 });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
});
