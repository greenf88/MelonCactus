import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { InsightCard } from "@/components/insight-card";
import { PageHeader } from "@/components/page-header";
import { insights } from "@/data/insights";
import { seoTopics } from "@/data/seo-topics";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = { title: "Practical AI Cases and Industrial Intelligence Insights", description: "Fictional practical AI cases for SMEs and evidence-led articles on industrial competitor analysis, technical claims and public-source research.", alternates: languageAlternates("/insights", "en") };

export default function InsightsPage() {
  const aiCases = insights.filter((insight) => insight.kind === "fictional-ai-case");
  const researchInsights = insights.filter((insight) => insight.kind !== "fictional-ai-case");
  return <><PageHeader eyebrow="Insights" title="Practical AI cases and evidence-led research." intro="Explore clearly labelled fictional AI cases for SMEs alongside industrial intelligence articles that distinguish plans, claims and proven results." breadcrumbs={[{ label: "Insights" }]} />
    <section className="section"><Container><div className="content-heading"><p className="eyebrow">Practical AI for SMEs</p><h2>Fictional cases with realistic boundaries.</h2><p>These scenarios explain how a bounded AI trial could work. They are not customer projects or measured results.</p></div><div className="insights-grid">{aiCases.map((insight) => <InsightCard insight={insight} key={insight.slug} />)}</div></Container></section>
    <section className="section section-muted"><Container><div className="content-heading"><p className="eyebrow">Industrial intelligence</p><h2>Better use of public evidence.</h2></div><div className="insights-grid">{researchInsights.map((insight) => <InsightCard insight={insight} key={insight.slug} />)}</div></Container></section>
    <section className="section"><Container><div className="content-heading"><p className="eyebrow">Research topics</p><h2>Begin with the decision.</h2></div><div className="seo-link-grid">{seoTopics.en.map((topic) => <article key={topic.slug}><h3><Link href={`/topics/${topic.slug}`}>{topic.title}</Link></h3><p>{topic.description}</p></article>)}</div></Container></section></>;
}
