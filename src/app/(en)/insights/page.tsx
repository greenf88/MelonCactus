import type { Metadata } from "next";
import { Container } from "@/components/container";
import { InsightCard } from "@/components/insight-card";
import { PageHeader } from "@/components/page-header";
import { insights } from "@/data/insights";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = { title: "Insights", description: "Practical analysis of industrial competitive intelligence, technical evidence and public-source research.", alternates: languageAlternates("/insights", "en") };

export default function InsightsPage() {
  return <><PageHeader eyebrow="Insights" title="Better questions. Better use of public evidence." intro="Practical guidance for industrial leaders who need to assess capabilities, claims and competitive signals without overstating what the evidence proves." breadcrumbs={[{ label: "Insights" }]} /><section className="section"><Container><div className="insights-grid">{insights.map((insight) => <InsightCard insight={insight} key={insight.slug} />)}</div></Container></section></>;
}
