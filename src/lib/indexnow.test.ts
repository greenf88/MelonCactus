import { describe, expect, it, vi } from "vitest";
import { expandIndexNowPaths, indexNowPayload, submitIndexNow, validIndexNowKey, verifyIndexNowTargets } from "./indexnow";

describe("IndexNow release helper", () => {
  it("accepts only protocol-compatible server keys", () => {
    expect(validIndexNowKey("Abcd-1234")).toBe(true);
    expect(validIndexNowKey("short")).toBe(false);
    expect(validIndexNowKey("contains_secret_value!")).toBe(false);
  });

  it("expands changed pages to both canonical language variants", () => {
    expect(expandIndexNowPaths(["/insights/what-a-factory-expansion-announcement-proves"]))
      .toEqual({
        changed: [
          "https://meloncactus.com/insights/what-a-factory-expansion-announcement-proves",
          "https://meloncactus.com/nl/artikelen/wat-bewijst-een-aangekondigde-fabrieksuitbreiding",
        ],
        deleted: [],
      });
    expect(expandIndexNowPaths(["/"]).changed).toEqual([
      "https://meloncactus.com",
      "https://meloncactus.com/nl",
    ]);
  });

  it("rejects preview, parameter, API and unpublished changed URLs", () => {
    expect(() => expandIndexNowPaths(["https://preview.vercel.app/page"])).toThrow();
    expect(() => expandIndexNowPaths(["/contact?report=scan"])).toThrow();
    expect(() => expandIndexNowPaths(["/api/contact"])).toThrow();
    expect(() => expandIndexNowPaths(["/unpublished"])).toThrow();
  });

  it("requires live changed URLs to self-canonicalize and deleted URLs to be gone", async () => {
    const targets = { changed: ["https://meloncactus.com/about"], deleted: ["https://meloncactus.com/old-page"] };
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response('<link rel="canonical" href="https://meloncactus.com/about">', { status: 200 }))
      .mockResolvedValueOnce(new Response("not found", { status: 404 }));
    await expect(verifyIndexNowTargets(targets, fetcher)).resolves.toEqual([...targets.changed, ...targets.deleted]);
  });

  it("builds a root key location and retries only transient submission failures", async () => {
    const payload = indexNowPayload("Abcd-1234", ["https://meloncactus.com/about"]);
    expect(payload.keyLocation).toBe("https://meloncactus.com/indexnow-key.txt");
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response(null, { status: 202 }));
    await expect(submitIndexNow("Abcd-1234", payload.urlList, fetcher)).resolves.toEqual({ ok: true, status: 202 });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
