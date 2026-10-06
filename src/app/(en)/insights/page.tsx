import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { InsightCard } from "@/components/insight-card";
import { PageHeader } from "@/components/page-header";
import { insights } from "@/data/insights";
import { seoTopics } from "@/data/seo-topics";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = { title: "Industrial Intelligence Insights", description: "Evidence-led articles on industrial competitor analysis, technical claims and public-source research, with clear distinctions between plans and proven results.", alternates: languageAlternates("/insights", "en") };

export default function InsightsPage() {
  return <><PageHeader eyebrow="Insights" title="Better questions. Better use of public evidence." intro="Practical guidance for industrial leaders who need to assess capabilities, claims and competitive signals without overstating what the evidence proves." breadcrumbs={[{ label: "Insights" }]} /><section className="section"><Container><div className="insights-grid">{insights.map((insight) => <InsightCard insight={insight} key={insight.slug} />)}</div></Container></section><section className="section section-muted"><Container><div className="content-heading"><p className="eyebrow">Research topics</p><h2>Begin with the decision.</h2></div><div className="seo-link-grid">{seoTopics.en.map((topic) => <article key={topic.slug}><h3><Link href={`/topics/${topic.slug}`}>{topic.title}</Link></h3><p>{topic.description}</p></article>)}</div></Container></section></>;
}
