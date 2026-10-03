import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { InsightCard } from "@/components/insight-card";
import { PageHeader } from "@/components/page-header";
import { insightsNl } from "@/data/insights-nl";
import { seoTopics } from "@/data/seo-topics";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Artikelen over industrieel concurrentieonderzoek",
  description: "Onderbouwde artikelen over industriële concurrentieanalyse, technische claims en openbaar bronnenonderzoek, met oog voor plannen en bewezen resultaten.",
  alternates: languageAlternates("/insights", "nl"),
};

export default function DutchInsightsPage() {
  return <>
    <PageHeader locale="nl" eyebrow="Artikelen" title="Betere vragen. Beter gebruik van openbaar bewijs." intro="Praktische inzichten voor industriële beslissers die capaciteiten, claims en concurrentiesignalen willen beoordelen zonder het bewijs te overschatten." breadcrumbs={[{ label: "Artikelen" }]} />
    <section className="section"><Container><div className="insights-grid">{insightsNl.map((insight) => <InsightCard insight={insight} locale="nl" key={insight.slug} />)}</div></Container></section>
    <section className="section section-muted"><Container><div className="content-heading"><p className="eyebrow">Onderzoeksthema’s</p><h2>Begin bij de beslissing.</h2></div><div className="seo-link-grid">{seoTopics.nl.map((topic) => <article key={topic.slug}><h3><Link href={`/nl/themas/${topic.slug}`}>{topic.title}</Link></h3><p>{topic.description}</p></article>)}</div></Container></section>
  </>;
}
