import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import { ArticleVisual } from "@/components/article-visual";
import type { Insight, InsightParagraph } from "@/data/insights";
import type { Locale } from "@/lib/i18n";

function ArticleMarkdown({ text }: { text: string }) {
  return <ReactMarkdown components={{
    a: ({ href, children }) => {
      if (!href || href.startsWith("//") || (!href.startsWith("/") && !href.startsWith("https://"))) return <span>{children}</span>;
      return <a href={href} rel={href.startsWith("https://") ? "noopener noreferrer" : undefined}>{children}</a>;
    },
    img: () => null,
  }}>{text}</ReactMarkdown>;
}

function sourceDateLabel(source: NonNullable<Insight["sources"]>[number], locale: Locale) {
  if (!source.date || !source.dateKind) return null;
  const date = new Date(`${source.date}T00:00:00Z`);
  const options: Intl.DateTimeFormatOptions = source.datePrecision === "year"
    ? { year: "numeric", timeZone: "UTC" }
    : source.datePrecision === "month"
      ? { month: "long", year: "numeric", timeZone: "UTC" }
      : { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" };
  const labels = locale === "nl"
    ? { published: "Gepubliceerd", reviewed: "Beoordeeld", updated: "Gewijzigd" }
    : { published: "Published", reviewed: "Reviewed", updated: "Updated" };
  return `${labels[source.dateKind]} ${new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", options).format(date)}`;
}

function CitationLinks({ paragraph, insight, sourceIndexes, idPrefix, locale }: {
  paragraph: Exclude<InsightParagraph, string>;
  insight: Insight;
  sourceIndexes: ReadonlyMap<string, number>;
  idPrefix: string;
  locale: Locale;
}) {
  return <>{paragraph.sourceIds.map((sourceId) => {
    const sourceIndex = sourceIndexes.get(sourceId);
    if (sourceIndex === undefined) throw new Error(`Unknown article source ${sourceId} in ${insight.slug}`);
    const label = locale === "nl" ? `Bron ${sourceIndex + 1}` : `Source ${sourceIndex + 1}`;
    return <a className="article-citation" href={`#${idPrefix}-source-${sourceId}`} aria-label={label} key={sourceId}>[{sourceIndex + 1}]</a>;
  })}</>;
}

export function ArticleContent({ insight, idPrefix, locale = "en" }: { insight: Insight; idPrefix: string; locale?: Locale }) {
  const sourceHeading = locale === "nl" ? "Bronnen" : "Sources";
  const accessedLabel = locale === "nl" ? "Geraadpleegd" : "Accessed";
  const sourceIndexes = new Map((insight.sources ?? []).map((source, index) => [source.id, index]));
  return <>
    {insight.introMarkdown ? <div className="article-intro"><ArticleMarkdown text={insight.introMarkdown} /></div> : null}
    {insight.sections.map((section, index) => <Fragment key={section.heading}>
      <section id={`${idPrefix}-${index + 1}`}>
        <h2>{section.heading}</h2>
        {section.markdown ? <ArticleMarkdown text={section.markdown} /> : <>
          {section.paragraphs?.map((paragraph) => typeof paragraph === "string"
            ? <p key={paragraph}>{paragraph}</p>
            : <p key={paragraph.text}>{paragraph.text} <CitationLinks paragraph={paragraph} insight={insight} sourceIndexes={sourceIndexes} idPrefix={idPrefix} locale={locale} /></p>)}
          {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
        </>}
      </section>
      {insight.visual?.afterSectionIndex === index ? <ArticleVisual visual={insight.visual} /> : null}
    </Fragment>)}
    {insight.sources?.length ? <section className="article-sources" id={`${idPrefix}-sources`}>
      <h2>{sourceHeading}</h2>
      <ol>
        {insight.sources.map((source) => {
          const accessed = new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${source.accessed}T00:00:00Z`));
          const sourceDate = sourceDateLabel(source, locale);
          return <li id={`${idPrefix}-source-${source.id}`} key={source.id}>
            <a href={source.url} rel="noopener noreferrer">{source.title}</a>
            <span>{source.organization}. {sourceDate ? `${sourceDate}. ` : ""}{accessedLabel} {accessed}.</span>
            <span>{source.note[locale]}</span>
          </li>;
        })}
      </ol>
    </section> : null}
  </>;
}
