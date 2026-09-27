import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { SampleEvidenceTable } from "@/components/sample-evidence-table";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Voorbeeldrapport industriële concurrentieanalyse | MelonCactus",
  description: "Een fictieve beslisnotitie die laat zien hoe MelonCactus openbaar bewijs, alternatieve verklaringen en gevolgen voor een besluit scheidt.",
  alternates: languageAlternates("/sample-report", "nl"),
};

export default function DutchSampleReportPage() {
  return (
    <article className="sample-report">
      <PageHeader
        locale="nl"
        eyebrow="Voorbeeldrapport · fictieve casus"
        title="Kan Alderwick de productie opschalen?"
        intro="Een voorbeeld van hoe MelonCactus openbare signalen omzet in een onderbouwde beoordeling voor een besluit. Alderwick Thermal Modules, de brondocumenten en alle data en getallen in deze casus zijn verzonnen."
        breadcrumbs={[{ label: "Voorbeeldrapport" }]}
      />

      <section className="report-cover" aria-label="Rapportgegevens">
        <Container>
          <div className="report-meta">
            <div><span>Referentie</span><strong>MC-DEMO-001</strong></div>
            <div><span>Onderwerp</span><strong>Alderwick Thermal Modules</strong></div>
            <div><span>Peildatum bewijs</span><strong>1 september 2026 · fictief</strong></div>
            <div><span>Status</span><strong>Publieke demonstratie · geen klantopdracht</strong></div>
          </div>
        </Container>
      </section>

      <section className="report-section report-decision" id="decision">
        <Container className="report-grid">
          <aside><span>01 / Beslisnotitie</span><h2>De kern in één minuut</h2></aside>
          <div className="report-body">
            <p className="report-kicker">Klantvraag in deze fictieve casus</p>
            <p className="report-lead">Moet een industriële inkoper uitgaan van een kortere levertijd voor Alderwicks systemen omdat een nieuw assemblagegebouw vorm krijgt?</p>
            <div className="decision-callout">
              <span>Onze beoordeling</span>
              <strong>Nee. Houd de bestaande aanname voor de levertijd aan tot de operationele productie onafhankelijk is onderbouwd.</strong>
              <p>De openbare signalen ondersteunen voorbereiding op uitbreiding. Ze tonen geen in bedrijf gestelde lijn, stabiel productietempo of kortere levertijden. Bereid parallel een alternatieve inkoopoptie voor.</p>
            </div>
            <div className="finding-summary" aria-label="Drie beoordelingsniveaus">
              <div><span>Fysieke uitbreiding</span><ConfidenceBadge level="High confidence" locale="nl" /></div>
              <div><span>Voorbereiding op opschaling</span><ConfidenceBadge level="Moderate confidence" locale="nl" /></div>
              <div><span>Hogere productie in bedrijf</span><ConfidenceBadge level="Unknown" locale="nl" /></div>
            </div>
          </div>
        </Container>
      </section>

      <section className="report-section report-tinted">
        <Container className="report-grid">
          <aside><span>02 / Afbakening</span><h2>Vraag en grenzen</h2></aside>
          <div className="report-body">
            <p>We beoordelen of rechtmatig beschikbare openbare informatie een verhoging van de assemblagecapaciteit op korte termijn ondersteunt. Het fictieve dossier bevat een productblad, een vergunningmelding, een gedateerde buitenfoto, vacatures en een presentatiedia.</p>
            <p>Dit voorbeeld toont bewust alleen een beknopt bronnenpad. Het bevat geen echte brondocumenten, vertrouwelijke informatie, specifieke verzamelstappen of berekening van productiecapaciteit. De casus demonstreert de redenering; zij doet geen uitspraak over een bestaande fabrikant.</p>
          </div>
        </Container>
      </section>

      <section className="report-section" id="evidence">
        <Container>
          <div className="report-section-heading"><span>03 / Bronnenpad</span><h2>Vijf signalen. Vijf bewijsgrenzen.</h2><p>Deze bronvermeldingen zijn voor de casus verzonnen. Bij een echte opdracht gebruiken we herleidbare, gedateerde bronnen die de opdrachtgever binnen de afgesproken scope kan beoordelen.</p></div>
          <SampleEvidenceTable locale="nl" />
        </Container>
      </section>

      <section className="report-section report-tinted" id="findings">
        <Container className="report-grid">
          <aside><span>04 / Bevindingen</span><h2>Wat het bewijs ondersteunt</h2></aside>
          <div className="report-body">
            <div className="finding-list">
              <article><span>B1</span><div><h3>De bouw is verder dan een aankondiging.</h3><p>De goedgekeurde uitbreiding en de latere foto van een gesloten gebouwschil stemmen qua locatie en volgorde overeen. Dat ondersteunt de fysieke bouw, niet de gereedheid van de inrichting. <a href="#sample-source-s-02">S-02</a> · <a href="#sample-source-s-03">S-03</a></p></div><ConfidenceBadge level="High confidence" locale="nl" /></article>
              <article><span>B2</span><div><h3>Operationele voorbereiding is aannemelijk, de omvang blijft onduidelijk.</h3><p>De bouw en de combinatie van productie-, kwaliteits- en ploegfuncties passen bij een uitbreidingsplan. Vervangingsvacatures en gebruik als opslagruimte blijven geloofwaardige alternatieven. <a href="#sample-source-s-02">S-02</a> · <a href="#sample-source-s-03">S-03</a> · <a href="#sample-source-s-04">S-04</a></p></div><ConfidenceBadge level="Moderate confidence" locale="nl" /></article>
              <article><span>B3</span><div><h3>Snellere leveringen zijn niet aangetoond.</h3><p>Het productblad en de dia over een prototype vermelden geen lijnsnelheid, aantal afgeleverde units, rendement, orderachterstand of geverifieerde levertijd. Het bewijs draagt geen capaciteitscijfer. <a href="#sample-source-s-01">S-01</a> · <a href="#sample-source-s-05">S-05</a></p></div><ConfidenceBadge level="Unknown" locale="nl" /></article>
            </div>
          </div>
        </Container>
      </section>

      <section className="report-section">
        <Container className="report-grid">
          <aside><span>05 / Tegentoets</span><h2>Wat kan ons oordeel veranderen?</h2></aside>
          <div className="report-body">
            <p className="report-lead">Een gebouw kan klaar zijn terwijl de productielijn dat nog niet is. Werving kan een voornemen tonen zonder dat er een extra ploeg draait.</p>
            <div className="report-challenge-grid">
              <div><h3>Alternatieve verklaring</h3><p>De uitbreiding kan vooral voor opslag of testen dienen. De vacatures kunnen vertrekkende medewerkers vervangen. Buitenfoto’s geven over beide mogelijkheden geen uitsluitsel.</p></div>
              <div><h3>Bewijs dat ertoe doet</h3><p>Een gedateerde mijlpaal voor ingebruikname, een bevestigde start van een ploeg of herhaalde verwijzingen naar seriële productie en leveringen versterken de beoordeling. Vertraagde inrichting of langdurig openstaande vacatures verzwakken haar.</p></div>
            </div>
          </div>
        </Container>
      </section>

      <section className="report-section report-tinted">
        <Container className="report-grid">
          <aside><span>06 / Besluit</span><h2>Van bevinding naar actie</h2></aside>
          <div className="report-body">
            <ol className="report-actions">
              <li><span>Nu</span><p>Houd bestaande aannames over leverancier en levertijd aan. Baseer prijs of leverbelofte niet op de bouw alleen.</p></li>
              <li><span>Parallel</span><p>Bereid een tweede inkooproute voor als een daadwerkelijke capaciteitsverhoging relevant is voor aanbestedingen of concurrentiepositie.</p></li>
              <li><span>Herbeoordeel bij</span><p>Openbaar bewijs van ingebruikname en seriële leveringen, of een geloofwaardige vertraging die het uitbreidingsverhaal tegenspreekt.</p></li>
            </ol>
            <p className="report-disclaimer">Dit is een fictief voorbeeld, geen prognose, inkoopadvies over een bestaand bedrijf of weergave van een uitgevoerde klantopdracht. Het volledige bronpakket en de wijze van verzamelen vallen buiten deze publieke demonstratie.</p>
          </div>
        </Container>
      </section>

      <section className="closing-cta no-print"><Container className="closing-inner"><div><p className="eyebrow">Een vraag waarop u kunt handelen</p><h2>Leg een werkelijke beslissing langs dezelfde meetlat.</h2><p>We stemmen de vraag, bewijsgrenzen en oplevering af op uw situatie.</p></div><ButtonLink href="/nl/contact">Bespreek een rapport</ButtonLink></Container></section>
    </article>
  );
}
