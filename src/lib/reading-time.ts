import type { Insight } from "@/data/insights";
import type { Locale } from "@/lib/i18n";

function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#]/g, "")
    .replace(/^\s*(?:[-+] |\d+\. )/gm, "");
}

// Count only the article text that readers see, including its headings and sources.
// The shared call-to-action and navigation are not part of the article.
export function articleWordCount(insight: Insight, locale: Locale = "en"): number {
  const text = [
    insight.introMarkdown ?? "",
    ...insight.sections.flatMap((section) => [
      section.heading,
      section.markdown ?? "",
      ...(section.paragraphs ?? []).map((paragraph) => typeof paragraph === "string"
        ? paragraph
        : `${paragraph.text} ${paragraph.sourceIds.map(() => "1").join(" ")}`),
      ...(section.bullets ?? []),
    ]),
    ...(insight.sources?.length ? [locale === "nl" ? "Bronnen" : "Sources"] : []),
    ...(insight.sources ?? []).flatMap((source) => [
      source.organization,
      source.title,
      source.date && source.dateKind ? `${source.dateKind} ${source.date}` : "",
      `accessed ${source.accessed}`,
      source.note[locale],
    ]),
    ...(insight.visual ? [
      insight.visual.title,
      insight.visual.caption,
      ...insight.visual.details.flatMap((detail) => [detail.label, detail.text]),
    ] : []),
  ].join("\n");
  return [...plainText(text).matchAll(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)].length;
}

export function articleReadingMinutes(insight: Insight, locale: Locale = "en"): number {
  return Math.max(1, Math.ceil(articleWordCount(insight, locale) / 225));
}

export function articleReadingLabel(insight: Insight, locale: Locale): string {
  const minutes = articleReadingMinutes(insight, locale);
  return locale === "nl" ? `${minutes} min leestijd` : `${minutes} min read`;
}
