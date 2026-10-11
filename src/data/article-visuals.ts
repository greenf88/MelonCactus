export type ArticleVisual = {
  src: string;
  width: number;
  height: number;
  mobileSrc: string;
  mobileWidth: number;
  mobileHeight: number;
  alt: string;
  title: string;
  caption: string;
  explanationLabel: string;
  details: readonly {
    label: string;
    text: string;
  }[];
  afterSectionIndex: number;
};

const dimensions = { width: 1200, height: 760 } as const;
const mobileDimensions = { mobileWidth: 760, mobileHeight: 1100 } as const;

export const articleVisuals = {
  en: {
    industrialIntelligence: {
      ...dimensions,
      ...mobileDimensions,
      src: "/article-visuals/industrial-intelligence-en.svg",
      mobileSrc: "/article-visuals/industrial-intelligence-en-mobile.svg",
      alt: "Flow diagram showing public sources moving through checks for provenance, date, scope and corroboration before informing a defined decision question, with known, assessed and unknown outcomes kept separate.",
      title: "From public sources to a defensible decision question",
      caption: "Source material becomes useful intelligence only after it has been checked against the scope and evidential needs of a defined decision.",
      explanationLabel: "Diagram explained in text",
      details: [
        { label: "Inputs", text: "Lawfully accessible company, technical, public-record and visual material." },
        { label: "Checks", text: "Provenance, date, scope, consistency and independent corroboration." },
        { label: "Output", text: "A bounded answer that distinguishes what is known, assessed and still unknown." },
      ],
      afterSectionIndex: 0,
    },
    publicImages: {
      ...dimensions,
      ...mobileDimensions,
      src: "/article-visuals/public-images-en.svg",
      mobileSrc: "/article-visuals/public-images-en-mobile.svg",
      alt: "Conceptual diagram separating an observable detail in a public image from possible explanations and facts that the image cannot establish, such as operating status, capacity and date.",
      title: "Observation is not the same as capability",
      caption: "A visible feature can narrow possibilities, but operating status, capacity and timing require contextual and independent support.",
      explanationLabel: "Diagram explained in text",
      details: [
        { label: "Visible", text: "Record the object, label or spatial relationship that can actually be seen." },
        { label: "Possible", text: "Keep more than one explanation open while context is incomplete." },
        { label: "Unknown", text: "Do not infer hidden specifications, current operation or production scale from appearance alone." },
      ],
      afterSectionIndex: 2,
    },
    evidenceAssessmentInference: {
      ...dimensions,
      ...mobileDimensions,
      src: "/article-visuals/evidence-assessment-inference-en.svg",
      mobileSrc: "/article-visuals/evidence-assessment-inference-en-mobile.svg",
      alt: "Three-part framework distinguishing evidence as what a source directly supports, assessment as a reasoned judgement across sources, and inference as a plausible but unproven explanation.",
      title: "Keep evidence, assessment and inference visibly separate",
      caption: "The categories can build on one another, but each needs its own label, evidential basis and limitation.",
      explanationLabel: "Diagram explained in text",
      details: [
        { label: "Evidence", text: "A traceable statement or observation supported directly by a source." },
        { label: "Assessment", text: "A reasoned judgement that weighs several sources, contradictions and uncertainty." },
        { label: "Inference", text: "A plausible interpretation that remains unproven and is tested against alternatives." },
      ],
      afterSectionIndex: 3,
    },
    cumulativeDisclosure: {
      ...dimensions,
      ...mobileDimensions,
      src: "/article-visuals/cumulative-disclosure-en.svg",
      mobileSrc: "/article-visuals/cumulative-disclosure-en-mobile.svg",
      alt: "Diagram showing a vacancy, supplier case study, trade-fair video and planning record contributing to combined context without turning any single disclosure into proof.",
      title: "Separate disclosures can add context without becoming proof",
      caption: "Combining public material may strengthen context, but every item retains its own provenance, scope, date and uncertainty.",
      explanationLabel: "Diagram explained in text",
      details: [
        { label: "Separate signals", text: "Recruitment, supplier, event and public-record material may each address a different part of the question." },
        { label: "Combined context", text: "Connections can make a pattern more informative when source relationships are recorded." },
        { label: "Boundary", text: "A coherent pattern still does not prove hidden capacity, intent or current operational status." },
      ],
      afterSectionIndex: 1,
    },
  },
  nl: {
    industrialIntelligence: {
      ...dimensions,
      ...mobileDimensions,
      src: "/article-visuals/industrial-intelligence-nl.svg",
      mobileSrc: "/article-visuals/industrial-intelligence-nl-mobile.svg",
      alt: "Stroomschema waarin openbare bronnen via controles op herkomst, datum, reikwijdte en bevestiging bijdragen aan een afgebakende beslisvraag, met een scheiding tussen bekend, beoordeeld en onbekend.",
      title: "Van openbare bronnen naar een verdedigbare beslisvraag",
      caption: "Bronmateriaal wordt pas bruikbare intelligence nadat het is getoetst aan de reikwijdte en bewijsbehoefte van een afgebakende beslissing.",
      explanationLabel: "Uitleg van het diagram in tekst",
      details: [
        { label: "Invoer", text: "Rechtmatig toegankelijke bedrijfs-, technische, openbare en visuele bronnen." },
        { label: "Controles", text: "Herkomst, datum, reikwijdte, consistentie en onafhankelijke bevestiging." },
        { label: "Uitkomst", text: "Een begrensd antwoord dat bekend, beoordeeld en nog onbekend van elkaar scheidt." },
      ],
      afterSectionIndex: 0,
    },
    publicImages: {
      ...dimensions,
      ...mobileDimensions,
      src: "/article-visuals/public-images-nl.svg",
      mobileSrc: "/article-visuals/public-images-nl-mobile.svg",
      alt: "Conceptueel diagram dat een zichtbaar detail in een openbaar beeld scheidt van mogelijke verklaringen en zaken die het beeld niet kan bewijzen, zoals bedrijfsstatus, capaciteit en datum.",
      title: "Een waarneming is nog geen bewezen capaciteit",
      caption: "Een zichtbaar kenmerk kan mogelijkheden verkleinen, maar bedrijfsstatus, capaciteit en timing vragen om context en onafhankelijke ondersteuning.",
      explanationLabel: "Uitleg van het diagram in tekst",
      details: [
        { label: "Zichtbaar", text: "Leg het object, label of de ruimtelijke relatie vast die werkelijk te zien is." },
        { label: "Mogelijk", text: "Houd meerdere verklaringen open zolang de context onvolledig is." },
        { label: "Onbekend", text: "Leid verborgen specificaties, actuele werking of productieschaal niet uitsluitend uit het uiterlijk af." },
      ],
      afterSectionIndex: 2,
    },
    evidenceAssessmentInference: {
      ...dimensions,
      ...mobileDimensions,
      src: "/article-visuals/evidence-assessment-inference-nl.svg",
      mobileSrc: "/article-visuals/evidence-assessment-inference-nl-mobile.svg",
      alt: "Driedelig schema dat bewijs als directe bronondersteuning, beoordeling als onderbouwd oordeel over meerdere bronnen en gevolgtrekking als aannemelijke maar onbewezen verklaring onderscheidt.",
      title: "Houd bewijs, beoordeling en gevolgtrekking zichtbaar uit elkaar",
      caption: "De categorieën kunnen op elkaar voortbouwen, maar vragen ieder om een eigen label, bewijsbasis en beperking.",
      explanationLabel: "Uitleg van het diagram in tekst",
      details: [
        { label: "Bewijs", text: "Een herleidbare uitspraak of waarneming die rechtstreeks door een bron wordt ondersteund." },
        { label: "Beoordeling", text: "Een beredeneerd oordeel dat meerdere bronnen, tegenspraak en onzekerheid afweegt." },
        { label: "Gevolgtrekking", text: "Een aannemelijke uitleg die onbewezen blijft en tegenover alternatieven wordt getoetst." },
      ],
      afterSectionIndex: 3,
    },
    cumulativeDisclosure: {
      ...dimensions,
      ...mobileDimensions,
      src: "/article-visuals/cumulative-disclosure-nl.svg",
      mobileSrc: "/article-visuals/cumulative-disclosure-nl-mobile.svg",
      alt: "Diagram waarin een vacature, leverancierscase, beursvideo en openbaar planningsdocument samen extra context geven zonder dat één uiting als bewijs wordt gepresenteerd.",
      title: "Losse uitingen kunnen context toevoegen zonder bewijs te worden",
      caption: "Het combineren van openbaar materiaal kan de context versterken, maar ieder item behoudt zijn eigen herkomst, reikwijdte, datum en onzekerheid.",
      explanationLabel: "Uitleg van het diagram in tekst",
      details: [
        { label: "Losse signalen", text: "Werving, leveranciersinformatie, evenementen en openbare registraties kunnen elk een ander deel van de vraag raken." },
        { label: "Gezamenlijke context", text: "Verbindingen kunnen een patroon informatiever maken wanneer bronrelaties worden vastgelegd." },
        { label: "Bewijsgrens", text: "Een samenhangend patroon bewijst nog geen verborgen capaciteit, intentie of actuele bedrijfsstatus." },
      ],
      afterSectionIndex: 1,
    },
  },
} as const satisfies Record<"en" | "nl", Record<string, ArticleVisual>>;
