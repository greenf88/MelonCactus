import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { publicProfileScanNl, reportOptionsNl } from "@/config/site-nl";
import { deliveryOptions } from "@/config/delivery";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Diensten voor industriële intelligence",
  description: "Onderzoek voor industriële beslissingen, met indicatieve opdrachtniveaus en prijzen. Elke opdracht wordt vooraf afgebakend.",
  alternates: languageAlternates("/services", "nl"),
};

const capabilities = [
  ["Profielen van concurrenten en capaciteiten", "Beoordeel bedrijfsstructuur, producten, locaties, mensen, samenwerkingen en geloofwaardige signalen over de bedrijfsvoering."],
  ["Analyse van technologie en producten", "Breng productclaims, octrooien, documentatie, beeldmateriaal en leveranciersinformatie samen tot een helder technisch beeld."],
  ["Productie- en locatieanalyse", "Onderzoek openbare aanwijzingen over processen, apparatuur, laboratoria, capaciteit en de ontwikkeling van locaties."],
  ["Netwerken van leveranciers en partners", "Breng zichtbare relaties tussen bedrijven, leveranciers, klanten, projecten, aanbestedingen en technologiepartners in kaart."],
  ["Inzicht voor markttoetreding", "Toets vraagsignalen, bestaande marktposities, markttoegangsopties en het bewijs achter claims over een marktsegment."],
  ["Analyse van openbaar gemaakte informatie", "Identificeer openbare uitingen die samen meer kunnen onthullen over capaciteiten, timing, relaties of bedrijfsvoering."],
  ["Technologielandschap", "Breng benaderingen, organisaties, octrooien, producten en signalen over volwassenheid rond een afgebakende technologievraag in kaart."],
  ["Doorlopende signalering", "Volg afgesproken signalen uit openbare bronnen en rapporteer relevante veranderingen zonder ruis."],
] as const;

const deliveryCopy: Record<(typeof deliveryOptions)[number]["value"], { title: string; description: string }> = {
  standard: { title: "Standaard", description: "De opleverdatum wordt na beoordeling van de vraag en de opdracht afgesproken." },
  priority: { title: "Prioriteit", description: "Voor tijdgevoelige beslissingen, afhankelijk van de opdracht, bewijsbehoefte en beschikbaarheid." },
  critical: { title: "Kritiek / 24–48 uur", description: "Alleen voor geselecteerde opdrachten wanneer de bewijsstandaard haalbaar blijft." },
};

export default function DutchServicesPage() {
  return (
    <>
      <PageHeader locale="nl" eyebrow="Diensten" title="Onderzoek rond uw beslissing, geen verzameling losse gegevens." intro="MelonCactus onderzoekt afgebakende commerciële en technische vragen met rechtmatig toegankelijke openbare bronnen, transparante bewijsnormen en afgewogen conclusies." breadcrumbs={[{ label: "Diensten" }]} />
      <section className="section"><Container>
        <div className="content-heading"><p className="eyebrow">Onderzoeksterreinen</p><h2>Waar gericht bewijs het beeld kan veranderen.</h2></div>
        <div className="capability-list">{capabilities.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
      </Container></section>
      <section className="section section-muted"><Container className="split-content">
        <div className="prose-block"><p className="eyebrow">Defensief vertrekpunt</p><h2>Beoordeel wat uw eigen openbare profiel kan prijsgeven.</h2><p>Een strak afgebakende scan van uw bedrijfswebsite, officiële openbare kanalen en geselecteerd beeldmateriaal. De scan scheidt waarnemingen van voorzichtige gevolgtrekkingen en geeft praktische prioriteiten voor publicaties.</p><ButtonLink href="/nl/diensten/openbare-informatiescan" variant="secondary">Bekijk de scope van de scan</ButtonLink></div>
        <ServiceCard locale="nl" service={publicProfileScanNl} />
      </Container></section>
      <section className="section pricing-section" id="rapporten"><Container>
        <div className="content-heading"><p className="eyebrow">Indicatieve opdrachtniveaus</p><h2>De opdracht volgt uit uw beslissing.</h2><p>Anders dan de scan van €499 voor uw eigen openbare profiel behandelen onderstaande beoordelingen externe intelligencevragen. Alle genoemde bedragen zijn exclusief btw; toepasselijke btw wordt bij de overeengekomen projectprijs opgeteld. De bedragen zijn indicatieve vanafprijzen, geen bestelprijzen of offertes. Na beoordeling ontvangt u een afgebakende opdracht met resultaten, vaste prijs en opleverdatum.</p></div>
        <div className="pricing-grid">{reportOptionsNl.map((service) => <ServiceCard locale="nl" service={service} key={service.name} />)}</div>
        <p className="pricing-note">Complexe, internationale of urgente opdrachten worden na afbakening afzonderlijk geoffreerd. Waar passend kan een kleinere betaalde pilot worden voorgesteld.</p>
      </Container></section>
      <section className="section priority-section" id="spoedlevering"><Container>
        <div className="content-heading"><p className="eyebrow">Leveringsopties</p><h2>De termijn volgt uit de bewijsbehoefte.</h2><p>Geef aan wanneer u de beslissing moet nemen. Wij beoordelen opdracht, bronnen en capaciteit voordat wij een opleverdatum bevestigen.</p></div>
        <div className="priority-grid">{deliveryOptions.map((option) => <article className="priority-option" key={option.value}><h3>{deliveryCopy[option.value].title}</h3><p>{deliveryCopy[option.value].description}</p></article>)}</div>
        <p className="priority-condition">Verzoeken met prioriteit of een kritieke termijn worden vóór aanvang individueel afgebakend en geoffreerd. Een keuze in het formulier is geen aanvaarding. De afgesproken termijn begint pas na schriftelijke bevestiging van opdracht, vaste prijs en opleverdatum én ontvangst van de benodigde informatie. Wij kunnen weigeren als het bewijs niet tijdig verantwoord te controleren is; onze bewijsnormen blijven gelijk.</p>
        <div className="priority-faq"><p className="eyebrow">Veelgestelde vraag</p><h3>Is een beoordeling binnen 24–48 uur altijd mogelijk?</h3><p>Nee. Dit is alleen mogelijk bij geselecteerde vragen waarvoor rechtmatige bronnen, opdracht en capaciteit verantwoorde verificatie toelaten. Wij bevestigen haalbaarheid en prijs eerst schriftelijk.</p></div>
      </Container></section>
      <section className="section"><Container className="split-content">
        <div><p className="eyebrow">Grenzen van ons werk</p><h2>Openbare bronnen. Heldere grenzen.</h2></div>
        <div className="prose-block"><p>Ons werk is beperkt tot rechtmatig onderzoek in openbare bronnen. MelonCactus hackt geen systemen, omzeilt geen toegangsbeveiliging, doet zich niet voor als iemand anders, gebruikt geen social engineering en accepteert geen gestolen of onrechtmatig verkregen informatie.</p><p>Sommige vragen zijn niet verantwoord te beantwoorden op basis van openbaar materiaal. Wij benoemen die grenzen, de resterende kennislacunes en zinvolle vervolgvraagstukken.</p><ButtonLink href="/nl/werkwijze" variant="secondary">Bekijk onze werkwijze</ButtonLink></div>
      </Container></section>
      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">Bepaal uw vraag</p><h2>Welke onzekerheid beïnvloedt uw beslissing?</h2><p>Een beknopte omschrijving is genoeg om de opdracht en het benodigde bewijs te beoordelen.</p></div><ButtonLink href="/nl/contact">Bespreek uw onderzoeksvraag</ButtonLink></Container></section>
    </>
  );
}
