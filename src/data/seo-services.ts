import { reportOptions } from "@/config/site";
import { reportOptionsNl } from "@/config/site-nl";
import type { Locale } from "@/lib/i18n";

export type ServiceDetail = {
  slug: string;
  report: (typeof reportOptions)[number];
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  question: string;
  applications: readonly string[];
  deliverables: readonly string[];
  needed: string;
  method: string;
  boundary: string;
  timing: string;
  topicPath: string;
  relatedArticlePaths: readonly string[];
  examplePath: string;
};

const en: readonly ServiceDetail[] = [
  {
    slug: "focused-intelligence-assessment", report: reportOptions[0],
    title: "Focused Intelligence Assessment", metaTitle: "Focused Industrial Competitor Assessment",
    description: "A defined industrial competitor or market question assessed through lawful public sources. Focused intelligence from €995 excl. VAT, scoped in writing.",
    eyebrow: "One decision · focused evidence",
    question: "Which external claim or uncertainty could change your next decision?",
    applications: ["Testing a competitor's public capability claim before a product or market decision", "Checking whether a factory announcement indicates plans, construction or verified output", "Clarifying one supplier, partner or market-entry assumption"],
    deliverables: ["A concise decision-oriented assessment with cited findings", "Direct observations separated from assessments and unknowns", "The material gaps and practical questions for the next decision"],
    needed: "Tell us the decision, target company or market, geography, deadline and which claim or uncertainty matters. Do not send confidential documents through the initial form.",
    method: "We select relevant company, regulatory and technical public sources, establish provenance and recency, compare independent signals and state how far the evidence supports a conclusion.",
    boundary: "This is one defined external question, not a broad competitor landscape, a review of your own exposure or a promise to prove an unavailable fact. No private-system access or impersonation.",
    timing: "From €995 excl. VAT. The final fixed fee, scope and delivery date follow a written review of the question and available evidence; selecting this level is not acceptance.",
    topicPath: "/topics/industrial-competitor-analysis",
    relatedArticlePaths: ["/insights/what-is-industrial-competitive-intelligence", "/insights/what-a-factory-expansion-announcement-proves"],
    examplePath: "/example-case/fourth-pillar",
  },
  {
    slug: "technical-competitive-intelligence", report: reportOptions[1],
    title: "Technical & Competitive Intelligence", metaTitle: "Technical and Competitive Intelligence",
    description: "Technical intelligence for industrial technology, capabilities and competitors. Traceable public evidence and explicit limits; typically from €1,995 excl. VAT.",
    eyebrow: "Technology · capability · competition",
    question: "How credible is a technical position when claims, equipment and delivery signals differ?",
    applications: ["Comparing approaches and maturity signals in a technology landscape", "Assessing a competitor's visible facilities, products and partnerships", "Mapping public supplier and project evidence around a technical programme"],
    deliverables: ["A structured technical and commercial assessment", "A traceable evidence trail with confidence levels and competing explanations", "Implications for the defined product, procurement or strategy decision"],
    needed: "Provide the technical decision, products or organisations in scope, relevant specifications, geographic limits and the assumptions you need tested. We agree source and comparison boundaries before starting.",
    method: "We examine lawful technical literature, public filings, patents, official imagery, permits and other pertinent sources. A visible machine is not treated as proof of output; a patent is not treated as proof of deployment.",
    boundary: "This is not engineering certification, a penetration test, access to private systems, or an unlimited search. Technical conclusions remain proportionate to the available evidence.",
    timing: "Typically from €1,995 excl. VAT. Scope, fixed fee and delivery date are confirmed in writing after an evidence and capacity review.",
    topicPath: "/topics/technology-scouting",
    relatedArticlePaths: ["/insights/what-public-images-can-reveal-about-industrial-capabilities", "/insights/asml-capacity-plans-reading-manufacturing-forecasts"],
    examplePath: "/sample-report",
  },
  {
    slug: "strategic-intelligence-engagement", report: reportOptions[2],
    title: "Strategic Intelligence Engagement", metaTitle: "Strategic Industrial Intelligence Engagement",
    description: "A broader, decision-led industrial intelligence engagement across related questions and evidence streams, from €3,995 excl. VAT after written scope review.",
    eyebrow: "Several questions · one strategic decision",
    question: "Which market, technology or partner direction fits the evidence well enough to act?",
    applications: ["Comparing options for a new business pillar or market position", "Understanding a competitive landscape after an initial focused assessment", "Connecting public project, supplier and capability signals across several organisations"],
    deliverables: ["Agreed research workstreams and a decision-focused executive synthesis", "Detailed source-backed findings, alternatives and uncertainty", "Strategic implications and clearly bounded follow-up questions"],
    needed: "Share the board-level decision, candidate options, time horizon, territories and what information is already known. We define workstreams, exclusions and deliverables before acceptance.",
    method: "Each workstream starts from a defined question. We compare lawfully accessible sources, distinguish company plans from demonstrated capability, and explain how conflicting evidence affects the overall judgement.",
    boundary: "This is a scoped project, not open-ended monitoring, a guaranteed recommendation or proof of undisclosed competitor plans. Any continuing monitoring is separately agreed.",
    timing: "From €3,995 excl. VAT. We agree the final fixed fee, workstreams and delivery schedule in writing; urgent timing is assessed separately.",
    topicPath: "/topics/industrial-competitor-analysis",
    relatedArticlePaths: ["/insights/battery-factory-from-pilot-to-commercial-scale", "/insights/separate-evidence-assessment-inference-osint"],
    examplePath: "/example-case/fourth-pillar",
  },
];

const nl: readonly ServiceDetail[] = [
  {
    slug: "gerichte-intelligencebeoordeling", report: reportOptionsNl[0],
    title: "Gerichte intelligencebeoordeling", metaTitle: "Gericht concurrentieonderzoek voor industrie",
    description: "Eén afgebakende vraag over een concurrent of markt, onderzocht met openbare bronnen. Vanaf €995 excl. btw; opdracht en oplevering schriftelijk afgestemd.",
    eyebrow: "Eén beslissing · gericht bewijs",
    question: "Welke externe claim of onzekerheid kan uw eerstvolgende beslissing veranderen?",
    applications: ["Een openbare capaciteitsclaim van een concurrent toetsen vóór een product- of marktbeslissing", "Onderscheiden of een fabrieksaankondiging een plan, bouwstart of aantoonbare productie betreft", "Eén aanname over een leverancier, partner of markttoetreding verhelderen"],
    deliverables: ["Een beknopte beoordeling voor de beslissing, met bronverwijzingen", "Waarnemingen afzonderlijk van beoordelingen en onbekenden", "De belangrijkste kennislacunes en zinvolle vervolgvragen"],
    needed: "Beschrijf de beslissing, onderneming of markt, regio, gewenste termijn en de claim die u wilt toetsen. Stuur via het eerste formulier geen vertrouwelijke documenten.",
    method: "Wij kiezen relevante openbare bedrijfs-, overheids- en technische bronnen, controleren herkomst en actualiteit, vergelijken onafhankelijke signalen en geven aan hoe ver een conclusie reikt.",
    boundary: "Dit is één afgebakende externe vraag, geen breed concurrentielandschap, scan van uw eigen profiel of belofte om een niet-beschikbaar feit te bewijzen. Geen toegang tot besloten systemen.",
    timing: "Vanaf €995 excl. btw. De vaste prijs, opdracht en opleverdatum volgen na een schriftelijke beoordeling van de vraag en de beschikbare bronnen; uw formulierkeuze is geen aanvaarding.",
    topicPath: "/nl/themas/concurrentieanalyse-industrie",
    relatedArticlePaths: ["/nl/artikelen/wat-is-industriele-concurrentie-intelligentie", "/nl/artikelen/wat-bewijst-een-aangekondigde-fabrieksuitbreiding"],
    examplePath: "/nl/voorbeeldcase/vierde-pijler",
  },
  {
    slug: "technische-concurrentie-intelligence", report: reportOptionsNl[1],
    title: "Technische en concurrentie-intelligence", metaTitle: "Technische en concurrentieanalyse voor industrie",
    description: "Onderzoek naar industriële technologie, capaciteiten en concurrenten met herleidbaar openbaar bewijs. Doorgaans vanaf €1.995 excl. btw.",
    eyebrow: "Technologie · capaciteit · concurrentie",
    question: "Hoe geloofwaardig is een technische positie als claims, apparatuur en opleversignalen uiteenlopen?",
    applications: ["Technische benaderingen en ontwikkelingssignalen vergelijken", "Zichtbare locaties, producten en samenwerkingen van een concurrent beoordelen", "Openbare leveranciers- en projectinformatie rond een technisch programma in kaart brengen"],
    deliverables: ["Een gestructureerde technische en zakelijke beoordeling", "Herleidbare bronnen, zekerheidsniveaus en alternatieve verklaringen", "Gevolgen voor de afgebakende product-, inkoop- of strategiebeslissing"],
    needed: "Geef de technische beslissing, betrokken producten of organisaties, relevante specificaties, regio en aannames aan. Wij stemmen bron- en vergelijkingsgrenzen vooraf af.",
    method: "Wij beoordelen rechtmatig toegankelijke technische documentatie, openbare registraties, octrooien, officieel beeldmateriaal en andere passende bronnen. Een zichtbare machine bewijst geen productievolume; een octrooi bewijst geen toepassing.",
    boundary: "Dit is geen technische certificering, penetratietest, toegang tot besloten systemen of onbeperkte zoektocht. Conclusies blijven in verhouding tot het beschikbare bewijs.",
    timing: "Doorgaans vanaf €1.995 excl. btw. Opdracht, vaste prijs en opleverdatum worden na beoordeling van bronnen en capaciteit schriftelijk bevestigd.",
    topicPath: "/nl/themas/technologieverkenning",
    relatedArticlePaths: ["/nl/artikelen/wat-publieke-beelden-vertellen-over-industriele-capaciteiten", "/nl/artikelen/asml-capaciteitsprognose-wat-zeggen-de-cijfers"],
    examplePath: "/nl/voorbeeldrapport",
  },
  {
    slug: "strategische-intelligenceopdracht", report: reportOptionsNl[2],
    title: "Strategische intelligenceopdracht", metaTitle: "Strategische intelligence voor industriële keuzes",
    description: "Een bredere, afgebakende intelligenceopdracht met meerdere onderzoekslijnen voor één strategische beslissing. Vanaf €3.995 excl. btw na scopebeoordeling.",
    eyebrow: "Meerdere vragen · één strategische beslissing",
    question: "Welke markt-, technologie- of partnerrichting past het best bij wat het bewijs kan dragen?",
    applications: ["Opties voor een nieuwe bedrijfspijler of marktpositie vergelijken", "Na een eerste beoordeling het concurrentielandschap verder doorgronden", "Openbare signalen over projecten, leveranciers en capaciteiten samenbrengen"],
    deliverables: ["Afgesproken onderzoekslijnen en een samenvatting voor beslissers", "Gedetailleerde bevindingen met bronnen, alternatieven en onzekerheden", "Strategische implicaties en duidelijk begrensde vervolgvragen"],
    needed: "Schets de directiebeslissing, mogelijke richtingen, tijdshorizon, regio's en wat u al weet. Onderzoekslijnen, uitsluitingen en resultaten leggen wij vooraf vast.",
    method: "Elke onderzoekslijn begint bij een concrete vraag. Wij vergelijken rechtmatig toegankelijke bronnen, scheiden bedrijfsplannen van bewezen capaciteit en lichten toe wat tegenstrijdig bewijs voor het oordeel betekent.",
    boundary: "Dit is een afgebakend project, geen onbeperkte monitoring, gegarandeerd advies of bewijs van niet-openbare concurrentieplannen. Doorlopende signalering wordt afzonderlijk afgesproken.",
    timing: "Vanaf €3.995 excl. btw. Wij leggen de definitieve vaste prijs, onderzoekslijnen en planning schriftelijk vast; een spoedverzoek wordt apart beoordeeld.",
    topicPath: "/nl/themas/concurrentieanalyse-industrie",
    relatedArticlePaths: ["/nl/artikelen/batterijfabriek-van-proefproductie-naar-commerciele-schaal", "/nl/artikelen/onderscheid-tussen-bewijs-beoordeling-en-gevolgtrekking"],
    examplePath: "/nl/voorbeeldcase/vierde-pijler",
  },
];

export const seoServices = { en, nl } as const;

export function getServiceDetail(locale: Locale, slug: string) {
  return seoServices[locale].find((service) => service.slug === slug);
}
