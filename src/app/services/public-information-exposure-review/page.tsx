import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { ServiceNextStep } from "@/components/service-next-step";
import { focusedServices } from "@/config/focused-services";

const service = focusedServices[2];
const path = `/services/${service.slug}`;

export const metadata: Metadata = {
  title: "Public-Information Exposure Review",
  description: "Understand what an outside observer could combine from your lawful public disclosures, including documents, vacancies, supplier references and imagery.",
  alternates: { canonical: path },
  openGraph: { type: "website", title: "Public-Information Exposure Review | MelonCactus", description: "A proportionate review of public disclosures and the competitive picture they create together.", url: path },
};

export default function PublicInformationExposureReviewPage() {
  return <>
    <PageHeader eyebrow="Focused service / 03" title="What could an outside observer learn from your public information?" intro="A disclosure that seems harmless alone can become revealing when combined with other published material. This review examines that cumulative picture from outside the organisation." breadcrumbs={[{ label: "Services", href: "/services" }, { label: service.title }]} />
    <section className="service-boundary-banner"><Container><strong>This reviews lawful public disclosures—not a penetration test or cybersecurity audit.</strong> It does not probe systems, test controls or use non-public material.</Container></section>
    <section className="section"><Container className="service-detail-grid"><div><p className="eyebrow">When this helps</p><h2>Publish deliberately, with the whole picture in view.</h2></div><div className="service-prose"><p>The review can support a product launch, a facility expansion, supplier communications or a refresh of publication guidance. It is useful when different teams publish independently and no one has recently examined what their documents and images reveal in combination.</p><p>The scope begins with the business information that matters: programme timing, process choices, operational constraints, supplier relationships or customer references. It is not an instruction to suppress useful public communication.</p></div></Container></section>
    <section className="section section-muted"><Container><div className="content-heading"><p className="eyebrow">Where signals appear</p><h2>Ordinary publications can form a detailed outside view.</h2></div><div className="service-columns"><div><h3>Questions the review can address</h3><ul><li>What can be inferred by combining current and older company documents?</li><li>Do vacancies disclose tools, programmes, locations or timing not apparent elsewhere?</li><li>Do supplier references connect a site, process or customer to a public project?</li><li>What do published photos and videos reveal through labels, screens, layout or equipment?</li></ul></div><div><h3>Sources in scope</h3><p>The review examines lawfully accessible company pages and documents, public recruitment material, supplier and contractor references, conference presentations, trade-fair material and published imagery. It records where each relevant disclosure appeared and how readily an ordinary outside reader could find it.</p></div></div></Container></section>
    <section className="section"><Container className="service-detail-grid"><div><p className="eyebrow">Approach and output</p><h2>Assess combinations, then prioritise practical action.</h2></div><div className="service-prose"><p>We map the agreed public channels, preserve source context and compare disclosures across dates and publishers. Each potential exposure is tested against alternative explanations and the actual business question. An isolated technical term may merit little attention; the same term linked to a site photograph and a supplier reference may deserve review.</p><p>The deliverable is a sourced exposure register with the relevant combination, likely competitive significance, uncertainty and proportionate options for publication review. Recommendations can distinguish material that should be checked before future release from historical material that may be difficult or inappropriate to remove. Collection of personal information is minimised.</p></div></Container></section>
    <section className="section service-limits"><Container className="service-detail-grid"><div><p className="eyebrow">Limits</p><h2>A public footprint is not an internal security posture.</h2></div><div className="service-prose"><p>The review cannot establish who has seen a disclosure, whether a competitor acted on it, or whether an internal system is secure. It does not bypass access controls, search private accounts, use leaked material, contact staff deceptively or certify legal compliance. Findings are framed as public-information risks for the organisation to evaluate, not as proof of harm.</p></div></Container></section>
    <ServiceNextStep service={service} scopeNote="A Technical Deep Dive is an indicative starting point for a multi-channel review. A narrowly defined first scan may be smaller; the fee depends on the channels, period and evidence volume agreed." />
  </>;
}
