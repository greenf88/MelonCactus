import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import { languageAlternates } from "@/lib/i18n";
import { breadcrumbSchema, personSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Our Industrial Intelligence Practice",
  description: "Meet Rick Groeneveld, the person behind MelonCactus. Learn how GFNI's industrial research uses lawful public sources and keeps evidence limits visible.",
  alternates: languageAlternates("/about", "en"),
};

export default function AboutPage() {
  return <>
    <PageHeader eyebrow="About" title="Industrial questions deserve technical evidence." intro={siteConfig.description} breadcrumbs={[{ label: "About" }]} />
    <section className="section"><Container className="split-content">
      <div><p className="eyebrow">Position</p><h2>A specialist research practice for complex industrial decisions.</h2></div>
      <div className="prose-block">
        <p>MelonCactus is built for decision-makers who need a clearer view of a competitor, technology, facility, supply chain or market position. The work brings fragmented public evidence into a structured assessment.</p>
        <p>We begin with the decision, test material assumptions and state what the evidence can support. Facts, assessments, inferences and unknowns are kept distinct. AI and automation may help organise research, but they cannot make weak evidence strong.</p>
        <p>{siteConfig.operatorStatement} GFNI is a sole proprietorship based in Enschede, Netherlands. MelonCactus is its public-facing industrial-intelligence practice, not a second legal entity.</p>
      </div>
    </Container></section>
    <section className="section section-muted" id="rick-groeneveld"><Container className="split-content">
      <div><p className="eyebrow">The person behind the work</p><h2>Rick Groeneveld</h2></div>
      <div className="prose-block">
        <p>Rick Groeneveld is the contact person behind MelonCactus. His professional background is in technical project management in an industrial setting. That perspective informs how the practice examines capability, timing and the evidence needed for a decision.</p>
        <p>Research is limited to lawfully accessible public sources. MelonCactus does not perform penetration tests, access private accounts, certify legal compliance or promise a particular commercial result. The published example cases are fictional.</p>
        <p>GFNI · Dutch Chamber of Commerce {siteConfig.registrationNumber} · VAT ID {siteConfig.vatId}<br />{siteConfig.postalAddress}<br /><a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a> · <a href={siteConfig.businessPhoneHref}>{siteConfig.businessPhoneDisplay}</a></p>
        <p><a href={siteConfig.linkedInCompanyUrl} rel="noopener noreferrer">View the MelonCactus company page on LinkedIn</a></p>
      </div>
    </Container></section>
    <section className="section section-muted"><Container><div className="values-grid">
      <article><span>01</span><h3>Evidence before narrative</h3><p>Conclusions follow the sources. Contradictions, alternative explanations and information gaps remain visible.</p></article>
      <article><span>02</span><h3>Discretion by default</h3><p>Enquiries and scopes are handled carefully. No public client list or named client case is used without written permission.</p></article>
      <article><span>03</span><h3>Technical restraint</h3><p>Analysis distinguishes what is observed, what is assessed, what is inferred and what remains unknown.</p></article>
      <article><span>04</span><h3>Lawful boundaries</h3><p>No hacking, impersonation, social engineering or unlawfully obtained information.</p></article>
    </div></Container></section>
    <section className="section"><Container className="split-content">
      <div><p className="eyebrow">For decision-makers</p><h2>Clear enough to brief the board. Detailed enough to challenge.</h2></div>
      <div className="prose-block">
        <p>Typical readers include executives, technical directors, strategy and business-development leaders, R&amp;D and product teams, procurement teams, investors and advisers working with industrial businesses.</p>
        <p>Every engagement begins with the question and the decision it must inform. Scope, deliverables, fixed fee and delivery date are agreed before research begins.</p>
        <ButtonLink href="/contact">Discuss an Intelligence Requirement</ButtonLink>
      </div>
    </Container></section>
    <StructuredData data={personSchema("en")} />
    <StructuredData data={breadcrumbSchema("en", [{ name: "About", path: "/about" }])} />
  </>;
}
