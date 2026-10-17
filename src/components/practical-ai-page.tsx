import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { MethodStep } from "@/components/method-step";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { enquiryHref } from "@/config/enquiry-topics";
import { practicalAiNetherlands } from "@/config/practical-ai-netherlands";
import { aiPaths, nationalAiPaths, practicalAi } from "@/config/practical-ai";
import { languageAlternates, type Locale } from "@/lib/i18n";
import { breadcrumbSchema, serviceSchema, socialImageMetadata } from "@/lib/seo";

export type AiServiceArea = "twente" | "netherlands";

export function practicalAiMetadata(locale: Locale, area: AiServiceArea = "twente"): Metadata {
  const content = area === "netherlands" ? practicalAiNetherlands : practicalAi;
  const paths = area === "netherlands" ? nationalAiPaths : aiPaths;
  const c = content[locale];
  const slug = area === "netherlands"
    ? (locale === "nl" ? "ai-hulp-nederland" : "ai-help-netherlands")
    : (locale === "nl" ? "ai-hulp-twente" : "ai-help-twente");
  const social = socialImageMetadata(locale, "service", c.title, slug);
  return {
    title: c.title, description: c.description,
    alternates: languageAlternates(paths.en, locale),
    openGraph: { title: c.title, description: c.description, url: paths[locale], ...social.openGraph },
    twitter: { ...social.twitter, title: c.title, description: c.description },
  };
}

export function PracticalAiPage({ locale, area = "twente" }: { locale: Locale; area?: AiServiceArea }) {
  const content = area === "netherlands" ? practicalAiNetherlands : practicalAi;
  const paths = area === "netherlands" ? nationalAiPaths : aiPaths;
  const relatedPath = area === "netherlands" ? aiPaths[locale] : nationalAiPaths[locale];
  const c = content[locale], nl = locale === "nl";
  return <>
    <PageHeader locale={locale} eyebrow={c.eyebrow} title={c.h1} intro={c.intro}
      breadcrumbs={[{ label: nl ? "Diensten" : "Services", href: nl ? "/nl/diensten" : "/services" }, { label: c.title }]} />
    <section className="section ai-introduction"><Container className="split-content">
      <div className="prose-block"><p>{c.audience}</p><ButtonLink href={enquiryHref(locale, "ai-guidance")}>{c.primary}</ButtonLink></div>
      <div><h2>{c.questionTitle}</h2><ul className="ai-questions">{c.questions.map(q => <li key={q}>{q}</li>)}</ul></div>
    </Container></section>
    <section className="section section-muted"><Container>
      <SectionHeading eyebrow={nl ? "Mogelijkheden" : "Possibilities"} title={c.examplesTitle} intro={c.examplesIntro} />
      <div className="ai-example-grid">{c.examples.map(([title, text]) => <article className="service-entrance" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
    </Container></section>
    <section className="section" id={nl ? "beginnen" : "get-started"}><Container>
      <SectionHeading eyebrow={nl ? "Samen aan de slag" : "Working together"} title={c.startTitle} />
      <div className="ai-offer-grid">{c.offers.map(offer => <article className="service-card ai-offer" key={offer.topic}>
        <h3>{offer.title}</h3><p>{offer.text}</p><p>{offer.outcome}</p><ButtonLink variant="secondary" href={enquiryHref(locale, offer.topic)}>{offer.cta}</ButtonLink>
      </article>)}</div>
    </Container></section>
    <section className="section section-muted"><Container>
      <SectionHeading eyebrow={nl ? "Werkwijze" : "Our approach"} title={c.processTitle} intro={c.processIntro} />
      <ol className="ai-process">{c.steps.map(([title, description], index) => <li key={title}><MethodStep number={String(index + 1).padStart(2, "0")} title={title} description={description} /></li>)}</ol>
    </Container></section>
    <section className="section"><Container className="split-content">
      <div><p className="eyebrow">{nl ? "Kosten en afspraken" : "Costs and scope"}</p><h2>{c.pricingTitle}</h2></div>
      <div className="prose-block"><p>{c.pricing}</p><p>{c.costs}</p></div>
    </Container></section>
    <section className="section section-muted"><Container className="split-content">
      <div><p className="eyebrow">{nl ? "Zorgvuldig werken" : "Working responsibly"}</p><h2>{c.privacyTitle}</h2></div>
      <div className="prose-block"><p>{c.privacy}</p><p>{c.privacyLimit}</p><p>{c.confidentiality}</p><p><Link href={nl ? "/nl/privacy" : "/privacy"}>{nl ? "Privacy bij contact en websitegebruik" : "Privacy when contacting us and using the website"}</Link></p></div>
    </Container></section>
    <section className="section"><Container className="vacancy-panel">
      <p className="eyebrow">{nl ? "Taken uit een vacature" : "Tasks from a vacancy"}</p><h2>{c.vacancyTitle}</h2><p>{c.vacancy}</p>
      <ButtonLink variant="secondary" href={enquiryHref(locale, "vacancy-tasks")}>{c.vacancyCta}</ButtonLink>
    </Container></section>
    <section className="section section-muted"><Container>
      <SectionHeading eyebrow="FAQ" title={c.faqTitle} />
      <div className="faq-grid">{c.faq.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </Container></section>
    <section className="closing-cta"><Container className="closing-inner"><div><h2>{c.closing}</h2><p>{c.closingText}</p></div><ButtonLink href={enquiryHref(locale, "ai-guidance")}>{c.primary}</ButtonLink></Container></section>
    <Container className="ai-related-links">
      <p><Link href={relatedPath}>{c.regionLink}</Link></p>
      <p><Link href={nl ? "/nl/diensten#onderzoek" : "/services#research"}>{c.researchLink}</Link></p>
    </Container>
    <StructuredData data={{
      ...serviceSchema({path: paths[locale], name: c.title, description: c.intro, locale, priceNote: c.pricing}),
      areaServed: area === "netherlands"
        ? { "@type": "Country", name: "Netherlands" }
        : { "@type": "Place", name: "Twente" },
    }} />
    <StructuredData data={breadcrumbSchema(locale, [{ name: nl ? "Diensten" : "Services", path: nl ? "/nl/diensten" : "/services" }, { name: c.title, path: paths[locale] }])} />
    <StructuredData data={{"@context":"https://schema.org","@type":"FAQPage",mainEntity:c.faq.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}}))}} />
  </>;
}
