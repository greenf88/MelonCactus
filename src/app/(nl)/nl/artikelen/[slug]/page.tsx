import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/buttons";
import { ArticleContent } from "@/components/article-content";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { StructuredData } from "@/components/structured-data";
import { getInsightNl, insightsNl } from "@/data/insights-nl";
import { siteConfig } from "@/config/site";
import { articleMetadataDescription, articleMetadataTitle, articleSummary } from "@/data/article-summaries";
import { seoTopics } from "@/data/seo-topics";
import { getServiceDetail } from "@/data/seo-services";
import { counterpartPath, languageAlternates } from "@/lib/i18n";
import { articleReadingLabel } from "@/lib/reading-time";
import { breadcrumbSchema, entityIds, socialImageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return insightsNl.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsightNl(slug);
  if (!insight) return {};
  const path = `/nl/artikelen/${slug}`;
  const enPath = counterpartPath(path);
  if (!enPath) throw new Error(`Missing English counterpart for ${path}`);
  const title = articleMetadataTitle("nl", slug, insight.title);
  const description = articleMetadataDescription("nl", slug, insight.description);
  const social = socialImageMetadata("nl", "article", insight.title, slug);
  return {
    title,
    description,
    alternates: languageAlternates(enPath, "nl"),
    openGraph: { type: "article", title, description, url: path, locale: "nl_NL", publishedTime: insight.date, modifiedTime: "2026-10-01", ...social.openGraph },
    twitter: { title, description, ...social.twitter },
  };
}

export default async function DutchInsightPage({ params }: Props) {
  const { slug } = await params;
  const insight = getInsightNl(slug);
  if (!insight) notFound();
  const url = `${siteConfig.siteUrl}/nl/artikelen/${slug}`;
  const path = `/nl/artikelen/${slug}`;
  const topic = seoTopics.nl.find((item) => item.articlePaths.includes(path));
  const related = insightsNl.filter((item) => item.slug !== insight.slug && (topic?.articlePaths.includes(`/nl/artikelen/${item.slug}`) ?? false)).slice(0, 2);
  return <article>
    <header className="article-header"><Container>
      <Breadcrumbs locale="nl" items={[{ label: "Artikelen", href: "/nl/artikelen" }, { label: insight.title }]} />
      <p className="eyebrow">Artikel over industrieel onderzoek</p>
      <h1>{insight.title}</h1><p className="page-intro">{insight.description}</p>
      <p className="article-meta"><time dateTime={insight.date}>{insight.displayDate}</time><span>{articleReadingLabel(insight, "nl")}</span><span>Door <Link href="/nl/over-ons">MelonCactus</Link></span></p>
    </Container></header>
    <Container className="article-layout"><aside className="article-aside"><p>In dit artikel</p><ol>{insight.sections.map((section, index) => <li key={section.heading}><a href={`#sectie-${index + 1}`}>{section.heading}</a></li>)}</ol></aside>
      <div className="article-body"><section className="article-summary"><h2>Kort samengevat</h2><p>{articleSummary("nl", insight.slug)}</p></section><ArticleContent insight={insight} idPrefix="sectie" />
        <section className="article-related"><h2>Verder lezen</h2><ul>{topic ? <><li><Link href={`/nl/themas/${topic.slug}`}>{topic.title}</Link></li>{topic.servicePaths.slice(0, 1).map((servicePath) => <li key={servicePath}><Link href={servicePath}>{getServiceDetail("nl", servicePath.split("/").at(-1) ?? "")?.title ?? "Openbare-informatiescan"}</Link></li>)}</> : null}{related.map((item) => <li key={item.slug}><Link href={`/nl/artikelen/${item.slug}`}>{item.title}</Link></li>)}</ul></section>
        <div className="article-cta"><h2>Gebruik deze aanpak voor uw actuele vraag.</h2><p>Bepaal de beslissing, de bewijsstandaard en de onzekerheid die ertoe doet.</p><div className="button-row"><ButtonLink href="/nl/contact">Bespreek uw onderzoeksvraag</ButtonLink><Link className="section-link" href="/nl/werkwijze">Bekijk de werkwijze →</Link></div></div>
      </div>
    </Container>
    <StructuredData data={breadcrumbSchema("nl", [{ name: "Artikelen", path: "/nl/artikelen" }, { name: insight.title, path }])} />
    <StructuredData data={{ "@context": "https://schema.org", "@type": "Article", "@id": `${url}#article`, headline: insight.title, description: insight.description, inLanguage: "nl-NL", datePublished: insight.date, dateModified: "2026-10-01", mainEntityOfPage: url, image: socialImageMetadata("nl", "article", insight.title, insight.slug).openGraph.images[0].url, author: { "@id": entityIds.organization }, publisher: { "@id": entityIds.organization } }} />
  </article>;
}
