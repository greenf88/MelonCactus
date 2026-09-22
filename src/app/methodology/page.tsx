import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { confidenceLevels } from "@/config/site";

export const metadata: Metadata = {
  title: "Research Methodology and Evidence Standards",
  description: "How Lemon Cactus collects, verifies and assesses lawful public evidence for industrial intelligence work.",
  alternates: { canonical: "/methodology" },
};

const stages = [
  ["01", "Define the decision", "Translate the business need into a precise research question, scope, target and evidence threshold."],
  ["02", "Build the source plan", "Identify primary, technical, regulatory, commercial and visual sources likely to reduce the key uncertainty."],
  ["03", "Collect with provenance", "Record source origin, publication context, date and relevant extracts so material remains traceable."],
  ["04", "Verify and challenge", "Cross-reference independent sources, check recency, identify contradictions and test alternative explanations."],
  ["05", "Interpret proportionately", "Separate direct observation from assessment and inference. Assign confidence that reflects the evidence."],
  ["06", "Deliver an evidence trail", "Present conclusions, limitations, sources, information gaps and the questions that would most improve confidence."],
];

export default function MethodologyPage() {
  return (
    <>
      <PageHeader eyebrow="Methodology" title="Evidence that can be traced. Conclusions that can be tested." intro="A disciplined method protects the quality of the decision. Every material finding should show what was observed, how it was interpreted and how much uncertainty remains." breadcrumbs={[{ label: "Methodology" }]} />
      <section className="section"><Container><div className="content-heading"><p className="eyebrow">Six stages</p><h2>From a useful question to a defensible answer.</h2></div><ol className="stage-list">{stages.map(([number,title,copy]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></Container></section>
      <section className="section section-muted"><Container className="split-content"><div><p className="eyebrow">Evidence standard</p><h2>Quality depends on provenance, context and corroboration.</h2></div><div className="prose-block"><h3>Source reliability and recency</h3><p>Sources are assessed for authority, proximity to the subject, publication purpose and date. A source may be authoritative for one fact and weak for another. Old material is not discarded automatically, but its relevance to the current question is stated.</p><h3>Contradictions and gaps</h3><p>Conflicting evidence is retained and explained. Reports identify missing information instead of smoothing it over. Where more than one explanation fits the evidence, alternatives remain visible.</p><h3>Observation and interpretation</h3><p>Directly observable facts are recorded separately from analytical judgement. Assessments explain their evidential basis; inferences are labelled as possibilities that need further verification.</p></div></Container></section>
      <section className="section"><Container><div className="content-heading"><p className="eyebrow">Confidence model</p><h2>Plain language for uncertainty.</h2><p>Confidence refers to the support for a specific finding—not to the overall professionalism of the work.</p></div><div className="confidence-list">{confidenceLevels.map((item) => <article key={item.level}><ConfidenceBadge level={item.level} /><p>{item.description}</p></article>)}</div></Container></section>
      <section className="section visual-boundary"><Container className="split-content"><div><p className="eyebrow">Image and video analysis</p><h2>What can be seen is not the same as what can be proved.</h2></div><div className="prose-block"><p>Public photographs and video can support observations about visible equipment, facility layout, process sequence, product configuration and change over time. Technical interpretation may use manuals, supplier material and independent sources to test what those features could indicate.</p><p>Visual analysis does not automatically prove hidden specifications, material composition, internal tolerances, production yield or processes outside the frame. Reports state these limitations and avoid converting visual resemblance into certainty.</p></div></Container></section>
      <section className="section"><Container className="split-content"><div><p className="eyebrow">Ethical and legal boundary</p><h2>Lawful public-source research only.</h2></div><div className="boundary-grid"><div><h3>Within scope</h3><ul><li>Publicly accessible documents and websites</li><li>Public corporate and professional activity</li><li>Lawfully published photographs and video</li><li>Patents, tenders, certifications and public records</li></ul></div><div><h3>Outside scope</h3><ul><li>Hacking or unauthorised access</li><li>Impersonation or social engineering</li><li>Stolen, leaked or unlawfully acquired material</li><li>Unnecessary collection of sensitive personal data</li></ul></div></div></Container></section>
      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">See the method in practice</p><h2>Review a representative evidence trail.</h2></div><ButtonLink href="/sample-report">View the Sample Report</ButtonLink></Container></section>
    </>
  );
}

