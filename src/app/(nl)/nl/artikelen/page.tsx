import type { Metadata } from "next";
import { Container } from "@/components/container";
import { InsightCard } from "@/components/insight-card";
import { PageHeader } from "@/components/page-header";
import { insightsNl } from "@/data/insights-nl";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Artikelen",
  description: "Praktische analyses over industriële concurrentie-informatie, technisch bewijs en onderzoek in openbare bronnen.",
  alternates: languageAlternates("/insights", "nl"),
};

export default function DutchInsightsPage() {
  return <>
    <PageHeader locale="nl" eyebrow="Artikelen" title="Betere vragen. Beter gebruik van openbaar bewijs." intro="Praktische inzichten voor industriële beslissers die capaciteiten, claims en concurrentiesignalen willen beoordelen zonder het bewijs te overschatten." breadcrumbs={[{ label: "Artikelen" }]} />
    <section className="section"><Container><div className="insights-grid">{insightsNl.map((insight) => <InsightCard insight={insight} locale="nl" key={insight.slug} />)}</div></Container></section>
  </>;
}
