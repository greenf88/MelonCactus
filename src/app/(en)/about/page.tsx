import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About",
  description: "MelonCactus is an industrial-intelligence practice operated by GFNI, using lawful public sources and explicit evidence limits.",
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
        <p>{siteConfig.operatorStatement}</p>
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
  </>;
}
