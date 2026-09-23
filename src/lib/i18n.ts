import { siteConfig } from "@/config/site";

export type Locale = "en" | "nl";

export const routePairs = [
  ["/", "/nl"],
  ["/services", "/nl/diensten"],
  ["/methodology", "/nl/werkwijze"],
  ["/sample-report", "/nl/voorbeeldrapport"],
  ["/about", "/nl/over-ons"],
  ["/insights", "/nl/artikelen"],
  ["/contact", "/nl/contact"],
  ["/privacy", "/nl/privacy"],
  ["/terms", "/nl/voorwaarden"],
  ["/insights/what-is-industrial-competitive-intelligence", "/nl/artikelen/wat-is-industriele-concurrentie-intelligentie"],
  ["/insights/what-public-images-can-reveal-about-industrial-capabilities", "/nl/artikelen/wat-publieke-beelden-vertellen-over-industriele-capaciteiten"],
  ["/insights/separate-evidence-assessment-inference-osint", "/nl/artikelen/onderscheid-tussen-bewijs-beoordeling-en-gevolgtrekking"],
  ["/insights/how-industrial-companies-expose-competitive-information", "/nl/artikelen/hoe-industriele-bedrijven-concurrentie-informatie-prijsgeven"],
] as const;

const enToNl = new Map<string, string>(routePairs);
const nlToEn = new Map<string, string>(routePairs.map(([en, nl]) => [nl, en]));

export function pathForLocale(englishPath: string, locale: Locale): string {
  if (locale === "en") return englishPath;
  const path = enToNl.get(englishPath);
  if (!path) throw new Error(`No Dutch equivalent for ${englishPath}`);
  return path;
}

export function counterpartPath(pathname: string): string | null {
  return enToNl.get(pathname) ?? nlToEn.get(pathname) ?? null;
}

export function languageAlternates(englishPath: string, locale: Locale) {
  const en = `${siteConfig.siteUrl}${englishPath}`;
  const nl = `${siteConfig.siteUrl}${pathForLocale(englishPath, "nl")}`;
  return {
    canonical: locale === "en" ? en : nl,
    languages: { en, "nl-NL": nl, "x-default": en },
  };
}
