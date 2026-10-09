import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { insights } from "@/data/insights";
import { insightsNl } from "@/data/insights-nl";

describe("localized article visuals", () => {
  const pairs = insights.filter((article) => article.visual).map((article, index) => ({
    en: article,
    nl: insightsNl.filter((item) => item.visual)[index],
  }));

  it("provides four English and Dutch visual pairs", () => {
    expect(pairs).toHaveLength(4);
    for (const { en, nl } of pairs) {
      expect(en.visual?.src).toMatch(/-en\.svg$/);
      expect(nl.visual?.src).toMatch(/-nl\.svg$/);
      expect(en.visual?.width).toBe(1200);
      expect(en.visual?.height).toBe(760);
      expect(en.visual?.mobileSrc).toMatch(/-en-mobile\.svg$/);
      expect(en.visual?.mobileWidth).toBe(760);
      expect(en.visual?.mobileHeight).toBe(1100);
      expect(nl.visual?.width).toBe(1200);
      expect(nl.visual?.height).toBe(760);
      expect(nl.visual?.mobileSrc).toMatch(/-nl-mobile\.svg$/);
      expect(en.visual?.alt.length).toBeGreaterThan(80);
      expect(nl.visual?.alt.length).toBeGreaterThan(80);
      expect(en.visual?.details).toHaveLength(3);
      expect(nl.visual?.details).toHaveLength(3);
    }
  });

  it("uses compact, self-contained local SVG assets", () => {
    for (const article of [...insights, ...insightsNl].filter((item) => item.visual)) {
      for (const [src, dimensions] of [[article.visual?.src, 'width="1200" height="760" viewBox="0 0 1200 760"'], [article.visual?.mobileSrc, 'width="760" height="1100" viewBox="0 0 760 1100"']] as const) {
        const path = join(process.cwd(), "public", src?.replace(/^\//, "") ?? "");
        const svg = readFileSync(path, "utf8");
        expect(svg).toContain(dimensions);
        expect(svg).toContain("<title");
        expect(svg).toContain("<desc");
        expect(svg).not.toMatch(/(?:href|src)=["']https?:/);
        expect(statSync(path).size).toBeLessThan(20_000);
      }
    }
  });

  it("uses core colour combinations with WCAG AA text contrast", () => {
    const luminance = (hex: string) => {
      const channels = hex.match(/[a-f\d]{2}/gi)?.map((value) => {
        const channel = Number.parseInt(value, 16) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      if (!channels) throw new Error(`Invalid colour: ${hex}`);
      return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
    };
    const contrast = (foreground: string, background: string) => {
      const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
      return (values[0] + 0.05) / (values[1] + 0.05);
    };

    expect(contrast("#FFFFFF", "#173D2D")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#18201D", "#EEE9BE")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#173D2D", "#DCE5DC")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#4C5852", "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });
});
