import type { Locale } from "@/lib/i18n";

export type Topic = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  definition: string;
  decisions: readonly string[];
  method: string;
  evidenceLimit: string;
  application: string;
  articlePaths: readonly string[];
  servicePaths: readonly string[];
  examplePath: string;
};

const en: readonly Topic[] = [
  {
    slug: "industrial-competitor-analysis", title: "Industrial competitor analysis", metaTitle: "Industrial Competitor Analysis from Public Evidence",
    description: "How industrial competitor analysis supports defined decisions: capabilities, expansion and market position, with sources, uncertainty and clear limits.",
    eyebrow: "Research topic · competition", intro: "A competitor's announcement is a signal, not the complete picture of its capability.",
    definition: "Industrial competitor analysis connects lawfully accessible evidence about products, facilities, partners and market activity to a specific business decision. It does not simply collect every mention of a rival. A useful assessment explains which statements are directly supported, which require interpretation and which remain unknown.",
    decisions: ["Whether a competitor's public capability claim should change a product roadmap", "Whether a factory expansion appears to be a plan, a commissioned facility or demonstrated output", "Which competitor or partner uncertainties justify a deeper technical assessment"],
    method: "We begin with the decision and define the companies, time period and evidence standard. Company documents, public registers, technical publications, vacancies and official imagery can be compared for timing and consistency. Contradictions and alternative explanations are retained rather than edited away.",
    evidenceLimit: "A permit can confirm permission, not production. Recruitment can indicate intent, not installed capacity. A photograph can show equipment, not its uptime or output. Where independent confirmation is absent, a conclusion remains provisional.",
    application: "A focused assessment suits one competitor question. A broader strategic engagement is suitable when several organisations and linked decisions must be compared. Both are scoped and priced before work begins.",
    articlePaths: ["/insights/what-is-industrial-competitive-intelligence", "/insights/what-a-factory-expansion-announcement-proves", "/insights/factory-opening-versus-full-production-infineon"],
    servicePaths: ["/services/focused-intelligence-assessment", "/services/strategic-intelligence-engagement"], examplePath: "/example-case/fourth-pillar",
  },
  {
    slug: "technology-scouting", title: "Technology scouting for industrial decisions", metaTitle: "Technology Scouting with Traceable Evidence",
    description: "Technology scouting for industrial choices: compare approaches, maturity signals and technical claims without treating patents or prototypes as production.",
    eyebrow: "Research topic · technology", intro: "Technology scouting asks what an approach can plausibly do, how mature it is and what remains unproven.",
    definition: "Technology scouting is a structured look at relevant approaches, organisations, technical claims and observable maturity signals around a defined question. It helps product, engineering and strategy teams compare options before committing to a development or partnership path. It is not engineering certification or a substitute for testing a product.",
    decisions: ["Which technical approach merits a closer feasibility review", "Whether a supplier's claimed capability is supported by public documentation", "Which technology or partner assumptions could affect a product or investment decision"],
    method: "We set comparison criteria from the intended decision, then review technical literature, product specifications, patents, public demonstrations and relevant company statements. Dates, source incentives and differences in terminology matter. We separate observed features from analytical judgement and record what would need direct verification.",
    evidenceLimit: "A patent shows a disclosed concept, not a deployed system. A prototype video shows a demonstration under unknown conditions, not stable serial performance. Public material can narrow options, but it cannot reveal confidential specifications or replace laboratory validation.",
    application: "The technical and competitive intelligence service provides a deeper, scoped assessment. A smaller focused assessment can test one decisive claim first.",
    articlePaths: ["/insights/what-public-images-can-reveal-about-industrial-capabilities", "/insights/asml-capacity-plans-reading-manufacturing-forecasts", "/insights/separate-evidence-assessment-inference-osint"],
    servicePaths: ["/services/technical-competitive-intelligence", "/services/focused-intelligence-assessment"], examplePath: "/sample-report",
  },
  {
    slug: "supplier-research", title: "Supplier research from public sources", metaTitle: "Supplier Research for Industrial Decisions",
    description: "Public-source supplier research can clarify visible capabilities and relationships before procurement decisions, while stating what remains unverified.",
    eyebrow: "Research topic · suppliers", intro: "A supplier brochure is a starting point; qualification still needs evidence suited to the decision.",
    definition: "Supplier research examines what public records say about a potential partner's products, facilities, visible projects and relationships. It supports an early commercial or technical decision: which questions to ask, which claims to verify and where a direct qualification process remains necessary. It is an application of a scoped intelligence assessment, not a separate certification service.",
    decisions: ["Which potential suppliers deserve a deeper conversation", "Whether a visible project or partnership supports a claimed capability", "What gaps should a procurement team address before relying on public information"],
    method: "We define the capability and geography in scope, then compare official company material with public tenders, relevant registers, technical documentation and independently published project information. Where names or roles are ambiguous, the report states the ambiguity rather than inferring a relationship.",
    evidenceLimit: "A listed customer does not prove the current scope of supply; a facility image does not prove available capacity; absence of a public record is not proof that a capability does not exist. Direct supplier questionnaires, site visits and contractual checks remain separate steps.",
    application: "A focused intelligence assessment can address one supplier question. A technical and competitive assessment is appropriate when processes, facilities or several relationships need deeper comparison.",
    articlePaths: ["/insights/what-is-industrial-competitive-intelligence", "/insights/factory-opening-versus-full-production-infineon", "/insights/battery-factory-from-pilot-to-commercial-scale"],
    servicePaths: ["/services/focused-intelligence-assessment", "/services/technical-competitive-intelligence"], examplePath: "/example-case/fourth-pillar",
  },
  {
    slug: "public-company-profile", title: "Your company's public information profile", metaTitle: "What Does Your Public Company Profile Reveal?",
    description: "Review what your website, official channels and public imagery may reveal together. A defensive, fixed-scope scan for your own company from €499 excl. VAT.",
    eyebrow: "Research topic · own profile", intro: "Separate public fragments can form a clearer picture of your company than any one page suggests.",
    definition: "A public company profile is the combined impression formed by your own website, official social channels and other material you choose to publish. A defensive review looks at what an outside observer might infer from that material, while distinguishing direct observations from cautious interpretations. It is not penetration testing or monitoring of private accounts.",
    decisions: ["Which public details should be reviewed before a product or facility announcement", "Whether images and videos unintentionally reveal operational context", "Which publication practices deserve priority for internal guidance"],
    method: "The fixed-scope scan reviews one company website and up to two official public channels, with a selected sample of visual material. It records the source and context of notable disclosures, assesses plausible combinations and gives publication priorities. The company retains control over what it changes.",
    evidenceLimit: "A plausible inference is not proof of a hidden capability or an actual security weakness. The scan does not access restricted material, test systems, remove published copies or guarantee that every public mention has been found.",
    application: "The €499 Public Profile Exposure Scan is the defined entry service for your own company. External competitor research is a different assignment with its own scope.",
    articlePaths: ["/insights/how-industrial-companies-expose-competitive-information", "/insights/what-public-images-can-reveal-about-industrial-capabilities"],
    servicePaths: ["/services/public-profile-exposure-scan"], examplePath: "/example-case/public-profile",
  },
];

const nl: readonly Topic[] = [
  {
    slug: "concurrentieanalyse-industrie", title: "Concurrentieanalyse voor de industrie", metaTitle: "Concurrentieanalyse industrie met openbaar bewijs",
    description: "Concurrentieanalyse voor industriële beslissingen: toets capaciteiten, uitbreidingen en marktposities met herleidbare bronnen en zichtbare onzekerheid.",
    eyebrow: "Onderzoeksthema · concurrentie", intro: "Een aankondiging van een concurrent is een signaal, geen compleet beeld van diens capaciteit.",
    definition: "Industriële concurrentieanalyse verbindt rechtmatig toegankelijke informatie over producten, locaties, partners en marktactiviteiten aan één zakelijke beslissing. Het gaat niet om een verzameling van alle vermeldingen van een concurrent. Een bruikbare beoordeling laat zien wat rechtstreeks is onderbouwd, wat interpretatie vraagt en wat onbekend blijft.",
    decisions: ["Moet een openbare capaciteitsclaim van een concurrent uw productplanning beïnvloeden?", "Is een fabrieksuitbreiding een plan, een operationele locatie of aantoonbare productie?", "Welke onzekerheid over concurrent of partner rechtvaardigt verdiepend technisch onderzoek?"],
    method: "Wij bepalen eerst de beslissing, onderzochte ondernemingen, periode en bewijsnorm. Bedrijfsdocumenten, registers, technische publicaties, vacatures en officieel beeldmateriaal worden op tijdlijn en samenhang vergeleken. Tegenstrijdigheden en alternatieve verklaringen blijven zichtbaar.",
    evidenceLimit: "Een vergunning bevestigt toestemming, geen productie. Werving kan wijzen op een voornemen, niet op geïnstalleerde capaciteit. Een foto kan apparatuur tonen, niet de bezettingsgraad of output. Zonder onafhankelijke bevestiging blijft een conclusie voorlopig.",
    application: "Een gerichte beoordeling past bij één concurrentievraag. Een bredere strategische opdracht is geschikt wanneer meerdere organisaties en samenhangende beslissingen vergeleken moeten worden. Scope en prijs worden vooraf afgesproken.",
    articlePaths: ["/nl/artikelen/wat-is-industriele-concurrentie-intelligentie", "/nl/artikelen/wat-bewijst-een-aangekondigde-fabrieksuitbreiding", "/nl/artikelen/nieuwe-fabriek-openen-versus-volledig-produceren"],
    servicePaths: ["/nl/diensten/gerichte-intelligencebeoordeling", "/nl/diensten/strategische-intelligenceopdracht"], examplePath: "/nl/voorbeeldcase/vierde-pijler",
  },
  {
    slug: "technologieverkenning", title: "Technologieverkenning voor industriële keuzes", metaTitle: "Technologieverkenning met herleidbaar bewijs",
    description: "Vergelijk technische benaderingen, ontwikkelingssignalen en leveranciersclaims zonder octrooien of demonstraties als bewezen productie te presenteren.",
    eyebrow: "Onderzoeksthema · technologie", intro: "Technologieverkenning vraagt wat een benadering aannemelijk kan, hoe ver zij is en wat onbewezen blijft.",
    definition: "Technologieverkenning brengt relevante benaderingen, organisaties, technische claims en zichtbare signalen over de ontwikkelingsfase rond een afgebakende vraag in kaart. Product-, engineering- en strategieteams kunnen opties zo beter vergelijken vóór een ontwikkel- of samenwerkingskeuze. Het is geen technische certificering en vervangt geen producttest.",
    decisions: ["Welke technische benadering verdient nader haalbaarheidsonderzoek?", "Wordt een leveranciersclaim door openbare technische documentatie ondersteund?", "Welke aanname over technologie of partner beïnvloedt een product- of investeringsbeslissing?"],
    method: "Wij maken vergelijkingscriteria vanuit de beslissing en bekijken technische literatuur, productspecificaties, octrooien, openbare demonstraties en relevante bedrijfsuitspraken. Datum, belang van de bron en verschillen in terminologie tellen mee. We scheiden zichtbare kenmerken van analytisch oordeel.",
    evidenceLimit: "Een octrooi toont een beschreven concept, geen toegepast systeem. Een prototypevideo laat een demonstratie onder onbekende voorwaarden zien, geen stabiele serieprestatie. Openbare bronnen kunnen opties inperken, maar onthullen geen vertrouwelijke specificaties en vervangen geen laboratoriumvalidatie.",
    application: "Technische en concurrentie-intelligence biedt een verdiepende beoordeling met afgesproken scope. Een gerichte beoordeling kan eerst één doorslaggevende claim toetsen.",
    articlePaths: ["/nl/artikelen/wat-publieke-beelden-vertellen-over-industriele-capaciteiten", "/nl/artikelen/asml-capaciteitsprognose-wat-zeggen-de-cijfers", "/nl/artikelen/onderscheid-tussen-bewijs-beoordeling-en-gevolgtrekking"],
    servicePaths: ["/nl/diensten/technische-concurrentie-intelligence", "/nl/diensten/gerichte-intelligencebeoordeling"], examplePath: "/nl/voorbeeldrapport",
  },
  {
    slug: "leveranciersonderzoek", title: "Leveranciersonderzoek met openbare bronnen", metaTitle: "Leveranciersonderzoek voor industriële beslissingen",
    description: "Openbaar bronnenonderzoek naar zichtbare leverancierscapaciteiten, projecten en relaties vóór een inkoopbeslissing, met duidelijke verificatiegrenzen.",
    eyebrow: "Onderzoeksthema · leveranciers", intro: "Een leveranciersbrochure is een beginpunt; kwalificatie vraagt bewijs dat past bij uw beslissing.",
    definition: "Leveranciersonderzoek bekijkt wat openbare stukken zeggen over producten, locaties, zichtbare projecten en relaties van een mogelijke partner. Het helpt bij een vroege commerciële of technische keuze: welke vragen moeten worden gesteld, welke claims moeten worden getoetst en waar is directe kwalificatie nodig? Het is een toepassing van afgebakend intelligenceonderzoek, geen aparte certificeringsdienst.",
    decisions: ["Welke leveranciers verdienen een verdiepend gesprek?", "Ondersteunt een zichtbaar project of partnerschap een geclaimde capaciteit?", "Welke lacunes moet inkoop aanpakken voordat openbare informatie betrouwbaar genoeg is?"],
    method: "Wij begrenzen de benodigde capaciteit en regio, en vergelijken officieel bedrijfsmateriaal met openbare aanbestedingen, relevante registers, technische documentatie en onafhankelijk gepubliceerd projectmateriaal. Wanneer namen of rollen onduidelijk zijn, vermelden wij dat in plaats van een relatie te veronderstellen.",
    evidenceLimit: "Een genoemde klant bewijst de huidige leveromvang niet; een locatiebeeld bewijst geen beschikbare capaciteit; ontbrekend openbaar bewijs bewijst niet dat een vaardigheid ontbreekt. Vragenlijsten, locatiebezoek en contractcontrole blijven afzonderlijke stappen.",
    application: "Een gerichte intelligencebeoordeling kan één leveranciersvraag behandelen. Een technische en concurrentiegerichte beoordeling past wanneer processen, locaties of meerdere relaties meer diepgang vragen.",
    articlePaths: ["/nl/artikelen/wat-is-industriele-concurrentie-intelligentie", "/nl/artikelen/nieuwe-fabriek-openen-versus-volledig-produceren", "/nl/artikelen/batterijfabriek-van-proefproductie-naar-commerciele-schaal"],
    servicePaths: ["/nl/diensten/gerichte-intelligencebeoordeling", "/nl/diensten/technische-concurrentie-intelligence"], examplePath: "/nl/voorbeeldcase/vierde-pijler",
  },
  {
    slug: "openbaar-bedrijfsprofiel", title: "Wat onthult uw openbare bedrijfsprofiel?", metaTitle: "Openbaar bedrijfsprofiel: wat is zichtbaar?",
    description: "Bekijk wat uw website, officiële kanalen en beelden samen kunnen prijsgeven. Een defensieve scan voor uw eigen bedrijf: €499 excl. btw.",
    eyebrow: "Onderzoeksthema · eigen profiel", intro: "Afzonderlijke openbare fragmenten kunnen samen een scherper bedrijfsbeeld geven dan één pagina laat zien.",
    definition: "Uw openbare bedrijfsprofiel is het gezamenlijke beeld dat ontstaat uit uw website, officiële sociale kanalen en ander materiaal dat uw organisatie zelf publiceert. Een defensieve beoordeling onderzoekt wat een buitenstaander daaruit zou kunnen afleiden en scheidt directe waarnemingen van voorzichtige interpretaties. Het is geen penetratietest of toezicht op besloten accounts.",
    decisions: ["Welke details verdienen controle vóór een product- of locatieaankondiging?", "Kunnen beelden en video's onbedoeld operationele context onthullen?", "Welke publicatiewerkwijze vraagt als eerste interne aandacht?"],
    method: "De scan met vaste scope bekijkt één bedrijfswebsite en maximaal twee officiële openbare kanalen, plus een selectie beeldmateriaal. Wij leggen bron en context van opvallende publicaties vast, beoordelen mogelijke combinaties en geven publicatieprioriteiten. Uw organisatie beslist zelf over wijzigingen.",
    evidenceLimit: "Een aannemelijke gevolgtrekking is geen bewijs van een verborgen capaciteit of een daadwerkelijk beveiligingsprobleem. De scan opent geen afgeschermd materiaal, test geen systemen, verwijdert geen gepubliceerde kopieën en garandeert geen volledige dekking van alle openbare vermeldingen.",
    application: "De openbare-informatiescan van €499 is de afgebakende instapdienst voor uw eigen bedrijf. Onderzoek naar externe concurrenten is een andere opdracht met een eigen scope.",
    articlePaths: ["/nl/artikelen/hoe-industriele-bedrijven-concurrentie-informatie-prijsgeven", "/nl/artikelen/wat-publieke-beelden-vertellen-over-industriele-capaciteiten"],
    servicePaths: ["/nl/diensten/openbare-informatiescan"], examplePath: "/nl/voorbeeldcase/openbaar-profiel",
  },
];

export const seoTopics = { en, nl } as const;

export function getTopic(locale: Locale, slug: string) {
  return seoTopics[locale].find((topic) => topic.slug === slug);
}
