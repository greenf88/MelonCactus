import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ServiceNextStep } from "@/components/service-next-step";
import { focusedServices } from "@/config/focused-services";

const service = focusedServices[0];
const path = `/services/${service.slug}`;

export const metadata: Metadata = {
  title: "Industrial Competitor Analysis",
  description: "Assess what verified public evidence establishes about an industrial competitor’s products, technical capabilities, partnerships and strategic direction.",
  alternates: { canonical: path },
  openGraph: { type: "website", title: "Industrial Competitor Analysis | MelonCactus", description: "An evidence-led competitor profile that separates substantiated capability from claims and signals.", url: path },
};

export default function IndustrialCompetitorAnalysisPage() {
  return <>
    <PageHeader eyebrow="Focused service / 01" title="What can public evidence establish about an industrial competitor?" intro="A competitor profile connects product, capability, partnership and investment signals to the decision you face. It separates what a company says, what independent sources support and what remains unverified." breadcrumbs={[{ label: "Services", href: "/services" }, { label: service.title }]} />
    <section className="section"><Container className="service-detail-grid"><div><p className="eyebrow">When this helps</p><h2>Test the assumption before it shapes a decision.</h2></div><div className="service-prose"><p>This work is useful before market entry, product positioning, partner selection or a response to a competitor announcement. The starting point is a narrow uncertainty: for example, whether a newly promoted product is commercially available, or whether a stated technical capability has support beyond marketing language.</p><p>A profile is not a general dossier. Its scope follows the decision: which claims need testing, which time period matters and how strong the evidence must be to act.</p></div></Container></section>
    <section className="section section-muted"><Container><div className="content-heading"><p className="eyebrow">Questions and sources</p><h2>From visible claims to a defensible competitor picture.</h2></div><div className="service-columns"><div><h3>Questions the investigation can address</h3><ul><li>Which products appear to be offered now, and which are still development or launch signals?</li><li>What public evidence supports particular technical capabilities or facilities?</li><li>Which partnerships, suppliers or project relationships are documented, and what is merely implied?</li><li>Do hiring, filings or published investments point to a change in strategic direction?</li></ul></div><div><h3>Lawful evidence considered</h3><p>Product documentation, technical papers, patents, corporate and regulatory filings, certifications, public tenders, vacancies, supplier references and published imagery may each answer a different part of the question. A source is assessed for date, provenance and purpose; a company claim is recorded as a claim until corroborated.</p></div></div></Container></section>
    <section className="section"><Container className="service-detail-grid"><div><p className="eyebrow">Research and verification</p><h2>Make the reasoning inspectable.</h2></div><div className="service-prose"><p>We define the claims to test, build a source plan and assemble a dated evidence trail. Product statements are compared with independent technical or regulatory material where available. Relationships are described at the level the source supports: a named supplier reference, for example, does not by itself establish an exclusive or continuing partnership.</p><p>The report distinguishes direct observations, supported assessments and working hypotheses. Contradictions and stale evidence remain visible rather than being folded into a single narrative.</p><h3>The deliverable</h3><p>A scoped competitor profile can include a product and capability map, documented relationship and investment signals, a short timeline, evidence references, confidence levels, alternative explanations and the gaps that matter to the buyer’s decision.</p></div></Container></section>
    <section className="section service-limits"><Container className="service-detail-grid"><div><p className="eyebrow">What remains unknown</p><h2>Public evidence has a boundary.</h2></div><div className="service-prose"><p>A brochure cannot prove performance in use. A patent does not prove commercial deployment. A vacancy does not prove a team has been hired. Undisclosed contracts, private roadmaps, internal cost, achieved throughput and customer-specific terms may remain unknowable from lawful public material. We state those limits instead of supplying an estimate unsupported by evidence.</p></div></Container></section>
    <ServiceNextStep service={service} scopeNote="A Competitor Snapshot suits a defined company, product or capability question. A multi-company or highly technical investigation may need a broader report option." />
  </>;
}
