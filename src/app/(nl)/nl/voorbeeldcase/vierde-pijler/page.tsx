import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Fictieve voorbeeldcase: een vierde bedrijfspijler vinden",
  description: "Een fictieve case in twee fasen: Bedrijf X onderzoekt een vierde pijler vanuit bestaande technologie en vraagt daarna een afzonderlijke concurrentieanalyse aan.",
  alternates: languageAlternates("/example-case/fourth-pillar", "nl"),
};

const selectionQuestions = [
  ["Strategische aansluiting", "Welke mogelijkheden bouwen voort op de sterke punten van het bedrijf, zonder een geheel ander bedrijfsmodel te veronderstellen?"],
  ["Hergebruik van technologie", "Wat kan de bestaande technologie mogelijk al ondersteunen, en wat vraagt nog aanpassing of toetsing?"],
  ["Marktbewijs", "Welke openbare signalen over vraag en concurrentie ondersteunen een mogelijkheid, en wat is slechts een claim of plan?"],
  ["Open vragen", "Wat blijkt niet uit de beschikbare informatie en vergt aanvullend technisch of commercieel onderzoek?"],
] as const;

const competitorQuestions = [
  ["Werkzaamheden", "Wat ontwikkelen, produceren of leveren concurrenten aantoonbaar? We scheiden zichtbare activiteit van uitgesproken ambities."],
  ["Projecten", "Welke openbaar beschreven projecten laten zien waar zij actief zijn, en in welke fase bevindt elk project zich?"],
  ["Leveranciers", "Welke relaties met leveranciers of partners zijn te bevestigen, en welke zijn slechts mogelijke verbanden?"],
  ["Betekenis", "Wat kan Bedrijf X van deze patronen leren, zonder aan te nemen dat de aanpak van een concurrent ook voor het eigen bedrijf werkt?"],
] as const;

export default function DutchFourthPillarExampleCasePage() {
  return (
    <article>
      <PageHeader
        locale="nl"
        eyebrow="Fictieve voorbeeldcase · opdracht in twee fasen"
        title="Een vierde pijler vinden vanuit wat het bedrijf al kan."
        intro="De drie bestaande bedrijfspijlers van Bedrijf X bieden steeds minder groeiruimte. Het bestuur wil weten welke nieuwe ideeën bij de onderneming passen en wat mogelijk is met de bestaande technologie."
        breadcrumbs={[{ label: "Voorbeeldcase vierde pijler" }]}
      />

      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">01 / De eerste vraag</p><h2>Welke richting verdient nader onderzoek?</h2></div>
          <div className="prose-block">
            <p>De eerste beoordeling begint bij de beslissing, niet bij een lijst populaire markten. Mogelijke richtingen worden vergeleken met de bestaande capaciteiten, technologie en grenzen van Bedrijf X. Relevante marktsignalen worden vervolgens getoetst aan rechtmatig toegankelijke openbare bronnen.</p>
            <p>Het rapport maakt onderscheid tussen wat de huidige technologie mogelijk al kan, wat aanpassing of toetsing vergt en welke aanvullende capaciteiten nog niet zijn aangetoond. Zo kan het bestuur opties afwegen zonder een kansrijk idee al als bewezen bedrijfspijler te behandelen.</p>
            <p><strong>Dit scenario is verzonnen.</strong> Bedrijf X is geen klant; de tekst beschrijft geen bestaand bedrijf, concrete technologie of werkelijke marktkans.</p>
          </div>
        </Container>
      </section>

      <section className="section section-muted">
        <Container>
          <div className="content-heading"><p className="eyebrow">Eerste rapport</p><h2>Toets de aansluiting vóór u kiest.</h2><p>Vier vragen structureren de vergelijking. Bij elk antwoord horen het bewijs en de beperkingen daarvan.</p></div>
          <div className="values-grid">
            {selectionQuestions.map(([title, description], index) => (
              <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">02 / Het beslismoment</p><h2>Een richting komt naar voren. De vervolgvraag verandert.</h2></div>
          <div className="prose-block">
            <p>In deze fictieve verhaallijn vindt het eerste rapport een passend concept voor een vierde pijler dat voortbouwt op bestaande technologie. Het geeft het bestuur een richting om uit te werken, geen bewijs dat de technologie haalbaar is of dat de markt succesvol kan worden betreden. Het concept blijft onbenoemd, zodat het voorbeeld geen ongefundeerde marktconclusie suggereert.</p>
            <p>Het bestuur vraagt daarna een <strong>afzonderlijk vervolgrapport</strong> aan: wat doen concurrenten op dit terrein, welke projecten en leveranciers zijn zichtbaar, en wat kan Bedrijf X daarvan leren voordat het middelen vastlegt?</p>
          </div>
        </Container>
      </section>

      <section className="section section-muted">
        <Container>
          <div className="content-heading"><p className="eyebrow">Vervolgrapport</p><h2>Breng het concurrentielandschap in beeld.</h2><p>De tweede opdracht onderzoekt zichtbare werkzaamheden, projecten en relaties. Een gepubliceerd plan geldt niet als gerealiseerde productie of een bevestigde leveranciersovereenkomst.</p></div>
          <div className="values-grid">
            {competitorQuestions.map(([title, description], index) => (
              <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
          <p className="report-disclaimer">Beide fasen zijn illustratief. We beweren niet dat een klantopdracht is uitgevoerd of dat onderzoeksbevindingen, concurrentierelaties of bedrijfsresultaten zijn vastgesteld. Een echte opdracht wordt schriftelijk afgebakend en op herleidbaar bewijs beoordeeld.</p>
        </Container>
      </section>

      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">Begin bij uw beslissing</p><h2>Onderzoek een aangrenzende kans met heldere bewijsgrenzen.</h2><p>Wij kunnen een eerste beoordeling bespreken en, als dat zinvol is, een afzonderlijk afgebakend concurrentieonderzoek.</p></div><div className="button-row"><ButtonLink href="/nl/contact">Bespreek uw onderzoeksvraag</ButtonLink><ButtonLink href="/nl/voorbeeldrapport" variant="secondary">Bekijk het voorbeeldrapport</ButtonLink></div></Container></section>
    </article>
  );
}
