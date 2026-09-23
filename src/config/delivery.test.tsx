import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContactForm } from "@/components/contact-form";
import ServicesPage from "@/app/(en)/services/page";
import TermsPage from "@/app/(en)/terms/page";
import DutchServicesPage from "@/app/(nl)/nl/diensten/page";
import DutchTermsPage from "@/app/(nl)/nl/voorwaarden/page";
import { calculateDeliveryTotal, DEFAULT_DELIVERY_PRIORITY, deliveryOptions } from "./delivery";

describe("delivery-priority choices and pricing", () => {
  it("has exactly the three approved choices and correct totals", () => {
    expect(deliveryOptions.map(({ value, multiplier }) => [value, multiplier])).toEqual([
      ["standard", 1], ["within-48-hours", 2], ["within-24-hours", 3],
    ]);
    expect(calculateDeliveryTotal(995, "standard")).toBe(995);
    expect(calculateDeliveryTotal(995, "within-48-hours")).toBe(1990);
    expect(calculateDeliveryTotal(995, "within-24-hours")).toBe(2985);
  });

  it("defaults the form to Standard and explains written acceptance", () => {
    const html = renderToStaticMarkup(createElement(ContactForm));
    const standard = html.match(/<option[^>]*>Standard delivery<\/option>/)?.[0];
    expect(DEFAULT_DELIVERY_PRIORITY).toBe("standard");
    expect(standard).toContain("selected");
    expect(html).toContain("Delivery priority");
    expect(html).toContain("Within 48 hours — 2× project fee");
    expect(html).toContain("Within 24 hours — 3× project fee");
    expect(html).toContain("written acceptance by MelonCactus");
  });

  it("displays accurate multipliers, illustrations and conditions", () => {
    const html = renderToStaticMarkup(createElement(ServicesPage));
    expect(html).toContain("1×");
    expect(html).toContain("2×");
    expect(html).toContain("3×");
    expect(html).toContain("100% surcharge");
    expect(html).toContain("200% surcharge");
    expect(html).not.toContain("300% surcharge");
    expect(html).toContain("€1,990");
    expect(html).toContain("€2,985");
    expect(html).toContain("Illustration only, not a quotation");
    expect(html).toContain("binding only when MelonCactus confirms");
    expect(html).toContain("Can every report be delivered within 24 or 48 hours?");
  });

  it("states the start condition and final fee in the terms", () => {
    const html = renderToStaticMarkup(createElement(TermsPage));
    expect(html).toContain("written scope confirmation");
    expect(html).toContain("received all required materials");
    expect(html).toContain("200% surcharge");
  });

  it("keeps Dutch delivery values and report selections compatible with the server", () => {
    const form = renderToStaticMarkup(createElement(ContactForm, { locale: "nl", initialReport: "Competitor Snapshot" }));
    expect(form).toContain("Leveringsprioriteit");
    expect(form).toContain("schriftelijke aanvaarding door MelonCactus");
    expect(form).toMatch(/<option value="standard" selected="">Standaardlevering<\/option>/);
    expect(form).toMatch(/<option value="Competitor Snapshot" selected="">Concurrentieprofiel/);
    expect(form).toContain('value="within-48-hours"');
    expect(form).toContain('value="within-24-hours"');
  });

  it("shows the same priority mathematics and conditions in Dutch", () => {
    const services = renderToStaticMarkup(createElement(DutchServicesPage));
    const terms = renderToStaticMarkup(createElement(DutchTermsPage));
    expect(services).toContain("1×");
    expect(services).toContain("2×");
    expect(services).toContain("3×");
    expect(services).toContain("100% toeslag");
    expect(services).toContain("200% toeslag");
    expect(services).not.toContain("300% toeslag");
    expect(services).toContain("€1.990");
    expect(services).toContain("€2.985");
    expect(terms).toContain("schriftelijk");
  });
});
