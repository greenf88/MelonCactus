import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { siteConfig } from "@/config/site";
import { siteNl } from "@/config/site-nl";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Websitevoorwaarden",
  description: "Basisvoorwaarden voor het gebruik van de MelonCactus-website.",
  alternates: languageAlternates("/terms", "nl"),
};

export default function DutchTermsPage() {
  return (
    <LegalPageShell locale="nl" title="Websitevoorwaarden" intro="Basisvoorwaarden voor het gebruik van deze website en het openbare informatiemateriaal." updated="23 september 2026">
      <h2>Informatie, geen advies</h2>
      <p>De inhoud van deze website is algemene informatie over industriële inlichtingen en onderzoek in openbare bronnen. Zij vormt geen juridisch, financieel, beleggings-, technisch of beveiligingsadvies voor een specifieke situatie.</p>

      <h2>Geen klantrelatie</h2>
      <p>Het gebruik van deze website of het indienen van een aanvraag schept geen klantrelatie. Een opdracht begint pas nadat de omvang, voorwaarden, termijn en prijs schriftelijk zijn overeengekomen.</p>

      <h2>Spoedlevering</h2>
      <p>Bij standaardlevering wordt de leverdatum na beoordeling van de opdracht bevestigd tegen 1× de overeengekomen projectprijs. Een aangevraagde levering binnen 48 uur bedraagt in totaal 2× de overeengekomen projectprijs (een toeslag van 100%); een aangevraagde levering binnen 24 uur bedraagt in totaal 3× de overeengekomen projectprijs (een toeslag van 200%). De factor wordt toegepast op de definitief overeengekomen projectprijs.</p>
      <p>Spoedopties zijn afhankelijk van beschikbare capaciteit en de geschiktheid van de opdracht. Het selecteren van een optie in het formulier geldt niet als aanvaarding. De toepasselijke deadline en definitieve prijs staan in de schriftelijke opdrachtbevestiging. De spoedtermijn begint pas nadat MelonCactus de opdracht, prijs en deadline schriftelijk heeft bevestigd én alle benodigde materialen heeft ontvangen. Wij kunnen een verzoek afwijzen als verantwoorde verificatie van het bewijs binnen de gevraagde termijn niet mogelijk is. Onze normen voor bewijs en kwaliteit blijven gelijk.</p>

      <h2>Voorbeeldmateriaal</h2>
      <p>Het voorbeeldrapport is een fictieve demonstratie. Het beschrijft geen bestaand bedrijf, uitgevoerde klantopdracht of geverifieerde industriële capaciteit.</p>

      <h2>Verantwoord gebruik</h2>
      <p>U mag via de website geen illegaal materiaal, inloggegevens, malware of informatie insturen die u niet mag delen.</p>

      <h2>Juistheid en beschikbaarheid</h2>
      <p>Wij betrachten redelijke zorgvuldigheid bij openbare inhoud. De website kan echter worden gewijzigd en ononderbroken beschikbaarheid is niet gegarandeerd. Externe bronnen kunnen na publicatie veranderen.</p>

      <h2>Bedrijfsgegevens</h2>
      <p>{siteNl.operatorStatement} Contact: <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a>.</p>
    </LegalPageShell>
  );
}
