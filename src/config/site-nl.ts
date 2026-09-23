import type { ReportOption } from "@/config/site";

export const siteNl = {
  descriptor: "Industrieel onderzoek",
  description: "Discreet, onderbouwd onderzoek naar concurrenten en technologie voor bedrijven in industrie en technologie.",
  coreStatement: "Inzicht uit openbare bronnen. Houvast voor technische beslissers.",
  operatorStatement: "MelonCactus wordt geëxploiteerd door GFNI.",
  nav: [
    { href: "/nl/diensten", label: "Diensten" },
    { href: "/nl/werkwijze", label: "Werkwijze" },
    { href: "/nl/voorbeeldrapport", label: "Voorbeeldrapport" },
    { href: "/nl/artikelen", label: "Artikelen" },
    { href: "/nl/over-ons", label: "Over ons" },
  ],
} as const;

export const reportOptionsNl: readonly ReportOption[] = [
  {
    name: "Gerichte verkenning",
    formValue: "Rapid Intelligence Scan",
    price: "€495",
    summary: "Een scherp afgebakend eerste antwoord op een concrete vraag.",
    includes: ["Gericht onderzoek in openbare bronnen", "Belangrijkste bevindingen en bronnenlijst", "In kaart gebrachte kennislacunes"],
  },
  {
    name: "Concurrentieprofiel",
    formValue: "Competitor Snapshot",
    price: "€995",
    summary: "Een gestructureerd profiel van een bedrijf, product of technologie.",
    includes: ["Waarnemingen met bronverwijzingen", "Capaciteiten en marktsignalen", "Risico’s en strategische vragen"],
  },
  {
    name: "Technische diepteanalyse",
    formValue: "Technical Deep Dive",
    price: "€1.995",
    summary: "Gedetailleerde analyse op basis van meerdere soorten technisch bewijs.",
    includes: ["Analyse van locaties, producten, processen of ecosystemen", "Meerdere soorten bronnen", "Bewijsbijlage en beoordeling van de zekerheid"],
    featured: true,
  },
  {
    name: "Strategisch onderzoeksrapport",
    formValue: "Strategic Intelligence Report",
    price: "€3.995",
    summary: "Een breder onderzoek, toegespitst op een strategische beslissing.",
    includes: ["Meerdere bedrijven, markten of bewijsstromen", "Conclusies voor beslissers en gedetailleerde bevindingen", "Controleerbaar bronnenpad en strategische implicaties"],
  },
];

export const confidenceLevelsNl = [
  { level: "Confirmed", description: "Rechtstreeks onderbouwd door een sterke primaire bron of meerdere onafhankelijke bronnen." },
  { level: "High confidence", description: "Onderbouwd door consistent bewijs, met beperkte onzekerheid." },
  { level: "Moderate confidence", description: "Aannemelijk en onderbouwd, maar het bewijs is onvolledig." },
  { level: "Indicative", description: "Een bruikbaar signaal dat verder moet worden gecontroleerd." },
  { level: "Unknown", description: "Onvoldoende betrouwbaar bewijs voor een beoordeling." },
] as const;
