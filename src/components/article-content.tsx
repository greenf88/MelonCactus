import ReactMarkdown from "react-markdown";
import type { Insight } from "@/data/insights";

function ArticleMarkdown({ text }: { text: string }) {
  return <ReactMarkdown components={{
    a: ({ href, children }) => {
      if (!href || href.startsWith("//") || (!href.startsWith("/") && !href.startsWith("https://"))) return <span>{children}</span>;
      return <a href={href} rel={href.startsWith("https://") ? "noopener noreferrer" : undefined}>{children}</a>;
    },
    img: () => null,
  }}>{text}</ReactMarkdown>;
}

export function ArticleContent({ insight, idPrefix }: { insight: Insight; idPrefix: string }) {
  return <>
    {insight.introMarkdown ? <div className="article-intro"><ArticleMarkdown text={insight.introMarkdown} /></div> : null}
    {insight.sections.map((section, index) => <section id={`${idPrefix}-${index + 1}`} key={section.heading}>
      <h2>{section.heading}</h2>
      {section.markdown ? <ArticleMarkdown text={section.markdown} /> : <>
        {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
      </>}
    </section>)}
  </>;
}
