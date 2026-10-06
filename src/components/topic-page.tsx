import Link from "next/link";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { StructuredData } from "@/components/structured-data";
import { getInsight } from "@/data/insights";
import { getInsightNl } from "@/data/insights-nl";
import { getServiceDetail } from "@/data/seo-services";
import type { Topic } from "@/data/seo-topics";
import type { Locale } from "@/lib/i18n";
import { breadcrumbSchema } from "@/lib/seo";

export function TopicPage({ topic, locale }: { topic: Topic; locale: Locale }) {
  const nl = locale === "nl";
  const path = `${nl ? "/nl/themas" : "/topics"}/${topic.slug}`;
  return <>
    <PageHeader locale={locale} eyebrow={topic.eyebrow} title={topic.title} intro={topic.intro} breadcrumbs={[{ label: topic.title }]} />
    <section className="section"><Container className="split-content"><div><p className="eyebrow">{nl ? "Begrip" : "Definition"}</p><h2>{nl ? "Wat dit onderzoek wel en niet is" : "What this research does—and does not—establish"}</h2></div><div className="prose-block"><p>{topic.definition}</p><p><strong>{nl ? "Grenzen van het bewijs:" : "Evidence limits:"}</strong> {topic.evidenceLimit}</p></div></Container></section>
    <section className="section section-muted"><Container className="split-content"><div><p className="eyebrow">{nl ? "Beslissingen" : "Decisions"}</p><h2>{nl ? "Wanneer is dit relevant?" : "When is this useful?"}</h2></div><div className="prose-block"><ul>{topic.decisions.map((item) => <li key={item}>{item}</li>)}</ul></div></Container></section>
    <section className="section"><Container className="split-content"><div><p className="eyebrow">{nl ? "Werkwijze" : "Approach"}</p><h2>{nl ? "Een toetsbare onderzoeksvraag" : "A question that can be tested"}</h2></div><div className="prose-block"><p>{topic.method}</p><p>{topic.application}</p></div></Container></section>
    <section className="section section-muted"><Container><div className="content-heading"><p className="eyebrow">{nl ? "Verdieping" : "Further reading"}</p><h2>{nl ? "Lees de analyse en bekijk de passende opdracht." : "Read the analysis and consider the right scope."}</h2></div><div className="seo-link-grid">{topic.articlePaths.map((articlePath) => { const slug = articlePath.split("/").at(-1) ?? ""; const article = nl ? getInsightNl(slug) : getInsight(slug); if (!article) throw new Error(`Missing article: ${articlePath}`); return <article key={articlePath}><h3><Link href={articlePath}>{article.title}</Link></h3><p>{article.description}</p></article>; })}</div><p>{topic.servicePaths.map((servicePath) => { const slug = servicePath.split("/").at(-1) ?? ""; const label = getServiceDetail(locale, slug)?.title ?? (nl ? "Openbare-informatiescan" : "Public Profile Exposure Scan"); return <Link className="section-link" href={servicePath} key={servicePath}>{label} → </Link>; })}</p><p><Link className="section-link" href={topic.examplePath}>{nl ? "Bekijk een fictieve voorbeeldcase" : "View a fictional example case"} →</Link></p></Container></section>
    <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">{nl ? "Uw vraag" : "Your question"}</p><h2>{nl ? "Welke beslissing wilt u onderbouwen?" : "Which decision needs evidence?"}</h2><p>{nl ? "Wij beoordelen eerst de reikwijdte, bronnen, prijs en planning." : "We review scope, sources, fee and timing before an engagement is agreed."}</p></div><ButtonLink href={nl ? "/nl/contact" : "/contact"}>{nl ? "Bespreek uw vraag" : "Discuss your question"}</ButtonLink></Container></section>
    <StructuredData data={breadcrumbSchema(locale, [{ name: topic.title, path }])} />
  </>;
}
