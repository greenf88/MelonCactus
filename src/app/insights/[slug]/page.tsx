import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/buttons";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { StructuredData } from "@/components/structured-data";
import { getInsight, insights } from "@/data/insights";
import { siteConfig } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return insights.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) return {};
  const url = `/insights/${insight.slug}`;
  return { title: insight.title, description: insight.description, alternates: { canonical: url }, openGraph: { type: "article", title: insight.title, description: insight.description, url, publishedTime: insight.date }, twitter: { card: "summary", title: insight.title, description: insight.description } };
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();
  const url = `${siteConfig.siteUrl}/insights/${insight.slug}`;
  return <article><header className="article-header"><Container><Breadcrumbs items={[{ label: "Insights", href: "/insights" }, { label: insight.title }]} /><p className="eyebrow">Industrial intelligence insight</p><h1>{insight.title}</h1><p className="page-intro">{insight.description}</p><p className="article-meta"><time dateTime={insight.date}>{insight.displayDate}</time><span>{insight.readingTime}</span></p></Container></header><Container className="article-layout"><aside className="article-aside"><p>In this article</p><ol>{insight.sections.map((section,index) => <li key={section.heading}><a href={`#section-${index+1}`}>{section.heading}</a></li>)}</ol></aside><div className="article-body">{insight.sections.map((section,index) => <section id={`section-${index+1}`} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}</section>)}<div className="article-cta"><h2>Apply this discipline to a live question.</h2><p>Define the decision, the evidence standard and the uncertainty that matters most.</p><div className="button-row"><ButtonLink href="/contact">Request a Report</ButtonLink><Link className="section-link" href="/methodology">Review the methodology →</Link></div></div></div></Container><StructuredData data={{ "@context": "https://schema.org", "@type": "Article", headline: insight.title, description: insight.description, datePublished: insight.date, dateModified: insight.date, mainEntityOfPage: url, author: { "@type": "Organization", name: siteConfig.name }, publisher: { "@type": "Organization", name: siteConfig.name } }} /></article>;
}

