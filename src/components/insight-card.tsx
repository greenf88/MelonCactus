import Link from "next/link";
import type { Insight } from "@/data/insights";
import type { Locale } from "@/lib/i18n";
import { articleReadingLabel } from "@/lib/reading-time";

export function InsightCard({ insight, locale = "en" }: { insight: Insight; locale?: Locale }) {
  const href = locale === "nl" ? `/nl/artikelen/${insight.slug}` : `/insights/${insight.slug}`;
  return (
    <article className="insight-card">
      <p className="insight-meta">
        <time dateTime={insight.date}>{insight.displayDate}</time>
        <span>{articleReadingLabel(insight, locale)}</span>
      </p>
      <h2><Link href={href}>{insight.title}</Link></h2>
      <p>{insight.description}</p>
      <Link className="section-link" href={href}>
        {locale === "nl" ? "Lees het artikel" : "Read insight"} <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
