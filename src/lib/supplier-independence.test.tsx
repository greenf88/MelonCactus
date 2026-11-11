import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EnglishInsightPage from "@/app/(en)/insights/[slug]/page";
import EnglishInsightsPage from "@/app/(en)/insights/page";
import sitemap from "@/app/sitemap";
import { seoTopics } from "@/data/seo-topics";
import { supplierIndependenceInsightEn } from "@/data/supplier-independence-insight";
import { counterpartPath, localizedAlternates, standaloneArticlePaths } from "@/lib/i18n";

describe("standalone supplier-independence guide", () => {
  const path = "/insights/laser-cutting-supplier-independence-check";

  it("keeps the fictional comparison distinct from the sourced transaction context", () => {
    expect(supplierIndependenceInsightEn.sources?.every((source) => source.accessed === "2026-11-11")).toBe(true);
    const copy = JSON.stringify(supplierIndependenceInsightEn.sections);
    expect(copy).toContain("Fictional comparison sheet");
    expect(copy).not.toMatch(/client result|measured saving|guaranteed/i);
    const cited = new Set(supplierIndependenceInsightEn.sections.flatMap((section) => section.paragraphs ?? [])
      .flatMap((paragraph) => typeof paragraph === "string" ? [] : paragraph.sourceIds));
    expect(cited).toEqual(new Set(supplierIndependenceInsightEn.sources?.map((source) => source.id)));
  });

  it("publishes one English route without inventing a Dutch counterpart", () => {
    const alternates = localizedAlternates(path, "en");
    expect(alternates).toEqual({
      canonical: "https://meloncactus.com" + path,
      languages: {
        en: "https://meloncactus.com" + path,
        "x-default": "https://meloncactus.com" + path,
      },
    });
    expect(standaloneArticlePaths).toContain(path);
    const entry = sitemap().find((item) => item.url === alternates.canonical);
    expect(entry?.alternates?.languages).toEqual(alternates.languages);
    expect(counterpartPath(path)).toBeNull();
  });

  it("appears in the English index and supplier-research topic with Article citations", async () => {
    const indexHtml = renderToStaticMarkup(createElement(EnglishInsightsPage));
    const articleHtml = renderToStaticMarkup(await EnglishInsightPage({
      params: Promise.resolve({ slug: supplierIndependenceInsightEn.slug }),
    }));
    const supplierTopic = seoTopics.en.find((topic) => topic.slug === "supplier-research");
    expect(indexHtml).toContain(supplierIndependenceInsightEn.title);
    expect(supplierTopic?.articlePaths).toContain(path);
    expect(articleHtml).toContain("Fictional comparison sheet");
    expect(articleHtml).toContain("Supplier research from public sources");
    const articleSchema = [...articleHtml.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]) as { "@type": string; citation?: string[] })
      .find((schema) => schema["@type"] === "Article");
    expect(articleSchema?.citation).toEqual(supplierIndependenceInsightEn.sources?.map((source) => source.url));
  });
});
