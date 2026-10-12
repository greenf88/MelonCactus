import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import EnglishArticlePage from "@/app/(en)/insights/[slug]/page";
import DutchArticlePage from "@/app/(nl)/nl/artikelen/[slug]/page";
import { siteConfig } from "@/config/site";
import { insights } from "@/data/insights";
import { insightsNl } from "@/data/insights-nl";
import { entityIds } from "@/lib/seo";
import { routePairs } from "@/lib/i18n";

function jsonLd(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)]
    .map((match) => JSON.parse(match[1]) as Record<string, unknown>);
}

function escapeHtmlText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function articlePairs() {
  return routePairs
    .filter(([en]) => en.startsWith("/insights/"))
    .map(([enPath, nlPath]) => {
      const en = insights.find((article) => enPath.endsWith(`/${article.slug}`));
      const nl = insightsNl.find((article) => nlPath.endsWith(`/${article.slug}`));
      if (!en || !nl) throw new Error(`Missing article data for ${enPath} or ${nlPath}`);
      return { enPath, nlPath, en, nl };
    });
}

describe("GEO content regression", () => {
  it("keeps every article dated, sourced, illustrated and paired without future dates", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const { en, nl } of articlePairs()) {
      for (const article of [en, nl]) {
        expect(article.date, article.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(article.date <= today, article.slug).toBe(true);
        expect((article.modifiedDate ?? article.date) <= today, article.slug).toBe(true);
        expect(article.sources?.length, article.slug).toBeGreaterThan(0);
        expect(article.visual, article.slug).toBeDefined();
        expect(article.visual?.alt.length, article.slug).toBeGreaterThan(80);
        expect(article.visual?.width, article.slug).toBe(1200);
        expect(article.visual?.height, article.slug).toBe(760);
        expect(article.visual?.mobileWidth, article.slug).toBe(760);
        expect(article.visual?.mobileHeight, article.slug).toBe(1100);
      }
      expect(nl.sources?.map((source) => source.id)).toEqual(en.sources?.map((source) => source.id));
    }
  });

  it("keeps sitemap dates, canonical language sets and production-only URLs coherent", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(routePairs.length * 2);
    for (const entry of entries) {
      const url = new URL(entry.url);
      expect(url.origin).toBe(siteConfig.siteUrl);
      expect(url.search).toBe("");
      expect(url.hash).toBe("");
      expect(url.hostname).not.toMatch(/vercel|localhost|preview/i);
      expect(Object.keys(entry.alternates?.languages ?? {}).sort()).toEqual(["en", "nl-NL", "x-default"].sort());
    }
    for (const { enPath, nlPath, en, nl } of articlePairs()) {
      for (const [path, article] of [[enPath, en], [nlPath, nl]] as const) {
        const entry = entries.find((item) => item.url === `${siteConfig.siteUrl}${path}`);
        expect(entry, path).toBeDefined();
        expect(new Date(entry?.lastModified ?? 0).toISOString().slice(0, 10), path)
          .toBe(article.modifiedDate ?? article.date);
      }
    }
  });

  it("renders primary article content, sources, images and parseable matching Article JSON-LD in source HTML", async () => {
    for (const { en, nl } of articlePairs()) {
      const variants = [
        { article: en, locale: "en", html: renderToStaticMarkup(await EnglishArticlePage({ params: Promise.resolve({ slug: en.slug }) })) },
        { article: nl, locale: "nl-NL", html: renderToStaticMarkup(await DutchArticlePage({ params: Promise.resolve({ slug: nl.slug }) })) },
      ];
      for (const { article, locale, html } of variants) {
        expect(html, article.slug).toContain(`<h1>${escapeHtmlText(article.title)}</h1>`);
        expect(html, article.slug).toContain("article-summary");
        expect(html, article.slug).toContain("article-sources");
        expect(html, article.slug).toContain(article.visual?.src);
        const schemas = jsonLd(html);
        expect(schemas.length, article.slug).toBeGreaterThanOrEqual(2);
        const schema = schemas.find((item) => item["@type"] === "Article");
        expect(schema, article.slug).toBeDefined();
        expect(schema?.inLanguage, article.slug).toBe(locale);
        expect(schema?.datePublished, article.slug).toBe(article.date);
        expect(schema?.dateModified, article.slug).toBe(article.modifiedDate ?? article.date);
        expect(schema?.author, article.slug).toEqual({ "@id": entityIds.organization });
        expect(schema?.publisher, article.slug).toEqual({ "@id": entityIds.organization });
        expect(schema?.citation, article.slug).toEqual(article.sources?.map((source) => source.url));
        for (const source of article.sources ?? []) expect(html, article.slug).toContain(`href="${source.url}"`);
      }
    }
  });

  it("keeps robots open in production and llms.txt compact, canonical and bilingual", () => {
    expect(robots().rules).toMatchObject({ userAgent: "*", allow: "/" });
    const llms = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");
    const links = [...llms.matchAll(/https:\/\/meloncactus\.com[^\s|]+/g)].map((match) => match[0]);
    const sitemapUrls = new Set(sitemap().map((entry) => entry.url));
    for (const link of links) {
      const url = new URL(link);
      expect(url.search).toBe("");
      expect(url.hash).toBe("");
      expect(sitemapUrls.has(link), link).toBe(true);
    }
    const articleLinks = links.filter((link) => link.includes("/insights/") || link.includes("/nl/artikelen/"));
    expect(articleLinks).toHaveLength(6);
    expect(articleLinks.filter((link) => link.includes("/insights/"))).toHaveLength(3);
    expect(articleLinks.filter((link) => link.includes("/nl/artikelen/"))).toHaveLength(3);
  });
});
