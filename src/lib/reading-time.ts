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
export function articleWordCount(insight: Insight): number {
  const text = [
    insight.introMarkdown ?? "",
    ...insight.sections.flatMap((section) => [
      section.heading,
      section.markdown ?? "",
      ...(section.paragraphs ?? []),
      ...(section.bullets ?? []),
    ]),
  ].join("\n");
  return [...plainText(text).matchAll(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)].length;
}

export function articleReadingMinutes(insight: Insight): number {
  return Math.max(1, Math.ceil(articleWordCount(insight) / 225));
}

export function articleReadingLabel(insight: Insight, locale: Locale): string {
  const minutes = articleReadingMinutes(insight);
  return locale === "nl" ? `${minutes} min leestijd` : `${minutes} min read`;
}
