export type ArticleSource = {
  id: string;
  organization: string;
  title: string;
  url: string;
  date?: string;
  dateKind?: "published" | "reviewed" | "updated";
  datePrecision?: "day" | "month" | "year";
  accessed: string;
  note: { en: string; nl: string };
};

const accessed = "2026-10-07";

export const articleSources = {
  scipEthics: {
    id: "scip-ethics",
    organization: "Strategic Consortium of Intelligence Professionals (SCIP)",
    title: "SCIP Code of Ethics",
    url: "https://scip.world/ethics/",
    accessed,
    note: {
      en: "Professional-association guidance, not legislation. The page does not state a publication or update date.",
      nl: "Richtlijn van een beroepsvereniging, geen wetgeving. De pagina vermeldt geen publicatie- of wijzigingsdatum.",
    },
  },
  espacenet: {
    id: "epo-espacenet",
    organization: "European Patent Office",
    title: "Espacenet – patent search",
    url: "https://www.epo.org/en/searching-for-patents/technical/espacenet",
    accessed,
    note: {
      en: "Describes the official search service and its coverage. A patent document records a filing or claim; it does not by itself prove operating capability. The page does not state a publication or update date.",
      nl: "Beschrijft de officiële zoekdienst en de dekking ervan. Een octrooidocument legt een aanvraag of claim vast, maar bewijst op zichzelf geen operationele capaciteit. De pagina vermeldt geen publicatie- of wijzigingsdatum.",
    },
  },
  ted: {
    id: "eu-ted",
    organization: "Publications Office of the European Union",
    title: "About TED: The Online EU Procurement Supplement",
    url: "https://ted.europa.eu/en/about-ted",
    accessed,
    note: {
      en: "Identifies TED as the online EU public-procurement supplement. The page does not state a publication or update date.",
      nl: "Benoemt TED als het online EU-supplement voor overheidsaanbestedingen. De pagina vermeldt geen publicatie- of wijzigingsdatum.",
    },
  },
  phiaStandards: {
    id: "phia-standards",
    organization: "UK Intelligence Analysis profession",
    title: "PHIA Common Analytical Standards",
    url: "https://www.gov.uk/government/publications/phia-common-analytical-standards/phia-common-analytical-standards",
    date: "2025-03-24",
    dateKind: "published",
    datePrecision: "day",
    accessed,
    note: {
      en: "Government analytical guidance used here as a methodological reference; it is not an industrial certification for MelonCactus.",
      nl: "Overheidsrichtlijn die hier als methodologische referentie dient; dit is geen industriële certificering van MelonCactus.",
    },
  },
  phiaUncertainty: {
    id: "phia-uncertainty",
    organization: "UK Intelligence Analysis profession",
    title: "Explaining Uncertainty in UK Intelligence Assessment",
    url: "https://www.gov.uk/government/publications/explaining-uncertainty-in-uk-intelligence-assessment/explaining-uncertainty-in-uk-intelligence-assessment",
    date: "2025-03-24",
    dateKind: "published",
    datePrecision: "day",
    accessed,
    note: {
      en: "Explains the distinction between assessed likelihood and confidence in the analytical basis.",
      nl: "Legt het onderscheid uit tussen ingeschatte waarschijnlijkheid en vertrouwen in de analytische basis.",
    },
  },
  odniStandards: {
    id: "odni-icd-203",
    organization: "Office of the Director of National Intelligence",
    title: "Intelligence Community Directive 203: Analytic Standards",
    url: "https://www.dni.gov/files/documents/ICD/ICD-203.pdf",
    date: "2022-01-21",
    dateKind: "updated",
    datePrecision: "day",
    accessed,
    note: {
      en: "Government intelligence standard used only for general analytical principles such as source quality, uncertainty, assumptions and alternatives.",
      nl: "Overheidsstandaard die alleen als referentie dient voor algemene analyseprincipes zoals bronkwaliteit, onzekerheid, aannames en alternatieven.",
    },
  },
  berkeleyProtocol: {
    id: "ohchr-berkeley-protocol",
    organization: "UN Human Rights Office and UC Berkeley Human Rights Center",
    title: "Berkeley Protocol on Digital Open Source Investigations",
    url: "https://searchlibrary.ohchr.org/record/30334",
    date: "2022-01-01",
    dateKind: "published",
    datePrecision: "year",
    accessed,
    note: {
      en: "The protocol concerns human-rights investigations. This article uses only its general principles for identifying, collecting, preserving and analysing digital open-source material.",
      nl: "Het protocol gaat over mensenrechtenonderzoek. Dit artikel gebruikt alleen de algemene principes voor identificatie, verzameling, bewaring en analyse van digitaal openbronmateriaal.",
    },
  },
  iptcMetadata: {
    id: "iptc-photo-metadata",
    organization: "International Press Telecommunications Council",
    title: "IPTC Photo Metadata Standard",
    url: "https://iptc.org/standards/photo-metadata/iptc-standard/",
    date: "2025-11-01",
    dateKind: "published",
    datePrecision: "month",
    accessed,
    note: {
      en: "The standard defines descriptive, rights and administrative metadata fields. Metadata can provide context, but its presence is not proof that an image or its claims are authentic.",
      nl: "De standaard definieert beschrijvende, rechten- en administratieve metadatavelden. Metadata kan context geven, maar bewijst niet dat een beeld of de bijbehorende claim authentiek is.",
    },
  },
  npsaCommunications: {
    id: "npsa-security-minded-communications",
    organization: "UK National Protective Security Authority",
    title: "Security-Minded Communications – Guidance for Remote and Rural Locations",
    url: "https://www.npsa.gov.uk/specialised-guidance/hostile-reconnaissance/security-minded-communications-guidance-remote-and-rural-locations",
    accessed,
    note: {
      en: "Protective-security guidance that specifically identifies screens, noticeboards, staff passes and contractor case studies as material to review. The page does not state a publication or update date.",
      nl: "Beveiligingsrichtlijn die schermen, mededelingenborden, personeelspassen en leverancierscases specifiek noemt als te controleren materiaal. De pagina vermeldt geen publicatie- of wijzigingsdatum.",
    },
  },
  ncscSharing: {
    id: "ncsc-sharing-online",
    organization: "UK National Cyber Security Centre",
    title: "Small organisations guide to cyber security: Think about what you share online",
    url: "https://www.ncsc.gov.uk/collection/small-organisations-guide-to-cyber-security/spotting-cyber-attacks",
    date: "2026-07-21",
    dateKind: "reviewed",
    datePrecision: "day",
    accessed,
    note: {
      en: "Official guidance to assess what an organisation’s website and social channels reveal, including outdated links and third-party details.",
      nl: "Officiële richtlijn om te beoordelen wat een website en sociale kanalen van een organisatie prijsgeven, waaronder verouderde links en gegevens over derden.",
    },
  },
  ncscPublishing: {
    id: "ncsc-social-publishing",
    organization: "UK National Cyber Security Centre",
    title: "Social media: protecting what you publish",
    url: "https://www.ncsc.gov.uk/guidance/social-media-protect-what-you-publish",
    date: "2020-06-30",
    dateKind: "reviewed",
    datePrecision: "day",
    accessed,
    note: {
      en: "Official guidance on content ownership, review and authorisation workflows before publication.",
      nl: "Officiële richtlijn over eigenaarschap, controle en goedkeuringsprocessen vóór publicatie.",
    },
  },
  gdprArticle5: {
    id: "gdpr-article-5",
    organization: "European Union",
    title: "Regulation (EU) 2016/679, Article 5",
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/art_5/oj",
    date: "2016-04-27",
    dateKind: "published",
    datePrecision: "day",
    accessed,
    note: {
      en: "Primary legislation. Article 5(1)(c) sets the data-minimisation principle; applying it to a particular project depends on the facts and is not legal certification.",
      nl: "Primaire wetgeving. Artikel 5, lid 1, onder c, bevat het beginsel van minimale gegevensverwerking; toepassing op een concrete opdracht hangt af van de feiten en is geen juridische certificering.",
    },
  },
  asmlCampus: {
    id: "asml-eindhoven-campus-2026",
    organization: "ASML",
    title: "ASML begins construction of new Eindhoven campus, strengthening its presence in the Brainport region",
    url: "https://www.asml.com/en/news/press-releases/2026/asml-begins-construction-of-new-eindhoven-campus",
    date: "2026-09-08",
    dateKind: "published",
    datePrecision: "day",
    accessed: "2026-10-12",
    note: {
      en: "ASML company announcement. It supports the stated construction milestone, planned site scale, workplace figures and timing; it does not establish present manufacturing output or the later operational effect of the campus.",
      nl: "Bedrijfsmededeling van ASML. De bron ondersteunt de genoemde bouwmijlpaal, geplande omvang, aantallen werkplekken en planning; zij bewijst geen actuele productie-output of het latere operationele effect van de campus.",
    },
  },
  infineonFabOpening: {
    id: "infineon-smart-power-fab-opening-2026",
    organization: "Infineon Technologies",
    title: "An impulse for Germany, Europe and the world: Infineon opens largest investment in company history",
    url: "https://www.infineon.com/press-release/2026/ifxpr202607-117",
    date: "2026-07-02",
    dateKind: "published",
    datePrecision: "day",
    accessed: "2026-10-12",
    note: {
      en: "Infineon company announcement. It supports the opening milestone and the company’s capacity statements; it does not disclose current output, utilisation, yield or availability for a specific product family.",
      nl: "Bedrijfsmededeling van Infineon. De bron ondersteunt de openingsmijlpaal en capaciteitsuitspraken van het bedrijf; zij vermeldt geen actuele output, bezettingsgraad, opbrengst of beschikbaarheid per productfamilie.",
    },
  },
  infineonQuarterly2026: {
    id: "infineon-quarterly-update-2026-02",
    organization: "Infineon Technologies",
    title: "Infineon makes a successful start to fiscal year 2026",
    url: "https://www.infineon.com/press-release/2026/infxx202602-042",
    date: "2026-02-04",
    dateKind: "published",
    datePrecision: "day",
    accessed: "2026-10-12",
    note: {
      en: "Infineon financial release. It supports attribution of the investment plan and timing to Infineon; product-group or company figures do not by themselves prove output from one factory or availability of one component.",
      nl: "Financieel bericht van Infineon. De bron ondersteunt de toeschrijving van investeringsplan en planning aan Infineon; cijfers voor een productgroep of bedrijf bewijzen niet vanzelf de output van één fabriek of beschikbaarheid van één component.",
    },
  },
  europeanCommissionBatteryBooster: {
    id: "ec-battery-booster-facility-2026",
    organization: "European Commission",
    title: "Commission seeks projects to fund under Battery Booster Facility",
    url: "https://single-market-economy.ec.europa.eu/news/commission-seeks-projects-fund-under-battery-booster-facility-2026-07-28_en",
    date: "2026-07-28",
    dateKind: "published",
    datePrecision: "day",
    accessed: "2026-10-12",
    note: {
      en: "European Commission announcement. It supports the existence, purpose and stated conditions of the funding call; it does not prove an award to a particular manufacturer or successful commercial ramp-up.",
      nl: "Mededeling van de Europese Commissie. De bron ondersteunt het bestaan, doel en de genoemde voorwaarden van de financieringsoproep; zij bewijst geen toekenning aan een bepaalde fabrikant of succesvolle commerciële opschaling.",
    },
  },
  asmlQ2Results2026: {
    id: "asml-q2-results-2026",
    organization: "ASML",
    title: "ASML reports €9.3 billion total net sales and €2.9 billion net income in Q2 2026",
    url: "https://www.asml.com/en/news/press-releases/2026/q2-2026-financial-results",
    date: "2026-07-15",
    dateKind: "published",
    datePrecision: "day",
    accessed: "2026-10-12",
    note: {
      en: "ASML company release. It supports attribution of the stated capacity outlook and conditions to ASML; a forecast or option under investigation is not realised manufacturing output or delivered systems.",
      nl: "Bedrijfsbericht van ASML. De bron ondersteunt de toeschrijving van de capaciteitsverwachting en voorwaarden aan ASML; een prognose of onderzochte mogelijkheid is geen gerealiseerde productie-output of geleverd systeem.",
    },
  },
  microsoftPhysicalAi: {
    id: "microsoft-physical-ai-2026",
    organization: "Microsoft",
    title: "Physical AI in manufacturing: From intelligent machines to coordinated operations",
    url: "https://www.microsoft.com/en-us/microsoft-cloud/blog/manufacturing/2026/10/06/physical-ai-in-manufacturing-from-intelligent-machines-to-coordinated-operations/",
    date: "2026-10-06",
    dateKind: "published",
    datePrecision: "day",
    accessed: "2026-10-11",
    note: {
      en: "Vendor thought leadership. It supports attribution of Microsoft's proposed perceive–reason–act loop and governance considerations; it is not independent evidence that a particular deployment delivers the stated benefits.",
      nl: "Visiepublicatie van een leverancier. De bron ondersteunt de toeschrijving van Microsofts voorgestelde lus waarnemen–redeneren–handelen en de genoemde beheersmaatregelen; zij bewijst niet onafhankelijk dat een concrete toepassing de genoemde voordelen oplevert.",
    },
  },
  qadDecisioning: {
    id: "qad-ai-decisioning-2026",
    organization: "QAD",
    title: "Driving Future-Ready Manufacturing: From ERP to AI-Driven Decisioning",
    url: "https://blog.qad.com/2026/10/driving-future-ready-manufacturing-from-erp-to-ai-driven-decisioning",
    date: "2026-10-06",
    dateKind: "published",
    datePrecision: "day",
    accessed: "2026-10-11",
    note: {
      en: "Vendor-hosted guest thought leadership. It is used for its decision-layer argument and explicit authority boundaries. Adoption figures and example outcomes in the post are not used as independent market evidence.",
      nl: "Gastbijdrage op het platform van een leverancier. De bron wordt gebruikt voor het betoog over een beslislaag en expliciete bevoegdheidsgrenzen. Adoptiecijfers en voorbeeldresultaten uit het artikel worden niet als onafhankelijk marktbewijs gebruikt.",
    },
  },
  inforIndustryAi: {
    id: "infor-industry-ai-2026-10",
    organization: "Infor",
    title: "Built to execute: AI in the 2026.10 release",
    url: "https://www.infor.com/blog/infor-industry-ai-2026-10-release",
    date: "2026-10-06",
    dateKind: "published",
    datePrecision: "day",
    accessed: "2026-10-11",
    note: {
      en: "Infor product-release material. It is primary evidence of how Infor describes its own approval workflows and agents, not independent validation of their performance, compliance or suitability.",
      nl: "Productinformatie van Infor. De bron is primair bewijs voor de manier waarop Infor zijn eigen goedkeuringsprocessen en agents beschrijft, niet voor een onafhankelijke validatie van prestaties, compliance of geschiktheid.",
    },
  },
} satisfies Record<string, ArticleSource>;
