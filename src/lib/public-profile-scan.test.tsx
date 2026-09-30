import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EnglishScan, { metadata as englishMetadata } from "@/app/(en)/services/public-profile-exposure-scan/page";
import DutchScan, { metadata as dutchMetadata } from "@/app/(nl)/nl/diensten/openbare-informatiescan/page";
import EnglishHome from "@/app/(en)/page";
import DutchHome from "@/app/(nl)/nl/page";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/config/site";

describe("fixed-scope public-profile scan", () => {
  it("states the price, scope and defensive boundaries in both languages", () => {
    const en = renderToStaticMarkup(createElement(EnglishScan));
    const nl = renderToStaticMarkup(createElement(DutchScan));
    expect(en).toContain("€499");
    expect(en).toContain("up to two official public channels");
    expect(en).toContain("does not include private accounts");
    expect(nl).toContain("€499");
    expect(nl).toContain("maximaal twee officiële openbare kanalen");
    expect(nl).toContain("geen besloten accounts");
    expect(`${en}${nl}`).not.toMatch(/guarantee|garantie|hack|hacken/i);
  });

  it("is linked from both homepages and uses reciprocal metadata and sitemap entries", () => {
    const enPath = "/services/public-profile-exposure-scan";
    const nlPath = "/nl/diensten/openbare-informatiescan";
    const en = `${siteConfig.siteUrl}${enPath}`;
    const nl = `${siteConfig.siteUrl}${nlPath}`;
    expect(renderToStaticMarkup(createElement(EnglishHome))).toContain(`href="${enPath}"`);
    expect(renderToStaticMarkup(createElement(DutchHome))).toContain(`href="${nlPath}"`);
    expect(englishMetadata.alternates).toEqual({ canonical: en, languages: { en, "nl-NL": nl, "x-default": en } });
    expect(dutchMetadata.alternates).toEqual({ canonical: nl, languages: { en, "nl-NL": nl, "x-default": en } });
    expect(sitemap().filter((entry) => entry.url === en || entry.url === nl)).toHaveLength(2);
  });
});
