import { describe, expect, it } from "vitest";
import { displayDossierNumber, formatDossierNumber, parseDossierNumber } from "./dossier-number";

describe("dossier numbering", () => {
  it("uses the Europe/Amsterdam calendar month", () => {
    expect(formatDossierNumber(new Date("2026-10-31T23:30:00.000Z"), 1)).toBe("2611001");
  });

  it("formats and parses the selected convention", () => {
    expect(displayDossierNumber("2610001")).toBe("26-10-001");
    expect(parseDossierNumber("2610001")).toEqual({ year: 2026, month: 10, sequence: 1 });
  });

  it("rejects invalid or exhausted sequence values", () => {
    expect(() => formatDossierNumber(new Date("2026-10-01T10:00:00Z"), 0)).toThrow(RangeError);
    expect(() => formatDossierNumber(new Date("2026-10-01T10:00:00Z"), 1000)).toThrow(RangeError);
    expect(() => parseDossierNumber("2610000")).toThrow(TypeError);
  });
});
