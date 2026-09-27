import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { SampleEvidenceTable } from "@/components/sample-evidence-table";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Sample Industrial Intelligence Report | MelonCactus",
  description: "A fictional decision memo showing how MelonCactus separates public evidence, competing explanations and decision implications in an industrial capability assessment.",
  alternates: languageAlternates("/sample-report", "en"),
};

export default function SampleReportPage() {
  return (
    <article className="sample-report">
      <PageHeader
        eyebrow="Representative report · fictional case"
        title="Is Alderwick ready to scale production?"
        intro="A decision-focused example of how MelonCactus turns public signals into a defensible assessment. Alderwick Thermal Modules, the source records and every date and figure in this case are invented."
        breadcrumbs={[{ label: "Sample Report" }]}
      />

      <section className="report-cover" aria-label="Report details">
        <Container>
          <div className="report-meta">
            <div><span>Case reference</span><strong>MC-DEMO-001</strong></div>
            <div><span>Subject</span><strong>Alderwick Thermal Modules</strong></div>
            <div><span>Evidence cut-off</span><strong>1 September 2026 · fictional</strong></div>
            <div><span>Document status</span><strong>Public demonstration · no client assignment</strong></div>
          </div>
        </Container>
      </section>

      <section className="report-section report-decision" id="decision">
        <Container className="report-grid">
          <aside><span>01 / Decision brief</span><h2>Decision in one minute</h2></aside>
          <div className="report-body">
            <p className="report-kicker">Client question in this fictional case</p>
            <p className="report-lead">Should an industrial buyer shorten its assumed delivery lead time for Alderwick’s systems because a new assembly building is taking shape?</p>
            <div className="decision-callout">
              <span>Our assessment</span>
              <strong>No. Keep the current lead-time assumption until operational output is independently evidenced.</strong>
              <p>The public signals support preparation for expansion. They do not show a commissioned line, a stable production rate or shorter deliveries. Prepare an alternative sourcing option in parallel.</p>
            </div>
            <div className="finding-summary" aria-label="Three assessment levels">
              <div><span>Physical expansion</span><ConfidenceBadge level="High confidence" /></div>
              <div><span>Preparation to scale</span><ConfidenceBadge level="Moderate confidence" /></div>
              <div><span>Higher output in operation</span><ConfidenceBadge level="Unknown" /></div>
            </div>
          </div>
        </Container>
      </section>

      <section className="report-section report-tinted">
        <Container className="report-grid">
          <aside><span>02 / Scope</span><h2>Question and boundary</h2></aside>
          <div className="report-body">
            <p>We assess whether lawfully available public material supports a near-term increase in assembly capability. The fictional record includes a product sheet, a planning notice, a dated exterior image, vacancies and a trade-fair slide.</p>
            <p>This sample deliberately shows only a short evidence trail. It contains no real source documents, confidential information, proprietary collection steps or numerical capacity forecast. The case is a demonstration of reasoning, not a claim about a real manufacturer.</p>
          </div>
        </Container>
      </section>

      <section className="report-section" id="evidence">
        <Container>
          <div className="report-section-heading"><span>03 / Source trail</span><h2>Five signals. Five clear limits.</h2><p>These source entries are fabricated for the case. A live assignment would use attributable, dated records that a client can review within the agreed scope.</p></div>
          <SampleEvidenceTable />
        </Container>
      </section>

      <section className="report-section report-tinted" id="findings">
        <Container className="report-grid">
          <aside><span>04 / Findings</span><h2>What the evidence supports</h2></aside>
          <div className="report-body">
            <div className="finding-list">
              <article><span>F1</span><div><h3>The building programme has progressed beyond an announcement.</h3><p>The approved extension and the later image of an enclosed shell align on location and sequence. That supports physical construction, not internal readiness. <a href="#sample-source-s-02">S-02</a> · <a href="#sample-source-s-03">S-03</a></p></div><ConfidenceBadge level="High confidence" /></article>
              <article><span>F2</span><div><h3>Operational preparation is plausible, but its scale is unresolved.</h3><p>Construction and the mix of production, quality and shift roles fit an expansion plan. Replacement hiring and a warehouse-only use remain credible alternatives. <a href="#sample-source-s-02">S-02</a> · <a href="#sample-source-s-03">S-03</a> · <a href="#sample-source-s-04">S-04</a></p></div><ConfidenceBadge level="Moderate confidence" /></article>
              <article><span>F3</span><div><h3>Improved delivery performance has not been demonstrated.</h3><p>Neither the product sheet nor the prototype slide gives a line rate, completed-unit count, yield, backlog or verified lead time. The evidence cannot support a capacity figure. <a href="#sample-source-s-01">S-01</a> · <a href="#sample-source-s-05">S-05</a></p></div><ConfidenceBadge level="Unknown" /></article>
            </div>
          </div>
        </Container>
      </section>

      <section className="report-section">
        <Container className="report-grid">
          <aside><span>05 / Challenge</span><h2>What could change our view?</h2></aside>
          <div className="report-body">
            <p className="report-lead">A building can be ready while a production line is not. Hiring can signal intent without adding a single shift.</p>
            <div className="report-challenge-grid">
              <div><h3>Competing explanation</h3><p>The extension could primarily serve storage or testing. The advertised roles could replace departing staff. Exterior images cannot resolve either possibility.</p></div>
              <div><h3>Evidence that would matter</h3><p>A dated commissioning or occupancy milestone, a corroborated shift start, or repeated delivery and serial-production references would strengthen the operational case. A delayed fit-out or persistent vacancies would weaken it.</p></div>
            </div>
          </div>
        </Container>
      </section>

      <section className="report-section report-tinted">
        <Container className="report-grid">
          <aside><span>06 / Decision use</span><h2>Turn the finding into action</h2></aside>
          <div className="report-body">
            <ol className="report-actions">
              <li><span>Now</span><p>Keep the current supplier and lead-time assumptions. Do not price or promise faster deliveries based on construction alone.</p></li>
              <li><span>In parallel</span><p>Prepare a second sourcing path if a real capacity increase would affect procurement or competitive bids.</p></li>
              <li><span>Reassess when</span><p>Public evidence confirms commissioning and serial deliveries, or a credible delay contradicts the expansion narrative.</p></li>
            </ol>
            <p className="report-disclaimer">This is a fictional example, not a forecast, procurement recommendation for an actual company or representation of work completed for a client. The complete source pack and collection process are outside this public demonstration.</p>
          </div>
        </Container>
      </section>

      <section className="closing-cta no-print"><Container className="closing-inner"><div><p className="eyebrow">A question you can act on</p><h2>Put a real decision under the same scrutiny.</h2><p>We define the question, evidence boundary and deliverable around your situation.</p></div><ButtonLink href="/contact">Discuss a report</ButtonLink></Container></section>
    </article>
  );
}
