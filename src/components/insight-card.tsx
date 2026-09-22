import Link from "next/link";
import type { Insight } from "@/data/insights";

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <article className="insight-card">
      <p className="insight-meta">
        <time dateTime={insight.date}>{insight.displayDate}</time>
        <span>{insight.readingTime}</span>
      </p>
      <h2><Link href={`/insights/${insight.slug}`}>{insight.title}</Link></h2>
      <p>{insight.description}</p>
      <Link className="section-link" href={`/insights/${insight.slug}`}>
        Read insight <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

