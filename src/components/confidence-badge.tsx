import type { Locale } from "@/lib/i18n";

const labelsNl: Record<string, string> = {
  Confirmed: "Bevestigd",
  "High confidence": "Hoge zekerheid",
  "Moderate confidence": "Matige zekerheid",
  Indicative: "Indicatief",
  Unknown: "Onbekend",
};

export function ConfidenceBadge({ level, locale = "en" }: { level: string; locale?: Locale }) {
  const slug = level.toLowerCase().replaceAll(" ", "-");
  return <span className={`confidence-badge ${slug}`}>{locale === "nl" ? labelsNl[level] ?? level : level}</span>;
}
