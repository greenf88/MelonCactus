import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/i18n";

const base = siteConfig.siteUrl.replace(/\/$/, "");

export const entityIds = {
  organization: `${base}/#organization`,
  website: `${base}/#website`,
  person: `${base}/about#rick-groeneveld`,
} as const;

export function absoluteUrl(path: string) {
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function entityGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": entityIds.organization,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        description: siteConfig.description,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/icon.svg"),
        email: siteConfig.businessEmail,
        telephone: siteConfig.businessPhoneE164,
        address: { "@type": "PostalAddress", ...siteConfig.address },
        identifier: [
          { "@type": "PropertyValue", propertyID: "KvK", value: siteConfig.registrationNumber },
          { "@type": "PropertyValue", propertyID: "VAT", value: siteConfig.vatId },
        ],
        sameAs: [siteConfig.linkedInCompanyUrl],
      },
      {
        "@type": "WebSite",
        "@id": entityIds.website,
        name: siteConfig.name,
        url: absoluteUrl("/"),
        description: siteConfig.description,
        inLanguage: ["en", "nl-NL"],
        publisher: { "@id": entityIds.organization },
      },
    ],
  };
}

export function personSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": entityIds.person,
    name: siteConfig.contactPerson,
    description: locale === "nl" ? "Contactpersoon achter MelonCactus met een achtergrond in technisch projectmanagement in een industriële omgeving." : "Contact person behind MelonCactus with a background in technical project management in an industrial setting.",
    url: entityIds.person,
    worksFor: { "@id": entityIds.organization },
  };
}

export function breadcrumbSchema(locale: Locale, entries: readonly { name: string; path: string }[]) {
  const home = locale === "nl" ? { name: "Startpagina", path: "/nl" } : { name: "Home", path: "/" };
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [home, ...entries].map((entry, index) => ({
      "@type": "ListItem", position: index + 1, name: entry.name, item: absoluteUrl(entry.path),
    })),
  };
}

export function serviceSchema(input: {
  path: string;
  name: string;
  description: string;
  locale: Locale;
  price?: number;
  priceNote: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(input.path)}#service`,
    name: input.name,
    description: input.description,
    serviceType: input.name,
    inLanguage: input.locale === "nl" ? "nl-NL" : "en",
    url: absoluteUrl(input.path),
    provider: { "@id": entityIds.organization },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(input.path),
      priceCurrency: "EUR",
      ...(input.price === undefined ? {} : { price: input.price }),
      description: input.priceNote,
      ...(input.price === undefined ? {} : { priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        valueAddedTaxIncluded: false,
        price: input.price,
      } }),
    },
  };
}

export function socialImageUrl(locale: Locale, kind: "default" | "service" | "article", slug?: string) {
  return absoluteUrl(`/social/${locale}/${kind}/${slug ?? "site"}`);
}

export function socialImageMetadata(locale: Locale, kind: "default" | "service" | "article", alt: string, slug?: string) {
  const url = socialImageUrl(locale, kind, slug);
  return {
    openGraph: { images: [{ url, width: 1200, height: 630, alt }] },
    twitter: { card: "summary_large_image" as const, images: [{ url, alt }] },
  };
}
