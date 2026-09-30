import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { siteNl } from "@/config/site-nl";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Over ons",
  description: "MelonCactus is een door GFNI geëxploiteerd onafhankelijk onderzoeksbureau voor industriële intelligence, met rechtmatig toegankelijke openbare bronnen en heldere bewijsgrenzen.",
  alternates: languageAlternates("/about", "nl"),
};

export default function DutchAboutPage() {
  return <>
    <PageHeader locale="nl" eyebrow="Over ons" title="Industriële vragen vragen om technisch bewijs." intro={siteNl.description} breadcrumbs={[{ label: "Over ons" }]} />
    <section className="section"><Container className="split-content">
      <div><p className="eyebrow">Onze positie</p><h2>Gespecialiseerd onderzoek voor complexe industriële beslissingen.</h2></div>
      <div className="prose-block">
        <p>MelonCactus is bedoeld voor beslissers die een scherper beeld nodig hebben van een concurrent, technologie, locatie, toeleveringsketen of marktpositie. Wij brengen versnipperd openbaar bewijs samen in een gestructureerde beoordeling.</p>
        <p>Wij beginnen bij de beslissing, toetsen belangrijke aannames en benoemen wat het bewijs kan dragen. Feiten, beoordelingen, gevolgtrekkingen en onbekenden blijven onderscheiden. AI en automatisering kunnen het onderzoek helpen ordenen, maar maken zwak bewijs niet sterk.</p>
        <p>{siteNl.operatorStatement}</p>
      </div>
    </Container></section>
    <section className="section section-muted"><Container><div className="values-grid">
      <article><span>01</span><h3>Bewijs vóór verhaal</h3><p>Conclusies volgen uit de bronnen. Tegenstrijdigheden, alternatieve verklaringen en kennislacunes blijven zichtbaar.</p></article>
      <article><span>02</span><h3>Discretie als uitgangspunt</h3><p>Wij behandelen aanvragen en opdrachten zorgvuldig. Zonder schriftelijke toestemming publiceren wij geen klantenlijst of klantcase met naam.</p></article>
      <article><span>03</span><h3>Technische terughoudendheid</h3><p>De analyse onderscheidt waarnemingen, beoordelingen, gevolgtrekkingen en wat onbekend blijft.</p></article>
      <article><span>04</span><h3>Rechtmatige grenzen</h3><p>Wij hacken niet, doen ons niet voor als een ander, gebruiken geen social engineering en werken niet met onrechtmatig verkregen informatie.</p></article>
    </div></Container></section>
    <section className="section"><Container className="split-content">
      <div><p className="eyebrow">Voor beslissers</p><h2>Helder genoeg voor de directie. Gedetailleerd genoeg om te bevragen.</h2></div>
      <div className="prose-block">
        <p>Tot de beoogde lezers behoren directies, technisch directeuren, strategieteams, verantwoordelijken voor business development, R&amp;D- en productteams, inkoopteams, investeerders en adviseurs van industriële ondernemingen.</p>
        <p>Elke opdracht begint bij de vraag en de beslissing die zij moet ondersteunen. Omvang, resultaten, vaste prijs en opleverdatum worden afgesproken voordat het onderzoek begint.</p>
        <ButtonLink href="/nl/contact">Bespreek uw onderzoeksvraag</ButtonLink>
      </div>
    </Container></section>
  </>;
}
