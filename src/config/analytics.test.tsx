import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/(en)/privacy/page";
import DutchPrivacyPage from "@/app/(nl)/nl/privacy/page";
import TermsPage from "@/app/(en)/terms/page";
import DutchTermsPage from "@/app/(nl)/nl/voorwaarden/page";
import { redactAnalyticsEvent } from "@/components/privacy-analytics";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/config/site";
import { Footer } from "@/components/footer";
import { routePairs } from "@/lib/i18n";

describe("Web Analytics privacy notices", () => {
  it("describes page-view measurement consistently in both languages", () => {
    const english = renderToStaticMarkup(createElement(PrivacyPage));
    const dutch = renderToStaticMarkup(createElement(DutchPrivacyPage));

    expect(english).toContain("Vercel Web Analytics");
    expect(english).toContain("known public English and Dutch pages");
    expect(english).toContain("visitor hash derived from the incoming request that is valid for one day, without third-party Analytics cookies");
    expect(english).toContain("does not send form field values as Analytics events");
    expect(english).toContain("connection data such as an IP address");
    expect(english).toContain("we rely on our legitimate interest in understanding and improving use of the website");
    expect(english).toContain(`href="mailto:${siteConfig.businessEmail}"`);
    expect(english).toContain("turn off future Analytics measurement in this browser using the setting below");
    expect(english).toContain("local browser storage, without a visitor ID");
    expect(english).toContain("Earlier aggregate statistics cannot be searched by name");
    expect(english).toContain("Analytics in this browser");
    expect(english).not.toContain("this proposal requires approval before publication");
    expect(english).toContain("no more than twelve months after the last substantive contact");
    expect(english).toContain("no later than 24 months after final delivery");
    expect(english).toContain("We keep the final report for no more than 24 months from final delivery");
    expect(english).not.toContain("five years after final delivery");
    expect(english).toContain("generally seven years in the Netherlands");
    expect(english).toContain("OVHcloud through Zimbra");
    expect(english).toContain("stored locally on our computer");
    expect(english).toContain("provider-held copies or security records");
    expect(english).toContain("EU standard contractual clauses");
    expect(english).toContain("https://resend.com/legal/dpa");
    expect(english).toContain("https://vercel.com/legal/dpa");
    expect(english).toContain("routine 30-day period for email content and delivery logs");
    expect(english).toContain("not a general deletion period");
    expect(english).not.toContain("must still be checked before this notice");
    expect(english).toContain(siteConfig.registrationNumber);
    expect(english).toContain(siteConfig.vatId);
    expect(english).toContain(siteConfig.postalAddress);

    expect(dutch).toContain("Vercel Web Analytics");
    expect(dutch).toContain("bekende openbare Engelse en Nederlandse pagina&#x27;s");
    expect(dutch).toContain("bezoekerhash op basis van het inkomende verzoek die één dag geldig is, zonder cookies van derden voor Analytics");
    expect(dutch).toContain("verstuurt geen formulierwaarden als Analytics-gebeurtenissen");
    expect(dutch).toContain("verbindingsgegevens zoals een IP-adres");
    expect(dutch).toContain("gebruiken wij ons gerechtvaardigd belang om het gebruik van de website te begrijpen en te verbeteren");
    expect(dutch).toContain(`href="mailto:${siteConfig.businessEmail}"`);
    expect(dutch).toContain("verdere Analytics-meting in deze browser hieronder uitschakelen");
    expect(dutch).toContain("lokale browseropslag van deze website, zonder bezoekers-ID");
    expect(dutch).toContain("Eerdere geaggregeerde statistieken zijn niet op naam doorzoekbaar");
    expect(dutch).toContain("Analytics in deze browser");
    expect(dutch).not.toContain("dit voorstel moet vóór publicatie worden goedgekeurd");
    expect(dutch).toContain("tot maximaal twaalf maanden na het laatste inhoudelijke contact");
    expect(dutch).toContain("uiterlijk 24 maanden na definitieve oplevering");
    expect(dutch).toContain("Voor het definitieve rapport geldt vanaf de definitieve oplevering eveneens een maximum van 24 maanden");
    expect(dutch).not.toContain("vijf jaar na definitieve oplevering");
    expect(dutch).toContain("in Nederland doorgaans zeven jaar");
    expect(dutch).toContain("OVHcloud via Zimbra");
    expect(dutch).toContain("staan momenteel lokaal op onze computer");
    expect(dutch).toContain("kopieën of beveiligingsgegevens bij leveranciers");
    expect(dutch).toContain("EU-modelcontractbepalingen");
    expect(dutch).toContain("https://resend.com/legal/dpa");
    expect(dutch).toContain("https://vercel.com/legal/dpa");
    expect(dutch).toContain("reguliere termijn van 30 dagen voor e-mailinhoud en afleverlogs");
    expect(dutch).toContain("geen algemene verwijdertermijn");
    expect(dutch).not.toContain("vóór goedkeuring van deze verklaring");
    expect(dutch).toContain(siteConfig.registrationNumber);
    expect(dutch).toContain(siteConfig.vatId);
    expect(dutch).toContain(siteConfig.postalAddress);
  });

  it("separates website terms from written paid-assignment terms in both languages", () => {
    const english = renderToStaticMarkup(createElement(TermsPage));
    const dutch = renderToStaticMarkup(createElement(DutchTermsPage));
    expect(english).toContain("does not create a paid research assignment");
    expect(english).toContain("payment, cancellation, report-use and liability terms in writing");
    expect(dutch).toContain("schept geen betaalde onderzoeksopdracht");
    expect(dutch).toContain("betaling, annulering, gebruik van het rapport en aansprakelijkheid afzonderlijk schriftelijk vast");
  });

  it("removes query and fragment data and ignores unknown paths and custom events", () => {
    expect(redactAnalyticsEvent({ type: "pageview", url: "https://meloncactus.com/nl/contact?email=private%40example.com#form" }))
      .toEqual({ type: "pageview", url: "https://meloncactus.com/nl/contact" });
    expect(redactAnalyticsEvent({ type: "pageview", url: "https://meloncactus.com/private/person" })).toBeNull();
    expect(redactAnalyticsEvent({ type: "event", url: "https://meloncactus.com/contact" })).toBeNull();
  });

  it("measures every published bilingual route without enquiry data, including new SEO pages", () => {
    for (const path of routePairs.flat()) {
      const url = `https://meloncactus.com${path}`;
      expect(redactAnalyticsEvent({
        type: "pageview",
        url: `${url}?report=assessment&email=private%40example.com#confidential-context`,
      })).toEqual({ type: "pageview", url });
    }
  });

  it("does not measure unpublished routes within the new service and topic families", () => {
    for (const path of ["/services/unpublished", "/topics/private-company", "/nl/diensten/onbekend", "/nl/themas/prive-bedrijf"]) {
      expect(redactAnalyticsEvent({ type: "pageview", url: `https://meloncactus.com${path}` })).toBeNull();
    }
  });

  it("links the matching privacy notice before form submission", () => {
    expect(renderToStaticMarkup(createElement(ContactForm, { locale: "nl" }))).toContain('href="/nl/privacy"');
    expect(renderToStaticMarkup(createElement(ContactForm, { locale: "en" }))).toContain('href="/privacy"');
  });

  it("uses the owner-supplied business contact details consistently", () => {
    for (const locale of ["en", "nl"] as const) {
      const footer = renderToStaticMarkup(createElement(Footer, { locale }));
      expect(footer).toContain(`href="${siteConfig.businessPhoneHref}"`);
      expect(footer).toContain(siteConfig.registrationNumber);
      expect(footer).toContain(siteConfig.businessEmail);
      expect(footer).toContain(siteConfig.vatId);
      expect(footer).toContain(siteConfig.postalAddress);
    }
  });
});
