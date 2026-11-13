import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DutchInsightPage from "@/app/(nl)/nl/artikelen/[slug]/page";
import DutchInsightsPage from "@/app/(nl)/nl/artikelen/page";
import sitemap from "@/app/sitemap";
import { redactAnalyticsEvent } from "@/components/privacy-analytics";
import { weldPhotoInspectionInsightNl } from "@/data/weld-photo-inspection-insight";
import { counterpartPath, localizedAlternates, standaloneArticlePaths } from "@/lib/i18n";

describe("zelfstandige handleiding voor een lasnaadfotoproef", () => {
  const path = "/nl/artikelen/ai-lasnaadinspectie-test-bestaande-fotos";

  it("houdt het fictieve voorbeeld en de bewijsgrenzen zichtbaar", () => {
    expect(weldPhotoInspectionInsightNl.sources?.every((source) => source.accessed === "2026-11-13")).toBe(true);
    const copy = JSON.stringify(weldPhotoInspectionInsightNl.sections);
    expect(copy).toContain("volledig fictief");
    expect(copy).toContain("geen klant, uitgevoerde opdracht of gemeten resultaat");
    expect(copy).toContain("Geen automatische vrijgave");
    expect(copy).not.toMatch(/bewezen besparing|gegarandeerd|klantresultaat/i);
    const cited = new Set(weldPhotoInspectionInsightNl.sections.flatMap((section) => section.paragraphs ?? [])
      .flatMap((paragraph) => typeof paragraph === "string" ? [] : paragraph.sourceIds));
    expect(cited).toEqual(new Set(weldPhotoInspectionInsightNl.sources?.map((source) => source.id)));
  });

  it("publiceert alleen de echte Nederlandse route", () => {
    const alternates = localizedAlternates(path, "nl");
    expect(alternates).toEqual({
      canonical: "https://meloncactus.com" + path,
      languages: { "nl-NL": "https://meloncactus.com" + path },
    });
    expect(standaloneArticlePaths).toContain(path);
    expect(counterpartPath(path)).toBeNull();
    expect(sitemap().find((item) => item.url === alternates.canonical)?.alternates?.languages).toEqual(alternates.languages);
  });

  it("staat op de Nederlandse index en bevat broncitaten en toegankelijke visuele uitleg", async () => {
    const indexHtml = renderToStaticMarkup(createElement(DutchInsightsPage));
    const articleHtml = renderToStaticMarkup(await DutchInsightPage({
      params: Promise.resolve({ slug: weldPhotoInspectionInsightNl.slug }),
    }));
    expect(indexHtml).toContain("AI bij lasnaadinspectie: test eerst één type lasnaad");
    expect(articleHtml).toContain("Fictief proefblad vóór de eerste modelvergelijking");
    expect(articleHtml).toContain("Uitleg van de lasnaadfotoproef in tekst");
    expect(articleHtml).toContain("/article-visuals/ai-lasnaadinspectie-proef-nl.svg");
    const articleSchema = [...articleHtml.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]) as { "@type": string; citation?: string[] })
      .find((schema) => schema["@type"] === "Article");
    expect(articleSchema?.citation).toEqual(weldPhotoInspectionInsightNl.sources?.map((source) => source.url));
  });

  it("meet alleen het bekende pad en verwijdert querygegevens", () => {
    expect(redactAnalyticsEvent({
      type: "pageview",
      url: `https://meloncactus.com${path}?foto=intern-123#testset`,
    })).toEqual({ type: "pageview", url: `https://meloncactus.com${path}` });
  });
});
