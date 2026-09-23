import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { reportOptions } from "@/config/site";
import { calculateDeliveryTotal, deliveryOptions } from "@/config/delivery";
import { focusedServices } from "@/config/focused-services";

export const metadata: Metadata = {
  title: "Industrial Competitive Intelligence Services",
  description: "Explore MelonCactus industrial competitor analysis, public-source manufacturing capability analysis and public-information exposure review, plus report options.",
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
        title="Industrial competitor and technical intelligence services"
        intro="Explore focused competitor, manufacturing capability and public-information exposure research. Each engagement starts with a decision and uses lawful public sources, transparent evidence standards and proportionate conclusions."
        breadcrumbs={[{ label: "Services" }]}
      />
      <section className="section section-muted">
        <Container>
          <div className="content-heading"><p className="eyebrow">Focused services</p><h2>Find the service that fits your question.</h2><p>These pages explain what each investigation can establish, what it delivers and where public evidence has limits.</p></div>
          <div className="focused-services-grid">
            {focusedServices.map((service, index) => <article className="focused-service-card" key={service.slug}><span>{String(index + 1).padStart(2, "0")}</span><h3><Link href={`/services/${service.slug}`}>{service.title}</Link></h3><p>{service.summary}</p><Link className="section-link" href={`/services/${service.slug}`}>Explore this service <span aria-hidden="true">→</span></Link></article>)}
          </div>
        </Container>
      </section>
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
      <section className="section priority-section" id="priority-delivery">
        <Container>
          <div className="content-heading">
            <p className="eyebrow">Delivery options</p>
            <h2>Priority delivery</h2>
            <p>Choose a delivery request to discuss during scope review. Each multiplier applies to the final agreed project fee, not to a starting price shown above.</p>
          </div>
          <div className="priority-grid">
            {deliveryOptions.map((option) => (
              <article className="priority-option" key={option.value}>
                <h3>{option.title}</h3>
                <p className="priority-multiplier">{option.multiplier}× <span>final agreed project fee</span></p>
                <p>{option.description}</p>
                <p className="priority-surcharge">{option.surcharge}</p>
              </article>
            ))}
          </div>
          <p className="priority-condition">The 24- and 48-hour options are subject to capacity and scope suitability. A request is not automatically accepted. Priority delivery becomes binding only when MelonCactus confirms the scope, final fee and deadline in writing and has received all required materials. We may decline a request when responsible evidence verification is not possible within the timeframe. Our evidence and quality standards remain the same.</p>
          <p className="priority-example">Illustration only, not a quotation: if the final agreed project fee is €995, confirmed 48-hour delivery totals €{calculateDeliveryTotal(995, "within-48-hours").toLocaleString("en-IE")}; confirmed 24-hour delivery totals €{calculateDeliveryTotal(995, "within-24-hours").toLocaleString("en-IE")}.</p>
          <div className="priority-faq">
            <p className="eyebrow">FAQ</p>
            <h3>Can every report be delivered within 24 or 48 hours?</h3>
            <p>No. Suitability depends on the research scope, available sources and capacity. We will only confirm a priority deadline when the evidence can be checked responsibly within it.</p>
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
      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">Define the question</p><h2>Which uncertainty is shaping your decision?</h2><p>A concise brief is enough to start a confidential scope discussion.</p></div><ButtonLink href="/contact">Request a Report</ButtonLink></Container></section>
    </>
  );
}
