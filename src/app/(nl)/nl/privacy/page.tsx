import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { siteConfig } from "@/config/site";
import { siteNl } from "@/config/site-nl";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: "Hoe MelonCactus omgaat met gegevens die u via de website verstrekt.",
  alternates: languageAlternates("/privacy", "nl"),
};

export default function DutchPrivacyPage() {
  return (
    <LegalPageShell locale="nl" title="Privacyverklaring" intro="Hoe wij omgaan met informatie die u via deze website verstrekt." updated="22 september 2026">
      <h2>Wie beheert deze website?</h2>
      <p>{siteNl.operatorStatement} U kunt contact opnemen via <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a>.</p>

      <h2>Aanvragen</h2>
      <p>Als u het formulier verstuurt, gebruiken wij de naam, het zakelijke e-mailadres, de bedrijfsnaam en de gegevens over uw vraag die u invult om uw aanvraag te beoordelen en te beantwoorden. Het formulier verzendt deze gegevens via Resend, onze e-maildienstverlener, naar onze zakelijke inbox. Als het formulier niet beschikbaar is, kunt u rechtstreeks per e-mail contact met ons opnemen.</p>

      <h2>Welke informatie kunt u beter niet sturen?</h2>
      <p>Stuur geen wachtwoorden of andere toegangsgegevens, onrechtmatig verkregen materiaal, bijzondere categorieën persoonsgegevens of meer persoonsgegevens dan nodig is om uw vraag toe te lichten.</p>

      <h2>Websitetechnologie</h2>
      <p>Deze versie gebruikt geen advertentietrackers, gedragsprofilering of niet-noodzakelijke cookies. Wij verkopen geen informatie uit aanvragen.</p>

      <h2>Vragen over uw gegevens</h2>
      <p>Heeft u vragen over een aanvraag of uw persoonsgegevens? Stuur dan een e-mail naar <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a>.</p>
    </LegalPageShell>
  );
}
