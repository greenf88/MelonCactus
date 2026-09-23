import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { confidenceLevelsNl } from "@/config/site-nl";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Werkwijze en bewijsnormen",
  description: "Hoe MelonCactus rechtmatig verkregen openbaar bewijs verzamelt, controleert en beoordeelt voor industrieel onderzoek.",
  alternates: languageAlternates("/methodology", "nl"),
};

const stages = [
  ["01", "Bepaal de beslissing", "Vertaal de zakelijke behoefte naar een precieze onderzoeksvraag, doel, afbakening en bewijsstandaard."],
  ["02", "Maak een bronnenplan", "Bepaal welke primaire, technische, officiële, commerciële en visuele bronnen de belangrijkste onzekerheid kunnen verkleinen."],
  ["03", "Leg herkomst vast", "Noteer bron, publicatiecontext, datum en relevante passages, zodat het materiaal controleerbaar blijft."],
  ["04", "Controleer en bevraag", "Vergelijk onafhankelijke bronnen, toets actualiteit, benoem tegenstrijdigheden en onderzoek alternatieve verklaringen."],
  ["05", "Interpreteer zorgvuldig", "Houd directe waarneming, beoordeling en gevolgtrekking uit elkaar. Laat de mate van zekerheid aansluiten op het bewijs."],
  ["06", "Lever een bronnenpad", "Presenteer conclusies, beperkingen, bronnen, kennislacunes en de vragen die de zekerheid het meest kunnen vergroten."],
] as const;

export default function DutchMethodologyPage() {
  return <>
    <PageHeader locale="nl" eyebrow="Werkwijze" title="Bewijs dat u kunt terugvinden. Conclusies die u kunt toetsen." intro="Een zorgvuldige methode helpt betere beslissingen te nemen. Bij elke wezenlijke bevinding moet duidelijk zijn wat is waargenomen, hoe het is geïnterpreteerd en welke onzekerheid overblijft." breadcrumbs={[{ label: "Werkwijze" }]} />
    <section className="section"><Container><div className="content-heading"><p className="eyebrow">Zes stappen</p><h2>Van een scherpe vraag naar een verdedigbaar antwoord.</h2></div><ol className="stage-list">{stages.map(([number, title, copy]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></Container></section>
    <section className="section section-muted"><Container className="split-content"><div><p className="eyebrow">Bewijsnorm</p><h2>Kwaliteit hangt af van herkomst, context en bevestiging.</h2></div><div className="prose-block"><h3>Betrouwbaarheid en actualiteit van bronnen</h3><p>Wij beoordelen bronnen op gezag, nabijheid tot het onderwerp, publicatiedoel en datum. Een bron kan voor het ene feit gezaghebbend zijn en voor het andere zwak. Ouder materiaal sluiten wij niet automatisch uit, maar de relevantie voor de huidige vraag wordt benoemd.</p><h3>Tegenstrijdigheden en lacunes</h3><p>Tegenstrijdig bewijs blijft zichtbaar en wordt toegelicht. Rapporten benoemen ontbrekende informatie in plaats van verschillen glad te strijken. Als meerdere verklaringen bij het bewijs passen, blijven die naast elkaar bestaan.</p><h3>Waarneming en interpretatie</h3><p>Rechtstreeks waarneembare feiten worden apart vastgelegd van analytische oordelen. Beoordelingen lichten hun bewijsbasis toe; gevolgtrekkingen worden aangeduid als mogelijkheden die nader onderzoek vragen.</p></div></Container></section>
    <section className="section"><Container><div className="content-heading"><p className="eyebrow">Zekerheidsniveaus</p><h2>Duidelijke taal voor onzekerheid.</h2><p>De mate van zekerheid geeft aan hoe sterk een specifieke bevinding wordt ondersteund, niet hoe professioneel het werk als geheel is.</p></div><div className="confidence-list">{confidenceLevelsNl.map((item) => <article key={item.level}><ConfidenceBadge level={item.level} locale="nl" /><p>{item.description}</p></article>)}</div></Container></section>
    <section className="section visual-boundary"><Container className="split-content"><div><p className="eyebrow">Analyse van beeld en video</p><h2>Wat zichtbaar is, is niet hetzelfde als wat bewezen is.</h2></div><div className="prose-block"><p>Openbare foto’s en video’s kunnen aanwijzingen geven over zichtbare apparatuur, de indeling van een locatie, procesvolgorde, productopbouw en veranderingen door de tijd. Bij technische interpretatie kunnen handleidingen, leveranciersinformatie en onafhankelijke bronnen helpen toetsen wat deze kenmerken mogelijk betekenen.</p><p>Visueel bewijs toont niet vanzelf verborgen specificaties, materiaalsamenstelling, interne toleranties, productierendement of processen buiten het beeld. Rapporten benoemen die beperkingen en maken van uiterlijke gelijkenis geen zekerheid.</p></div></Container></section>
    <section className="section"><Container className="split-content"><div><p className="eyebrow">Juridische en ethische grens</p><h2>Uitsluitend rechtmatig onderzoek in openbare bronnen.</h2></div><div className="boundary-grid"><div><h3>Binnen de opdracht</h3><ul><li>Openbaar toegankelijke documenten en websites</li><li>Openbare bedrijfs- en beroepsactiviteiten</li><li>Rechtmatig gepubliceerde foto’s en video’s</li><li>Octrooien, aanbestedingen, certificeringen en openbare registers</li></ul></div><div><h3>Buiten de opdracht</h3><ul><li>Hacken of ongeoorloofde toegang</li><li>Voordoen als een ander of social engineering</li><li>Gestolen, gelekt of onrechtmatig verkregen materiaal</li><li>Onnodige verzameling van gevoelige persoonsgegevens</li></ul></div></div></Container></section>
    <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">De werkwijze in de praktijk</p><h2>Bekijk een voorbeeld van een controleerbaar bronnenpad.</h2></div><ButtonLink href="/nl/voorbeeldrapport">Bekijk het voorbeeldrapport</ButtonLink></Container></section>
  </>;
}
