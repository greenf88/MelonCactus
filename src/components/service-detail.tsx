import Link from "next/link";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { StructuredData } from "@/components/structured-data";
import type { ServiceDetail } from "@/data/seo-services";
import { getInsight } from "@/data/insights";
import { getInsightNl } from "@/data/insights-nl";
import type { Locale } from "@/lib/i18n";
import { breadcrumbSchema, serviceSchema } from "@/lib/seo";

export function ServiceDetailPage({ detail, locale }: { detail: ServiceDetail; locale: Locale }) {
  const nl = locale === "nl";
  const overviewPath = nl ? "/nl/diensten" : "/services";
  const path = `${overviewPath}/${detail.slug}`;
  const contactPath = nl ? "/nl/contact" : "/contact";
  return <>
    <PageHeader locale={locale} eyebrow={detail.eyebrow} title={detail.title} intro={detail.question} breadcrumbs={[{ label: nl ? "Diensten" : "Services", href: overviewPath }, { label: detail.title }]} />
    <section className="section"><Container className="split-content">
      <div><p className="eyebrow">{nl ? "Wanneer passend" : "When it fits"}</p><h2>{nl ? "Een duidelijke beslisvraag bepaalt de opdracht." : "The decision defines the assignment."}</h2></div>
      <div className="prose-block"><p>{detail.description}</p><h3>{nl ? "Typische toepassingen" : "Typical applications"}</h3><ul>{detail.applications.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </Container></section>
    <section className="section section-muted"><Container className="split-content">
      <div><p className="eyebrow">{nl ? "Resultaat" : "Deliverable"}</p><h2>{nl ? "Wat u ontvangt" : "What you receive"}</h2></div>
      <div className="prose-block"><ul>{detail.deliverables.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>{nl ? "Vooraf nodig:" : "To begin:"}</strong> {detail.needed}</p></div>
    </Container></section>
    <section className="section"><Container className="split-content">
      <div><p className="eyebrow">{nl ? "Werkwijze en grenzen" : "Method and limits"}</p><h2>{nl ? "Sterk bewijs, zichtbare onzekerheid." : "Strong evidence, visible uncertainty."}</h2></div>
      <div className="prose-block"><p>{detail.method}</p><p><strong>{nl ? "Buiten deze opdracht:" : "Outside this scope:"}</strong> {detail.boundary}</p><p>{detail.timing}</p><p><Link className="section-link" href={detail.topicPath}>{nl ? "Lees meer over dit onderzoeksthema" : "Explore this research topic"} →</Link></p></div>
    </Container></section>
    <section className="section section-muted"><Container>
      <div className="content-heading"><p className="eyebrow">{nl ? "Verder lezen" : "Further reading"}</p><h2>{nl ? "Vergelijk bewijs met claims." : "Compare evidence with claims."}</h2></div>
      <div className="seo-link-grid">{detail.relatedArticlePaths.map((articlePath) => {
        const slug = articlePath.split("/").at(-1) ?? "";
        const article = nl ? getInsightNl(slug) : getInsight(slug);
        if (!article) throw new Error(`Missing article for ${articlePath}`);
        return <article key={articlePath}><h3><Link href={articlePath}>{article.title}</Link></h3><p>{article.description}</p></article>;
      })}</div>
      <p><Link className="section-link" href={detail.examplePath}>{nl ? "Bekijk een fictief voorbeeld" : "View a fictional example"} →</Link></p>
    </Container></section>
    <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">{nl ? "Bespreek uw vraag" : "Discuss the question"}</p><h2>{nl ? "Begin met de beslissing en de onzekerheid." : "Start with the decision and uncertainty."}</h2><p>{nl ? "Een formulieraanvraag is geen opdracht. Wij beoordelen eerst scope, prijs, bronnen en planning." : "A form enquiry is not an engagement. We review scope, fee, sources and timing first."}</p></div><ButtonLink href={`${contactPath}?report=${encodeURIComponent(detail.report.formValue ?? detail.report.name)}`}>{nl ? "Bespreek deze opdracht" : "Discuss this assessment"}</ButtonLink></Container></section>
    <StructuredData data={breadcrumbSchema(locale, [{ name: nl ? "Diensten" : "Services", path: overviewPath }, { name: detail.title, path }])} />
    <StructuredData data={serviceSchema({ path, name: detail.title, description: detail.description, locale, priceNote: detail.timing })} />
  </>;
}
