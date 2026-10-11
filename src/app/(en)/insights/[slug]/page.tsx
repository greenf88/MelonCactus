import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/buttons";
import { ArticleContent } from "@/components/article-content";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { StructuredData } from "@/components/structured-data";
import { getInsight, insights } from "@/data/insights";
import { siteConfig } from "@/config/site";
import { articleMetadataDescription, articleMetadataTitle, articleSummary } from "@/data/article-summaries";
import { seoTopics } from "@/data/seo-topics";
import { getServiceDetail } from "@/data/seo-services";
import { languageAlternates } from "@/lib/i18n";
import { articleReadingLabel } from "@/lib/reading-time";
import { breadcrumbSchema, entityIds, socialImageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return insights.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) return {};
  const url = `/insights/${insight.slug}`;
  const title = articleMetadataTitle("en", slug, insight.title);
  const description = articleMetadataDescription("en", slug, insight.description);
  const social = socialImageMetadata("en", "article", insight.title, slug);
  return { title, description, alternates: languageAlternates(url, "en"), openGraph: { type: "article", title, description, url, publishedTime: insight.date, modifiedTime: insight.modifiedDate ?? "2026-10-01", ...social.openGraph }, twitter: { title, description, ...social.twitter } };
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();
  const url = `${siteConfig.siteUrl}/insights/${insight.slug}`;
  const path = `/insights/${insight.slug}`;
  const topic = seoTopics.en.find((item) => item.articlePaths.includes(path));
  const related = insights.filter((item) => item.slug !== insight.slug && (topic?.articlePaths.includes(`/insights/${item.slug}`) ?? false)).slice(0, 2);
  return <article>
    <header className="article-header"><Container>
      <Breadcrumbs items={[{ label: "Insights", href: "/insights" }, { label: insight.title }]} />
      <p className="eyebrow">Industrial intelligence insight</p>
      <h1>{insight.title}</h1>
      <p className="page-intro">{insight.description}</p>
      <p className="article-meta"><span>Published <time dateTime={insight.date}>{insight.displayDate}</time></span>{insight.modifiedDate && insight.displayModifiedDate ? <span>Updated <time dateTime={insight.modifiedDate}>{insight.displayModifiedDate}</time></span> : null}<span>{articleReadingLabel(insight, "en")}</span><span>By <Link href="/about">MelonCactus</Link></span>{insight.sources?.length ? <span>Editorial contact: <Link href="/about#rick-groeneveld">Rick Groeneveld</Link></span> : null}</p>
    </Container></header>
    <Container className="article-layout">
      <aside className="article-aside"><p>In this article</p><ol>{insight.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`}>{section.heading}</a></li>)}{insight.sources?.length ? <li><a href="#section-sources">Sources</a></li> : null}</ol></aside>
      <div className="article-body">
        <section className="article-summary"><h2>In brief</h2><p>{articleSummary("en", insight.slug)}</p></section>
        <ArticleContent insight={insight} idPrefix="section" locale="en" />
        <section className="article-related"><h2>Continue exploring</h2><ul>{topic ? <><li><Link href={`/topics/${topic.slug}`}>{topic.title}</Link></li>{topic.servicePaths.slice(0, 1).map((servicePath) => <li key={servicePath}><Link href={servicePath}>{getServiceDetail("en", servicePath.split("/").at(-1) ?? "")?.title ?? "Public Profile Exposure Scan"}</Link></li>)}</> : null}{related.map((item) => <li key={item.slug}><Link href={`/insights/${item.slug}`}>{item.title}</Link></li>)}</ul></section>
        <div className="article-cta"><h2>Apply this discipline to a live question.</h2><p>Define the decision, the evidence standard and the uncertainty that matters most.</p><div className="button-row"><ButtonLink href="/contact">Discuss an Intelligence Requirement</ButtonLink><Link className="section-link" href="/methodology">Review the methodology →</Link></div></div>
      </div>
    </Container>
    <StructuredData data={breadcrumbSchema("en", [{ name: "Insights", path: "/insights" }, { name: insight.title, path }])} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "Article", "@id": `${url}#article`, headline: insight.title, description: insight.description, inLanguage: "en", datePublished: insight.date, dateModified: insight.modifiedDate ?? "2026-10-01", mainEntityOfPage: url, image: socialImageMetadata("en", "article", insight.title, insight.slug).openGraph.images[0].url, author: { "@id": entityIds.organization }, publisher: { "@id": entityIds.organization }, ...(insight.sources?.length ? { citation: insight.sources.map((source) => source.url) } : {}) }} />
  </article>;
}
