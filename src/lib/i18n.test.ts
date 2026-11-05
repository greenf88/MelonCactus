import { describe, expect, it } from "vitest";
import { insights } from "@/data/insights";
import { insightsNl } from "@/data/insights-nl";
import { reportOptions } from "@/config/site";
import { reportOptionsNl } from "@/config/site-nl";
import { seoServices } from "@/data/seo-services";
import { seoTopics } from "@/data/seo-topics";
import sitemap from "@/app/sitemap";
import { counterpartPath, localizedAlternates, languageAlternates, pathForLocale, routePairs, standaloneArticlePaths } from "./i18n";

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

  it("keeps standalone articles canonical without inventing a translated counterpart", () => {
    expect(localizedAlternates("/nl/artikelen/zelfstandig-artikel", "nl")).toEqual({
      canonical: "https://meloncactus.com/nl/artikelen/zelfstandig-artikel",
      languages: { "nl-NL": "https://meloncactus.com/nl/artikelen/zelfstandig-artikel" },
    });
    expect(localizedAlternates("/insights/standalone-article", "en")).toEqual({
      canonical: "https://meloncactus.com/insights/standalone-article",
      languages: {
        en: "https://meloncactus.com/insights/standalone-article",
        "x-default": "https://meloncactus.com/insights/standalone-article",
      },
    });
  });

  it("includes every paired and standalone article in the sitemap", () => {
    expect(routePairs).toContainEqual(["/ai-help-netherlands", "/nl/ai-hulp-nederland"]);
    expect(routePairs).toContainEqual(["/ai-help-twente", "/nl/ai-hulp-twente"]);
    expect(routePairs).toContainEqual(["/services/public-profile-exposure-scan", "/nl/diensten/openbare-informatiescan"]);
    expect(routePairs).toContainEqual(["/example-case/fourth-pillar", "/nl/voorbeeldcase/vierde-pijler"]);
    expect(routePairs).toContainEqual(["/example-case/public-profile", "/nl/voorbeeldcase/openbaar-profiel"]);
    expect(seoServices.en).toHaveLength(3);
    expect(seoServices.nl).toHaveLength(3);
    expect(seoTopics.en).toHaveLength(4);
    expect(seoTopics.nl).toHaveLength(4);
    const entries = sitemap();
    const pairedPaths = new Set<string>(routePairs.flatMap(([en, nl]) => [en, nl]));
    const standaloneEnglish = insights.filter((article) => !pairedPaths.has(`/insights/${article.slug}`));
    const standaloneDutch = insightsNl.filter((article) => !pairedPaths.has(`/nl/artikelen/${article.slug}`));
    expect([...standaloneArticlePaths].sort()).toEqual([
      ...standaloneEnglish.map((article) => `/insights/${article.slug}`),
      ...standaloneDutch.map((article) => `/nl/artikelen/${article.slug}`),
    ].sort());
    expect(entries).toHaveLength(routePairs.length * 2 + standaloneEnglish.length + standaloneDutch.length);
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
        expect(english?.sections.length).toBeGreaterThan(0);
        expect(dutch?.sections.length).toBeGreaterThan(0);
        expect(english?.description).toBeTruthy();
        expect(dutch?.description).toBeTruthy();
      }
    }
    for (const article of insights) {
      expect(entries.find((entry) => entry.url === `https://meloncactus.com/insights/${article.slug}`), article.slug).toBeDefined();
    }
    for (const article of insightsNl) {
      expect(entries.find((entry) => entry.url === `https://meloncactus.com/nl/artikelen/${article.slug}`), article.slug).toBeDefined();
    }
  });

  it("keeps report starting prices equivalent while formatting Dutch thousands", () => {
    expect(reportOptionsNl.map(({ price }) => Number(price.replace(/\D/g, ""))))
      .toEqual(reportOptions.map(({ price }) => Number(price.replace(/\D/g, ""))));
    expect(reportOptionsNl[1].price).toBe("€1.995");
    expect(reportOptionsNl[2].price).toBe("€3.995");
  });
});
