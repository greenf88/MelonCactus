import { ConfidenceBadge } from "./confidence-badge";
import type { Locale } from "@/lib/i18n";

const rows = [
  {
    source: "Company product brochure (fictional)",
    observation: "The current product range lists two modular thermal units rated for mid-scale industrial applications.",
    assessment: "The company has a defined modular product architecture, but the brochure does not establish production volume.",
    confidence: "Confirmed",
  },
  {
    source: "Planning notice and facility imagery (fictional)",
    observation: "A permitted extension is visible beside the assembly hall; roof geometry is consistent with an additional production bay.",
    assessment: "The expansion may increase assembly capacity. Internal equipment and commissioning status cannot be verified.",
    confidence: "High confidence",
  },
  {
    source: "Six public vacancy notices (fictional)",
    observation: "Roles include production engineering, supplier quality and two shift-supervisor positions.",
    assessment: "Hiring is consistent with preparation for greater operational throughput, although vacancies alone do not prove realised growth.",
    confidence: "Moderate confidence",
  },
  {
    source: "Trade-fair presentation (fictional)",
    observation: "A slide refers to a next-generation unit but provides no launch date or validated specification.",
    assessment: "The product is an indicative development signal rather than a confirmed commercial offering.",
    confidence: "Indicative",
  },
];

const rowsNl = [
  {
    source: "Productbrochure van het bedrijf (fictief)",
    observation: "Het huidige assortiment vermeldt twee modulaire warmte-units voor middelgrote industriële toepassingen.",
    assessment: "Het bedrijf heeft een omschreven modulaire productopbouw, maar de brochure zegt niets over het productievolume.",
    confidence: "Confirmed",
  },
  {
    source: "Bouwvergunning en locatiebeelden (fictief)",
    observation: "Naast de assemblagehal is een vergunde uitbreiding zichtbaar; de dakvorm past bij een extra productiehal.",
    assessment: "De uitbreiding kan de assemblagecapaciteit vergroten. Interne apparatuur en de status van ingebruikname zijn niet te verifiëren.",
    confidence: "High confidence",
  },
  {
    source: "Zes openbare vacatures (fictief)",
    observation: "De functies omvatten productie-engineering, leverancierskwaliteit en twee ploegleiders.",
    assessment: "De werving past bij voorbereiding op een hogere operationele doorvoer, maar vacatures bewijzen geen gerealiseerde groei.",
    confidence: "Moderate confidence",
  },
  {
    source: "Presentatie op een vakbeurs (fictief)",
    observation: "Een dia noemt een nieuwe generatie units, maar bevat geen introductiedatum of gevalideerde specificatie.",
    assessment: "Dit is een indicatief ontwikkelsignaal, geen bevestigde commerciële productintroductie.",
    confidence: "Indicative",
  },
];

export function SampleEvidenceTable({ locale = "en" }: { locale?: Locale }) {
  const nl = locale === "nl";
  return (
    <div className="table-scroll" tabIndex={0} aria-label={nl ? "Horizontaal verschuifbare bewijstabel" : "Scrollable evidence table"}>
      <table className="evidence-table">
        <caption>{nl ? "Illustratief bewijsregister" : "Illustrative evidence register"}</caption>
        <thead>
          <tr><th>{nl ? "Brontype" : "Source type"}</th><th>{nl ? "Waarneming" : "Observation"}</th><th>{nl ? "Beoordeling" : "Assessment"}</th><th>{nl ? "Zekerheid" : "Confidence"}</th></tr>
        </thead>
        <tbody>
          {(nl ? rowsNl : rows).map((row) => (
            <tr key={row.source}>
              <td>{row.source}</td>
              <td>{row.observation}</td>
              <td>{row.assessment}</td>
              <td><ConfidenceBadge level={row.confidence} locale={locale} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
