import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { InsightCard } from "@/components/insight-card";
import { PageHeader } from "@/components/page-header";
import { insightsNl } from "@/data/insights-nl";
import { seoTopics } from "@/data/seo-topics";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Praktische AI-handleidingen en industrieel onderzoek",
  description: "Praktische AI-handleidingen, fictieve cases en onderbouwde artikelen over industriële concurrentieanalyse, technische claims en openbaar bronnenonderzoek.",
  alternates: languageAlternates("/insights", "nl"),
};

export default function DutchInsightsPage() {
  const practicalAiInsights = insightsNl.filter((insight) => insight.kind === "fictional-ai-case" || insight.kind === "practical-ai-guide");
  const researchInsights = insightsNl.filter((insight) => insight.kind !== "fictional-ai-case" && insight.kind !== "practical-ai-guide");
  return <>
    <PageHeader locale="nl" eyebrow="Artikelen" title="Praktische AI-handleidingen en onderbouwd onderzoek." intro="Bekijk praktische handleidingen, duidelijk gemarkeerde fictieve AI-cases voor het mkb en artikelen die plannen, claims en bewezen resultaten zorgvuldig van elkaar onderscheiden." breadcrumbs={[{ label: "Artikelen" }]} />
    <section className="section"><Container><div className="content-heading"><p className="eyebrow">Praktische AI voor het mkb</p><h2>Handleidingen en fictieve cases met duidelijke grenzen.</h2><p>De handleidingen geven een toetsbare aanpak. De duidelijk gemarkeerde scenario’s zijn geen klantopdrachten of gemeten resultaten.</p></div><div className="insights-grid">{practicalAiInsights.map((insight) => <InsightCard insight={insight} locale="nl" key={insight.slug} />)}</div></Container></section>
    <section className="section section-muted"><Container><div className="content-heading"><p className="eyebrow">Industrieel onderzoek</p><h2>Beter gebruik van openbaar bewijs.</h2></div><div className="insights-grid">{researchInsights.map((insight) => <InsightCard insight={insight} locale="nl" key={insight.slug} />)}</div></Container></section>
    <section className="section"><Container><div className="content-heading"><p className="eyebrow">Onderzoeksthema’s</p><h2>Begin bij de beslissing.</h2></div><div className="seo-link-grid">{seoTopics.nl.map((topic) => <article key={topic.slug}><h3><Link href={`/nl/themas/${topic.slug}`}>{topic.title}</Link></h3><p>{topic.description}</p></article>)}</div></Container></section>
  </>;
}
