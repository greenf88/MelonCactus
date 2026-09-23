import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import ServicesPage from "@/app/services/page";
import CompetitorPage, { metadata as competitorMetadata } from "@/app/services/industrial-competitor-analysis/page";
import ManufacturingPage, { metadata as manufacturingMetadata } from "@/app/services/manufacturing-capability-analysis/page";
import ExposurePage, { metadata as exposureMetadata } from "@/app/services/public-information-exposure-review/page";
import InsightPage, { generateMetadata as insightMetadata } from "@/app/insights/[slug]/page";
import sitemap from "@/app/sitemap";
import { ContactForm } from "@/components/contact-form";
import { focusedServices, serviceContactHref } from "./focused-services";
import { insights } from "@/data/insights";

describe("focused service content and discovery", () => {
  it("shows all three service routes on home and overview", () => {
    const home = renderToStaticMarkup(createElement(Home));
    const overview = renderToStaticMarkup(createElement(ServicesPage));
    for (const service of focusedServices) {
      expect(home).toContain(`/services/${service.slug}`);
      expect(overview).toContain(`/services/${service.slug}`);
    }
    expect(home).toContain("Evidence from public sources. Intelligence for technology leaders.");
    expect(overview).toContain("Industrial competitor and technical intelligence services");
    expect(overview).toContain("€495");
    expect(overview).toContain("€3,995");
  });

  it("renders distinct evidence limits, report options and contextual next steps", () => {
    const pages = [CompetitorPage, ManufacturingPage, ExposurePage];
    const metadata = [competitorMetadata, manufacturingMetadata, exposureMetadata];
    pages.forEach((page, index) => {
      const service = focusedServices[index];
      const html = renderToStaticMarkup(createElement(page));
      expect(html.match(/<h1\b/g)).toHaveLength(1);
      expect(html).toContain(service.report.name);
      expect(html).toContain(service.report.price);
      expect(html).toContain(serviceContactHref(service).replaceAll("&", "&amp;"));
      expect(html).toContain(`/insights/${service.articleSlug}`);
      expect(html).toContain('/methodology');
      expect(html).toContain('/sample-report');
      expect(metadata[index].alternates?.canonical).toBe(`/services/${service.slug}`);
      expect(metadata[index].description).toBeTruthy();
      expect(metadata[index].openGraph).toBeTruthy();
    });
    expect(renderToStaticMarkup(createElement(ManufacturingPage))).toContain("not an on-site factory audit");
    expect(renderToStaticMarkup(createElement(ExposurePage))).toContain("not a penetration test or cybersecurity audit");
  });

  it("carries an allowlisted service focus into the contact form", () => {
    const html = renderToStaticMarkup(createElement(ContactForm, { initialService: focusedServices[0], initialReport: focusedServices[0].report.name }));
    expect(html).toContain("Enquiry focus:");
    expect(html).toContain('name="serviceFocus" value="industrial-competitor-analysis"');
    expect(html).toContain('selected=""');
  });

  it("includes exactly sixteen sitemap URLs with distinct change dates", () => {
    const urls = sitemap();
    expect(urls).toHaveLength(16);
    for (const service of focusedServices) expect(urls.some((item) => item.url.endsWith(`/services/${service.slug}`))).toBe(true);
    const methodology = urls.find((item) => item.url.endsWith("/methodology"));
    const manufacturing = urls.find((item) => item.url.endsWith("/services/manufacturing-capability-analysis"));
    expect(methodology?.lastModified).toBe("2026-09-22");
    expect(manufacturing?.lastModified).toBe("2026-09-23");
  });

  it("links each article to its service and only marks the materially revised article updated", async () => {
    for (const insight of insights) {
      const html = renderToStaticMarkup(await InsightPage({ params: Promise.resolve({ slug: insight.slug }) }));
      expect(html).toContain(`/services/${insight.relatedServiceSlug}`);
      expect(html).toContain(`dateTime="${insight.date}"`);
    }
    const images = insights.find((insight) => insight.slug === "what-public-images-can-reveal-about-industrial-capabilities");
    expect(images?.modifiedDate).toBe("2026-09-23");
    const imagesHtml = renderToStaticMarkup(await InsightPage({ params: Promise.resolve({ slug: images!.slug }) }));
    expect(imagesHtml).toContain("Fictional illustration");
    expect(imagesHtml).toContain("Alternative explanation");
    expect(imagesHtml).toContain("Not established");
    expect(imagesHtml).toContain('/sample-report');
    expect(imagesHtml).toContain("Updated");
    const meta = await insightMetadata({ params: Promise.resolve({ slug: images!.slug }) });
    expect(meta.openGraph).toMatchObject({ publishedTime: "2026-09-22", modifiedTime: "2026-09-23" });
    expect(insights.filter((insight) => insight.modifiedDate)).toHaveLength(1);
  });
});
