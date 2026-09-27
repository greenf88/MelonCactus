import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { industrialInsights } from "@/data/industrial-insights";
import { ArticleContent } from "./article-content";

describe("sourced article rendering", () => {
  it("renders every new article with clickable sources, internal links and formatted emphasis", () => {
    for (const article of industrialInsights) {
      const html = renderToStaticMarkup(<ArticleContent insight={article} idPrefix="section" />);
      expect(html).toContain('<a href="https://');
      expect(html).toContain('<a href="/');
      expect(html).toContain("<strong>");
      expect(html).not.toContain("**Bron");
      expect(html).not.toContain("**Source");
      expect(html).not.toMatch(/!\[[^\]]*\]\(/);
    }
  });
});
