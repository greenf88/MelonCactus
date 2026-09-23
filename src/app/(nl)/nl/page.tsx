import Link from "next/link";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { MethodStep } from "@/components/method-step";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { reportOptionsNl, siteNl } from "@/config/site-nl";

const investigations = [
  "Concurrenten en bedrijfsactiviteiten",
  "Producten en technologieën",
  "Productie- en laboratoriumcapaciteiten",
  "Openbare foto’s en video’s",
  "Leveranciers, klanten en projectnetwerken",
  "Markten, aanbestedingen en groeisignalen",
  "Openbaar gemaakte bedrijfsinformatie",
  "Doorlopende signalering",
];

const questions = [
  "Wat zegt openbaar bewijs over de daadwerkelijke technische capaciteiten van een concurrent?",
  "Welke leveranciers, partners en klanten lijken bij een product of project betrokken?",
  "Wat onthullen beelden van een locatie, en welke conclusies zijn niet verantwoord?",
  "Waar investeert, werft of breidt een concurrent uit?",
  "Welke openbare informatie geeft mogelijk meer prijs dan een organisatie beseft?",
  "Welk bewijs ondersteunt een geclaimde markt- of technologiepositie?",
];

const method = [
  ["01", "Afbakenen", "Bepaal de beslissing, opdracht en onderzoeksvraag."],
  ["02", "Verzamelen", "Verzamel rechtmatig bewijs uit relevante openbare bronnen."],
  ["03", "Controleren", "Vergelijk bronnen, herkomst en actualiteit."],
  ["04", "Beoordelen", "Scheid feit, beoordeling, gevolgtrekking en onbekende factoren."],
  ["05", "Rapporteren", "Presenteer conclusies met een controleerbaar bronnenpad."],
] as const;

const reportContents = [
  "Samenvatting voor beslissers", "Opdracht en onderzoeksvraag", "Belangrijkste bevindingen",
  "Bewijs en bronverwijzingen", "Zekerheidsniveaus", "Alternatieve verklaringen",
  "Kennislacunes", "Strategische implicaties", "Aanbevolen vervolgvragen",
];

export default function DutchHome() {
  return <>
    <section className="hero"><Container className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">Industriële inlichtingen</p>
        <h1>Inzicht voor de industrie, gebaseerd op openbaar bewijs.</h1>
        <p className="hero-intro">MelonCactus brengt versnipperde openbare informatie samen tot gestructureerde, onderbouwde inzichten voor beslissers in industrie en technologie.</p>
        <div className="button-row"><ButtonLink href="/nl/contact">Rapport aanvragen</ButtonLink><ButtonLink href="/nl/voorbeeldrapport" variant="secondary">Bekijk een voorbeeldrapport</ButtonLink></div>
        <p className="core-statement">{siteNl.coreStatement}</p>
      </div>
      <div className="evidence-panel" role="group" aria-label="Voorbeeld van bewijsclassificatie">
        <div className="evidence-panel-top"><span>Bewijsregistratie</span><span>MC / 001</span></div>
        <div className="evidence-lines" aria-hidden="true"><span className="line long" /><span className="line medium" /><span className="line short" /></div>
        <dl><div><dt>Bron</dt><dd>Primaire publicatie</dd></div><div><dt>Herkomst</dt><dd>Vastgelegd en herleidbaar</dd></div><div><dt>Beoordeling</dt><dd>Onafhankelijk bevestigd</dd></div><div><dt>Zekerheid</dt><dd><span className="badge confirmed">Bevestigd</span></dd></div></dl>
        <p className="evidence-note">Een conclusie is nooit sterker dan het bewijs waarop zij berust.</p>
      </div>
    </Container></section>

    <section className="trust-band"><Container className="trust-grid"><h2>Discreet van opzet. Bewijs als uitgangspunt.</h2><div className="trust-points"><p>Wij behandelen aanvragen en onderzoeksopdrachten vertrouwelijk.</p><p>Onderzoek gebruikt rechtmatig toegankelijke openbare bronnen.</p><p>Feiten, beoordelingen en gevolgtrekkingen blijven duidelijk gescheiden.</p></div></Container></section>

    <section className="section"><Container>
      <SectionHeading eyebrow="Onderzoeksgebied" title="Wat MelonCactus onderzoekt" intro="Gericht onderzoek voor beslissingen waarbij technische details, bronkwaliteit en commerciële context allemaal van belang zijn." />
      <div className="investigation-grid">{investigations.map((item, index) => <div className="investigation-item" key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3></div>)}</div>
    </Container></section>

    <section className="section section-muted"><Container>
      <SectionHeading eyebrow="Voorbeelden van onderzoeksvragen" title="Begin bij de beslissing die u moet nemen." intro="Dit zijn voorbeeldvragen, geen beweringen over uitgevoerde klantopdrachten." />
      <ol className="question-list">{questions.map((question, index) => <li key={question}><span>V{index + 1}</span><p>{question}</p></li>)}</ol>
    </Container></section>

    <section className="section"><Container>
      <SectionHeading eyebrow="Werkwijze" title="Van vraag naar conclusie, stap voor stap." />
      <div className="method-grid">{method.map(([number, title, description]) => <MethodStep key={number} number={number} title={title} description={description} />)}</div>
      <Link className="section-link" href="/nl/werkwijze">Lees de volledige werkwijze <span aria-hidden="true">→</span></Link>
    </Container></section>

    <section className="section pricing-section"><Container>
      <SectionHeading eyebrow="Rapportopties" title="Een opdracht die past bij de vraag." intro="De vanafprijzen zijn indicatief. Definitieve opdracht, levertijd en prijs worden bevestigd voordat het werk begint." />
      <div className="pricing-grid">{reportOptionsNl.map((service) => <ServiceCard service={service} locale="nl" key={service.name} />)}</div>
    </Container></section>

    <section className="section sample-section"><Container className="sample-grid"><div><p className="eyebrow">In het rapport</p><h2>Conclusies die u kunt controleren, bevragen en gebruiken.</h2><p className="section-intro">Elk rapport maakt duidelijk wat het bewijs ondersteunt, waar onzekerheid blijft en welke vragen nader onderzoek verdienen.</p><ButtonLink href="/nl/voorbeeldrapport" variant="secondary">Bekijk het voorbeeldrapport</ButtonLink></div><ul className="report-contents">{reportContents.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ul></Container></section>

    <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">Een bruikbaar vertrekpunt</p><h2>Beschrijf de vraag waarop u antwoord zoekt.</h2><p>Voordat wij beginnen, bepalen wij het benodigde bewijs, de grenzen en een passende onderzoeksopdracht.</p></div><div className="button-row"><ButtonLink href="/nl/contact">Rapport aanvragen</ButtonLink><ButtonLink href="/nl/contact?call=true" variant="secondary">Plan een vertrouwelijk gesprek</ButtonLink></div></Container></section>
  </>;
}
