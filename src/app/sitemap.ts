import type { MetadataRoute } from "next";
import { insights } from "@/data/insights";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/methodology", "/sample-report", "/about", "/insights", "/contact", "/privacy", "/terms"];
  return [...routes.map((route) => ({ url: `${siteConfig.siteUrl}${route}`, lastModified: new Date("2026-09-22"), changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .7 })), ...insights.map((insight) => ({ url: `${siteConfig.siteUrl}/insights/${insight.slug}`, lastModified: new Date(insight.date), changeFrequency: "monthly" as const, priority: .75 }))];
}

