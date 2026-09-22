import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const preview = process.env.VERCEL_ENV === "preview";
  return { rules: { userAgent: "*", allow: preview ? undefined : "/", disallow: preview ? "/" : undefined }, sitemap: `${siteConfig.siteUrl}/sitemap.xml` };
}

