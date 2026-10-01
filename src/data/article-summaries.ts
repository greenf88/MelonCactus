import type { Locale } from "@/lib/i18n";

const summaries: Record<Locale, Record<string, string>> = {
  en: {
    "what-is-industrial-competitive-intelligence": "This article explains how public-source research can inform a defined industrial decision. It shows why source quality, timing and competing interpretations matter more than the volume of collected material. Public evidence can narrow uncertainty, but it cannot reveal every private plan or operating fact.",
    "what-public-images-can-reveal-about-industrial-capabilities": "This article examines what public photographs and videos can reveal about industrial facilities and equipment. Visual clues become useful only when their origin, date and context can be tested against other sources. An image cannot by itself establish throughput, utilisation or current production.",
    "separate-evidence-assessment-inference-osint": "This article separates direct evidence from assessment and inference in open-source research. It offers a way to record sources, alternative explanations and confidence before making a business decision. An inference remains uncertain even when it sounds plausible.",
    "how-industrial-companies-expose-competitive-information": "This article looks at how a company's own public material can reveal more when several signals are combined. It sets out a proportionate review of websites, public channels and imagery. The aim is deliberate publication, not a claim that every disclosure is harmful or that all exposure can be eliminated.",
    "what-a-factory-expansion-announcement-proves": "ASML's announced Eindhoven campus illustrates the difference between construction, intended capacity and realised production. The company has reported a construction start and phased plans, not a measured increase in output from the new site. Later operational evidence is needed before drawing conclusions about delivered capacity.",
    "factory-opening-versus-full-production-infineon": "Infineon's Dresden opening illustrates why a factory milestone is not the same as steady output for every product. The company's investment and capacity statements show its plans and reported progress. They do not independently establish present shipments, yield or availability of a specific component.",
    "battery-factory-from-pilot-to-commercial-scale": "The European Commission's Battery Booster Facility highlights the difficult transition from pilot to commercial battery-cell production. Announced GWh capacity, equipment installation and stable qualified output are different measures. The programme is evidence of a policy response, not proof that an individual factory has reached its target.",
    "asml-capacity-plans-reading-manufacturing-forecasts": "This article reads ASML's capacity outlook as a forecast with assumptions rather than a completed result. Public figures can clarify intended manufacturing scale and timing. They do not prove that a future production or delivery target has already been achieved.",
  },
  nl: {
    "wat-is-industriele-concurrentie-intelligentie": "Dit artikel laat zien hoe onderzoek met openbare bronnen een afgebakende industriële beslissing kan ondersteunen. Bronkwaliteit, datering en alternatieve verklaringen zijn belangrijker dan de hoeveelheid verzameld materiaal. Openbaar bewijs kan onzekerheid verkleinen, maar onthult niet elk besloten plan of operationeel feit.",
    "wat-publieke-beelden-vertellen-over-industriele-capaciteiten": "Dit artikel onderzoekt wat openbare foto's en video's over industriële locaties en apparatuur kunnen laten zien. Beeldsignalen worden pas bruikbaar als herkomst, datum en context tegen andere bronnen zijn getoetst. Een beeld bewijst op zichzelf geen productievolume, bezettingsgraad of actuele output.",
    "onderscheid-tussen-bewijs-beoordeling-en-gevolgtrekking": "Dit artikel onderscheidt directe waarnemingen, beoordelingen en gevolgtrekkingen in onderzoek met openbare bronnen. Het biedt een manier om bronnen, alternatieve verklaringen en zekerheid vast te leggen vóór een zakelijke beslissing. Een aannemelijke gevolgtrekking blijft onzeker zolang aanvullend bewijs ontbreekt.",
    "hoe-industriele-bedrijven-concurrentie-informatie-prijsgeven": "Dit artikel laat zien hoe eigen openbare publicaties in samenhang meer kunnen onthullen dan afzonderlijk. Het beschrijft een proportionele beoordeling van websites, publieke kanalen en beeldmateriaal. Het doel is bewuster publiceren, niet de stelling dat iedere openbaarmaking schadelijk is of dat alle zichtbaarheid verdwijnt.",
    "wat-bewijst-een-aangekondigde-fabrieksuitbreiding": "De aangekondigde ASML-campus in Eindhoven maakt het verschil zichtbaar tussen bouw, beoogde capaciteit en gerealiseerde productie. ASML meldde een bouwstart en gefaseerde plannen, geen gemeten extra output van de nieuwe locatie. Voor conclusies over feitelijke capaciteit is later operationeel bewijs nodig.",
    "nieuwe-fabriek-openen-versus-volledig-produceren": "De opening van Infineons fabriek in Dresden laat zien waarom een projectmijlpaal niet gelijkstaat aan stabiele productie van elk product. Investeringen en capaciteitsuitspraken tonen de plannen en gemelde voortgang van het bedrijf. Zij bewijzen niet onafhankelijk de huidige leveringen, opbrengst of beschikbaarheid van een specifiek component.",
    "batterijfabriek-van-proefproductie-naar-commerciele-schaal": "De Europese Battery Booster Facility vestigt de aandacht op de stap van proefproductie naar commerciële batterijcelproductie. Aangekondigde GWh-capaciteit, geïnstalleerde apparatuur en stabiele gekwalificeerde output zijn verschillende maten. De regeling bewijst niet dat een afzonderlijke fabriek haar doel al heeft bereikt.",
    "asml-capaciteitsprognose-wat-zeggen-de-cijfers": "Dit artikel leest de capaciteitsverwachting van ASML als een prognose met aannames, niet als een bereikt resultaat. Openbare cijfers kunnen de beoogde productieschaal en timing verduidelijken. Zij bewijzen niet dat een toekomstig productie- of leverdoel al is gerealiseerd.",
  },
};

export function articleSummary(locale: Locale, slug: string) {
  const summary = summaries[locale][slug];
  if (!summary) throw new Error(`Missing ${locale} summary for ${slug}`);
  return summary;
}

const seoDescriptions: Record<Locale, Record<string, string>> = {
  en: {
    "what-is-industrial-competitive-intelligence": "A practical guide to industrial competitive intelligence: define a decision, test public sources and separate supported findings from assumptions.",
    "what-public-images-can-reveal-about-industrial-capabilities": "How to assess public facility photographs and videos as industrial evidence while respecting uncertainty about timing, capacity and output.",
    "separate-evidence-assessment-inference-osint": "Learn to separate direct evidence, analyst assessment and inference in public-source research, with traceable sources and visible uncertainty.",
    "how-industrial-companies-expose-competitive-information": "How public websites, vacancies and images can reveal industrial context in combination—and how to review your own disclosures proportionately.",
    "battery-factory-from-pilot-to-commercial-scale": "A battery factory's announced GWh target is not actual output. The EU Battery Booster Facility highlights the shift from pilot to commercial production.",
    "asml-capacity-plans-reading-manufacturing-forecasts": "ASML's EUV and DUV capacity plans are forecasts, not delivered output. Learn to distinguish capability, orders, deliveries and scenarios.",
  },
  nl: {
    "wat-is-industriele-concurrentie-intelligentie": "Wat is industrieel concurrentieonderzoek? Bepaal de beslisvraag, toets openbare bronnen en onderscheid onderbouwde conclusies van aannames.",
    "wat-publieke-beelden-vertellen-over-industriele-capaciteiten": "Zo beoordeelt u openbare foto's en video's als industrieel bewijs zonder meer te concluderen over planning, capaciteit of productie dan de bron toelaat.",
    "onderscheid-tussen-bewijs-beoordeling-en-gevolgtrekking": "Leer waarneming, beoordeling en gevolgtrekking te scheiden in openbaar bronnenonderzoek, met herleidbare bronnen en zichtbare onzekerheid.",
    "hoe-industriele-bedrijven-concurrentie-informatie-prijsgeven": "Websites, vacatures en beelden kunnen samen meer over een industriebedrijf onthullen. Lees hoe u eigen openbaarmakingen proportioneel beoordeelt.",
    "batterijfabriek-van-proefproductie-naar-commerciele-schaal": "Aangekondigde batterijcapaciteit is geen gerealiseerde productie. De EU Battery Booster Facility toont de stap van proefserie naar commerciële schaal.",
  },
};

export function articleMetadataDescription(locale: Locale, slug: string, fallback: string) {
  return seoDescriptions[locale][slug] ?? fallback;
}

export function articleMetadataTitle(locale: Locale, slug: string, fallback: string) {
  const conciseTitles: Record<Locale, Record<string, string>> = {
    en: {
      "what-public-images-can-reveal-about-industrial-capabilities": "Public Images as Evidence of Industrial Capabilities",
      "separate-evidence-assessment-inference-osint": "Evidence, Assessment and Inference in OSINT",
      "how-industrial-companies-expose-competitive-information": "How Industrial Firms Expose Competitive Information",
      "what-a-factory-expansion-announcement-proves": "ASML Factory Expansion: Claim Versus Evidence",
      "factory-opening-versus-full-production-infineon": "Infineon Fab: Opening Versus Full Production",
      "battery-factory-from-pilot-to-commercial-scale": "Battery Factory: Pilot to Commercial Scale",
    },
    nl: {
      "wat-publieke-beelden-vertellen-over-industriele-capaciteiten": "Openbare beelden en industriële capaciteit",
      "onderscheid-tussen-bewijs-beoordeling-en-gevolgtrekking": "Bewijs en gevolgtrekking in bronnenonderzoek",
      "hoe-industriele-bedrijven-concurrentie-informatie-prijsgeven": "Onbedoelde blootstelling van bedrijfsinformatie",
      "wat-bewijst-een-aangekondigde-fabrieksuitbreiding": "ASML-campus: bouw is nog geen productie",
      "nieuwe-fabriek-openen-versus-volledig-produceren": "Infineon-fabriek: opening versus productie",
      "batterijfabriek-van-proefproductie-naar-commerciele-schaal": "Batterijfabriek: van proef naar productie",
    },
  };
  if (conciseTitles[locale][slug]) return conciseTitles[locale][slug];
  if (slug === "asml-capacity-plans-reading-manufacturing-forecasts") return "ASML Capacity Plans: Reading the Manufacturing Forecast";
  if (slug === "asml-capaciteitsprognose-wat-zeggen-de-cijfers") return "ASML-capaciteitsprognose: wat zeggen de cijfers?";
  return fallback;
}
