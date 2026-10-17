import type { MetadataRoute } from "next";
import { insights } from "@/data/insights";
import { languageAlternates, routePairs } from "@/lib/i18n";

const updatedPaths = new Set(["/", "/about", "/contact", "/services", "/insights", "/privacy", "/terms", "/sample-report"]);

export default function sitemap(): MetadataRoute.Sitemap {
  return routePairs.flatMap(([enPath, nlPath]) => {
    const languages = languageAlternates(enPath, "en").languages;
    const en = languages.en;
    const nl = languages["nl-NL"];
    const article = insights.find((item) => enPath === `/insights/${item.slug}`);
    const updated = Boolean(article) || updatedPaths.has(enPath) || enPath.startsWith("/topics/") || enPath.startsWith("/services/");
    const repositioned = ["/", "/services", "/contact", "/about", "/ai-help-netherlands", "/ai-help-twente"].includes(enPath);
    const lastModified = new Date(article?.modifiedDate ?? article?.date ?? (repositioned ? "2026-10-17" : updated ? "2026-10-01" : enPath.startsWith("/example-case/") ? "2026-09-29" : "2026-09-22"));
    const alternates = { languages };
    return [
      { url: en, lastModified, changeFrequency: enPath === "/" ? "weekly" as const : "monthly" as const, priority: enPath === "/" ? 1 : article ? .75 : .7, alternates },
      { url: nl, lastModified, changeFrequency: nlPath === "/nl" ? "weekly" as const : "monthly" as const, priority: nlPath === "/nl" ? 1 : article ? .75 : .7, alternates },
    ];
  });
}
