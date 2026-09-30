import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    const dutchDomains = ["meloncactus.nl", "www.meloncactus.nl"];

    return dutchDomains.flatMap((hostname) => [
      {
        source: "/nl/:path*",
        has: [{ type: "host" as const, value: hostname }],
        destination: "https://meloncactus.com/nl/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: hostname }],
        destination: "https://meloncactus.com/nl/:path*",
        permanent: true,
      },
    ]);
  },
};

export default nextConfig;
