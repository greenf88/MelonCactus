import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { reportOptions } from "@/config/site";

export const metadata: Metadata = {
  title: "Services and Report Options",
  description: "Industrial competitive intelligence, technical analysis and public-source research report options from Lemon Cactus.",
  alternates: { canonical: "/services" },
};

const capabilities = [
  ["Competitor and capability profiles", "Assess corporate structure, products, facilities, people, partnerships and credible operating signals."],
  ["Technical and product analysis", "Connect product claims, patents, documentation, imagery and supplier evidence into a clear technical picture."],
  ["Manufacturing and facility assessment", "Examine public evidence of processes, equipment, laboratory resources, capacity signals and site development."],
  ["Ecosystem and supplier mapping", "Trace visible relationships between companies, suppliers, customers, projects, tenders and technology partners."],
  ["Market-entry intelligence", "Test demand signals, incumbent positions, route-to-market options and evidence behind category claims."],
  ["Public information exposure review", "Identify public disclosures that may reveal capabilities, timing, relationships or operational detail in combination."],
  ["Technology landscaping", "Map relevant approaches, organisations, patents, products and maturity signals around a defined technology question."],
  ["Ongoing intelligence monitoring", "Track a defined set of evidence signals and report material changes without adding noise."],
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Research shaped around a decision—not a data dump."
        intro="Lemon Cactus investigates defined commercial and technical questions using lawful public sources, transparent evidence standards and proportionate conclusions."
        breadcrumbs={[{ label: "Services" }]}
      />
      <section className="section">
        <Container>
          <div className="content-heading"><p className="eyebrow">Capabilities</p><h2>Where focused evidence can change the picture.</h2></div>
          <div className="capability-list">
            {capabilities.map(([title, copy], index) => (
              <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{copy}</p></div></article>
            ))}
          </div>
        </Container>
      </section>
      <section className="section pricing-section" id="reports">
        <Container>
          <div className="content-heading"><p className="eyebrow">Report options</p><h2>Choose a starting scope.</h2><p>Prices are starting points, not fixed quotations. Scope, delivery time and fee are agreed before research begins.</p></div>
          <div className="pricing-grid">{reportOptions.map((service) => <ServiceCard service={service} key={service.name} />)}</div>
        </Container>
      </section>
      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">Working boundary</p><h2>Public sources. Clear limits.</h2></div>
          <div className="prose-block">
            <p>Work is limited to lawful public-source research. Lemon Cactus does not hack systems, bypass access controls, impersonate people, use social engineering or accept stolen or unlawfully acquired information.</p>
            <p>Some questions cannot be answered responsibly from public material. Those limits are stated directly, with the remaining information gaps and sensible next research questions.</p>
            <ButtonLink href="/methodology" variant="secondary">Read the Methodology</ButtonLink>
          </div>
        </Container>
      </section>
      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">Define the question</p><h2>Which uncertainty is shaping your decision?</h2><p>A concise brief is enough to start a confidential scope discussion.</p></div><ButtonLink href="/contact">Request a Report</ButtonLink></Container></section>
    </>
  );
}

