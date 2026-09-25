import { describe, expect, it } from "vitest";
import { insights } from "@/data/insights";
import { insightsNl } from "@/data/insights-nl";
import { industrialInsights } from "@/data/industrial-insights";
import { articleReadingLabel, articleReadingMinutes, articleWordCount } from "./reading-time";

describe("article reading time", () => {
  it("uses the visible article body, including Markdown link labels but not destinations", () => {
    const example = {
      ...insights[0],
      introMarkdown: "A [linked source](https://example.com/a/very/long/path) and **bold** text.",
      sections: [{ heading: "A section", markdown: "1. **First point** and *second point*." }],
    };
    expect(articleWordCount(example)).toBe(13);
    expect(articleReadingMinutes(example)).toBe(1);
  });

  it("calculates localized times for every existing and new article", () => {
    expect(insights).toHaveLength(8);
    expect(insightsNl).toHaveLength(8);
    for (const article of insights) {
      expect(articleWordCount(article)).toBeGreaterThan(400);
      expect(articleReadingLabel(article, "en")).toMatch(/^\d+ min read$/);
      expect(articleReadingMinutes(article)).toBe(Math.ceil(articleWordCount(article) / 225));
    }
    for (const article of insightsNl) {
      expect(articleWordCount(article)).toBeGreaterThan(400);
      expect(articleReadingLabel(article, "nl")).toMatch(/^\d+ min leestijd$/);
      expect(articleReadingMinutes(article)).toBe(Math.ceil(articleWordCount(article) / 225));
    }
  });

  it("retains eight sourced Markdown articles with no third-party images", () => {
    expect(industrialInsights).toHaveLength(8);
    for (const article of industrialInsights) {
      const body = [article.introMarkdown, ...article.sections.map((section) => section.markdown)].join("\n");
      expect(body).toContain("https://");
      expect(body).toMatch(/\]\(\/(?:nl\/)?(?:werkwijze|methodology|artikelen|insights)/);
      expect(body).not.toMatch(/!\[[^\]]*\]\(/);
      expect(article.date).toBe("2026-09-25");
    }
  });
});
