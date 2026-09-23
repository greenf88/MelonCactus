import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/buttons";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import { StructuredData } from "@/components/structured-data";
import { getInsightNl, insightsNl } from "@/data/insights-nl";
import { siteConfig } from "@/config/site";
import { counterpartPath, languageAlternates } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return insightsNl.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsightNl(slug);
  if (!insight) return {};
  const path = `/nl/artikelen/${slug}`;
  const enPath = counterpartPath(path);
  if (!enPath) throw new Error(`Missing English counterpart for ${path}`);
  return {
    title: insight.title,
    description: insight.description,
    alternates: languageAlternates(enPath, "nl"),
    openGraph: { type: "article", title: insight.title, description: insight.description, url: path, locale: "nl_NL", publishedTime: insight.date },
    twitter: { card: "summary", title: insight.title, description: insight.description },
  };
}

export default async function DutchInsightPage({ params }: Props) {
  const { slug } = await params;
  const insight = getInsightNl(slug);
  if (!insight) notFound();
  const url = `${siteConfig.siteUrl}/nl/artikelen/${slug}`;
  return <article>
    <header className="article-header"><Container>
      <Breadcrumbs locale="nl" items={[{ label: "Artikelen", href: "/nl/artikelen" }, { label: insight.title }]} />
      <p className="eyebrow">Artikel over industriële inlichtingen</p>
      <h1>{insight.title}</h1><p className="page-intro">{insight.description}</p>
      <p className="article-meta"><time dateTime={insight.date}>{insight.displayDate}</time><span>{insight.readingTime}</span></p>
    </Container></header>
    <Container className="article-layout"><aside className="article-aside"><p>In dit artikel</p><ol>{insight.sections.map((section, index) => <li key={section.heading}><a href={`#sectie-${index + 1}`}>{section.heading}</a></li>)}</ol></aside>
      <div className="article-body">{insight.sections.map((section, index) => <section id={`sectie-${index + 1}`} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}</section>)}
        <div className="article-cta"><h2>Gebruik deze aanpak voor uw actuele vraag.</h2><p>Bepaal de beslissing, de bewijsstandaard en de onzekerheid die ertoe doet.</p><div className="button-row"><ButtonLink href="/nl/contact">Rapport aanvragen</ButtonLink><Link className="section-link" href="/nl/werkwijze">Bekijk de werkwijze →</Link></div></div>
      </div>
    </Container>
    <StructuredData data={{ "@context": "https://schema.org", "@type": "Article", headline: insight.title, description: insight.description, inLanguage: "nl-NL", datePublished: insight.date, dateModified: insight.date, mainEntityOfPage: url, author: { "@type": "Organization", name: siteConfig.name }, publisher: { "@type": "Organization", name: siteConfig.name } }} />
  </article>;
}
