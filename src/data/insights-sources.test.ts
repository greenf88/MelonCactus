import { describe, expect, it } from "vitest";
import { insights } from "@/data/insights";
import { insightsNl } from "@/data/insights-nl";

function citedSourceIds(article: (typeof insights)[number]) {
  return article.sections.flatMap((section) => section.paragraphs ?? []).flatMap((paragraph) =>
    typeof paragraph === "string" ? [] : paragraph.sourceIds,
  );
}

describe("evergreen article evidence records", () => {
  const english = insights.filter((article) => article.sources?.length);
  const dutch = insightsNl.filter((article) => article.sources?.length);

  it("keeps exactly four bilingual article pairs with the original publication date", () => {
    expect(english).toHaveLength(4);
    expect(dutch).toHaveLength(4);
    for (const article of [...english, ...dutch]) {
      expect(article.date).toBe("2026-09-22");
      expect(article.modifiedDate).toBe("2026-10-07");
      expect(article.sources?.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("resolves every inline citation to a unique HTTPS source", () => {
    for (const article of [...english, ...dutch]) {
      const ids = article.sources?.map((source) => source.id) ?? [];
      expect(new Set(ids).size).toBe(ids.length);
      expect(new Set(citedSourceIds(article))).toEqual(new Set(ids));
      for (const source of article.sources ?? []) {
        expect(source.url).toMatch(/^https:\/\//);
        expect(source.accessed).toBe("2026-10-07");
        expect(source.note.en).toBeTruthy();
        expect(source.note.nl).toBeTruthy();
      }
    }
  });

  it("uses the same evidence set for each English and Dutch counterpart", () => {
    for (let index = 0; index < english.length; index += 1) {
      expect(dutch[index].sources?.map((source) => source.id)).toEqual(english[index].sources?.map((source) => source.id));
    }
  });
});
