import { describe, expect, it } from "vitest";
import { insights } from "@/data/insights";
import { insightsNl } from "@/data/insights-nl";
import sitemap from "@/app/sitemap";
import { counterpartPath, languageAlternates, pathForLocale, routePairs } from "./i18n";

describe("localized public routes", () => {
  it("maps each English route to one reciprocal Dutch route", () => {
    expect(new Set(routePairs.map(([en]) => en)).size).toBe(routePairs.length);
    expect(new Set(routePairs.map(([, nl]) => nl)).size).toBe(routePairs.length);
    for (const [en, nl] of routePairs) {
      expect(pathForLocale(en, "nl")).toBe(nl);
      expect(counterpartPath(en)).toBe(nl);
      expect(counterpartPath(nl)).toBe(en);
      expect(languageAlternates(en, "en").languages["x-default"]).toBe(languageAlternates(en, "en").canonical);
      expect(languageAlternates(en, "nl").canonical).toBe(languageAlternates(en, "nl").languages["nl-NL"]);
    }
    expect(counterpartPath("/no-such-page")).toBeNull();
  });

  it("includes every translated article and both language URLs in the sitemap", () => {
    expect(routePairs.length).toBe(9 + insights.length);
    expect(insightsNl).toHaveLength(insights.length);
    const entries = sitemap();
    expect(entries).toHaveLength(routePairs.length * 2);
    for (const [enPath, nlPath] of routePairs) {
      const en = languageAlternates(enPath, "en").canonical;
      const nl = languageAlternates(enPath, "nl").canonical;
      expect(entries.find((entry) => entry.url === en)?.alternates?.languages).toEqual({ en, "nl-NL": nl, "x-default": en });
      expect(entries.find((entry) => entry.url === nl)?.alternates?.languages).toEqual({ en, "nl-NL": nl, "x-default": en });
      if (enPath.startsWith("/insights/")) {
        const english = insights.find((article) => enPath.endsWith(`/${article.slug}`));
        const dutch = insightsNl.find((article) => nlPath.endsWith(`/${article.slug}`));
        expect(english).toBeDefined();
        expect(dutch).toBeDefined();
        expect(dutch?.sections.map((section) => [section.paragraphs.length, section.bullets?.length ?? 0])).toEqual(
          english?.sections.map((section) => [section.paragraphs.length, section.bullets?.length ?? 0]),
        );
      }
    }
  });
});
