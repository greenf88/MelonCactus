import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DutchInsightPage, { generateMetadata } from "@/app/(nl)/nl/artikelen/[slug]/page";
import DutchInsightsPage from "@/app/(nl)/nl/artikelen/page";
import sitemap from "@/app/sitemap";
import { redactAnalyticsEvent } from "@/components/privacy-analytics";
import { workOrderRevisionInsightNl } from "@/data/work-order-revision-insight";
import { counterpartPath, localizedAlternates, standaloneArticlePaths } from "@/lib/i18n";

describe("zelfstandige handleiding voor werkbon- en revisiecontrole", () => {
  const path = "/nl/artikelen/werkbon-tekeningrevisie-controleren-voor-productie";

  it("houdt de vaste regel, vijf fictieve documenten en menselijke beslisgrens zichtbaar", () => {
    const copy = JSON.stringify(workOrderRevisionInsightNl.sections);
    expect(workOrderRevisionInsightNl.kind).toBe("practical-ai-guide");
    expect(copy).toContain("volledig fictief");
    expect(copy).toContain("geen klant, uitgevoerde opdracht of gemeten resultaat");
    for (const document of ["WB-01", "WB-02", "WB-03", "WB-04", "WB-05"]) expect(copy).toContain(document);
    expect(copy).toContain("werkvoorbereiding");
    expect(copy).toContain("Geen AI voor velden die al betrouwbaar en gestructureerd beschikbaar zijn");
    expect(copy).not.toMatch(/bewezen besparing|gegarandeerd|klantresultaat/i);
    const cited = new Set(workOrderRevisionInsightNl.sections.flatMap((section) => section.paragraphs ?? [])
      .flatMap((paragraph) => typeof paragraph === "string" ? [] : paragraph.sourceIds));
    expect(cited).toEqual(new Set(workOrderRevisionInsightNl.sources?.map((source) => source.id)));
  });

  it("publiceert alleen de echte Nederlandse route met correcte metadata en sitemap", async () => {
    const alternates = localizedAlternates(path, "nl");
    expect(alternates).toEqual({
      canonical: "https://meloncactus.com" + path,
      languages: { "nl-NL": "https://meloncactus.com" + path },
    });
    expect(standaloneArticlePaths).toContain(path);
    expect(counterpartPath(path)).toBeNull();
    expect(sitemap().find((item) => item.url === alternates.canonical)?.alternates?.languages).toEqual(alternates.languages);
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: workOrderRevisionInsightNl.slug }) });
    expect(metadata.alternates).toEqual(alternates);
    expect(metadata.openGraph).toMatchObject({ type: "article", publishedTime: "2026-11-18" });
  });

  it("staat op de Nederlandse index en bevat broncitatie en toegankelijke visuele uitleg", async () => {
    const indexHtml = renderToStaticMarkup(createElement(DutchInsightsPage));
    const articleHtml = renderToStaticMarkup(await DutchInsightPage({
      params: Promise.resolve({ slug: workOrderRevisionInsightNl.slug }),
    }));
    expect(indexHtml).toContain("Werkbon en tekeningrevisie controleren vóór productie");
    expect(articleHtml).toContain("Fictief proefblad met vijf werkbonnen");
    expect(articleHtml).toContain("Uitleg van de werkbon- en revisiecontrole in tekst");
    expect(articleHtml).toContain("/article-visuals/werkbon-tekeningrevisie-proef-nl.svg");
    expect(articleHtml).toContain('href="/nl/ai-hulp-twente"');
    const articleSchema = [...articleHtml.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]) as { "@type": string; citation?: string[] })
      .find((schema) => schema["@type"] === "Article");
    expect(articleSchema?.citation).toEqual(workOrderRevisionInsightNl.sources?.map((source) => source.url));
  });

  it("meet alleen het bekende pad en verwijdert querygegevens", () => {
    expect(redactAnalyticsEvent({
      type: "pageview",
      url: `https://meloncactus.com${path}?werkbon=WB-05#scan`,
    })).toEqual({ type: "pageview", url: `https://meloncactus.com${path}` });
  });
});
