import { ConfidenceBadge } from "./confidence-badge";

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

export function SampleEvidenceTable() {
  return (
    <div className="table-scroll" tabIndex={0} aria-label="Scrollable evidence table">
      <table className="evidence-table">
        <caption>Illustrative evidence register</caption>
        <thead>
          <tr><th>Source type</th><th>Observation</th><th>Assessment</th><th>Confidence</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.source}>
              <td>{row.source}</td>
              <td>{row.observation}</td>
              <td>{row.assessment}</td>
              <td><ConfidenceBadge level={row.confidence} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

