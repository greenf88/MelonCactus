import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Fictional Example Case: Finding a Fourth Business Pillar",
  description: "A fictional two-stage example: Company X explores a fourth business pillar using its existing technology, then requests a separate competitor assessment.",
  alternates: languageAlternates("/example-case/fourth-pillar", "en"),
};

const selectionQuestions = [
  ["Strategic fit", "Which possibilities build on the company's strengths rather than requiring an unrelated business model?"],
  ["Technology reuse", "What could existing technology support, and what would still need adaptation or validation?"],
  ["Market evidence", "Which public demand and competitor signals support each possibility, and which are only claims or plans?"],
  ["Open questions", "What cannot be established from the available information and needs further technical or commercial testing?"],
] as const;

const competitorQuestions = [
  ["Activities", "What are competitors visibly developing, producing or offering? Separate demonstrated activity from stated ambition."],
  ["Projects", "Which publicly documented projects show where they are active, and how far has each project progressed?"],
  ["Suppliers", "Which supplier or partner links can be verified, and which are only possible connections?"],
  ["Implications", "What might Company X learn from the pattern without assuming that a competitor's approach will work for it?"],
] as const;

export default function FourthPillarExampleCasePage() {
  return (
    <article>
      <PageHeader
        eyebrow="Fictional example case · two-stage assignment"
        title="Finding a fourth pillar from what the business already knows."
        intro="Company X's three established business pillars offer less room for growth. Its board wants to know which new ideas fit the company and what it could do with its existing technology."
        breadcrumbs={[{ label: "Fourth-pillar example case" }]}
      />

      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">01 / The first question</p><h2>Which direction deserves a closer look?</h2></div>
          <div className="prose-block">
            <p>The first assessment starts with the decision, not a list of fashionable markets. It compares possible directions with Company X’s existing capabilities, technology and constraints, then tests relevant market signals using lawful public sources.</p>
            <p>It distinguishes what the current technology can already support from what would require adaptation, validation or capabilities not yet evidenced. The board can compare the options without treating a promising idea as an established business.</p>
            <p><strong>This is an invented scenario.</strong> Company X is not a client, and no real company, technology or market opportunity is being described.</p>
          </div>
        </Container>
      </section>

      <section className="section section-muted">
        <Container>
          <div className="content-heading"><p className="eyebrow">First report</p><h2>Test the fit before choosing.</h2><p>Four questions structure the comparison; each answer states its evidence and limits.</p></div>
          <div className="values-grid">
            {selectionQuestions.map(([title, description], index) => (
              <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">02 / The decision point</p><h2>A direction emerges. The next question changes.</h2></div>
          <div className="prose-block">
            <p>In this fictional sequence, the first report identifies a suitable concept for a fourth pillar that builds on existing technology. It gives the board a direction to pursue, not proof of technical feasibility, demand or commercial success. The concept remains unnamed so the example does not suggest an unsupported market conclusion.</p>
            <p>The board then requests a <strong>separate follow-up report</strong>: what are competitors doing in this area, which projects and suppliers can be identified, and what can Company X learn before committing resources?</p>
          </div>
        </Container>
      </section>

      <section className="section section-muted">
        <Container>
          <div className="content-heading"><p className="eyebrow">Follow-up report</p><h2>Understand the competitive landscape.</h2><p>The second scope examines observable work, projects and relationships. A published plan is not treated as completed production or a confirmed supplier contract.</p></div>
          <div className="values-grid">
            {competitorQuestions.map(([title, description], index) => (
              <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
          <p className="report-disclaimer">Both stages are illustrative. No client assignment, research finding, competitor relationship or business result is claimed. A real scope would be agreed in writing and assessed against attributable evidence.</p>
        </Container>
      </section>

      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">Start with the decision</p><h2>Explore an adjacent opportunity with clear evidence limits.</h2><p>We can discuss an initial assessment and, if useful, a separately scoped competitor follow-up.</p></div><div className="button-row"><ButtonLink href="/contact">Discuss an Intelligence Requirement</ButtonLink><ButtonLink href="/sample-report" variant="secondary">View the Sample Report</ButtonLink></div></Container></section>
    </article>
  );
}
