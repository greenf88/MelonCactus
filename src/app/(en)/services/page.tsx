import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { publicProfileScan, reportOptions } from "@/config/site";
import { deliveryOptions } from "@/config/delivery";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Industrial Intelligence Services",
  description: "Decision-led industrial intelligence assessments with indicative scope and fees. Each assignment is agreed before research begins.",
  alternates: languageAlternates("/services", "en"),
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
        intro="MelonCactus investigates defined commercial and technical questions using lawful public sources, transparent evidence standards and proportionate conclusions."
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
      <section className="section section-muted">
        <Container className="split-content">
          <div className="prose-block">
            <p className="eyebrow">Defensive starting point</p>
            <h2>Review what your own public profile may reveal.</h2>
            <p>A tightly scoped scan of your company website, official public channels and selected visual material. It separates direct observations from cautious inferences and gives practical publication priorities.</p>
            <ButtonLink href="/services/public-profile-exposure-scan" variant="secondary">View the Scan Scope</ButtonLink>
          </div>
          <ServiceCard service={publicProfileScan} />
        </Container>
      </section>
      <section className="section pricing-section" id="reports">
        <Container>
          <div className="content-heading"><p className="eyebrow">Indicative engagement levels</p><h2>Scope follows the decision.</h2><p>Unlike the €499 scan of your own public presence, the assessments below address external intelligence questions. These are indicative starting fees, not order prices or quotations. A defined assignment, deliverables, fixed fee and delivery date are proposed after scope review.</p></div>
          <div className="pricing-grid">{reportOptions.map((service) => <ServiceCard service={service} key={service.name} />)}</div>
          <p className="pricing-note">Complex, international or urgent assignments are quoted individually after scoping. A smaller paid pilot may be proposed when appropriate.</p>
        </Container>
      </section>
      <section className="section priority-section" id="priority-delivery">
        <Container>
          <div className="content-heading">
            <p className="eyebrow">Delivery options</p>
            <h2>Timing shaped by the evidence.</h2>
            <p>Tell us when the decision is needed. We assess the scope, source availability and capacity before confirming any delivery date.</p>
          </div>
          <div className="priority-grid">
            {deliveryOptions.map((option) => (
              <article className="priority-option" key={option.value}>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
              </article>
            ))}
          </div>
          <p className="priority-condition">Priority and critical requests are scoped and quoted individually before work begins. Neither is accepted by form selection alone. The agreed period starts only after written confirmation of scope, fixed fee and deadline and receipt of required information. We may decline a request when the evidence cannot be checked responsibly in time; our evidence standards do not change.</p>
          <div className="priority-faq">
            <p className="eyebrow">FAQ</p>
            <h3>Is a 24–48-hour assessment always possible?</h3>
            <p>No. This is considered only for selected questions where lawful sources, scope and capacity permit responsible verification. We confirm feasibility and price in writing first.</p>
          </div>
        </Container>
      </section>
      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">Working boundary</p><h2>Public sources. Clear limits.</h2></div>
          <div className="prose-block">
            <p>Work is limited to lawful public-source research. MelonCactus does not hack systems, bypass access controls, impersonate people, use social engineering or accept stolen or unlawfully acquired information.</p>
            <p>Some questions cannot be answered responsibly from public material. Those limits are stated directly, with the remaining information gaps and sensible next research questions.</p>
            <ButtonLink href="/methodology" variant="secondary">Read the Methodology</ButtonLink>
          </div>
        </Container>
      </section>
      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">Define the question</p><h2>Which uncertainty is shaping your decision?</h2><p>A concise brief is enough to begin an assessment of scope and evidence.</p></div><ButtonLink href="/contact">Request an Intelligence Assessment</ButtonLink></Container></section>
    </>
  );
}
