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
    const evergreenEnglish = english.filter((article) => article.date === "2026-09-22");
    const evergreenDutch = dutch.filter((article) => article.date === "2026-09-22");
    expect(evergreenEnglish).toHaveLength(4);
    expect(evergreenDutch).toHaveLength(4);
    for (const article of [...evergreenEnglish, ...evergreenDutch]) {
      expect(article.date).toBe("2026-09-22");
      expect(article.modifiedDate).toBe("2026-10-09");
      expect(article.sources?.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("records the bilingual decision-loop article with supplier evidence limits", () => {
    const pair = [english[0], dutch[0]];
    expect(pair.map((article) => article.date)).toEqual(["2026-10-12", "2026-10-12"]);
    for (const article of pair) {
      expect(article.sources?.map((source) => source.accessed)).toEqual(["2026-10-11", "2026-10-11", "2026-10-11"]);
      expect(article.sources?.every((source) => /Vendor|leverancier|product/i.test(`${source.note.en} ${source.note.nl}`))).toBe(true);
    }
  });

  it("resolves every inline citation to a unique HTTPS source", () => {
    for (const article of [...english, ...dutch]) {
      const ids = article.sources?.map((source) => source.id) ?? [];
      expect(new Set(ids).size).toBe(ids.length);
      expect(new Set(citedSourceIds(article))).toEqual(new Set(ids));
      for (const source of article.sources ?? []) {
        expect(source.url).toMatch(/^https:\/\//);
        expect(source.accessed).toMatch(/^2026-10-(?:07|11)$/);
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
