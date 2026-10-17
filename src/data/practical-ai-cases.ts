import type { Insight } from "@/data/insights";

const publicationDate = "2026-10-17";

export const practicalAiCasesEn: readonly Insight[] = [
  {
    kind: "fictional-ai-case",
    slug: "fictional-ai-case-internal-knowledge-search",
    title: "Fictional AI Case: Finding Technical Knowledge Without Guessing",
    description: "How a fictional technical service company could test an internal AI knowledge search while keeping sources, document versions and human review visible.",
    date: publicationDate,
    displayDate: "17 October 2026",
    sections: [
      {
        heading: "The fictional situation: knowledge spread across documents",
        paragraphs: [
          "A fictional technical service company has manuals, work instructions, supplier bulletins and project notes stored in several folders. Experienced employees usually know where to look, but newer colleagues may spend too long searching or rely on an old document. Management wants practical AI help, but does not want a chatbot that invents an answer and presents it as policy.",
          "The decision is deliberately narrow: can an internal AI search workflow help employees locate the right passage faster while leaving interpretation and action with the employee? This is a knowledge-retrieval question, not a promise that AI can replace technical judgement.",
        ],
      },
      {
        heading: "Start with one document set and one type of question",
        paragraphs: [
          "The first step would be to select a controlled set of current documents, assign an owner and record the version and validity of each file. A small trial might focus on maintenance instructions for one product family. Questions outside that set should produce a clear boundary instead of a plausible-sounding answer.",
          "A useful response would contain the relevant passage, document title and version. The employee should be able to open the original source before relying on the answer. If sources conflict, the workflow should show the conflict rather than silently choose one.",
        ],
        bullets: [
          "Use only approved documents with a known owner",
          "Show the source passage and document version with every answer",
          "Refuse questions that fall outside the indexed material",
          "Keep technical approval with a qualified employee",
        ],
      },
      {
        heading: "What an AI workday could test",
        paragraphs: [
          "During a practical AI workday, the team could collect representative questions, define what a good answer must contain and test where ordinary search already works well. A bounded prototype could then compare keyword search with an AI-assisted route. The purpose is to learn which approach is more usable, not to force AI into every question.",
          "The test should include deliberately difficult examples: an obsolete instruction, two documents that use different terminology and a question that cannot be answered from the available material. Those cases reveal whether the workflow makes uncertainty visible.",
        ],
      },
      {
        heading: "Privacy, access and maintenance remain part of the design",
        paragraphs: [
          "Before business information is used, the company would need to decide which tool and subscription are suitable, who may search which documents and how queries are logged. Confidential project files and personal information should not be added merely because they are available. A test can begin with sanitised examples.",
          "An internal AI knowledge base also needs maintenance. When a document changes, the index and version record must change with it. Without ownership, an apparently helpful answer can still point to outdated information.",
        ],
      },
      {
        heading: "A sensible outcome is evidence for a decision",
        paragraphs: [
          "The trial succeeds if employees can find traceable information for the agreed question set and understand when they must return to the original document or an expert. It may also show that better folder structure, metadata or ordinary search solves most of the problem.",
          "Only after that evidence would the fictional company decide whether to expand the document set or connect the workflow to another system. That is a practical route to AI knowledge management for an SME: one bounded use case, visible sources and no hidden transfer of responsibility.",
        ],
      },
    ],
  },
  {
    kind: "fictional-ai-case",
    slug: "fictional-ai-case-tender-document-review",
    title: "Fictional AI Case: Comparing Tender Documents With Human Review",
    description: "A fictional installation company explores AI document comparison for tender requirements, changes and unanswered questions without automating commercial commitments.",
    date: publicationDate,
    displayDate: "17 October 2026",
    sections: [
      {
        heading: "The fictional situation: important requirements in many files",
        paragraphs: [
          "A fictional installation company receives a tender package containing specifications, appendices, planning conditions and later clarifications. Different employees review different files. The risk is not only missed text; a revised requirement may be noticed by one person but not reflected in the final proposal.",
          "The company asks whether AI can support tender document review. The responsible question is not whether AI can write and submit a bid. It is whether a controlled workflow can help identify requirements, versions and possible conflicts so that commercial and technical specialists can review them.",
        ],
      },
      {
        heading: "Turn the document set into a review matrix",
        paragraphs: [
          "A first trial could use one completed, non-confidential example package. The workflow would extract candidate requirements into a matrix containing the source file, page, topic, responsible reviewer and status. Later documents would be compared with the earlier set, with possible additions and changes marked for attention.",
          "The output remains a draft. Tables, drawings, cross-references and ambiguous wording can be misread. Every material requirement must therefore remain connected to the original page, and the reviewer must be able to reject or correct the extraction.",
        ],
        bullets: [
          "Keep file names, dates and versions visible",
          "Link each extracted requirement to its original passage",
          "Mark uncertainty and conflicting interpretations",
          "Require named review for price, scope and contractual commitments",
        ],
      },
      {
        heading: "Use a small test before connecting systems",
        paragraphs: [
          "The fictional company could begin with a manual upload and export rather than an immediate integration with document management or estimating software. This keeps the first AI automation trial inspectable. It also shows whether the team can define a consistent requirement taxonomy before investing in a connection.",
          "Test cases should include scanned pages, a withdrawn appendix and a clarification that changes an earlier requirement. If the workflow cannot make those boundaries clear, the appropriate outcome may be a narrower use case or no implementation.",
        ],
      },
      {
        heading: "Commercial judgement cannot be delegated",
        paragraphs: [
          "An AI-supported matrix may help organise evidence, but it cannot decide whether the company accepts a liability, meets a technical condition or should price an uncertainty. Those decisions require authorised people and the wider context of the opportunity.",
          "Access control and retention also matter because tender material can contain confidential or personal information. The company should agree which information enters the tool, where it is processed and when trial files are removed before testing with live material.",
        ],
      },
      {
        heading: "Measure completeness and review quality, not impressive prose",
        paragraphs: [
          "A sensible evaluation checks whether reviewers can trace every proposed requirement, find missed changes and resolve exceptions. Time may matter, but speed alone is not a safe success measure for a tender workflow.",
          "The fictional case illustrates a restrained form of AI automation for SMEs: AI prepares a structured comparison, while people remain responsible for interpretation, pricing and submission. The best next step might be a reusable review template rather than a fully automated bid process.",
        ],
      },
    ],
  },
  {
    kind: "fictional-ai-case",
    slug: "fictional-ai-case-meeting-follow-up",
    title: "Fictional AI Case: Turning Meetings Into Reviewed Follow-Up",
    description: "How a fictional industrial maintenance team could test AI meeting notes, action points and follow-up while preserving consent, context and ownership.",
    date: publicationDate,
    displayDate: "17 October 2026",
    sections: [
      {
        heading: "The fictional situation: decisions disappear into separate notes",
        paragraphs: [
          "A fictional industrial maintenance provider holds customer calls, planning meetings and toolbox discussions throughout the week. Actions are sometimes written in personal notes, sometimes added to the planning tool and sometimes remembered only by the people present. The company is considering AI meeting notes to make follow-up more consistent.",
          "The objective is not to record every conversation by default. It is to test whether an authorised transcript from a defined meeting type can be converted into a draft summary and action list that a participant reviews before anything is shared or entered into another system.",
        ],
      },
      {
        heading: "Define the meeting boundary before choosing a tool",
        paragraphs: [
          "The team would first choose one recurring operational meeting, identify who needs to consent to recording and decide what must never be captured. The output format could separate decisions, actions, owners, dates and unresolved questions. Statements that are unclear should remain marked as unclear.",
          "Names, customer details and safety information require particular care. A transcript should not be reused for unrelated analysis, and an automatically suggested owner or deadline must not become an instruction without review.",
        ],
        bullets: [
          "Obtain appropriate agreement before recording or transcribing",
          "Use a fixed draft format for decisions, actions and unknowns",
          "Let a named participant validate the summary",
          "Send or store the output only after that review",
        ],
      },
      {
        heading: "A practical AI workday can expose the exceptions",
        paragraphs: [
          "A workday could compare several fictional or sanitised transcripts. The team would examine speaker confusion, technical terms, incomplete decisions and moments where an action depends on information outside the meeting. This produces a realistic error list before any automated follow-up is considered.",
          "The first workflow might generate only a draft in a controlled folder. A later connection to a CRM or planning system should be a separate decision, because creating records changes the operational impact of an error.",
        ],
      },
      {
        heading: "Human review protects both relationships and operations",
        paragraphs: [
          "A fluent summary can still change the meaning of a customer statement or omit an important condition. The reviewer needs access to the source transcript and, where appropriate, the original recording. For sensitive meetings, the right answer may be not to use automated transcription at all.",
          "The company should also set retention rules for recordings, transcripts and approved notes. Keeping every intermediate file indefinitely is not necessary for the intended workflow and creates avoidable exposure.",
        ],
      },
      {
        heading: "The test should improve accountability, not create more messages",
        paragraphs: [
          "The fictional team would judge the trial by the correctness and traceability of actions, the effort needed for review and whether employees know which version is authoritative. More summaries are not automatically better follow-up.",
          "If the approach works, a next step could cover another meeting type or a carefully controlled export. If it does not, a simpler meeting template may be the better solution. Practical AI guidance should make that option visible as well.",
        ],
      },
    ],
  },
  {
    kind: "fictional-ai-case",
    slug: "fictional-ai-case-service-request-intake",
    title: "Fictional AI Case: Structuring Customer Requests Before Work Starts",
    description: "A fictional technical wholesaler tests AI-supported customer intake to organise requests, attachments and missing information without sending automatic promises.",
    date: publicationDate,
    displayDate: "17 October 2026",
    sections: [
      {
        heading: "The fictional situation: every request arrives differently",
        paragraphs: [
          "A fictional technical wholesaler receives customer requests by email with product descriptions, photographs, spreadsheets and delivery questions. Employees first determine what the customer is asking, whether enough information is present and which colleague should review it. The variety makes a rigid form difficult, but completely manual intake creates retyping and inconsistent handovers.",
          "The company wants to explore AI automation for customer requests. The bounded goal is to prepare a structured internal intake and identify missing information. The workflow must not select a product, set a price or promise a delivery date without authorised review.",
        ],
      },
      {
        heading: "Separate extraction from a business decision",
        paragraphs: [
          "A small trial could extract the sender's stated requirement, referenced product, quantity, requested date and attachments into a draft record. It could also flag fields that appear incomplete. The original email and files remain the source; the draft is a navigation aid for the employee.",
          "The distinction matters because a customer's wording may be ambiguous and an attachment may contradict the email. AI can organise candidate information, but the employee decides what the request means and which questions must be asked.",
        ],
        bullets: [
          "Preserve the original message and attachments",
          "Show which text supports each extracted field",
          "Route uncertain cases to a person instead of guessing",
          "Prevent automatic prices, delivery promises or product advice",
        ],
      },
      {
        heading: "Test with representative variation",
        paragraphs: [
          "The fictional company could create a test set covering a clear request, an incomplete message, an unusual file type and a request containing several products. Employees would define which errors are tolerable and which require the workflow to stop.",
          "Starting without a live mailbox connection keeps the experiment contained. If the structured draft proves useful, a later phase could examine safe intake from a shared mailbox and controlled transfer into the existing system.",
        ],
      },
      {
        heading: "Customer information requires deliberate handling",
        paragraphs: [
          "Requests may contain names, contact details and commercially sensitive files. Before live data is used, the company needs suitable access, processing and retention arrangements. Fictitious examples are enough to design the fields and review steps during the first workshop.",
          "Automatic replies also require caution. A polite message can still create an expectation or disclose information to the wrong recipient. The first version should therefore prepare an internal draft, not send external communication.",
        ],
      },
      {
        heading: "A useful pilot makes the next decision easier",
        paragraphs: [
          "The trial should show whether employees receive a more complete, traceable starting point and whether exceptions are sent to the right reviewer. It should also reveal the ongoing work: maintaining categories, handling new document types and checking provider settings.",
          "This fictional case shows how administrative processes can be automated in stages. For an SME, a reliable internal intake may be more valuable than a broad customer-service agent. The appropriate scope follows from the task, the information and the consequences of a wrong answer.",
        ],
      },
    ],
  },
];

export const practicalAiCasesNl: readonly Insight[] = [
  {
    kind: "fictional-ai-case",
    slug: "fictieve-ai-case-interne-kennisbank",
    title: "Fictieve AI-case: technische kennis vinden zonder te gokken",
    description: "Hoe een fictief technisch dienstverlenend bedrijf een interne AI-kennisbank kan toetsen met zichtbare bronnen, documentversies en menselijke controle.",
    date: publicationDate,
    displayDate: "17 oktober 2026",
    sections: [
      {
        heading: "De fictieve situatie: kennis verspreid over documenten",
        paragraphs: [
          "Een fictief technisch dienstverlenend bedrijf bewaart handleidingen, werkinstructies, leveranciersbulletins en projectnotities in verschillende mappen. Ervaren medewerkers weten meestal waar zij moeten zoeken. Nieuwe collega's zijn langer bezig of gebruiken soms een verouderd document. De directie wil praktische AI-hulp, maar geen chatbot die een antwoord verzint en als beleid presenteert.",
          "De beslisvraag blijft bewust klein: kan een interne AI-zoekfunctie medewerkers sneller naar de juiste passage leiden, terwijl interpretatie en handelen bij de medewerker blijven? Dit gaat over kennis terugvinden, niet over het vervangen van technisch oordeel.",
        ],
      },
      {
        heading: "Begin met één documentset en één type vraag",
        paragraphs: [
          "De eerste stap is een beheerde set actuele documenten kiezen, een eigenaar aanwijzen en versie en geldigheid per bestand vastleggen. Een kleine proef kan zich richten op onderhoudsinstructies voor één productfamilie. Een vraag buiten die set moet een duidelijke grens opleveren in plaats van een aannemelijk klinkend antwoord.",
          "Een bruikbaar antwoord toont de relevante passage, documenttitel en versie. De medewerker moet de oorspronkelijke bron kunnen openen voordat het antwoord wordt gebruikt. Spreken bronnen elkaar tegen, dan moet de werkwijze dat conflict tonen en niet stilzwijgend één bron kiezen.",
        ],
        bullets: [
          "Gebruik alleen goedgekeurde documenten met een bekende eigenaar",
          "Toon bij ieder antwoord de bronpassage en documentversie",
          "Weiger vragen buiten het opgenomen materiaal",
          "Laat technische goedkeuring bij een bevoegde medewerker",
        ],
      },
      {
        heading: "Wat een praktische AI-werkdag kan toetsen",
        paragraphs: [
          "Tijdens een AI-werkdag kan het team representatieve vragen verzamelen, bepalen wat een goed antwoord moet bevatten en vaststellen waar gewone zoekfuncties al voldoen. Een afgebakende proef kan daarna zoeken op trefwoorden vergelijken met AI-ondersteund zoeken. Het doel is leren welke aanpak bruikbaar is, niet AI in iedere vraag dwingen.",
          "De test hoort ook lastige voorbeelden te bevatten: een vervallen instructie, twee documenten met andere terminologie en een vraag die niet uit het beschikbare materiaal kan worden beantwoord. Juist die gevallen laten zien of de werkwijze onzekerheid zichtbaar maakt.",
        ],
      },
      {
        heading: "Privacy, toegang en onderhoud horen bij het ontwerp",
        paragraphs: [
          "Voordat bedrijfsinformatie wordt gebruikt, bepaalt het bedrijf welke tool en abonnementsvorm passend zijn, wie welke documenten mag doorzoeken en hoe zoekvragen worden vastgelegd. Vertrouwelijke projectbestanden en persoonsgegevens worden niet toegevoegd alleen omdat ze beschikbaar zijn. Een proef kan beginnen met opgeschoonde voorbeelden.",
          "Een interne AI-kennisbank vraagt ook onderhoud. Verandert een document, dan moeten de index en versieregistratie meeveranderen. Zonder eigenaarschap kan een behulpzaam antwoord alsnog naar verouderde informatie verwijzen.",
        ],
      },
      {
        heading: "Een verstandige uitkomst is bewijs voor een besluit",
        paragraphs: [
          "De proef slaagt wanneer medewerkers voor de afgesproken vragen herleidbare informatie vinden en begrijpen wanneer zij naar het oorspronkelijke document of een expert moeten terugkeren. De proef kan ook aantonen dat betere mappen, metadata of gewone zoekfuncties het grootste deel van het probleem oplossen.",
          "Pas met dat bewijs besluit het fictieve bedrijf of het meer documenten opneemt of een koppeling onderzoekt. Zo blijft kennismanagement met AI beheersbaar voor het mkb: één afgebakende toepassing, zichtbare bronnen en geen verborgen overdracht van verantwoordelijkheid.",
        ],
      },
    ],
  },
  {
    kind: "fictional-ai-case",
    slug: "fictieve-ai-case-aanbestedingsdocumenten-vergelijken",
    title: "Fictieve AI-case: aanbestedingsdocumenten vergelijken met menselijke controle",
    description: "Een fictief installatiebedrijf onderzoekt AI voor documentvergelijking, eisen en wijzigingen zonder commerciële toezeggingen te automatiseren.",
    date: publicationDate,
    displayDate: "17 oktober 2026",
    sections: [
      {
        heading: "De fictieve situatie: belangrijke eisen in veel bestanden",
        paragraphs: [
          "Een fictief installatiebedrijf ontvangt een aanbestedingspakket met specificaties, bijlagen, planningsvoorwaarden en latere nota's van inlichtingen. Verschillende medewerkers beoordelen verschillende bestanden. Het risico is niet alleen een gemiste passage: een gewijzigde eis kan bij één medewerker bekend zijn, maar niet in het uiteindelijke voorstel terechtkomen.",
          "Het bedrijf vraagt of AI aanbestedingsdocumenten kan helpen vergelijken. De verantwoorde vraag is niet of AI zelfstandig een inschrijving kan schrijven en indienen. Het gaat erom of een beheerste werkwijze eisen, versies en mogelijke conflicten kan ordenen voor beoordeling door technische en commerciële specialisten.",
        ],
      },
      {
        heading: "Zet de documentset om in een beoordelingsmatrix",
        paragraphs: [
          "Een eerste proef kan één afgerond, niet-vertrouwelijk voorbeeldpakket gebruiken. De werkwijze zet mogelijke eisen in een matrix met bronbestand, pagina, onderwerp, verantwoordelijke beoordelaar en status. Latere documenten worden met de eerdere set vergeleken, waarna mogelijke toevoegingen en wijzigingen aandacht krijgen.",
          "De uitkomst blijft een concept. Tabellen, tekeningen, kruisverwijzingen en dubbelzinnige tekst kunnen verkeerd worden gelezen. Iedere materiële eis blijft daarom gekoppeld aan de oorspronkelijke pagina en de beoordelaar moet extracties kunnen afwijzen of corrigeren.",
        ],
        bullets: [
          "Houd bestandsnamen, data en versies zichtbaar",
          "Koppel iedere gevonden eis aan de oorspronkelijke passage",
          "Markeer onzekerheid en tegenstrijdige interpretaties",
          "Vereis benoemde controle voor prijs, omvang en contractuele toezeggingen",
        ],
      },
      {
        heading: "Begin met een kleine proef voordat systemen worden gekoppeld",
        paragraphs: [
          "Het fictieve bedrijf kan beginnen met handmatig uploaden en exporteren, zonder directe koppeling met documentbeheer of calculatiesoftware. Zo blijft de eerste AI-automatiseringsproef controleerbaar. Ook wordt duidelijk of het team een consistente indeling van eisen kan maken voordat in een koppeling wordt geïnvesteerd.",
          "Testgevallen bevatten bijvoorbeeld een gescande pagina, een ingetrokken bijlage en een toelichting die een eerdere eis wijzigt. Kan de werkwijze die grenzen niet duidelijk tonen, dan past mogelijk een kleinere toepassing of geen implementatie.",
        ],
      },
      {
        heading: "Zakelijk oordeel kan niet worden uitbesteed",
        paragraphs: [
          "Een AI-ondersteunde matrix kan bewijs ordenen, maar niet beslissen of het bedrijf aansprakelijkheid aanvaardt, aan een technische voorwaarde voldoet of een onzekerheid moet prijzen. Daarvoor zijn bevoegde mensen en de bredere context van de kans nodig.",
          "Ook toegang en bewaring tellen mee, omdat aanbestedingsmateriaal vertrouwelijke of persoonlijke informatie kan bevatten. Het bedrijf spreekt vóór gebruik van actuele bestanden af welke informatie in de tool komt, waar verwerking plaatsvindt en wanneer proefbestanden worden verwijderd.",
        ],
      },
      {
        heading: "Meet volledigheid en beoordelingskwaliteit, geen fraaie tekst",
        paragraphs: [
          "Een verstandige evaluatie kijkt of beoordelaars iedere voorgestelde eis kunnen herleiden, gemiste wijzigingen vinden en uitzonderingen oplossen. Tijd kan relevant zijn, maar snelheid alleen is geen veilige succesmaat voor een aanbestedingsproces.",
          "Deze fictieve case laat een terughoudende vorm van AI-automatisering voor het mkb zien: AI bereidt een gestructureerde vergelijking voor, terwijl mensen verantwoordelijk blijven voor interpretatie, prijs en indiening. Een herbruikbaar beoordelingssjabloon kan een betere vervolgstap zijn dan een volledig geautomatiseerde inschrijving.",
        ],
      },
    ],
  },
  {
    kind: "fictional-ai-case",
    slug: "fictieve-ai-case-gespreksverslagen-automatiseren",
    title: "Fictieve AI-case: van overleg naar gecontroleerde opvolging",
    description: "Hoe een fictief industrieel onderhoudsteam AI voor gespreksverslagen en actiepunten kan toetsen met toestemming, context en duidelijk eigenaarschap.",
    date: publicationDate,
    displayDate: "17 oktober 2026",
    sections: [
      {
        heading: "De fictieve situatie: besluiten verdwijnen in losse notities",
        paragraphs: [
          "Een fictieve industriële onderhoudsdienst voert iedere week klantgesprekken, planningsoverleggen en toolboxmeetings. Acties staan soms in persoonlijke notities, soms in het planningssysteem en soms alleen in het geheugen van aanwezigen. Het bedrijf overweegt AI voor gespreksverslagen om de opvolging consistenter te maken.",
          "Het doel is niet ieder gesprek standaard opnemen. De proef onderzoekt of een toegestaan transcript van één afgebakend type overleg kan worden omgezet in een conceptsamenvatting en actielijst die een deelnemer controleert voordat informatie wordt gedeeld of in een ander systeem terechtkomt.",
        ],
      },
      {
        heading: "Bepaal de gespreksgrens vóór de keuze van een tool",
        paragraphs: [
          "Het team kiest eerst één terugkerend operationeel overleg, bepaalt wie met opname moet instemmen en legt vast wat nooit mag worden vastgelegd. Het uitvoerformaat kan besluiten, acties, eigenaren, data en open vragen scheiden. Onduidelijke uitspraken blijven als onduidelijk gemarkeerd.",
          "Namen, klantgegevens en veiligheidsinformatie vragen extra zorg. Een transcript wordt niet voor ander onderzoek hergebruikt. Een automatisch voorgestelde eigenaar of datum wordt bovendien geen opdracht zonder menselijke beoordeling.",
        ],
        bullets: [
          "Regel passende instemming vóór opname of transcriptie",
          "Gebruik een vast conceptformat voor besluiten, acties en onbekenden",
          "Laat een benoemde deelnemer de samenvatting controleren",
          "Deel of bewaar de uitkomst pas na die controle",
        ],
      },
      {
        heading: "Een AI-werkdag maakt uitzonderingen zichtbaar",
        paragraphs: [
          "Tijdens een praktische AI-werkdag kan het team enkele fictieve of opgeschoonde transcripties vergelijken. Daarbij wordt gelet op verwisselde sprekers, technische termen, onvolledige besluiten en acties die informatie buiten het overleg nodig hebben. Zo ontstaat een realistische foutenlijst voordat automatische opvolging wordt overwogen.",
          "De eerste werkwijze kan alleen een concept in een beheerde map opleveren. Een latere koppeling met CRM of planning is een afzonderlijk besluit, omdat het aanmaken van registraties de operationele gevolgen van een fout vergroot.",
        ],
      },
      {
        heading: "Menselijke controle beschermt relaties en uitvoering",
        paragraphs: [
          "Een vloeiende samenvatting kan de betekenis van een klantuitspraak veranderen of een belangrijke voorwaarde weglaten. De beoordelaar heeft toegang nodig tot het bronstranscript en, waar passend, de oorspronkelijke opname. Bij gevoelige gesprekken kan de juiste uitkomst zijn dat automatische transcriptie niet wordt gebruikt.",
          "Het bedrijf stelt daarnaast bewaartermijnen vast voor opnamen, transcripties en goedgekeurde notities. Ieder tussenbestand onbeperkt bewaren is niet nodig voor de bedoelde werkwijze en creëert extra blootstelling.",
        ],
      },
      {
        heading: "De proef moet verantwoordelijkheid verbeteren, niet meer berichten maken",
        paragraphs: [
          "Het fictieve team beoordeelt de proef op juistheid en herleidbaarheid van acties, benodigde controletijd en duidelijkheid over de gezaghebbende versie. Meer samenvattingen betekenen niet automatisch betere opvolging.",
          "Werkt de aanpak, dan kan een volgend type overleg of een beheerste export worden onderzocht. Werkt zij niet, dan kan een eenvoudiger vergadersjabloon beter zijn. Praktisch AI-advies hoort ook die uitkomst zichtbaar te maken.",
        ],
      },
    ],
  },
  {
    kind: "fictional-ai-case",
    slug: "fictieve-ai-case-klantaanvragen-automatiseren",
    title: "Fictieve AI-case: klantaanvragen structureren vóór het werk begint",
    description: "Een fictieve technische groothandel toetst AI voor klantaanvragen, bijlagen en ontbrekende informatie zonder automatisch prijzen of levertijden toe te zeggen.",
    date: publicationDate,
    displayDate: "17 oktober 2026",
    sections: [
      {
        heading: "De fictieve situatie: iedere aanvraag komt anders binnen",
        paragraphs: [
          "Een fictieve technische groothandel ontvangt klantaanvragen per e-mail met productomschrijvingen, foto's, spreadsheets en leveringsvragen. Medewerkers bepalen eerst wat de klant vraagt, of genoeg informatie aanwezig is en welke collega moet beoordelen. Door de variatie past een star formulier niet altijd, terwijl volledig handmatige intake leidt tot overtypen en wisselende overdracht.",
          "Het bedrijf wil AI-automatisering voor klantaanvragen onderzoeken. Het afgebakende doel is een gestructureerde interne intake voorbereiden en ontbrekende informatie aanwijzen. De werkwijze kiest geen product, stelt geen prijs vast en belooft geen leverdatum zonder bevoegde controle.",
        ],
      },
      {
        heading: "Scheid het uitlezen van de zakelijke beslissing",
        paragraphs: [
          "Een kleine proef kan de genoemde behoefte, het product, aantal, gewenste datum en bijlagen in een conceptregistratie zetten. Ook kan zij aangeven welke velden mogelijk ontbreken. De oorspronkelijke e-mail en bestanden blijven de bron; het concept helpt de medewerker navigeren.",
          "Dat onderscheid is belangrijk omdat klanttekst dubbelzinnig kan zijn en een bijlage de e-mail kan tegenspreken. AI kan mogelijke informatie ordenen, maar de medewerker bepaalt wat de aanvraag betekent en welke vragen nog moeten worden gesteld.",
        ],
        bullets: [
          "Bewaar het oorspronkelijke bericht en de bijlagen",
          "Toon welke tekst ieder uitgelezen veld ondersteunt",
          "Stuur onzekere gevallen naar een medewerker in plaats van te gokken",
          "Voorkom automatische prijzen, leverbeloften of productadvies",
        ],
      },
      {
        heading: "Toets met representatieve variatie",
        paragraphs: [
          "Het fictieve bedrijf kan een testset maken met een duidelijke aanvraag, een onvolledig bericht, een ongebruikelijk bestandstype en een vraag met meerdere producten. Medewerkers bepalen welke fouten acceptabel zijn en bij welke onzekerheid de werkwijze moet stoppen.",
          "Beginnen zonder koppeling met een actuele mailbox houdt het experiment beheersbaar. Blijkt het gestructureerde concept bruikbaar, dan kan een volgende fase veilige intake vanuit een gedeelde mailbox en beheerste overdracht naar het bestaande systeem onderzoeken.",
        ],
      },
      {
        heading: "Klantinformatie vraagt bewuste verwerking",
        paragraphs: [
          "Aanvragen kunnen namen, contactgegevens en commercieel gevoelige bestanden bevatten. Vóór gebruik van actuele gegevens zijn passende afspraken over toegang, verwerking en bewaring nodig. Fictieve voorbeelden zijn voldoende om tijdens de eerste sessie velden en controlestappen te ontwerpen.",
          "Ook automatische antwoorden vragen terughoudendheid. Een beleefd bericht kan een verwachting wekken of informatie aan de verkeerde ontvanger tonen. De eerste versie bereidt daarom een intern concept voor en verstuurt geen externe communicatie.",
        ],
      },
      {
        heading: "Een bruikbare proef maakt het volgende besluit eenvoudiger",
        paragraphs: [
          "De proef laat zien of medewerkers een vollediger en herleidbaar startpunt krijgen en of uitzonderingen bij de juiste beoordelaar terechtkomen. Ook wordt zichtbaar welk beheer nodig blijft: categorieën onderhouden, nieuwe bestandstypen verwerken en leveranciersinstellingen controleren.",
          "Deze fictieve case laat zien hoe administratieve processen stapsgewijs kunnen worden geautomatiseerd. Voor een mkb-bedrijf kan een betrouwbare interne intake waardevoller zijn dan een brede klantenservice-agent. De passende omvang volgt uit de taak, de informatie en de gevolgen van een verkeerd antwoord.",
        ],
      },
    ],
  },
];

export function practicalAiCases(locale: "en" | "nl") {
  return locale === "nl" ? practicalAiCasesNl : practicalAiCasesEn;
}
