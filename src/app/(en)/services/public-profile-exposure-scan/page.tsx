import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { StructuredData } from "@/components/structured-data";
import { publicProfileScan } from "@/config/site";
import { languageAlternates } from "@/lib/i18n";
import { breadcrumbSchema, serviceSchema, socialImageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Public Profile Exposure Scan for Industrial Companies",
  description: "A fixed-fee €499 review of what an outside observer may infer from your company website, official public channels and selected visual material.",
  alternates: languageAlternates("/services/public-profile-exposure-scan", "en"),
  openGraph: { title: "Public Profile Exposure Scan for Industrial Companies", ...socialImageMetadata("en", "service", "Public Profile Exposure Scan", "public-profile-exposure-scan").openGraph },
};

const deliverables = [
  ["Observations", "What the agreed public material directly shows, with clear source references."],
  ["Cautious inferences", "What an informed outside observer might reasonably infer when separate publications are considered together."],
  ["Unknowns", "Where the available material does not support a responsible conclusion."],
  ["Priorities", "Which future publications deserve closer review and why."],
] as const;

export default function PublicProfileExposureScanPage() {
  return (
    <>
      <PageHeader
        eyebrow="Fixed-scope defensive assessment"
        title="See your company the way an outside observer might."
        intro="The Public Profile Exposure Scan reviews a defined sample of your own public material and identifies what it may reveal when separate signals are considered together."
        breadcrumbs={[{ label: "Services", href: "/services" }, { label: "Public Profile Exposure Scan" }]}
      />

      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">The purpose</p><h2>Useful communication can disclose more in combination.</h2></div>
          <div className="prose-block">
            <p>A website page, social post, vacancy, image or company video may reveal little on its own. Together, public material can create a clearer picture of direction, capabilities, relationships or operating priorities than the organisation intended.</p>
            <p>The scan is defensive: it helps your company decide where a closer publication review is worthwhile without unnecessarily restricting communication with customers, employees and partners.</p>
          </div>
        </Container>
      </section>

      <section className="section section-muted">
        <Container>
          <div className="content-heading"><p className="eyebrow">Compact deliverable</p><h2>What you receive.</h2><p>The assessment separates direct evidence from interpretation and clearly states where the public record is incomplete.</p></div>
          <div className="values-grid">
            {deliverables.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </Container>
      </section>

      <section className="section pricing-section">
        <Container className="split-content">
          <div className="prose-block">
            <p className="eyebrow">Defined scope</p>
            <h2>A deliberately limited starting point.</h2>
            <p>The fixed fee covers one company-owned primary website, up to two official public channels and selected company-published visual material. The exact sample and review period are confirmed before work begins.</p>
            <p>It does not include private accounts, penetration testing, network or software vulnerability testing, dark-web monitoring, legal compliance certification or ongoing monitoring. A broader question is scoped separately.</p>
          </div>
          <ServiceCard service={publicProfileScan} />
        </Container>
      </section>

      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">Evidence boundary</p><h2>A signal is not automatically a finding.</h2></div>
          <div className="prose-block"><p>Visual and written material is assessed in context. The scan does not claim to determine everything a competitor knows, and it does not treat a plausible interpretation as fact. Conclusions remain proportionate to the evidence.</p><ButtonLink href="/example-case/public-profile" variant="secondary">View the Fictional Example Case</ButtonLink></div>
        </Container>
      </section>

      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">Review your own public profile</p><h2>Request the fixed-scope scan.</h2><p>We confirm the public channels, sample and boundaries before accepting the assignment.</p></div><ButtonLink href={`/contact?report=${encodeURIComponent(publicProfileScan.name)}`}>Request the €499 Scan</ButtonLink></Container></section>
      <StructuredData data={breadcrumbSchema("en", [{ name: "Services", path: "/services" }, { name: "Public Profile Exposure Scan", path: "/services/public-profile-exposure-scan" }])} />
      <StructuredData data={serviceSchema({ path: "/services/public-profile-exposure-scan", name: publicProfileScan.name, description: publicProfileScan.summary, locale: "en", price: 499, priceNote: "Fixed fee of €499 excluding VAT, subject to agreed scope and written confirmation." })} />
    </>
  );
}
