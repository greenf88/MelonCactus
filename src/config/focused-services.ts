import { reportOptions } from "@/config/site";

export const focusedServices = [
  {
    slug: "industrial-competitor-analysis",
    title: "Industrial competitor analysis",
    summary: "Test what public evidence establishes about a competitor’s products, capabilities, partnerships and direction.",
    report: reportOptions[1],
    articleSlug: "what-is-industrial-competitive-intelligence",
    articleTitle: "What industrial competitive intelligence involves",
  },
  {
    slug: "manufacturing-capability-analysis",
    title: "Manufacturing capability analysis",
    summary: "Assess visible equipment, process and expansion signals without mistaking them for proven output.",
    report: reportOptions[2],
    articleSlug: "what-public-images-can-reveal-about-industrial-capabilities",
    articleTitle: "What public industrial images can reveal",
  },
  {
    slug: "public-information-exposure-review",
    title: "Public-information exposure review",
    summary: "See what an outside observer could piece together from lawful public disclosures.",
    report: reportOptions[2],
    articleSlug: "how-industrial-companies-expose-competitive-information",
    articleTitle: "How public disclosures combine",
  },
] as const;

export type FocusedService = (typeof focusedServices)[number];

export function getFocusedService(slug: string) {
  return focusedServices.find((service) => service.slug === slug);
}

export function serviceContactHref(service: FocusedService) {
  const query = new URLSearchParams({ service: service.slug, report: service.report.name });
  return `/contact?${query.toString()}`;
}
