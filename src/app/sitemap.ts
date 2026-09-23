import type { MetadataRoute } from "next";
import { insights } from "@/data/insights";
import { siteConfig } from "@/config/site";
import { routePairs } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  return routePairs.flatMap(([enPath, nlPath]) => {
    const en = `${siteConfig.siteUrl}${enPath}`;
    const nl = `${siteConfig.siteUrl}${nlPath}`;
    const article = insights.find((item) => enPath === `/insights/${item.slug}`);
    const lastModified = new Date(article?.date ?? "2026-09-22");
    const alternates = { languages: { en, "nl-NL": nl, "x-default": en } };
    return [
      { url: en, lastModified, changeFrequency: enPath === "/" ? "weekly" as const : "monthly" as const, priority: enPath === "/" ? 1 : article ? .75 : .7, alternates },
      { url: nl, lastModified, changeFrequency: nlPath === "/nl" ? "weekly" as const : "monthly" as const, priority: nlPath === "/nl" ? 1 : article ? .75 : .7, alternates },
    ];
  });
}
