import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EnglishInsightPage, { generateMetadata } from "@/app/(en)/insights/[slug]/page";
import EnglishInsightsPage from "@/app/(en)/insights/page";
import sitemap from "@/app/sitemap";
import { redactAnalyticsEvent } from "@/components/privacy-analytics";
import { metalAmBatchSupplierInsightEn } from "@/data/metal-am-batch-supplier-insight";
import { seoTopics } from "@/data/seo-topics";
import { counterpartPath, localizedAlternates, standaloneArticlePaths } from "@/lib/i18n";

describe("standalone metal AM whole-batch supplier guide", () => {
  const path = "/insights/metal-am-supplier-whole-batch-evidence";

  it("keeps the fictional quotation and evidence limits explicit", () => {
    const copy = JSON.stringify(metalAmBatchSupplierInsightEn.sections);
    expect(copy).toContain("entirely fictional");
    expect(copy).toContain("does not describe a MelonCactus client");
    expect(copy).toContain("sixty accepted 316L stainless-steel sensor brackets");
    expect(copy).toContain('"66","5","61"');
    expect(copy).toContain('"66","6","60"');
    expect(copy).toContain('"66","7","59"');
    expect(copy).toContain("does not verify the capability, yield or lead time of any exhibitor or supplier");
    expect(copy).not.toMatch(/guaranteed yield|proven saving|client result/i);
    const cited = new Set(metalAmBatchSupplierInsightEn.sections.flatMap((section) => section.paragraphs ?? [])
      .flatMap((paragraph) => typeof paragraph === "string" ? [] : paragraph.sourceIds));
    expect(cited).toEqual(new Set(metalAmBatchSupplierInsightEn.sources?.map((source) => source.id)));
    expect(metalAmBatchSupplierInsightEn.sources?.every((source) => source.accessed === "2026-11-20")).toBe(true);
  });

  it("publishes one English route without inventing a Dutch counterpart", async () => {
    const alternates = localizedAlternates(path, "en");
    expect(alternates).toEqual({
      canonical: "https://meloncactus.com" + path,
      languages: {
        en: "https://meloncactus.com" + path,
        "x-default": "https://meloncactus.com" + path,
      },
    });
    expect(standaloneArticlePaths).toContain(path);
    expect(counterpartPath(path)).toBeNull();
    expect(sitemap().find((item) => item.url === alternates.canonical)?.alternates?.languages).toEqual(alternates.languages);
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: metalAmBatchSupplierInsightEn.slug }) });
    expect(metadata.alternates).toEqual(alternates);
    expect(metadata.openGraph).toMatchObject({ type: "article", publishedTime: "2026-11-20" });
  });

  it("appears in the English index and supplier topic with citations and accessible visual explanation", async () => {
    const indexHtml = renderToStaticMarkup(createElement(EnglishInsightsPage));
    const articleHtml = renderToStaticMarkup(await EnglishInsightPage({
      params: Promise.resolve({ slug: metalAmBatchSupplierInsightEn.slug }),
    }));
    const supplierTopic = seoTopics.en.find((topic) => topic.slug === "supplier-research");
    expect(indexHtml).toContain(metalAmBatchSupplierInsightEn.title);
    expect(supplierTopic?.articlePaths).toContain(path);
    expect(articleHtml).toContain("Fictional quotation comparison for sixty accepted brackets");
    expect(articleHtml).toContain("Supplier research from public sources");
    expect(articleHtml).toContain("/article-visuals/metal-am-whole-batch-evidence-en.svg");
    expect(articleHtml).toContain("The quoted batch ends at acceptance, not at the printer");
    const articleSchema = [...articleHtml.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]) as { "@type": string; citation?: string[] })
      .find((schema) => schema["@type"] === "Article");
    expect(articleSchema?.citation).toEqual(metalAmBatchSupplierInsightEn.sources?.map((source) => source.url));
  });

  it("allows Analytics only for the known path and strips query and fragment data", () => {
    expect(redactAnalyticsEvent({
      type: "pageview",
      url: `https://meloncactus.com${path}?supplier=fictional#quote`,
    })).toEqual({ type: "pageview", url: `https://meloncactus.com${path}` });
  });
});
