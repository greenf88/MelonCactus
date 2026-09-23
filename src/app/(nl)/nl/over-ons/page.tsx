import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { siteNl } from "@/config/site-nl";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Over ons",
  description: "MelonCactus biedt discreet en onderbouwd industrieel onderzoek op basis van rechtmatig toegankelijke openbare bronnen.",
  alternates: languageAlternates("/about", "nl"),
};

export default function DutchAboutPage() {
  return <>
    <PageHeader locale="nl" eyebrow="Over ons" title="Industriële vragen vragen om technisch bewijs." intro={siteNl.description} breadcrumbs={[{ label: "Over ons" }]} />
    <section className="section"><Container className="split-content"><div><p className="eyebrow">Onze positie</p><h2>Gespecialiseerd onderzoek voor complexe industriële beslissingen.</h2></div><div className="prose-block"><p>MelonCactus is bedoeld voor beslissers die een scherper beeld nodig hebben van een concurrent, technologie, locatie, toeleveringsketen of marktpositie. Wij brengen versnipperd openbaar bewijs samen in een gestructureerde analyse.</p><p>De aanpak is praktisch: bepaal de beslissing, toets de belangrijkste aannames, leg uit hoe sterk het bewijs is en benoem wat onbekend blijft. Rapporten zijn bedoeld om samen te worden gelezen door commerciële en technische betrokkenen.</p><p>{siteNl.operatorStatement}</p></div></Container></section>
    <section className="section section-muted"><Container><div className="values-grid"><article><span>01</span><h3>Bewijs vóór verhaal</h3><p>Conclusies volgen uit de bronnen. Tegenstrijdig bewijs en kennislacunes blijven zichtbaar.</p></article><article><span>02</span><h3>Discretie als uitgangspunt</h3><p>Wij behandelen aanvragen en opdrachten zorgvuldig. Zonder schriftelijke toestemming publiceren wij geen klantenlijst of klantcase met naam.</p></article><article><span>03</span><h3>Technische terughoudendheid</h3><p>De analyse onderscheidt wat zichtbaar is, wat wordt ondersteund en wat niet uit openbare bronnen kan worden afgeleid.</p></article><article><span>04</span><h3>Rechtmatige grenzen</h3><p>Wij hacken niet, doen ons niet voor als een ander, gebruiken geen social engineering en werken niet met onrechtmatig verkregen informatie.</p></article></div></Container></section>
    <section className="section"><Container className="split-content"><div><p className="eyebrow">Voor beslissers</p><h2>Helder genoeg voor de directie. Gedetailleerd genoeg om te bevragen.</h2></div><div className="prose-block"><p>Tot de beoogde lezers behoren algemeen directeuren, technisch directeuren, strategieteams, verantwoordelijken voor business development, R&amp;D- en productverantwoordelijken, inkoopteams, investeerders en adviseurs van industriële ondernemingen.</p><p>Elke opdracht begint bij de vraag en de beslissing die zij moet ondersteunen. De omvang wordt bevestigd voordat het onderzoek begint.</p><ButtonLink href="/nl/contact?call=true">Plan een vertrouwelijk gesprek</ButtonLink></div></Container></section>
  </>;
}
