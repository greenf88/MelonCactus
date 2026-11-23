import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DutchInsightPage, { generateMetadata } from "@/app/(nl)/nl/artikelen/[slug]/page";
import DutchInsightsPage from "@/app/(nl)/nl/artikelen/page";
import sitemap from "@/app/sitemap";
import { redactAnalyticsEvent } from "@/components/privacy-analytics";
import { practicalAiCasesNl } from "@/data/practical-ai-cases";
import { localizedAlternates } from "@/lib/i18n";

describe("bijgewerkte intakecontrole vóór calculatie", () => {
  const article = practicalAiCasesNl.find((item) => item.slug === "fictieve-ai-case-klantaanvragen-automatiseren");
  if (!article) throw new Error("Dutch service-request intake case is missing");
  const path = `/nl/artikelen/${article.slug}`;

  it("bewaart publicatiedatum en markeert de inhoudelijke actualisatie", () => {
    expect(article.kind).toBe("fictional-ai-case");
    expect(article.date).toBe("2026-10-17");
    expect(article.modifiedDate).toBe("2026-11-23");
    expect(article.displayModifiedDate).toBe("23 november 2026");
  });

  it("houdt vijf fictieve aanvragen, bronvelden en menselijke beslisgrenzen zichtbaar", () => {
    const copy = JSON.stringify(article.sections);
    expect(copy).toContain("volledig fictief");
    expect(copy).toContain("geen MelonCactus-klant, uitgevoerde opdracht of gemeten resultaat");
    for (const request of ["OA-01", "OA-02", "OA-03", "OA-04", "OA-05"]) expect(copy).toContain(request);
    for (const field of ["Onderdeel", "Hoeveelheid", "Materiaal", "Tekening of bron", "Gewenste datum"]) expect(copy).toContain(field);
    expect(copy).toContain("berekent geen prijs");
    expect(copy).toContain("belooft geen levertijd");
    expect(copy).toContain("De calculator blijft eigenaar");
    expect(copy).not.toMatch(/bewezen besparing|gegarandeerd|klantresultaat/i);
  });

  it("citeert alle drie geraadpleegde bronnen met actuele bewijsgrenzen", () => {
    const cited = new Set(article.sections.flatMap((section) => section.paragraphs ?? [])
      .flatMap((paragraph) => typeof paragraph === "string" ? [] : paragraph.sourceIds));
    expect(cited).toEqual(new Set(article.sources?.map((source) => source.id)));
    expect(article.sources?.map((source) => source.accessed)).toEqual(["2026-11-23", "2026-11-23", "2026-11-23"]);
    expect(article.sources?.[0].note.nl).toContain("geen onafhankelijk bewijs");
    expect(article.sources?.[1].note.nl).toContain("geen gemeten resultaat");
    expect(article.sources?.[2].note.nl).toContain("geen certificering");
  });

  it("behoudt de bestaande wederkerige taalroute en gebruikt de wijzigingsdatum in metadata en sitemap", async () => {
    const alternates = localizedAlternates(path, "nl");
    expect(alternates).toEqual({
      canonical: `https://meloncactus.com${path}`,
      languages: {
        en: "https://meloncactus.com/insights/fictional-ai-case-service-request-intake",
        "nl-NL": `https://meloncactus.com${path}`,
        "x-default": "https://meloncactus.com/insights/fictional-ai-case-service-request-intake",
      },
    });
    const sitemapEntry = sitemap().find((item) => item.url === alternates.canonical);
    expect(sitemapEntry?.alternates?.languages).toEqual(alternates.languages);
    expect(sitemapEntry?.lastModified).toEqual(new Date("2026-11-23"));
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: article.slug }) });
    expect(metadata.alternates).toEqual(alternates);
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-10-17",
      modifiedTime: "2026-11-23",
    });
  });

  it("toont bijgewerkte indextekst, broncitatie en toegankelijke lokale visual", async () => {
    const indexHtml = renderToStaticMarkup(createElement(DutchInsightsPage));
    const articleHtml = renderToStaticMarkup(await DutchInsightPage({
      params: Promise.resolve({ slug: article.slug }),
    }));
    expect(indexHtml).toContain("technische aanvragen controleren vóór calculatie");
    expect(articleHtml).toContain("Fictief proefblad met vijf technische aanvragen");
    expect(articleHtml).toContain("Uitleg van de intakecontrole in tekst");
    expect(articleHtml).toContain("/article-visuals/ai-offerteaanvraag-controle-nl.svg");
    expect(articleHtml).toContain('href="/nl/ai-hulp-twente"');
    const articleSchema = [...articleHtml.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]) as { "@type": string; citation?: string[]; dateModified?: string })
      .find((schema) => schema["@type"] === "Article");
    expect(articleSchema?.citation).toEqual(article.sources?.map((source) => source.url));
    expect(articleSchema?.dateModified).toBe("2026-11-23");
  });

  it("meet het bekende artikelpad zonder query of fragment", () => {
    expect(redactAnalyticsEvent({
      type: "pageview",
      url: `https://meloncactus.com${path}?aanvraag=OA-05#tekening`,
    })).toEqual({ type: "pageview", url: `https://meloncactus.com${path}` });
  });
});
