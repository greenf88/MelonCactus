import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/(en)/privacy/page";
import DutchPrivacyPage from "@/app/(nl)/nl/privacy/page";
import { redactAnalyticsEvent } from "@/components/privacy-analytics";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/config/site";
import { Footer } from "@/components/footer";

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
    expect(english).toContain("no longer than five years after final delivery");
    expect(english).toContain("generally seven years in the Netherlands");
    expect(english).toContain("OVHcloud using Zimbra");
    expect(english).toContain(siteConfig.registrationNumber);

    expect(dutch).toContain("Vercel Web Analytics");
    expect(dutch).toContain("Engelse en Nederlandse pagina’s");
    expect(dutch).toContain("in plaats van analytische cookies");
    expect(dutch).toContain("geen advertentietrackers of gedragsprofilering");
    expect(dutch).toContain("uiterlijk twaalf maanden na het laatste inhoudelijke contact");
    expect(dutch).toContain("uiterlijk 24 maanden na definitieve oplevering");
    expect(dutch).toContain("uiterlijk vijf jaar na definitieve oplevering");
    expect(dutch).toContain("in Nederland doorgaans zeven jaar");
    expect(dutch).toContain("OVHcloud met Zimbra");
    expect(dutch).toContain(siteConfig.registrationNumber);
  });

  it("removes query and fragment data and ignores unknown paths and custom events", () => {
    expect(redactAnalyticsEvent({ type: "pageview", url: "https://meloncactus.com/nl/contact?email=private%40example.com#form" }))
      .toEqual({ type: "pageview", url: "https://meloncactus.com/nl/contact" });
    expect(redactAnalyticsEvent({ type: "pageview", url: "https://meloncactus.com/private/person" })).toBeNull();
    expect(redactAnalyticsEvent({ type: "event", url: "https://meloncactus.com/contact" })).toBeNull();
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
    }
  });
});
