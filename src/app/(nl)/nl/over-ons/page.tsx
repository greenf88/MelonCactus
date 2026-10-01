import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { StructuredData } from "@/components/structured-data";
import { siteNl } from "@/config/site-nl";
import { siteConfig } from "@/config/site";
import { languageAlternates } from "@/lib/i18n";
import { breadcrumbSchema, personSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Rick Groeneveld en GFNI: over ons",
  description: "Maak kennis met Rick Groeneveld, de persoon achter MelonCactus. GFNI onderzoekt industriële beslisvragen met rechtmatig toegankelijke openbare bronnen.",
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
        <p>{siteNl.operatorStatement} GFNI is een eenmanszaak in Enschede. MelonCactus is de naam waaronder dit industriële onderzoek wordt aangeboden, geen tweede juridische onderneming.</p>
      </div>
    </Container></section>
    <section className="section section-muted" id="rick-groeneveld"><Container className="split-content">
      <div><p className="eyebrow">De persoon achter het werk</p><h2>Rick Groeneveld</h2></div>
      <div className="prose-block">
        <p>Rick Groeneveld is de contactpersoon achter MelonCactus. Zijn professionele achtergrond ligt in technisch projectmanagement in een industriële omgeving. Die blik helpt om vragen over capaciteit, planning en bewijs bij een beslissing scherp te stellen.</p>
        <p>Het onderzoek blijft beperkt tot rechtmatig toegankelijke openbare bronnen. MelonCactus voert geen penetratietests uit, krijgt geen toegang tot besloten accounts, verstrekt geen juridische certificering en belooft geen specifieke zakelijke uitkomst. De gepubliceerde voorbeeldcases zijn fictief.</p>
        <p>GFNI · KvK {siteConfig.registrationNumber} · btw-id {siteConfig.vatId}<br />{siteConfig.postalAddress}<br /><a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a> · <a href={siteConfig.businessPhoneHref}>{siteConfig.businessPhoneDisplay}</a></p>
        <p><a href={siteConfig.linkedInCompanyUrl} rel="noopener noreferrer">Bekijk de bedrijfspagina van MelonCactus op LinkedIn</a></p>
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
    <StructuredData data={personSchema("nl")} />
    <StructuredData data={breadcrumbSchema("nl", [{ name: "Over ons", path: "/nl/over-ons" }])} />
  </>;
}
