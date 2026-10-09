import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { industrialInsights } from "@/data/industrial-insights";
import { insights } from "@/data/insights";
import { insightsNl } from "@/data/insights-nl";
import { ArticleContent } from "./article-content";

describe("sourced article rendering", () => {
  it("renders every new article with clickable sources, internal links and formatted emphasis", () => {
    for (const article of industrialInsights) {
      const html = renderToStaticMarkup(<ArticleContent insight={article} idPrefix="section" />);
      expect(html).toContain('<a href="https://');
      expect(html).toContain('<a href="/');
      expect(html).toContain("<strong>");
      expect(html).not.toContain("**Bron");
      expect(html).not.toContain("**Source");
      expect(html).not.toMatch(/!\[[^\]]*\]\(/);
    }
  });

  it("renders numbered claim citations and a localized source register", () => {
    const english = insights.filter((article) => article.sources?.length);
    const dutch = insightsNl.filter((article) => article.sources?.length);
    expect(english).toHaveLength(4);
    expect(dutch).toHaveLength(4);

    for (const article of english) {
      const html = renderToStaticMarkup(<ArticleContent insight={article} idPrefix="section" locale="en" />);
      expect(html).toContain('id="section-sources"');
      expect(html).toContain("Sources</h2>");
      expect(html).toContain("Accessed 7 October 2026");
      expect(html).toMatch(/aria-label="Source \d+"/);
      for (const source of article.sources ?? []) expect(html).toContain(`id="section-source-${source.id}"`);
    }

    for (const article of dutch) {
      const html = renderToStaticMarkup(<ArticleContent insight={article} idPrefix="sectie" locale="nl" />);
      expect(html).toContain('id="sectie-sources"');
      expect(html).toContain("Bronnen</h2>");
      expect(html).toContain("Geraadpleegd 7 oktober 2026");
      expect(html).toMatch(/aria-label="Bron \d+"/);
      for (const source of article.sources ?? []) expect(html).toContain(`id="sectie-source-${source.id}"`);
    }
  });

  it("renders localized article visuals with accessible text equivalents", () => {
    for (const [articles, locale, idPrefix] of [[insights, "en", "section"], [insightsNl, "nl", "sectie"]] as const) {
      const visualArticles = articles.filter((article) => article.visual);
      expect(visualArticles).toHaveLength(4);

      for (const article of visualArticles) {
        const html = renderToStaticMarkup(<ArticleContent insight={article} idPrefix={idPrefix} locale={locale} />);
        expect(html).toContain('class="article-visual"');
        expect(html).toContain(`alt="${article.visual?.alt.replaceAll("&", "&amp;").replaceAll("\"", "&quot;")}`);
        expect(html).toContain(article.visual?.title);
        expect(html).toContain(`aria-label="${article.visual?.explanationLabel}`);
        for (const detail of article.visual?.details ?? []) {
          expect(html).toContain(detail.label);
          expect(html).toContain(detail.text);
        }
      }
    }
  });
});
