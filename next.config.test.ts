import { describe, expect, it } from "vitest";

import nextConfig from "./next.config";

describe("Dutch domain redirects", () => {
  it("permanently redirects apex and www traffic to the Dutch .com routes", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toEqual([
      expect.objectContaining({
        source: "/nl/:path*",
        has: [{ type: "host", value: "meloncactus.nl" }],
        destination: "https://meloncactus.com/nl/:path*",
        permanent: true,
      }),
      expect.objectContaining({
        source: "/:path*",
        has: [{ type: "host", value: "meloncactus.nl" }],
        destination: "https://meloncactus.com/nl/:path*",
        permanent: true,
      }),
      expect.objectContaining({
        source: "/nl/:path*",
        has: [{ type: "host", value: "www.meloncactus.nl" }],
        destination: "https://meloncactus.com/nl/:path*",
        permanent: true,
      }),
      expect.objectContaining({
        source: "/:path*",
        has: [{ type: "host", value: "www.meloncactus.nl" }],
        destination: "https://meloncactus.com/nl/:path*",
        permanent: true,
      }),
    ]);
  });
});
