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
    <LegalPageShell locale="nl" title="Websitevoorwaarden" intro="Basisvoorwaarden voor het gebruik van deze website en het openbare informatiemateriaal." updated="29 september 2026">
      <h2>Informatie, geen advies</h2>
      <p>De inhoud van deze website is algemene informatie over industriële inlichtingen en onderzoek in openbare bronnen. Zij vormt geen juridisch, financieel, beleggings-, technisch of beveiligingsadvies voor een specifieke situatie.</p>

      <h2>Geen klantrelatie</h2>
      <p>Het gebruik van deze website of het indienen van een aanvraag schept geen klantrelatie. Een opdracht begint pas nadat de omvang, voorwaarden, termijn en prijs schriftelijk zijn overeengekomen.</p>

      <h2>Termijn en spoedverzoeken</h2>
      <p>Bij standaardlevering wordt de opleverdatum na beoordeling van de opdracht afgesproken. Prioriteit voor tijdgevoelige beslissingen en een kritieke termijn van 24–48 uur zijn alleen mogelijk als opdracht, bewijsbehoefte en capaciteit dat toelaten. Een spoedverzoek wordt vóór aanvang afzonderlijk afgebakend en geoffreerd; het selecteren van een optie in het formulier is geen aanvaarding.</p>
      <p>De vaste prijs en toepasselijke opleverdatum staan in de schriftelijke opdrachtbevestiging. Een afgesproken termijn begint pas nadat MelonCactus opdracht, prijs en deadline schriftelijk heeft bevestigd én alle benodigde informatie heeft ontvangen. Wij kunnen een verzoek afwijzen als het bewijs niet tijdig verantwoord kan worden gecontroleerd. Onze normen voor bewijs en kwaliteit blijven gelijk.</p>

      <h2>Voorbeeldmateriaal</h2>
      <p>Het voorbeeldrapport en de voorbeeldcase zijn fictieve demonstraties. Zij beschrijven geen bestaande bedrijven, opdrachten voor klanten of geverifieerde industriële capaciteiten.</p>

      <h2>Verantwoord gebruik</h2>
      <p>U mag via de website geen illegaal materiaal, toegangsgegevens, malware of informatie insturen die u niet mag delen.</p>

      <h2>Juistheid en beschikbaarheid</h2>
      <p>Wij betrachten redelijke zorgvuldigheid bij openbare inhoud. De website kan echter worden gewijzigd en ononderbroken beschikbaarheid is niet gegarandeerd. Externe bronnen kunnen na publicatie veranderen.</p>

      <h2>Bedrijfsgegevens</h2>
      <p>{siteNl.operatorStatement} Contact: <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a>.</p>
    </LegalPageShell>
  );
}
