import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/(en)/privacy/page";
import DutchPrivacyPage from "@/app/(nl)/nl/privacy/page";
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
    expect(english).toContain("English and Dutch pages");
    expect(english).toContain("rather than analytics cookies");
    expect(english).toContain("advertising trackers or build behavioural profiles");
    expect(english).toContain("no later than twelve months after the last substantive contact");
    expect(english).toContain("no later than 24 months after final delivery");
    expect(english).toContain("We retain final reports only while needed for corrections or proportionate contractual claims");
    expect(english).not.toContain("five years after final delivery");
    expect(english).toContain("generally seven years in the Netherlands");
    expect(english).toContain("OVHcloud through Zimbra");
    expect(english).toContain("stored locally on our computer");
    expect(english).toContain("provider-held copies or security records");
    expect(english).toContain("EU standard contractual clauses");
    expect(english).toContain("https://resend.com/security/gdpr");
    expect(english).toContain("https://vercel.com/legal/dpa");
    expect(english).toContain("routine 30-day period for email content and logs");
    expect(english).toContain("not a general deletion period");
    expect(english).not.toContain("must still be checked before this notice");
    expect(english).toContain(siteConfig.registrationNumber);
    expect(english).toContain(siteConfig.vatId);
    expect(english).toContain(siteConfig.postalAddress);

    expect(dutch).toContain("Vercel Web Analytics");
    expect(dutch).toContain("Engelse en Nederlandse pagina’s");
    expect(dutch).toContain("in plaats van analyticscookies");
    expect(dutch).toContain("geen advertentietrackers of gedragsprofilering");
    expect(dutch).toContain("uiterlijk twaalf maanden na het laatste inhoudelijke contact");
    expect(dutch).toContain("uiterlijk 24 maanden na definitieve oplevering");
    expect(dutch).toContain("Definitieve rapporten bewaren wij alleen zolang zij nodig zijn voor correcties of evenredige contractuele aanspraken");
    expect(dutch).not.toContain("vijf jaar na definitieve oplevering");
    expect(dutch).toContain("in Nederland doorgaans zeven jaar");
    expect(dutch).toContain("OVHcloud via Zimbra");
    expect(dutch).toContain("staan momenteel lokaal op onze computer");
    expect(dutch).toContain("kopieën of beveiligingsgegevens bij leveranciers");
    expect(dutch).toContain("EU-modelcontractbepalingen");
    expect(dutch).toContain("https://resend.com/security/gdpr");
    expect(dutch).toContain("https://vercel.com/legal/dpa");
    expect(dutch).toContain("reguliere termijn van 30 dagen voor e-mailinhoud en logs");
    expect(dutch).toContain("geen algemene verwijdertermijn");
    expect(dutch).not.toContain("vóór goedkeuring van deze verklaring");
    expect(dutch).toContain(siteConfig.registrationNumber);
    expect(dutch).toContain(siteConfig.vatId);
    expect(dutch).toContain(siteConfig.postalAddress);
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
