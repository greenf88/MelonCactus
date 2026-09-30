export type HomeLocale = "en" | "nl";

type HomeContent = {
  hero: { eyebrow: string; title: string; intro: string; primary: string; secondary: string };
  applications: readonly string[];
  decisions: {
    eyebrow: string; title: string; intro: string;
    items: readonly { title: string; description: string }[];
  };
  deliverable: {
    eyebrow: string; title: string; intro: string; fictional: string;
    decision: string; evidence: string; assessment: string; inference: string;
    unknown: string; confidence: string; summary: string; findings: string; scope: string; sources: string;
    implications: string; cta: string;
  };
  examples: {
    eyebrow: string; title: string; intro: string; disclaimer: string;
    questionLabel: string; signalsLabel: string; findingLabel: string;
    unknownLabel: string; decisionLabel: string;
    items: readonly {
      title: string; href: string; question: string; signals: string;
      finding: string; unknown: string; decision: string; cta: string;
    }[];
  };
  comparison: {
    eyebrow: string; title: string; intro: string; us: string; alternative: string;
    rows: readonly { us: string; alternative: string }[];
    note: string;
  };
  pricing: { eyebrow: string; title: string; intro: string; distinction: string; note: string; cta: string };
  process: {
    eyebrow: string; title: string; intro: string; question: string;
    items: readonly { title: string; description: string }[];
    note: string; cta: string;
  };
  faq: { eyebrow: string; title: string; items: readonly { question: string; answer: string }[] };
  identity: { eyebrow: string; title: string; body: string; operator: string; boundary: string; emailLabel: string };
  closing: { eyebrow: string; title: string; body: string; primary: string; secondary: string };
};

export const commercialHome: Record<HomeLocale, HomeContent> = {
  en: {
    hero: {
      eyebrow: "Industrial Intelligence",
      title: "Public evidence for decisions about competitors, technology and markets.",
      intro: "MelonCactus examines what public sources substantiate—and what remains uncertain or unknown—so industrial and technology leaders can make better-informed decisions.",
      primary: "Discuss your research question",
      secondary: "View an example",
    },
    applications: [
      "Assess competitors and technology",
      "Map markets, suppliers and projects",
      "Review your company's public information profile",
    ],
    decisions: {
      eyebrow: "When to engage us",
      title: "Start with the decision, not the search terms.",
      intro: "A defined business question determines which public evidence matters and where the limits of an assessment lie.",
      items: [
        { title: "Assess a competitor or technology", description: "Test public claims about capability, technology, projects, deliveries or market position before relying on them." },
        { title: "Understand a market, customer or supplier", description: "Map relevant organisations, relationships, projects and public signals around an investment or commercial decision." },
        { title: "Verify an industrial claim", description: "Establish which public records support a technical or commercial assertion—and which evidence is missing." },
        { title: "Review your own public profile", description: "See what separate public sources, and their combination, might reveal about your business." },
      ],
    },
    deliverable: {
      eyebrow: "The deliverable",
      title: "A decision-ready report with its evidence and limits in view.",
      intro: "The agreed scope determines the depth. A report separates an executive view from the source trail, contrary signals and what cannot be established.",
      fictional: "Illustrative extract · entirely fictional, not a client report",
      decision: "Could a proposed supplier expansion justify a shorter lead-time assumption?",
      evidence: "Evidence · a published building notice and a dated exterior image indicate physical expansion.",
      assessment: "Assessment · preparation for expansion is plausible; operating output is not demonstrated.",
      inference: "Inference · additional production may follow, but timing and scale remain uncertain.",
      unknown: "Unknown · commissioned capacity, stable output and actual delivery performance.",
      confidence: "Confidence is stated per finding, never implied for the entire case.",
      summary: "Executive summary", findings: "Key findings",
      scope: "Scope and decision question",
      sources: "Source register and evidence trail",
      implications: "Implications and next questions",
      cta: "Explore the fictional sample report",
    },
    examples: {
      eyebrow: "Illustrative assignments",
      title: "Two decisions. Two different evidence questions.",
      intro: "These examples show the shape of an assignment, not work performed for a client.",
      disclaimer: "Both Company X scenarios are fictional. No actual client, finding or business outcome is claimed.",
      questionLabel: "Decision question",
      signalsLabel: "Public signals",
      findingLabel: "What the example can establish",
      unknownLabel: "What remains open",
      decisionLabel: "Decision use",
      items: [
        {
          title: "A fourth business pillar", href: "/example-case/fourth-pillar",
          question: "Which adjacent direction fits existing technology and capabilities?",
          signals: "Published market activity, competitor positions, projects and supplier links.",
          finding: "The fictional first report identifies a concept worth examining; a separate follow-up frames the competitor landscape.",
          unknown: "Technical feasibility, demand and commercial success are not proven.",
          decision: "Choose where to investigate further before committing resources.",
          cta: "Read the fictional fourth-pillar case",
        },
        {
          title: "A company's public profile", href: "/example-case/public-profile",
          question: "What might an outside observer infer from the company's online presence?",
          signals: "Company-owned web pages, official public channels and selected visual material.",
          finding: "The fictional example shows how combined publications may reveal more than a single item.",
          unknown: "The complete picture and any actual third-party use cannot be inferred.",
          decision: "Prioritise a careful review of future public communications.",
          cta: "Read the fictional public-profile case",
        },
      ],
    },
    comparison: {
      eyebrow: "Why a defined assessment",
      title: "More than a collection of search results.",
      intro: "General desk research and AI summaries can be useful starting points. A scoped assessment adds a reviewable basis for a specific decision.",
      us: "A MelonCactus engagement", alternative: "What a general search or summary may lack",
      rows: [
        { us: "Relevant conclusions linked to traceable sources", alternative: "Sources without a clear evidence trail" },
        { us: "Evidence, assessment and inference kept distinct", alternative: "Observation and interpretation mixed together" },
        { us: "Technical and commercial context for the agreed question", alternative: "A broader descriptive overview" },
        { us: "Contradictions, unknowns and confidence stated", alternative: "Uncertainty less visible" },
        { us: "Defined scope and careful handling of the enquiry", alternative: "An unbounded search task" },
        { us: "Scope, fixed fee and delivery date agreed in writing", alternative: "No defined research deliverable or deadline" },
      ],
      note: "This compares assignment formats, not the reliability of every other researcher or tool. Conclusions still depend on the quality of available public evidence.",
    },
    pricing: {
      eyebrow: "Engagements and indicative fees",
      title: "Choose the scope that fits the question.",
      intro: "The fixed-scope scan is for your own public profile. The three intelligence options address external decisions with increasing analytical depth.",
      distinction: "The €499 scan reviews your own company-owned public presence. An assessment from €995 addresses a defined external intelligence question; it is not an expanded version of the scan.",
      note: "Starting fees are indicative, not online order prices. Final scope, deliverables, fixed fee and delivery date are confirmed in writing before work begins. Timing and any priority request depend on scope, evidence and capacity.",
      cta: "Compare the services and scope",
    },
    process: {
      eyebrow: "Working together",
      title: "A clear route from enquiry to report.",
      intro: "The commercial process is separate from the research method: first agree the decision and assignment, then validate the evidence.",
      question: "What decision are you trying to make?",
      items: [
        { title: "Confidential enquiry", description: "Tell us the decision and any relevant timing; an enquiry is not an order." },
        { title: "Define the question", description: "Discuss decision context, boundaries and what public evidence could reasonably answer." },
        { title: "Written scope confirmation", description: "Confirm deliverables, fixed fee and delivery date in writing before research begins." },
        { title: "Research and validation", description: "Examine lawful public sources and test material findings against their provenance and limits." },
        { title: "Report delivery", description: "Receive the agreed report with findings, sources, uncertainty and decision implications." },
        { title: "Discussion and clarification", description: "Review the conclusions and clarify questions within the agreed assignment." },
      ],
      note: "A first conversation or form submission does not create an engagement. Any follow-up work is scoped separately.",
      cta: "Read the research methodology",
    },
    faq: {
      eyebrow: "Questions before you enquire", title: "Frequently asked questions",
      items: [
        { question: "Does MelonCactus use only public sources?", answer: "Research is based on lawfully accessible public sources within the agreed scope. We do not access private systems or use information obtained unlawfully." },
        { question: "What is the difference between public information and confidential company information?", answer: "Public information is lawfully available without access to a private system or account. Material you provide for context may be confidential even when the research itself uses public sources; we handle it under the agreed scope and applicable privacy terms." },
        { question: "What information must a client provide?", answer: "Usually the decision, the subject, relevant context and any deadline. We confirm any additional materials needed before an assignment starts; do not send secrets or sensitive personal data through the initial form." },
        { question: "How is confidential information handled?", answer: "Enquiries and supplied context are handled discreetly and used to assess or perform the agreed work. The privacy notice explains personal-data handling; specific confidentiality requirements can be discussed before sharing sensitive materials." },
        { question: "Can MelonCactus work under an NDA?", answer: "An NDA can be discussed before a project is agreed. Requesting one in the form does not itself create an NDA; any terms must be accepted separately in writing." },
        { question: "How do you handle uncertainty or conflicting sources?", answer: "We distinguish direct evidence from assessment and inference, state confidence for material findings, and show relevant contradictions and information gaps. Weak evidence is not presented as certainty." },
        { question: "How does the €499 scan differ from an assessment starting at €995?", answer: "The fixed-scope scan concerns your own company website and up to two official public channels. The focused assessment addresses a separately defined external intelligence question and can require a broader evidence review." },
        { question: "How is the final fee determined?", answer: "We review the question, scope, required sources, deliverable and timing, then confirm a fixed fee in writing before work begins. Published starting fees are indicative for the broader assessments." },
        { question: "How long does research take?", answer: "Delivery depends on scope, source availability and capacity. We confirm a date in writing before work begins; selecting a requested timing in the form is not acceptance of that deadline." },
        { question: "Can the conclusion be that there is insufficient public evidence?", answer: "Yes. If the available evidence does not support a responsible conclusion, the report states that limit and identifies what remains unknown." },
        { question: "Does MelonCactus investigate people?", answer: "Our work concerns defined industrial and commercial questions, not private lives. Public references to professional roles may be considered only where relevant and lawful within the agreed scope." },
        { question: "What is expressly outside the service?", answer: "No unauthorised access, deception, impersonation, social engineering, private-life investigation or use of stolen information. We do not guarantee that every question can be answered from public evidence." },
      ],
    },
    identity: {
      eyebrow: "Business identity", title: "Independent research with explicit boundaries.",
      body: "MelonCactus is an industrial-intelligence practice operated by GFNI. We structure lawful public evidence around a defined business decision and make the limits of that evidence visible.",
      operator: "Operated by GFNI", boundary: "Public sources only · no unauthorised access", emailLabel: "Confidential enquiry",
    },
    closing: {
      eyebrow: "Begin with the decision", title: "What do you need to decide?",
      body: "Describe the question and the timing that matters. We will discuss whether public evidence can support a responsible, clearly scoped assessment.",
      primary: "Discuss your research question", secondary: "View the sample report",
    },
  },
  nl: {
    hero: {
      eyebrow: "Industrial Intelligence",
      title: "Openbaar bewijs voor beslissingen over concurrenten, technologie en markten.",
      intro: "MelonCactus onderzoekt wat openbare bronnen aantoonbaar zeggen — en wat onzeker of onbekend blijft — zodat technische en commerciële beslissers beter onderbouwde keuzes kunnen maken.",
      primary: "Bespreek uw onderzoeksvraag", secondary: "Bekijk een voorbeeld",
    },
    applications: [
      "Concurrenten en technologie beoordelen",
      "Markten, leveranciers en projecten in kaart brengen",
      "Het openbare informatieprofiel van uw bedrijf onderzoeken",
    ],
    decisions: {
      eyebrow: "Wanneer schakelt u ons in?", title: "Begin bij de beslissing, niet bij de zoektermen.",
      intro: "Een afgebakende zakelijke vraag bepaalt welk openbaar bewijs relevant is en waar de grenzen van een beoordeling liggen.",
      items: [
        { title: "Concurrent of technologie beoordelen", description: "Toets openbare claims over capaciteit, technologie, projecten, leveringen of marktpositie voordat u daarop vertrouwt." },
        { title: "Markt, klant of leverancier onderzoeken", description: "Breng relevante partijen, relaties, projecten en openbare signalen in kaart voor een investerings- of commerciële beslissing." },
        { title: "Een industriële claim verifiëren", description: "Onderzoek welke openbare bronnen een technische of commerciële bewering ondersteunen en welke informatie ontbreekt." },
        { title: "Uw eigen openbare profiel onderzoeken", description: "Bekijk wat afzonderlijke openbare bronnen én hun combinatie over uw bedrijf kunnen prijsgeven." },
      ],
    },
    deliverable: {
      eyebrow: "Wat u ontvangt", title: "Een rapport voor uw beslissing, met bewijs en grenzen in beeld.",
      intro: "De afgesproken opdracht bepaalt de diepgang. Het rapport scheidt de samenvatting voor beslissers van de onderliggende bewijsvoering, tegenstrijdige signalen en informatie die niet kan worden vastgesteld.",
      fictional: "Illustratief fragment · volledig fictief, geen klantrapport",
      decision: "Rechtvaardigt een aangekondigde uitbreiding van een leverancier een kortere aanname over de levertijd?",
      evidence: "Bewijs · een openbaar bouwbericht en een gedateerde buitenfoto wijzen op fysieke uitbreiding.",
      assessment: "Beoordeling · voorbereiding op uitbreiding is aannemelijk; productiecapaciteit is niet aangetoond.",
      inference: "Gevolgtrekking · extra productie kan volgen, maar tijdstip en omvang blijven onzeker.",
      unknown: "Onbekend · opgeleverde capaciteit, stabiele productie en werkelijke levertijden.",
      confidence: "Bewijskracht wordt per bevinding aangegeven, niet stilzwijgend voor de hele casus.",
      summary: "Managementsamenvatting", findings: "Belangrijkste bevindingen",
      scope: "Afbakening en beslisvraag", sources: "Bronregister en bewijsvoering",
      implications: "Gevolgen en vervolgvragen", cta: "Bekijk het fictieve voorbeeldrapport",
    },
    examples: {
      eyebrow: "Illustratieve opdrachten", title: "Twee beslissingen. Twee verschillende bewijsvragen.",
      intro: "Deze voorbeelden tonen hoe een opdracht eruit kan zien, niet wat voor een klant is uitgevoerd.",
      disclaimer: "Beide scenario’s rond Bedrijf X zijn fictief. Er wordt geen werkelijke klant, bevinding of bedrijfsresultaat geclaimd.",
      questionLabel: "Beslisvraag", signalsLabel: "Openbare signalen", findingLabel: "Wat het voorbeeld laat zien",
      unknownLabel: "Wat openblijft", decisionLabel: "Gebruik voor de beslissing",
      items: [
        {
          title: "Een vierde bedrijfspijler", href: "/nl/voorbeeldcase/vierde-pijler",
          question: "Welke nieuwe richting past bij bestaande technologie en capaciteiten?",
          signals: "Openbare marktactiviteit, concurrentieposities, projecten en leveranciersrelaties.",
          finding: "Het fictieve eerste rapport wijst een idee aan voor nader onderzoek; een afzonderlijk vervolg brengt concurrenten in beeld.",
          unknown: "Technische haalbaarheid, vraag en commercieel succes zijn niet bewezen.",
          decision: "Bepaal welke mogelijkheid nader onderzoek verdient voordat u middelen vastlegt.",
          cta: "Lees de fictieve case over de vierde pijler",
        },
        {
          title: "Het openbare bedrijfsprofiel", href: "/nl/voorbeeldcase/openbaar-profiel",
          question: "Wat kan een buitenstaander uit de online aanwezigheid van het bedrijf afleiden?",
          signals: "De eigen website, officiële openbare kanalen en geselecteerd beeldmateriaal.",
          finding: "Het fictieve voorbeeld laat zien hoe gecombineerde publicaties meer kunnen prijsgeven dan één afzonderlijk bericht.",
          unknown: "Een volledig beeld of daadwerkelijk gebruik door derden is hieruit niet af te leiden.",
          decision: "Bepaal welke toekomstige openbare uitingen extra controle verdienen.",
          cta: "Lees de fictieve case over het openbare profiel",
        },
      ],
    },
    comparison: {
      eyebrow: "Waarom een afgebakende beoordeling?", title: "Meer dan een verzameling zoekresultaten.",
      intro: "Algemeen bureauonderzoek en AI-samenvattingen kunnen nuttige vertrekpunten zijn. Een afgebakende beoordeling voegt een toetsbare basis toe voor een specifieke beslissing.",
      us: "Een opdracht bij MelonCactus", alternative: "Wat bij een algemene zoekopdracht of samenvatting kan ontbreken",
      rows: [
        { us: "Relevante conclusies gekoppeld aan herleidbare bronnen", alternative: "Losse bronnen zonder helder bewijs- en bronnenpad" },
        { us: "Bewijs, beoordeling en gevolgtrekking apart behandeld", alternative: "Waarneming en interpretatie kunnen door elkaar lopen" },
        { us: "Technische en zakelijke context voor de afgesproken vraag", alternative: "Beperkte context bij de specifieke beslissing" },
        { us: "Tegenstrijdigheden, onbekenden en bewijskracht benoemd", alternative: "Onzekerheid blijft soms buiten beeld" },
        { us: "Een afgebakende opdracht en zorgvuldige behandeling van uw vraag", alternative: "Geen duidelijke onderzoeksgrens" },
        { us: "Opdracht, vaste prijs en opleverdatum schriftelijk afgesproken", alternative: "Geen afgesproken oplevering of termijn" },
      ],
      note: "Dit vergelijkt opdrachtvormen, niet de betrouwbaarheid van iedere andere onderzoeker of tool. Conclusies blijven afhankelijk van de kwaliteit van beschikbaar openbaar bewijs.",
    },
    pricing: {
      eyebrow: "Opdrachten en indicatieve prijzen", title: "Kies de omvang die past bij uw vraag.",
      intro: "De scan met vaste scope gaat over uw eigen openbare profiel. De drie intelligenceopdrachten ondersteunen externe beslissingen met oplopende analytische diepgang.",
      distinction: "De scan van €499 onderzoekt de openbare aanwezigheid van uw eigen bedrijf. De beoordeling vanaf €995 gaat over een afgebakende externe intelligencevraag; het is geen uitgebreide versie van de scan.",
      note: "Vanafprijzen zijn indicatief, geen online bestelprijzen. Definitieve opdracht, resultaten, vaste prijs en opleverdatum worden vóór aanvang schriftelijk bevestigd. Doorlooptijd en een eventueel verzoek om prioriteit hangen af van de opdracht, bronnen en capaciteit.",
      cta: "Vergelijk diensten en afbakening",
    },
    process: {
      eyebrow: "Samenwerken", title: "Een helder traject van aanvraag tot rapport.",
      intro: "Het klantproces staat los van de onderzoeksmethode: eerst bepalen wij de beslissing en de opdracht, daarna controleren wij het bewijs.",
      question: "Welke beslissing probeert u te nemen?",
      items: [
        { title: "Vertrouwelijke intake", description: "Beschrijf de beslissing en gewenste termijn; een aanvraag is nog geen opdracht." },
        { title: "Vraag afbakenen", description: "Bespreek de besliscontext, grenzen en wat met openbaar bewijs redelijkerwijs kan worden vastgesteld." },
        { title: "Schriftelijke bevestiging", description: "Wij bevestigen de afbakening, op te leveren onderdelen, vaste prijs en opleverdatum schriftelijk voordat het onderzoek begint." },
        { title: "Onderzoek en broncontrole", description: "Onderzoek rechtmatig toegankelijke openbare bronnen en toets belangrijke bevindingen op herkomst en beperkingen." },
        { title: "Rapportage", description: "Ontvang het afgesproken rapport met bevindingen, bronnen, onzekerheden en gevolgen voor de beslissing." },
        { title: "Bespreking en verduidelijking", description: "Bespreek conclusies en verduidelijk vragen binnen de afgesproken opdracht." },
      ],
      note: "Een eerste gesprek of formulierinzending schept geen opdracht. Eventueel vervolgwerk wordt afzonderlijk afgebakend.",
      cta: "Lees de onderzoeksmethode",
    },
    faq: {
      eyebrow: "Vragen vóór uw aanvraag", title: "Veelgestelde vragen",
      items: [
        { question: "Gebruikt MelonCactus uitsluitend openbare bronnen?", answer: "Het onderzoek is gebaseerd op rechtmatig toegankelijke openbare bronnen binnen de afgesproken opdracht. Wij verkrijgen geen toegang tot besloten systemen en gebruiken geen onrechtmatig verkregen informatie." },
        { question: "Wat is het verschil tussen openbare informatie en vertrouwelijke bedrijfsinformatie?", answer: "Openbare informatie is rechtmatig toegankelijk zonder toegang tot een besloten systeem of account. Informatie die u voor de context verstrekt, kan vertrouwelijk zijn, ook wanneer het onderzoek zelf openbare bronnen gebruikt. Wij behandelen die binnen de afgesproken opdracht en toepasselijke privacyvoorwaarden." },
        { question: "Welke informatie moet een opdrachtgever aanleveren?", answer: "Meestal de beslissing, het onderwerp, relevante context en een eventuele deadline. Vóór de start bevestigen wij welke aanvullende stukken nodig zijn. Deel via het eerste formulier geen bedrijfsgeheimen of gevoelige persoonsgegevens." },
        { question: "Hoe wordt vertrouwelijke informatie behandeld?", answer: "Aanvragen en verstrekte context worden zorgvuldig behandeld en gebruikt om de opdracht te beoordelen of uit te voeren. De privacyverklaring beschrijft de verwerking van persoonsgegevens; specifieke geheimhoudingswensen kunnen vóór het delen van gevoelige stukken worden besproken." },
        { question: "Kan MelonCactus onder een NDA werken?", answer: "Een geheimhoudingsovereenkomst kan vóór het aangaan van een opdracht worden besproken. Een verzoek in het formulier vormt op zichzelf geen NDA; eventuele afspraken moeten afzonderlijk schriftelijk worden aanvaard." },
        { question: "Hoe behandelt u onzekerheid en tegenstrijdige bronnen?", answer: "Wij scheiden direct bewijs van beoordeling en gevolgtrekking, geven bij belangrijke bevindingen de bewijskracht aan en tonen relevante tegenstrijdigheden en hiaten. Zwak bewijs presenteren wij niet als zekerheid." },
        { question: "Wat is het verschil tussen de scan van €499 en een beoordeling vanaf €995?", answer: "De scan met vaste scope betreft uw eigen bedrijfswebsite en maximaal twee officiële openbare kanalen. De gerichte beoordeling behandelt een afzonderlijk afgebakende externe intelligencevraag en kan een bredere bronbeoordeling vereisen." },
        { question: "Hoe wordt de definitieve prijs bepaald?", answer: "Wij beoordelen de vraag, omvang, benodigde bronnen, oplevering en termijn. Daarna bevestigen wij vóór aanvang een vaste prijs schriftelijk. De gepubliceerde vanafprijzen voor de bredere beoordelingen zijn indicatief." },
        { question: "Hoe lang duurt een onderzoek?", answer: "Dat hangt af van opdracht, bronbeschikbaarheid en capaciteit. Wij bevestigen vóór aanvang schriftelijk een opleverdatum; een gewenste termijn in het formulier is nog geen aanvaarding van die deadline." },
        { question: "Kan de conclusie zijn dat er onvoldoende openbaar bewijs is?", answer: "Ja. Als beschikbaar bewijs geen verantwoorde conclusie draagt, vermeldt het rapport die grens en wat onbekend blijft." },
        { question: "Onderzoekt MelonCactus personen?", answer: "Ons werk gaat over afgebakende industriële en zakelijke vragen, niet over het privéleven van personen. Openbare verwijzingen naar professionele functies komen alleen in beeld wanneer dat relevant en rechtmatig is binnen de afgesproken opdracht." },
        { question: "Wat valt nadrukkelijk buiten de dienstverlening?", answer: "Geen ongeautoriseerde toegang, misleiding, voordoen als een ander, social engineering, onderzoek naar het privéleven of gebruik van gestolen informatie. Wij garanderen niet dat iedere vraag met openbaar bewijs kan worden beantwoord." },
      ],
    },
    identity: {
      eyebrow: "Bedrijfsidentiteit", title: "Onafhankelijk onderzoek met duidelijke grenzen.",
      body: "MelonCactus is een onafhankelijk onderzoeksbureau voor industriële intelligence, geëxploiteerd door GFNI. Wij ordenen rechtmatig toegankelijk openbaar bewijs rond een afgebakende zakelijke beslissing en maken de beperkingen daarvan zichtbaar.",
      operator: "Geëxploiteerd door GFNI", boundary: "Alleen openbare bronnen · geen ongeautoriseerde toegang", emailLabel: "Vertrouwelijke aanvraag",
    },
    closing: {
      eyebrow: "Begin bij de beslissing", title: "Welke beslissing wilt u nemen?",
      body: "Beschrijf uw vraag en de termijn die voor u telt. Wij bespreken of openbaar bewijs een verantwoorde, helder afgebakende beoordeling mogelijk maakt.",
      primary: "Bespreek uw onderzoeksvraag", secondary: "Bekijk het voorbeeldrapport",
    },
  },
};
