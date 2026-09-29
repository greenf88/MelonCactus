import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EnglishCase, { metadata as englishMetadata } from "@/app/(en)/example-case/fourth-pillar/page";
import DutchCase, { metadata as dutchMetadata } from "@/app/(nl)/nl/voorbeeldcase/vierde-pijler/page";
import EnglishProfileCase, { metadata as englishProfileMetadata } from "@/app/(en)/example-case/public-profile/page";
import DutchProfileCase, { metadata as dutchProfileMetadata } from "@/app/(nl)/nl/voorbeeldcase/openbaar-profiel/page";
import EnglishHome from "@/app/(en)/page";
import DutchHome from "@/app/(nl)/nl/page";
import EnglishSampleReport from "@/app/(en)/sample-report/page";
import DutchSampleReport from "@/app/(nl)/nl/voorbeeldrapport/page";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/config/site";

describe("fictional fourth-pillar example", () => {
  it("keeps the two-stage story fictional and evidence-limited in both languages", () => {
    const en = renderToStaticMarkup(createElement(EnglishCase));
    const nl = renderToStaticMarkup(createElement(DutchCase));
    expect(en).toContain("Company X");
    expect(en).toContain("This is an invented scenario");
    expect(en).toContain("separate follow-up report");
    expect(en).toContain("Projects");
    expect(en).toContain("Suppliers");
    expect(nl).toContain("Bedrijf X");
    expect(nl).toContain("Dit scenario is verzonnen");
    expect(nl).toContain("afzonderlijk vervolgrapport");
    expect(nl).toContain("Projecten");
    expect(nl).toContain("Leveranciers");
    expect(`${en}${nl}`).not.toMatch(/completed client assignment|uitgevoerde klantopdracht|gegarandeerd rendement/i);
  });

  it("links the paired routes from both homes and sample reports", () => {
    expect(renderToStaticMarkup(createElement(EnglishHome))).toContain('href="/example-case/fourth-pillar"');
    expect(renderToStaticMarkup(createElement(DutchHome))).toContain('href="/nl/voorbeeldcase/vierde-pijler"');
    expect(renderToStaticMarkup(createElement(EnglishSampleReport))).toContain('href="/example-case/fourth-pillar"');
    expect(renderToStaticMarkup(createElement(DutchSampleReport))).toContain('href="/nl/voorbeeldcase/vierde-pijler"');
  });

  it("uses reciprocal metadata and lists both URLs in the sitemap", () => {
    const en = `${siteConfig.siteUrl}/example-case/fourth-pillar`;
    const nl = `${siteConfig.siteUrl}/nl/voorbeeldcase/vierde-pijler`;
    expect(englishMetadata.alternates).toEqual({ canonical: en, languages: { en, "nl-NL": nl, "x-default": en } });
    expect(dutchMetadata.alternates).toEqual({ canonical: nl, languages: { en, "nl-NL": nl, "x-default": en } });
    expect(sitemap().filter((entry) => entry.url === en || entry.url === nl)).toHaveLength(2);
  });
});

describe("fictional public-profile example", () => {
  it("keeps the outcome general and the confidential source out of both pages", () => {
    const en = renderToStaticMarkup(createElement(EnglishProfileCase));
    const nl = renderToStaticMarkup(createElement(DutchProfileCase));
    expect(en).toContain("This is a fictional illustration");
    expect(en).toContain("no single publication");
    expect(nl).toContain("Dit is een fictief voorbeeld");
    expect(nl).toContain("geen enkele publicatie");
    expect(`${en}${nl}`).not.toMatch(/HUG|SiC|catalyst|katalysator|65.?85%|productnaam|softwarepakket/i);
  });

  it("links the paired routes from the homes and includes reciprocal metadata and sitemap entries", () => {
    const en = `${siteConfig.siteUrl}/example-case/public-profile`;
    const nl = `${siteConfig.siteUrl}/nl/voorbeeldcase/openbaar-profiel`;
    expect(renderToStaticMarkup(createElement(EnglishHome))).toContain('href="/example-case/public-profile"');
    expect(renderToStaticMarkup(createElement(DutchHome))).toContain('href="/nl/voorbeeldcase/openbaar-profiel"');
    expect(englishProfileMetadata.alternates).toEqual({ canonical: en, languages: { en, "nl-NL": nl, "x-default": en } });
    expect(dutchProfileMetadata.alternates).toEqual({ canonical: nl, languages: { en, "nl-NL": nl, "x-default": en } });
    expect(sitemap().filter((entry) => entry.url === en || entry.url === nl)).toHaveLength(2);
  });
});
