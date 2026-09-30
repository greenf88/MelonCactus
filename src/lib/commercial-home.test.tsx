import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EnglishHome, { metadata as englishMetadata } from "@/app/(en)/page";
import DutchHome, { metadata as dutchMetadata } from "@/app/(nl)/nl/page";
import { commercialHome } from "@/config/commercial-home";
import { publicProfileScan, reportOptions, siteConfig } from "@/config/site";
import { publicProfileScanNl, reportOptionsNl, siteNl } from "@/config/site-nl";
import { routePairs } from "@/lib/i18n";

const homes = [
  { locale: "en" as const, html: renderToStaticMarkup(createElement(EnglishHome)) },
  { locale: "nl" as const, html: renderToStaticMarkup(createElement(DutchHome)) },
];

describe("commercial homepage", () => {
  it.each(homes)("keeps the decision-led section order in $locale", ({ locale, html }) => {
    const copy = commercialHome[locale];
    const markers = [
      copy.hero.title, copy.applications[0], copy.decisions.title,
      copy.deliverable.title, copy.examples.title, copy.comparison.title,
      copy.pricing.title, copy.process.title, copy.faq.title, copy.identity.title,
    ];
    const positions = markers.map((marker) => html.indexOf(marker));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(copy.decisions.items).toHaveLength(4);
    expect(copy.process.items).toHaveLength(6);
    expect(copy.applications).toHaveLength(3);
  });

  it.each(homes)("labels fictional material and makes evidence limits visible in $locale", ({ locale, html }) => {
    const copy = commercialHome[locale];
    expect(html).toContain(copy.deliverable.fictional);
    expect(html).toContain(copy.deliverable.summary);
    expect(html).toContain(copy.deliverable.findings);
    expect(html).toContain(copy.examples.disclaimer);
    expect(html).toContain(copy.deliverable.evidence);
    expect(html).toContain(copy.deliverable.assessment);
    expect(html).toContain(copy.deliverable.inference);
    expect(html).toContain(copy.deliverable.unknown);
    expect(html).toContain(copy.process.question);
    expect(html).not.toMatch(/Trusted by Technology Leaders|free mini.audit|gratis minionderzoek/i);
  });

  it("keeps all four product levels and distinguishes the scan from an external assessment", () => {
    const en = homes[0].html;
    const nl = homes[1].html;
    for (const product of [publicProfileScan, ...reportOptions]) {
      expect(en).toContain(product.name.replaceAll("&", "&amp;"));
      expect(en).toContain(product.price);
      expect(product.bestFor).toBeTruthy();
      expect(product.boundary).toBeTruthy();
    }
    for (const product of [publicProfileScanNl, ...reportOptionsNl]) {
      expect(nl).toContain(product.name);
      expect(nl).toContain(product.price);
      expect(product.bestFor).toBeTruthy();
      expect(product.boundary).toBeTruthy();
    }
    expect(en).toContain("The €499 scan reviews your own");
    expect(nl).toContain("De scan van €499 onderzoekt");
    expect(`${en}${nl}`).not.toMatch(/2×|3×|300% surcharge|300% toeslag/);
  });

  it.each(homes)("matches visible FAQ questions and answers to FAQPage data in $locale", ({ locale, html }) => {
    const questions = commercialHome[locale].faq.items;
    expect(questions).toHaveLength(12);
    const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
    expect(match).not.toBeNull();
    const schema = JSON.parse(match![1]) as { "@type": string; mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(12);
    for (const [index, entry] of questions.entries()) {
      expect(html).toContain(`<summary>${entry.question}</summary>`);
      expect(html).toContain(`<p>${entry.answer}</p>`);
      expect(schema.mainEntity[index].name).toBe(entry.question);
      expect(schema.mainEntity[index].acceptedAnswer.text).toBe(entry.answer);
    }
  });

  it("keeps paired metadata, prices, navigation and contact destinations", () => {
    const en = `${siteConfig.siteUrl}/`;
    const nl = `${siteConfig.siteUrl}/nl`;
    expect(englishMetadata.alternates).toEqual({ canonical: en, languages: { en, "nl-NL": nl, "x-default": en } });
    expect(dutchMetadata.alternates).toEqual({ canonical: nl, languages: { en, "nl-NL": nl, "x-default": en } });
    expect(siteConfig.nav.map((item) => item.label)).toEqual(["Services", "Examples", "Methodology", "Pricing", "Insights", "About"]);
    expect(siteNl.nav.map((item) => item.label)).toEqual(["Diensten", "Voorbeelden", "Werkwijze", "Prijzen", "Artikelen", "Over ons"]);
    expect(routePairs).toContainEqual(["/", "/nl"]);
    expect(homes[0].html).toContain('href="/contact"');
    expect(homes[1].html).toContain('href="/nl/contact"');
    expect(homes[0].html).toContain('href="/services/public-profile-exposure-scan"');
    expect(homes[1].html).toContain('href="/nl/diensten/openbare-informatiescan"');
    expect(homes[0].html).toContain(siteConfig.businessEmail);
    expect(homes[1].html).toContain(siteConfig.businessEmail);
  });
});
