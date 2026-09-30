import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContactForm } from "@/components/contact-form";
import ServicesPage from "@/app/(en)/services/page";
import TermsPage from "@/app/(en)/terms/page";
import DutchServicesPage from "@/app/(nl)/nl/diensten/page";
import DutchTermsPage from "@/app/(nl)/nl/voorwaarden/page";
import DutchPrivacyPage from "@/app/(nl)/nl/privacy/page";
import { publicProfileScan, reportOptions } from "./site";
import { publicProfileScanNl, reportOptionsNl } from "./site-nl";
import { DEFAULT_DELIVERY_PRIORITY, deliveryOptions } from "./delivery";

describe("decision-led assessment and delivery choices", () => {
  it("offers only Standard, Priority and Critical, with no public multiplier", () => {
    expect(deliveryOptions.map(({ value }) => value)).toEqual(["standard", "priority", "critical"]);
    expect(DEFAULT_DELIVERY_PRIORITY).toBe("standard");
    expect(JSON.stringify(deliveryOptions)).not.toMatch(/[23]×|multiplier|surcharge/i);
  });

  it("renders the decision-led form, Standard default and an optional NDA request in both languages", () => {
    const en = renderToStaticMarkup(createElement(ContactForm));
    const nl = renderToStaticMarkup(createElement(ContactForm, { locale: "nl" }));
    expect(en).toContain("What decision are you trying to make?");
    expect(en).toContain("Company, market or technology to examine");
    expect(en).toMatch(/<option value="standard" selected="">Standard/);
    expect(en).toContain("not automatic acceptance");
    expect(en).toContain('name="ndaRequest"');
    expect(en).toContain("does not create an agreement");
    expect(nl).toMatch(/<option value="standard" selected="">Standaard/);
    expect(nl).toContain("geen automatische aanvaarding");
    expect(nl).toContain("geen overeenkomst tot stand");
  });

  it("preserves assessment preselection, including old inbound report links", () => {
    const en = renderToStaticMarkup(createElement(ContactForm, { initialReport: "Technical Deep Dive" }));
    const nl = renderToStaticMarkup(createElement(ContactForm, { locale: "nl", initialReport: "Focused Intelligence Assessment" }));
    expect(en).toMatch(/<option value="Technical &amp; Competitive Intelligence" selected="">/);
    expect(nl).toMatch(/<option value="Focused Intelligence Assessment" selected="">Gerichte intelligencebeoordeling/);
    expect(renderToStaticMarkup(createElement(ContactForm, { initialReport: publicProfileScan.name }))).toMatch(/<option value="Public Profile Exposure Scan" selected="">/);
    expect(renderToStaticMarkup(createElement(ContactForm, { locale: "nl", initialReport: publicProfileScan.name }))).toMatch(/<option value="Public Profile Exposure Scan" selected="">Openbare-informatiescan voor uw bedrijf/);
  });

  it("keeps the fixed-scope scan separate from the three indicative engagement levels", () => {
    expect(publicProfileScan.price).toBe("€499");
    expect(publicProfileScanNl.price).toBe("€499");
    expect(reportOptions.map(({ price }) => price)).toEqual(["€995", "€1,995", "€3,995"]);
    expect(reportOptionsNl.map(({ price }) => price)).toEqual(["€995", "€1.995", "€3.995"]);
    const en = renderToStaticMarkup(createElement(ServicesPage));
    const nl = renderToStaticMarkup(createElement(DutchServicesPage));
    expect(en).toContain("indicative starting fees");
    expect(en).toContain("quoted individually after scoping");
    expect(nl).toContain("indicatieve vanafprijzen");
    expect(nl).toContain("afzonderlijk geoffreerd");
    expect(en).toContain("Public Profile Exposure Scan");
    expect(nl).toContain("Openbare-informatiescan voor uw bedrijf");
    expect(`${en}${nl}`).not.toMatch(/€495|€1,990|€2,985|€1\.990|€2\.985|[23]×|100% surcharge|200% toeslag/);
  });

  it("keeps written acceptance and evidence limits in both versions of the terms", () => {
    const en = renderToStaticMarkup(createElement(TermsPage));
    const nl = renderToStaticMarkup(createElement(DutchTermsPage));
    expect(en).toContain("confirmed the scope, fee and deadline in writing");
    expect(en).toContain("received all required information");
    expect(nl).toContain("schriftelijk heeft bevestigd");
    expect(nl).toContain("benodigde informatie heeft ontvangen");
    expect(`${en}${nl}`).not.toMatch(/[23]×|100% surcharge|200% toeslag/);
  });

  it("keeps approved Dutch legal wording and accurately covers new intake data", () => {
    const privacy = renderToStaticMarkup(createElement(DutchPrivacyPage));
    const terms = renderToStaticMarkup(createElement(DutchTermsPage));
    expect(privacy).toContain("andere toegangsgegevens");
    expect(privacy).toContain("geheimhoudingsovereenkomst");
    expect(privacy).toContain("bedrijf, functie of rol");
    expect(terms).toContain("technisch of beveiligingsadvies");
    expect(terms).toContain("opdrachten voor klanten");
  });
});
