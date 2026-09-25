import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Insight } from "@/data/insights";

// Keeping the supplied articles in Markdown makes the source links and emphasis
// reviewable alongside the published copy. Only these eight known entries are parsed.
const source = readFileSync(join(process.cwd(), "src/data/industrial-insights.md"), "utf8").replace(/\r\n/g, "\n");

function requiredMatch(text: string, expression: RegExp, field: string): string {
  const value = text.match(expression)?.[1];
  if (!value) throw new Error(`Missing ${field} in industrial insights source`);
  return value.trim();
}

function parseArticle(chunk: string): Insight & { locale: "en" | "nl" } {
  const locale = requiredMatch(chunk, /^## (EN|NL) \d+ — /m, "locale").toLowerCase() as "en" | "nl";
  const title = requiredMatch(chunk, /^## (?:EN|NL) \d+ — (.+)$/m, "title");
  const path = requiredMatch(chunk, /^\*\*(?:Suggested URL|Voorgestelde URL):\*\* `([^`]+)`$/m, "URL");
  const description = requiredMatch(chunk, /^\*\*Meta description:\*\* (.+)$/m, "description");
  const dateLine = /^\*\*(?:Publication date|Publicatiedatum):\*\* .+$/m.exec(chunk);
  if (!dateLine) throw new Error(`Missing publication date for ${path}`);
  const body = chunk.slice(dateLine.index + dateLine[0].length).trim();
  const [introMarkdown, ...sectionBlocks] = body.split(/\n(?=### )/);
  if (!introMarkdown || sectionBlocks.length === 0) throw new Error(`Missing article body for ${path}`);
  const sections = sectionBlocks.map((block) => {
    const heading = requiredMatch(block, /^### (.+)$/m, "section heading");
    return { heading, markdown: block.slice(block.indexOf("\n") + 1).trim() };
  });
  const slug = path.split("/").at(-1);
  if (!slug) throw new Error(`Missing slug for ${path}`);
  const date = "2026-09-25";
  return {
    locale,
    slug,
    title,
    description,
    date,
    displayDate: new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`)),
    introMarkdown: introMarkdown.trim(),
    sections,
  };
}

export const industrialInsights = source
  .split(/^---$/m)
  .map((chunk) => chunk.trim())
  .filter((chunk) => /^## (?:EN|NL) \d+ — /m.test(chunk))
  .map(parseArticle);

if (industrialInsights.length !== 8 || industrialInsights.filter((item) => item.locale === "en").length !== 4) {
  throw new Error("Expected four English and four Dutch industrial insights");
}
