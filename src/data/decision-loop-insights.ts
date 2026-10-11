import { articleSources } from "@/data/article-sources";
import { articleVisuals } from "@/data/article-visuals";
import type { Insight } from "@/data/insights";

const sources = [
  articleSources.microsoftPhysicalAi,
  articleSources.qadDecisioning,
  articleSources.inforIndustryAi,
] as const;

export const decisionLoopInsightEn: Insight = {
  slug: "industrial-ai-decision-loop-manufacturing",
  title: "Industrial AI Beyond the Dashboard: How to Build a Governed Decision Loop",
  description: "How manufacturers can connect signals, operational context, decision ownership and feedback to move industrial AI from insight to governed action.",
  date: "2026-10-12",
  displayDate: "12 October 2026",
  visual: articleVisuals.en.decisionLoop,
  sources,
  sections: [
    {
      heading: "Industrial intelligence closes a decision loop",
      paragraphs: [
        "Industrial intelligence connects operational signals, business context and accountable decision rights to a defined action, then uses the observed outcome to improve the next decision. Analytics can show that something changed. A governed decision loop also states who decides, what the system may do, when a person must intervene and how the result will be checked.",
        "This distinction matters because a dashboard is not an operating decision. A temperature trend, quality deviation or late supplier notice may be accurate and still leave the organisation to assemble context, choose a response, obtain approval and coordinate execution. The useful unit of design is therefore not the model or alert in isolation, but the recurring decision that follows it.",
      ],
    },
    {
      heading: "Why dashboards stop at insight",
      paragraphs: [
        { text: "Microsoft describes physical AI as a continuous loop in which systems perceive conditions, reason over context and act within defined boundaries. Its publication also stresses operating limits, observability, fallback and human approval or override when AI affects the physical world. These are Microsoft's design recommendations, not proof that every industrial AI deployment is governed in this way.", sourceIds: ["microsoft-physical-ai-2026"] },
        { text: "A QAD-hosted article makes a related argument: ERP, MES, QMS, EAM or CMMS and historians may each hold part of the operating picture, while a person still reconciles those fragments into a decision. It proposes a decision and orchestration layer around systems already in use. That is a useful architecture claim, but the article is vendor-hosted thought leadership rather than an independent comparison of implementations.", sourceIds: ["qad-ai-decisioning-2026"] },
        "The practical gap is between recognising a condition and owning the consequence. If the system cannot identify the relevant order, asset state, safety rule, available intervention and responsible owner, it has produced information rather than a complete decision path.",
      ],
    },
    {
      heading: "Five stages of the MelonCactus Industrial Decision Loop",
      paragraphs: [
        "The MelonCactus Industrial Decision Loop is a simple design test: signal → context → decision → action → outcome. Each stage must have an accountable owner and an evidence boundary. The model does not imply that AI should control every stage; it makes explicit where software assists, where a person approves and where automation is not appropriate.",
      ],
      bullets: [
        "Signal: define the event that opens the decision, including thresholds, data quality and false-alarm conditions.",
        "Context: assemble only the operational and business facts needed to understand the consequence, such as asset history, current order, quality status and an authorised operating limit.",
        "Decision: name the owner, permitted options, approval level, evidence threshold and escalation rule.",
        "Action: execute through the system of record or responsible team, with a safe fallback when required information or connectivity is missing.",
        "Outcome: record what happened, whether the decision achieved its intended result and which assumption or rule needs review.",
      ],
    },
    {
      heading: "A bounded maintenance example",
      paragraphs: [
        "Consider a fictional packaging line where a drive temperature rises beyond its normal operating band. The signal alone does not establish a failing bearing, the urgency of intervention or the commercial effect of stopping the line. The system first checks sensor quality, recent maintenance, load, active production order, available spare parts and the approved operating envelope.",
        "Suppose the evidence supports two safe options: reduce load until the current batch completes, or stop for inspection. The maintenance lead owns the choice. The AI may assemble evidence and recommend an option, but it cannot silently widen the temperature limit. If a required sensor is unreliable or the condition moves outside the authorised envelope, the workflow escalates and returns control to the responsible person.",
        "After the intervention, the team records the inspection result, downtime, quality effect and whether the original diagnosis was supported. That feedback can improve a threshold or procedure. It does not prove that the same rule is suitable for another line, drive type or plant without validation.",
      ],
    },
    {
      heading: "Recommendation, bounded execution or controlled autonomy?",
      paragraphs: [
        { text: "Infor's 2026.10 release material describes agents that perform routine work inside approval workflows and involve people at decision points that require judgement. Because this is Infor's own product release, it establishes what the supplier says its software is designed to do; it does not independently establish performance or compliance. The underlying governance question remains useful: which actions are reversible, low-risk and explicitly authorised?", sourceIds: ["infor-industry-ai-2026-10"] },
        "Authority should be assigned per decision, not per technology label. The same agent might be allowed to draft a work order, require approval before reserving a production window and be prohibited from changing a safety limit. A written policy is not enough if the workflow cannot enforce it or preserve a decision record.",
      ],
      table: {
        caption: "Three practical authority levels for an industrial AI workflow",
        headers: ["Level", "What AI may do", "Human role"],
        rows: [
          ["Recommendation", "Analyse evidence and recommend an option", "Decide, approve and execute"],
          ["Bounded execution", "Perform pre-authorised, reversible actions within explicit limits", "Approve the boundary and handle exceptions"],
          ["Controlled autonomy", "Decide and execute inside a validated operating envelope", "Set policy, monitor outcomes and retain intervention authority"],
        ],
      },
    },
    {
      heading: "Five questions before scaling",
      paragraphs: [
        { text: "Microsoft advises starting with one bounded operation and designing a successful pattern so that it can be reused. QAD similarly argues for one recurring decision with definable authority and a measurable outcome. Reuse should follow evidence: a pattern is not transferable merely because two lines use similar equipment.", sourceIds: ["microsoft-physical-ai-2026", "qad-ai-decisioning-2026"] },
      ],
      bullets: [
        "What exact event opens the decision, and how will missing, delayed or contradictory data be handled?",
        "Who owns the decision and its operational result, including the cost of a false positive or delayed response?",
        "Which evidence, rule or person may confirm, overrule or stop the recommendation?",
        "Which outcome will be recorded, and who reviews whether the intervention actually helped?",
        "Which context, controls and tests must remain consistent before the pattern is repeated on another line or site?",
      ],
    },
    {
      heading: "Start with the decision, not the model",
      paragraphs: [
        "A useful first project is a recurring decision with a clear consequence, an identifiable owner and boundaries that can be stated before automation begins. Map the current path from signal to action, including manual judgement, inaccessible data and exceptions. Only then decide where analytics, an agent or conventional workflow automation adds value.",
        "The goal is not maximum autonomy. It is a decision that becomes more timely, traceable and consistent without hiding uncertainty or transferring accountability to a model. Start with one bounded loop, measure the operational result and expand only when the evidence supports reuse.",
      ],
    },
    {
      heading: "Frequently asked questions",
      markdown: `### What is industrial intelligence?

Industrial intelligence is the disciplined use of operational, technical and commercial information to support a defined industrial decision. It connects evidence to ownership and action while preserving uncertainty.

### What is an industrial AI decision loop?

It is a repeatable path from signal through context, decision and action to a measured outcome. Governance specifies the owner, evidence threshold, authority boundary, exception path and feedback.

### How is decision intelligence different from business intelligence?

Business intelligence commonly describes performance through reports and dashboards. Decision intelligence focuses on how a specific choice is framed, governed, executed and evaluated. The two can work together.

### When should an industrial AI agent require human approval?

Approval is appropriate when an action is safety-critical, difficult to reverse, outside validated limits, based on incomplete evidence or carries material operational, legal or commercial consequences.

### How do ERP and MES contribute to industrial AI?

ERP can provide orders, inventory, cost and authority context; MES and other operational systems can provide current production state. Neither automatically creates a governed decision. Their data must be relevant, reliable and connected to an owned workflow.`,
    },
  ],
};

export const decisionLoopInsightNl: Insight = {
  slug: "industriele-ai-beslislus-productie",
  title: "Industriële AI voorbij het dashboard: zo bouwt u een beheerste beslislus",
  description: "Hoe productiebedrijven signalen, operationele context, besliseigenaarschap en terugkoppeling verbinden om van inzicht naar beheerst handelen te komen.",
  date: "2026-10-12",
  displayDate: "12 oktober 2026",
  visual: articleVisuals.nl.decisionLoop,
  sources,
  sections: [
    {
      heading: "Industrial intelligence sluit de beslislus",
      paragraphs: [
        "Industrial intelligence verbindt operationele signalen, zakelijke context en verantwoordelijke beslisrechten aan een afgebakende actie. De gemeten uitkomst voedt daarna de volgende beslissing. Analytics kan tonen dat iets verandert. Een beheerste beslislus legt ook vast wie beslist, wat het systeem mag doen, wanneer een mens moet ingrijpen en hoe het resultaat wordt gecontroleerd.",
        "Dat verschil is belangrijk, want een dashboard is nog geen operationele beslissing. Een temperatuurtrend, kwaliteitsafwijking of vertraagd leveranciersbericht kan juist zijn, terwijl de organisatie nog steeds context moet verzamelen, een reactie moet kiezen, goedkeuring moet regelen en de uitvoering moet coördineren. Ontwerp daarom niet alleen het model of alarm, maar vooral de terugkerende beslissing die erop volgt.",
      ],
    },
    {
      heading: "Waarom dashboards bij inzicht stoppen",
      paragraphs: [
        { text: "Microsoft beschrijft physical AI als een doorlopende lus waarin systemen omstandigheden waarnemen, over context redeneren en binnen vastgestelde grenzen handelen. De publicatie benadrukt daarnaast bedrijfsgrenzen, observeerbaarheid, terugvalprocedures en menselijke goedkeuring of ingrijpen wanneer AI de fysieke wereld raakt. Dit zijn ontwerpaanbevelingen van Microsoft, geen bewijs dat iedere industriële AI-toepassing zo wordt beheerst.", sourceIds: ["microsoft-physical-ai-2026"] },
        { text: "Een artikel op het platform van QAD voert een verwant argument aan: ERP, MES, QMS, EAM of CMMS en historians kunnen elk een deel van het operationele beeld bevatten, terwijl een medewerker die fragmenten nog tot een beslissing moet verbinden. Het artikel stelt een beslis- en orkestratielaag rond bestaande systemen voor. Dat is een bruikbare architectuurgedachte, maar geen onafhankelijke vergelijking van implementaties.", sourceIds: ["qad-ai-decisioning-2026"] },
        "De praktische leemte ligt tussen het herkennen van een toestand en het dragen van de gevolgen. Als het systeem de relevante order, toestand van de installatie, veiligheidsregel, beschikbare ingreep en verantwoordelijke eigenaar niet kan verbinden, heeft het informatie geleverd maar nog geen volledige beslisroute.",
      ],
    },
    {
      heading: "Vijf stappen van de MelonCactus Industrial Decision Loop",
      paragraphs: [
        "De MelonCactus Industrial Decision Loop is een eenvoudige ontwerptoets: signaal → context → beslissing → actie → uitkomst. Iedere stap vraagt een verantwoordelijke eigenaar en een duidelijke bewijsgrens. Het model veronderstelt niet dat AI iedere stap bestuurt; het maakt zichtbaar waar software ondersteunt, waar een mens goedkeurt en waar automatisering niet passend is.",
      ],
      bullets: [
        "Signaal: definieer de gebeurtenis die de beslissing opent, inclusief drempels, datakwaliteit en voorwaarden voor een vals alarm.",
        "Context: verzamel alleen de operationele en zakelijke feiten die nodig zijn om het gevolg te begrijpen, zoals onderhoudshistorie, actuele order, kwaliteitsstatus en toegestane bedrijfsgrens.",
        "Beslissing: benoem eigenaar, toegestane opties, goedkeuringsniveau, bewijsdrempel en escalatieregel.",
        "Actie: voer uit via het bronsysteem of verantwoordelijke team, met een veilige terugval wanneer informatie of verbinding ontbreekt.",
        "Uitkomst: leg vast wat gebeurde, of het beoogde resultaat is bereikt en welke aanname of regel moet worden beoordeeld.",
      ],
    },
    {
      heading: "Een begrensd onderhoudsvoorbeeld",
      paragraphs: [
        "Neem een fictieve verpakkingslijn waar de temperatuur van een aandrijving boven de normale bandbreedte stijgt. Het signaal bewijst op zichzelf geen defect lager, urgentie of commercieel gevolg van een lijnstop. Het systeem controleert eerst de sensorkwaliteit, recente onderhoudshistorie, belasting, actieve productieorder, beschikbare onderdelen en de toegestane bedrijfsgrenzen.",
        "Stel dat het bewijs twee veilige opties ondersteunt: tijdelijk de belasting verlagen totdat de lopende batch gereed is, of stoppen voor inspectie. De onderhoudsverantwoordelijke is eigenaar van de keuze. AI mag het bewijs samenbrengen en een optie adviseren, maar niet ongemerkt de temperatuurgrens verruimen. Als een noodzakelijke sensor onbetrouwbaar is of de toestand buiten de toegestane grens komt, escaleert het proces en krijgt de verantwoordelijke persoon de regie terug.",
        "Na de ingreep legt het team inspectieresultaat, stilstand, kwaliteitseffect en de houdbaarheid van de oorspronkelijke diagnose vast. Die terugkoppeling kan een drempel of procedure verbeteren. Zij bewijst niet dat dezelfde regel zonder validatie geschikt is voor een andere lijn, aandrijving of fabriek.",
      ],
    },
    {
      heading: "Advies, begrensde uitvoering of gecontroleerde autonomie?",
      paragraphs: [
        { text: "Infor beschrijft in de productinformatie voor versie 2026.10 agents die routinematig werk binnen goedkeuringsprocessen uitvoeren en mensen betrekken bij beslissingen die oordeel vragen. Omdat dit Infors eigen releasepublicatie is, toont zij hoe de leverancier zijn software positioneert; zij bewijst prestaties of compliance niet onafhankelijk. De onderliggende beheersvraag blijft bruikbaar: welke acties zijn omkeerbaar, laagrisico en expliciet toegestaan?", sourceIds: ["infor-industry-ai-2026-10"] },
        "Wijs bevoegdheid per beslissing toe, niet per technologielabel. Dezelfde agent kan een werkorder mogen opstellen, goedkeuring nodig hebben voordat hij een productieperiode reserveert en geen veiligheidsgrens mogen wijzigen. Een schriftelijk beleid volstaat niet als het proces de grens niet kan afdwingen of geen beslisregistratie bewaart.",
      ],
      table: {
        caption: "Drie praktische bevoegdheidsniveaus voor een industriële AI-workflow",
        headers: ["Niveau", "Wat AI mag doen", "Rol van de mens"],
        rows: [
          ["Advies", "Bewijs analyseren en een optie aanbevelen", "Beslissen, goedkeuren en uitvoeren"],
          ["Begrensde uitvoering", "Vooraf toegestane, omkeerbare acties binnen expliciete grenzen uitvoeren", "De grens goedkeuren en uitzonderingen behandelen"],
          ["Gecontroleerde autonomie", "Binnen een gevalideerd bedrijfsgebied beslissen en uitvoeren", "Beleid vaststellen, uitkomsten controleren en kunnen ingrijpen"],
        ],
      },
    },
    {
      heading: "Vijf vragen vóór opschaling",
      paragraphs: [
        { text: "Microsoft adviseert te beginnen met één begrensde operatie en een succesvol patroon zo te ontwerpen dat hergebruik mogelijk wordt. QAD pleit eveneens voor één terugkerende beslissing met definieerbare bevoegdheid en een meetbare uitkomst. Hergebruik moet op bewijs volgen: een patroon is niet automatisch overdraagbaar omdat twee lijnen vergelijkbare apparatuur gebruiken.", sourceIds: ["microsoft-physical-ai-2026", "qad-ai-decisioning-2026"] },
      ],
      bullets: [
        "Welke exacte gebeurtenis opent de beslissing, en hoe behandelt u ontbrekende, vertraagde of tegenstrijdige data?",
        "Wie is eigenaar van de beslissing en het operationele resultaat, inclusief de gevolgen van een vals alarm of vertraagde reactie?",
        "Welk bewijs, welke regel of welke persoon mag het advies bevestigen, overrulen of stoppen?",
        "Welke uitkomst wordt vastgelegd, en wie beoordeelt of de ingreep werkelijk hielp?",
        "Welke context, beheersmaatregelen en tests moeten gelijk blijven voordat het patroon op een andere lijn of locatie wordt herhaald?",
      ],
    },
    {
      heading: "Begin met de beslissing, niet met het model",
      paragraphs: [
        "Een bruikbaar eerste project is een terugkerende beslissing met een duidelijk gevolg, een herkenbare eigenaar en grenzen die vóór automatisering kunnen worden vastgelegd. Breng de huidige route van signaal naar actie in kaart, inclusief menselijk oordeel, ontoegankelijke data en uitzonderingen. Bepaal pas daarna waar analytics, een agent of traditionele workflowautomatisering waarde toevoegt.",
        "Het doel is niet maximale autonomie. Het doel is een tijdigere, herleidbare en consistentere beslissing zonder onzekerheid te verbergen of verantwoordelijkheid aan een model over te dragen. Begin met één begrensde lus, meet het operationele resultaat en breid alleen uit wanneer het bewijs hergebruik ondersteunt.",
      ],
    },
    {
      heading: "Veelgestelde vragen",
      markdown: `### Wat is industrial intelligence?

Industrial intelligence is het gedisciplineerde gebruik van operationele, technische en commerciële informatie voor een afgebakende industriële beslissing. Het verbindt bewijs met eigenaarschap en actie, terwijl onzekerheid zichtbaar blijft.

### Wat is een beslislus voor industriële AI?

Het is een herhaalbare route van signaal via context, beslissing en actie naar een gemeten uitkomst. Beheersing legt eigenaar, bewijsdrempel, bevoegdheidsgrens, uitzonderingsroute en terugkoppeling vast.

### Hoe verschilt decision intelligence van business intelligence?

Business intelligence beschrijft vaak prestaties via rapportages en dashboards. Decision intelligence richt zich op de manier waarop een specifieke keuze wordt afgebakend, beheerst, uitgevoerd en beoordeeld. Beide kunnen elkaar aanvullen.

### Wanneer moet een industriële AI-agent menselijke goedkeuring vragen?

Goedkeuring is passend als een actie veiligheidskritisch, moeilijk omkeerbaar, buiten gevalideerde grenzen of op onvolledig bewijs gebaseerd is, of wezenlijke operationele, juridische of commerciële gevolgen heeft.

### Hoe dragen ERP en MES bij aan industriële AI?

ERP kan context leveren over orders, voorraad, kosten en bevoegdheden; MES en andere operationele systemen kunnen de actuele productiestatus leveren. Geen van beide vormt automatisch een beheerste beslissing. De data moeten relevant, betrouwbaar en aan een proces met een eigenaar verbonden zijn.`,
    },
  ],
};
