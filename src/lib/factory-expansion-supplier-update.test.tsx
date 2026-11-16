import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DutchArticlePage from "@/app/(nl)/nl/artikelen/[slug]/page";
import sitemap from "@/app/sitemap";
import { insights } from "@/data/insights";
import { insightsNl } from "@/data/insights-nl";

describe("leveranciersbeslissing bij een aangekondigde fabrieksuitbreiding", () => {
  const slug = "wat-bewijst-een-aangekondigde-fabrieksuitbreiding";
  const path = `/nl/artikelen/${slug}`;
  const dutch = insightsNl.find((article) => article.slug === slug);
  const english = insights.find((article) => article.slug === "what-a-factory-expansion-announcement-proves");

  it("behoudt de publicatiedatum en legt de inhoudelijke wijzigingsdatum eerlijk vast", () => {
    expect(dutch?.date).toBe("2026-09-27");
    expect(dutch?.modifiedDate).toBe("2026-11-16");
    expect(english?.modifiedDate).toBe("2026-10-12");
    expect(new Date(sitemap().find((entry) => entry.url.endsWith(path))?.lastModified ?? 0).toISOString().slice(0, 10))
      .toBe("2026-11-16");
  });

  it("markeert het leidingenpakket als fictief en begrenst de leveranciersclaim", () => {
    const copy = JSON.stringify([dutch?.introMarkdown, dutch?.sections]);
    expect(copy).toContain("volledig fictief");
    expect(copy).toContain("geen werkelijk Umicore-werkpakket");
    expect(copy).toContain("externe inkooproute onbekend");
    expect(copy).toContain("pas na bevestiging calculeren");
    expect(copy).not.toMatch(/bevestigd leidingenpakket|gegarandeerde opdracht|bekende aanbesteding voor procesleidingen/i);
  });

  it("toont de Umicore-bron en neemt haar op in de Article-citaties", async () => {
    const html = renderToStaticMarkup(await DutchArticlePage({ params: Promise.resolve({ slug }) }));
    expect(html).toContain("Wanneer wordt een uitbreiding een bruikbaar leverancierssignaal?");
    expect(html).toContain("€450 miljoen");
    expect(html).toContain("<strong>Project volgen:</strong>");
    expect(html).not.toContain("| Niveau | Wat u minimaal wilt bevestigen");
    expect(html).toContain("umicore-hoboken-growth-2026");
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
      .map((match) => JSON.parse(match[1]) as { "@type": string; citation?: string[]; dateModified?: string });
    const article = schemas.find((schema) => schema["@type"] === "Article");
    expect(article?.dateModified).toBe("2026-11-16");
    expect(article?.citation).toContain("https://www.umicore.com/en/media/newsroom/umicore-to-invest-450-million-euros-for-growth/");
  });
});
