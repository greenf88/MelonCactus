import { ButtonLink } from "@/components/buttons";
import { nationalAiPaths } from "@/config/practical-ai";
import type { Locale } from "@/lib/i18n";

export function ServiceEntrances({ locale, researchHref }: { locale: Locale; researchHref?: string }) {
  const nl = locale === "nl";
  return <div className="service-entrances">
    <article className="service-entrance">
      <p className="eyebrow">01 · Industrial Intelligence</p>
      <h2>{nl ? "Markt- en concurrentieonderzoek" : "Market and competitor research"}</h2>
      <p>{nl ? "Inzicht in markten, concurrenten, technische capaciteiten en commerciële kansen. Een rapport met bronnen, conclusies en duidelijke grenzen." : "Understand markets, competitors, technical capabilities and commercial opportunities. A report with traceable sources, findings and clear limits."}</p>
      <ButtonLink variant="secondary" href={researchHref ?? (nl ? "/nl/diensten#onderzoek" : "/services#research")}>{nl ? "Bekijk het onderzoek" : "Explore the research"}</ButtonLink>
    </article>
    <article className="service-entrance">
      <p className="eyebrow">{nl ? "02 · AI voor het mkb" : "02 · AI for SMEs"}</p>
      <h2>{nl ? "Praktische AI & automatisering" : "Practical AI & automation"}</h2>
      <p>{nl ? "Uitleg, hulp op locatie en ondersteuning van terugkerend werk. Begin met een bruikbare werkwijze of een kleine, getoetste proef." : "Guidance, hands-on help at your premises and support for recurring work. Start with a usable approach or a small, tested trial."}</p>
      <ButtonLink variant="secondary" href={nationalAiPaths[locale]}>{nl ? "Bekijk de AI-hulp" : "Explore practical AI help"}</ButtonLink>
    </article>
  </div>;
}
