import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Fictieve voorbeeldcase: wat vertelt uw openbare profiel?",
  description: "Een fictief voorbeeld op hoofdlijnen van wat buitenstaanders uit de openbare online aanwezigheid van een bedrijf kunnen afleiden.",
  alternates: languageAlternates("/example-case/public-profile", "nl"),
};

export default function DutchPublicProfileExampleCasePage() {
  return (
    <article>
      <PageHeader
        locale="nl"
        eyebrow="Fictieve voorbeeldcase · openbaar profiel"
        title="Welk beeld ontstaat uit uw openbare aanwezigheid?"
        intro="Een ander Bedrijf X wil weten wat een buitenstaander over de onderneming kan leren uit materiaal dat het bedrijf en anderen openbaar hebben gemaakt."
        breadcrumbs={[{ label: "Voorbeeldcase openbaar profiel" }]}
      />

      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">De vraag</p><h2>Wat is zichtbaar naast de bedoelde boodschap?</h2></div>
          <div className="prose-block">
            <p>In de loop der tijd heeft het bedrijf webteksten, berichten op sociale media, beelden en bedrijfsvideo&apos;s gepubliceerd. Het vraagt om een zorgvuldige beoordeling van zijn openbare profiel: wat kan een buitenstaander waarnemen, wat zou die daar redelijkerwijs uit kunnen afleiden en waar gaat een conclusie verder dan het bewijs?</p>
            <p>Relevante beelden worden in hun context beoordeeld, niet als zelfstandig bewijs behandeld. De afgesproken opdracht bepaalt welke publicaties worden onderzocht. Er is geen toegang tot besloten systemen of accounts nodig.</p>
            <p><strong>Dit is een fictief voorbeeld.</strong> Bedrijf X is geen klant. Deze pagina bevat geen bevindingen over een werkelijk bedrijf en neemt geen tekst uit een vertrouwelijk rapport over.</p>
          </div>
        </Container>
      </section>

      <section className="section section-muted">
        <Container className="split-content">
          <div><p className="eyebrow">Illustratieve uitkomst</p><h2>De combinatie van uitingen telt.</h2></div>
          <div className="prose-block">
            <p>In deze fictieve case geeft geen enkele publicatie op zichzelf een volledig beeld. Samen kunnen openbare uitingen en beelden echter meer vertellen over de richting en capaciteiten van het bedrijf dan elk onderdeel afzonderlijk doet vermoeden.</p>
            <p>Het rapport zou directe waarnemingen onderscheiden van voorzichtige gevolgtrekkingen en open vragen. Daarmee kan het bedrijf bepalen welke toekomstige publicaties extra aandacht verdienen, zonder nuttige communicatie met klanten en partners onnodig te beperken.</p>
            <p className="report-disclaimer">Dit voorbeeld blijft bewust op hoofdlijnen en is geen beoordeling van een bestaand bedrijf. Het beweert niet dat een concurrent informatie heeft verkregen of een product heeft nagemaakt. Concrete bevindingen, bronnen en onderzoekswerkwijzen worden hier niet gepubliceerd.</p>
          </div>
        </Container>
      </section>

      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">Een vraag over uw eigen profiel?</p><h2>Begrijp wat uw openbare aanwezigheid kan vertellen.</h2><p>Wij kunnen een afgebakende, op bewijs gebaseerde beoordeling bespreken.</p></div><div className="button-row"><ButtonLink href="/nl/contact">Bespreek uw onderzoeksvraag</ButtonLink><ButtonLink href="/nl/voorbeeldcase/vierde-pijler" variant="secondary">Bekijk een andere voorbeeldcase</ButtonLink></div></Container></section>
    </article>
  );
}
