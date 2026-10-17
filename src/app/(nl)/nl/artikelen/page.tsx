import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { InsightCard } from "@/components/insight-card";
import { PageHeader } from "@/components/page-header";
import { insightsNl } from "@/data/insights-nl";
import { seoTopics } from "@/data/seo-topics";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Fictieve AI-cases en artikelen over industrieel onderzoek",
  description: "Fictieve praktijkcases over AI voor het mkb en onderbouwde artikelen over industriële concurrentieanalyse, technische claims en openbaar bronnenonderzoek.",
  alternates: languageAlternates("/insights", "nl"),
};

export default function DutchInsightsPage() {
  const aiCases = insightsNl.filter((insight) => insight.kind === "fictional-ai-case");
  const researchInsights = insightsNl.filter((insight) => insight.kind !== "fictional-ai-case");
  return <>
    <PageHeader locale="nl" eyebrow="Artikelen" title="Praktische AI-cases en onderbouwd onderzoek." intro="Bekijk duidelijk gemarkeerde fictieve AI-cases voor het mkb en artikelen die plannen, claims en bewezen resultaten zorgvuldig van elkaar onderscheiden." breadcrumbs={[{ label: "Artikelen" }]} />
    <section className="section"><Container><div className="content-heading"><p className="eyebrow">Praktische AI voor het mkb</p><h2>Fictieve cases met realistische grenzen.</h2><p>Deze scenario’s leggen uit hoe een afgebakende AI-proef kan werken. Het zijn geen klantopdrachten of gemeten resultaten.</p></div><div className="insights-grid">{aiCases.map((insight) => <InsightCard insight={insight} locale="nl" key={insight.slug} />)}</div></Container></section>
    <section className="section section-muted"><Container><div className="content-heading"><p className="eyebrow">Industrieel onderzoek</p><h2>Beter gebruik van openbaar bewijs.</h2></div><div className="insights-grid">{researchInsights.map((insight) => <InsightCard insight={insight} locale="nl" key={insight.slug} />)}</div></Container></section>
    <section className="section"><Container><div className="content-heading"><p className="eyebrow">Onderzoeksthema’s</p><h2>Begin bij de beslissing.</h2></div><div className="seo-link-grid">{seoTopics.nl.map((topic) => <article key={topic.slug}><h3><Link href={`/nl/themas/${topic.slug}`}>{topic.title}</Link></h3><p>{topic.description}</p></article>)}</div></Container></section>
  </>;
}
