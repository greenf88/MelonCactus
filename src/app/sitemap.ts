import type { MetadataRoute } from "next";
import { insights } from "@/data/insights";
import { siteConfig } from "@/config/site";
import { focusedServices } from "@/config/focused-services";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", updated: "2026-09-23" },
    { path: "/services", updated: "2026-09-23" },
    { path: "/methodology", updated: "2026-09-22" },
    { path: "/sample-report", updated: "2026-09-22" },
    { path: "/about", updated: "2026-09-23" },
    { path: "/insights", updated: "2026-09-22" },
    { path: "/contact", updated: "2026-09-23" },
    { path: "/privacy", updated: "2026-09-22" },
    { path: "/terms", updated: "2026-09-23" },
  ];
  return [
    ...routes.map(({ path, updated }) => ({ url: `${siteConfig.siteUrl}${path}`, lastModified: updated, changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : .7 })),
    ...focusedServices.map((service) => ({ url: `${siteConfig.siteUrl}/services/${service.slug}`, lastModified: "2026-09-23", changeFrequency: "monthly" as const, priority: .8 })),
    ...insights.map((insight) => ({ url: `${siteConfig.siteUrl}/insights/${insight.slug}`, lastModified: insight.modifiedDate ?? insight.date, changeFrequency: "monthly" as const, priority: .75 })),
  ];
}
