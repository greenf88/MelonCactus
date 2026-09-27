import type { Locale } from "@/lib/i18n";

type SampleSource = {
  id: string;
  date: string;
  type: string;
  observation: string;
  boundary: string;
  findings: string;
};

const sources: Record<Locale, SampleSource[]> = {
  en: [
    {
      id: "S-01", date: "12 Mar 2026", type: "Company product sheet",
      observation: "Two modular industrial heat units are listed as available products.",
      boundary: "A product listing does not establish production rate, delivery volume or order coverage.",
      findings: "F3",
    },
    {
      id: "S-02", date: "22 Apr 2026", type: "Public planning notice",
      observation: "An extension of 2,400 m² beside the assembly hall is approved in the fictional record.",
      boundary: "The notice authorises construction; it says nothing about equipment or commissioning.",
      findings: "F1, F2",
    },
    {
      id: "S-03", date: "18 Jul 2026", type: "Dated exterior photograph",
      observation: "A fictional trade publication shows the new building shell enclosed, with works still visible outside.",
      boundary: "The image cannot show interior fit-out, installed lines or operational throughput.",
      findings: "F1, F2",
    },
    {
      id: "S-04", date: "Apr–Aug 2026", type: "Six public vacancies",
      observation: "Posts include production engineering, supplier quality and two shift-supervisor roles.",
      boundary: "The roles may be replacements or remain unfilled; they do not demonstrate a running shift.",
      findings: "F2",
    },
    {
      id: "S-05", date: "20 Aug 2026", type: "Trade-fair slide",
      observation: "A next-generation module is described as a prototype without a stated launch date.",
      boundary: "A prototype reference is not evidence of serial availability or validated performance.",
      findings: "F3",
    },
  ],
  nl: [
    {
      id: "S-01", date: "12 mrt 2026", type: "Productblad van het bedrijf",
      observation: "Twee modulaire industriële warmte-units staan als beschikbare producten vermeld.",
      boundary: "Een productvermelding bewijst geen productietempo, levervolume of gevulde orderportefeuille.",
      findings: "B3",
    },
    {
      id: "S-02", date: "22 apr 2026", type: "Openbare vergunningmelding",
      observation: "Een uitbreiding van 2.400 m² naast de assemblagehal is in het fictieve dossier goedgekeurd.",
      boundary: "De melding staat bouw toe; zij zegt niets over apparatuur of ingebruikname.",
      findings: "B1, B2",
    },
    {
      id: "S-03", date: "18 jul 2026", type: "Gedateerde buitenfoto",
      observation: "Een fictief vakmedium toont een gesloten gebouwschil, terwijl buiten nog werkzaamheden zichtbaar zijn.",
      boundary: "De foto toont geen interne inrichting, geïnstalleerde lijnen of operationele doorvoer.",
      findings: "B1, B2",
    },
    {
      id: "S-04", date: "apr–aug 2026", type: "Zes openbare vacatures",
      observation: "De functies omvatten productie-engineering, leverancierskwaliteit en twee ploegleiders.",
      boundary: "Het kunnen vervangingen zijn of openstaande functies; een actieve ploeg is hiermee niet aangetoond.",
      findings: "B2",
    },
    {
      id: "S-05", date: "20 aug 2026", type: "Presentatiedia op vakbeurs",
      observation: "Een nieuwe generatie module wordt als prototype beschreven, zonder introductiedatum.",
      boundary: "Een prototypevermelding bewijst geen seriematige beschikbaarheid of gevalideerde prestaties.",
      findings: "B3",
    },
  ],
};

export function SampleEvidenceTable({ locale = "en" }: { locale?: Locale }) {
  const nl = locale === "nl";

  return (
    <div className="sample-sources">
      {sources[locale].map((source) => (
        <article className="sample-source" id={`sample-source-${source.id.toLowerCase()}`} key={source.id}>
          <div className="sample-source-head">
            <strong>{source.id}</strong>
            <div><h3>{source.type}</h3><span>{source.date}</span></div>
            <span className="sample-source-finding">{nl ? "Bevinding" : "Finding"} {source.findings}</span>
          </div>
          <dl>
            <div><dt>{nl ? "Waarneming" : "Observation"}</dt><dd>{source.observation}</dd></div>
            <div><dt>{nl ? "Bewijsgrens" : "Evidence boundary"}</dt><dd>{source.boundary}</dd></div>
          </dl>
        </article>
      ))}
    </div>
  );
}
