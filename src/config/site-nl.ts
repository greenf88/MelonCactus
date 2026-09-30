import type { ReportOption } from "@/config/site";

export const siteNl = {
  descriptor: "Industrieel onderzoek",
  description: "Discreet, onderbouwd onderzoek naar concurrenten en technologie voor bedrijven in industrie en technologie.",
  coreStatement: "Inzicht uit openbare bronnen. Houvast voor technische beslissers.",
  operatorStatement: "MelonCactus wordt geëxploiteerd door GFNI.",
  nav: [
    { href: "/nl/diensten", label: "Diensten" },
    { href: "/nl#voorbeelden", label: "Voorbeelden" },
    { href: "/nl/werkwijze", label: "Werkwijze" },
    { href: "/nl#prijzen", label: "Prijzen" },
    { href: "/nl/artikelen", label: "Artikelen" },
    { href: "/nl/over-ons", label: "Over ons" },
  ],
} as const;

export const publicProfileScanNl: ReportOption = {
  name: "Openbare-informatiescan voor uw bedrijf",
  formValue: "Public Profile Exposure Scan",
  price: "€499",
  priceQualifier: "vaste prijs",
  summary: "Een compacte, defensieve beoordeling van wat een buitenstaander uit uw eigen openbare bedrijfsprofiel kan afleiden.",
  bestFor: "De openbare communicatie van uw eigen bedrijf.",
  boundary: "Geen besloten accounts, penetratietest of extern concurrentieonderzoek.",
  includes: [
    "Eén bedrijfswebsite en maximaal twee officiële openbare kanalen",
    "Waarnemingen, voorzichtige gevolgtrekkingen en onbekenden",
    "Prioriteiten voor toekomstige publicaties",
  ],
};

export const reportOptionsNl: readonly ReportOption[] = [
  {
    name: "Gerichte intelligencebeoordeling",
    formValue: "Focused Intelligence Assessment",
    price: "€995",
    priceQualifier: "vanaf",
    summary: "Een gerichte beoordeling van een beslissing en de belangrijkste onzekerheden.",
    bestFor: "Eén afgebakende externe intelligencevraag.",
    boundary: "Geen beoordeling van uw eigen openbare profiel of breed concurrentielandschap.",
    includes: ["Afgesproken vraag en bewijsgrenzen", "Bevindingen met bronverwijzingen en beperkingen", "Beknopte oplevering voor de beslissing"],
  },
  {
    name: "Technische en concurrentie-intelligence",
    formValue: "Technical & Competitive Intelligence",
    price: "€1.995",
    priceQualifier: "doorgaans vanaf",
    summary: "Een diepgaander onderzoek naar een onderneming, technologie of concurrentiepositie.",
    bestFor: "Een technische of concurrentiegerichte beslissing met meer diepgang.",
    boundary: "Onderwerpen, bronnen en diepgang staan in de schriftelijke opdracht; geen toegang tot besloten systemen.",
    includes: ["Meerdere relevante brontypen", "Technische en zakelijke beoordeling", "Herleidbaar bewijs en zekerheidsniveaus"],
    featured: true,
  },
  {
    name: "Strategische intelligenceopdracht",
    formValue: "Strategic Intelligence Engagement",
    price: "€3.995",
    priceQualifier: "vanaf",
    summary: "Een bredere opdracht rond een strategische beslissing en meerdere bewijsstromen.",
    bestFor: "Een strategische beslissing met samenhangende deelvragen.",
    boundary: "Onderzoekslijnen en uitsluitingen worden schriftelijk afgesproken; doorlopende signalering alleen indien opgenomen.",
    includes: ["Afgesproken onderzoekslijnen", "Conclusies voor beslissers en gedetailleerde bevindingen", "Herleidbaar bewijs en strategische implicaties"],
  },
];

export const confidenceLevelsNl = [
  { level: "Confirmed", description: "Rechtstreeks onderbouwd door een sterke primaire bron of meerdere onafhankelijke bronnen." },
  { level: "High confidence", description: "Onderbouwd door consistent bewijs, met beperkte onzekerheid." },
  { level: "Moderate confidence", description: "Aannemelijk en onderbouwd, maar het bewijs is onvolledig." },
  { level: "Indicative", description: "Een bruikbaar signaal dat verder moet worden gecontroleerd." },
  { level: "Unknown", description: "Onvoldoende betrouwbaar bewijs voor een beoordeling." },
] as const;
