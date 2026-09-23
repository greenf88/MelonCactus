import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { reportOptionsNl } from "@/config/site-nl";
import { calculateDeliveryTotal, deliveryOptions } from "@/config/delivery";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Diensten en rapportopties",
  description: "Onderzoek naar concurrenten, technologie en openbare bronnen, met rapportopties voor industriële beslissingen.",
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

const deliveryCopy: Record<string, { title: string; description: string; surcharge: string }> = {
  standard: { title: "Standaardlevering", description: "Leverdatum na beoordeling van de opdracht te bevestigen.", surcharge: "Geen toeslag" },
  "within-48-hours": { title: "Prioriteit: binnen 48 uur", description: "De totale prijs is het dubbele van de definitief overeengekomen projectprijs.", surcharge: "100% toeslag" },
  "within-24-hours": { title: "Spoed: binnen 24 uur", description: "De totale prijs is drie keer de definitief overeengekomen projectprijs.", surcharge: "200% toeslag" },
};

export default function DutchServicesPage() {
  return (
    <>
      <PageHeader locale="nl" eyebrow="Diensten" title="Onderzoek rond uw beslissing, geen verzameling losse gegevens." intro="MelonCactus onderzoekt afgebakende commerciële en technische vragen met rechtmatig toegankelijke openbare bronnen, transparante bewijsnormen en afgewogen conclusies." breadcrumbs={[{ label: "Diensten" }]} />
      <section className="section"><Container>
        <div className="content-heading"><p className="eyebrow">Onderzoeksterreinen</p><h2>Waar gericht bewijs het beeld kan veranderen.</h2></div>
        <div className="capability-list">{capabilities.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
      </Container></section>
      <section className="section pricing-section" id="rapporten"><Container>
        <div className="content-heading"><p className="eyebrow">Rapportopties</p><h2>Kies een passende uitgangspositie.</h2><p>Dit zijn vanafprijzen, geen vaste offertes. Opdracht, levertijd en prijs worden overeengekomen voordat het onderzoek begint.</p></div>
        <div className="pricing-grid">{reportOptionsNl.map((service) => <ServiceCard locale="nl" service={service} key={service.name} />)}</div>
      </Container></section>
      <section className="section priority-section" id="spoedlevering"><Container>
        <div className="content-heading"><p className="eyebrow">Leveringsopties</p><h2>Spoedlevering</h2><p>Bespreek uw gewenste levertijd bij het bepalen van de opdracht. Elke factor geldt voor de definitief overeengekomen projectprijs, niet voor de hierboven genoemde vanafprijs.</p></div>
        <div className="priority-grid">{deliveryOptions.map((option) => <article className="priority-option" key={option.value}><h3>{deliveryCopy[option.value].title}</h3><p className="priority-multiplier">{option.multiplier}× <span>de definitief overeengekomen projectprijs</span></p><p>{deliveryCopy[option.value].description}</p><p className="priority-surcharge">{deliveryCopy[option.value].surcharge}</p></article>)}</div>
        <p className="priority-condition">Levering binnen 24 of 48 uur is afhankelijk van capaciteit en de geschiktheid van de opdracht. Een verzoek wordt niet automatisch aanvaard en is pas bindend na schriftelijke bevestiging door MelonCactus. De termijn begint pas nadat opdracht, definitieve prijs en deadline schriftelijk zijn bevestigd én alle benodigde materialen zijn ontvangen. Wij kunnen een verzoek afwijzen wanneer het bewijs niet verantwoord binnen de gevraagde termijn kan worden gecontroleerd. Onze bewijs- en kwaliteitsnormen blijven gelijk.</p>
        <p className="priority-example">Uitsluitend ter illustratie, geen offerte: bij een definitief overeengekomen projectprijs van €995 bedraagt bevestigde levering binnen 48 uur €{calculateDeliveryTotal(995, "within-48-hours").toLocaleString("nl-NL")} en binnen 24 uur €{calculateDeliveryTotal(995, "within-24-hours").toLocaleString("nl-NL")}.</p>
        <div className="priority-faq"><p className="eyebrow">Veelgestelde vraag</p><h3>Kan elk rapport binnen 24 of 48 uur worden geleverd?</h3><p>Nee. Dit hangt af van de onderzoeksvraag, de beschikbare bronnen en onze capaciteit. Wij bevestigen een spoeddeadline alleen als wij het bewijs binnen die termijn verantwoord kunnen controleren.</p></div>
      </Container></section>
      <section className="section"><Container className="split-content">
        <div><p className="eyebrow">Grenzen van ons werk</p><h2>Openbare bronnen. Heldere grenzen.</h2></div>
        <div className="prose-block"><p>Ons werk is beperkt tot rechtmatig onderzoek in openbare bronnen. MelonCactus hackt geen systemen, omzeilt geen toegangsbeveiliging, doet zich niet voor als iemand anders, gebruikt geen social engineering en accepteert geen gestolen of onrechtmatig verkregen informatie.</p><p>Sommige vragen zijn niet verantwoord te beantwoorden op basis van openbaar materiaal. Wij benoemen die grenzen, de resterende kennislacunes en zinvolle vervolgvraagstukken.</p><ButtonLink href="/nl/werkwijze" variant="secondary">Bekijk onze werkwijze</ButtonLink></div>
      </Container></section>
      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">Bepaal uw vraag</p><h2>Welke onzekerheid beïnvloedt uw beslissing?</h2><p>Een beknopte omschrijving is genoeg om vertrouwelijk over de opdracht te spreken.</p></div><ButtonLink href="/nl/contact">Rapport aanvragen</ButtonLink></Container></section>
    </>
  );
}
