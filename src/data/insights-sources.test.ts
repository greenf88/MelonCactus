import { describe, expect, it } from "vitest";
import { insights } from "@/data/insights";
import { insightsNl } from "@/data/insights-nl";
import { routePairs } from "@/lib/i18n";

function citedSourceIds(article: (typeof insights)[number]) {
  return article.sections.flatMap((section) => section.paragraphs ?? []).flatMap((paragraph) =>
    typeof paragraph === "string" ? [] : paragraph.sourceIds,
  );
}

function sourcedArticlePairs() {
  return routePairs.filter(([en]) => en.startsWith("/insights/")).map(([enPath, nlPath]) => {
    const en = insights.find((article) => enPath.endsWith(`/${article.slug}`));
    const nl = insightsNl.find((article) => nlPath.endsWith(`/${article.slug}`));
    if (!en || !nl) throw new Error(`Missing sourced article pair for ${enPath}`);
    return { en, nl };
  }).filter((pair) => pair.en.sources?.length && pair.nl.sources?.length);
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
      expect(article.modifiedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect((article.modifiedDate ?? "") >= "2026-10-09").toBe(true);
      expect(article.sources?.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("records the bilingual decision-loop article with supplier evidence limits", () => {
    const englishArticle = insights.find((article) => article.slug === "industrial-ai-decision-loop-manufacturing");
    const dutchArticle = insightsNl.find((article) => article.slug === "industriele-ai-beslislus-productie");
    if (!englishArticle || !dutchArticle) throw new Error("Missing decision-loop article pair");
    const pair = [englishArticle, dutchArticle];
    expect(pair.map((article) => article.date)).toEqual(["2026-10-12", "2026-10-12"]);
    for (const article of pair) {
      expect(article.sources?.map((source) => source.accessed)).toEqual(["2026-10-11", "2026-10-11", "2026-10-11"]);
      expect(article.sources?.every((source) => /Vendor|leverancier|product/i.test(`${source.note.en} ${source.note.nl}`))).toBe(true);
    }
  });

  it("keeps the four industrial case pairs source-matched and visibly updated", () => {
    const caseEnglish = english.filter((article) => article.date === "2026-09-27");
    const caseDutch = dutch.filter((article) => article.date === "2026-09-27");
    expect(caseEnglish).toHaveLength(4);
    expect(caseDutch).toHaveLength(4);
    for (const article of [...caseEnglish, ...caseDutch]) {
      expect(article.modifiedDate).toBe("2026-10-12");
      expect(article.sources?.length).toBeGreaterThan(0);
      expect(article.visual).toBeDefined();
    }
  });

  it("resolves every inline citation to a unique HTTPS source", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const article of [...english, ...dutch]) {
      const ids = article.sources?.map((source) => source.id) ?? [];
      expect(new Set(ids).size).toBe(ids.length);
      const inlineIds = new Set(citedSourceIds(article));
      if (article.introMarkdown) {
        const markdown = JSON.stringify([article.introMarkdown, article.sections]);
        for (const source of article.sources ?? []) expect(markdown).toContain(source.url);
      } else {
        expect(inlineIds).toEqual(new Set(ids));
      }
      for (const source of article.sources ?? []) {
        expect(source.url).toMatch(/^https:\/\//);
        expect(source.accessed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(source.accessed <= today, `${article.slug}: ${source.accessed}`).toBe(true);
        expect(source.note.en).toBeTruthy();
        expect(source.note.nl).toBeTruthy();
      }
    }
  });

  it("uses the same evidence set for each English and Dutch counterpart", () => {
    for (const { en, nl } of sourcedArticlePairs()) {
      expect(nl?.sources?.map((source) => source.id)).toEqual(en?.sources?.map((source) => source.id));
    }
  });
});
