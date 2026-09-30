import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Fictional Example Case: What Does a Public Profile Reveal?",
  description: "A fictional, high-level example of how a company can assess what outsiders might infer from its public online presence.",
  alternates: languageAlternates("/example-case/public-profile", "en"),
};

export default function PublicProfileExampleCasePage() {
  return (
    <article>
      <PageHeader
        eyebrow="Fictional example case · public profile"
        title="What picture does your public presence create?"
        intro="Another Company X wants to understand what an outside observer could learn about its business from the material it and others have made public."
        breadcrumbs={[{ label: "Public-profile example case" }]}
      />

      <section className="section">
        <Container className="split-content">
          <div><p className="eyebrow">The question</p><h2>What becomes visible beyond the intended message?</h2></div>
          <div className="prose-block">
            <p>The company has published website content, social posts, images and company videos over time. It asks for a careful review of its public profile: what can an outside reader observe, what might they reasonably infer, and where would a conclusion go beyond the evidence?</p>
            <p>Relevant visual material is considered in context, not treated as proof on its own. The agreed scope determines which publications are reviewed. The assignment does not involve access to private systems or accounts.</p>
            <p><strong>This is a fictional illustration.</strong> Company X is not a client, and this page does not reproduce a real company&apos;s findings or confidential report.</p>
          </div>
        </Container>
      </section>

      <section className="section section-muted">
        <Container className="split-content">
          <div><p className="eyebrow">Illustrative outcome</p><h2>The combined picture matters.</h2></div>
          <div className="prose-block">
            <p>In this fictional case, no single publication gives away a complete picture. Considered together, however, public messages and visuals could reveal more about the company&apos;s direction and capabilities than any one item suggests.</p>
            <p>The report would distinguish direct observations from cautious inferences and unknowns. It would help the company decide which future publications need a closer review, while preserving useful communication with customers and partners.</p>
            <p className="report-disclaimer">This is deliberately a high-level example, not a disclosure assessment of an actual company. It makes no claim that a competitor obtained information or reproduced a product. It shows the form of the assessment, not the source list or concrete findings from a real assignment.</p>
          </div>
        </Container>
      </section>

      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">A question about your own profile?</p><h2>Understand what your public presence may convey.</h2><p>Our fixed-scope scan provides a compact, evidence-led review of your own company&apos;s public profile.</p></div><div className="button-row"><ButtonLink href="/services/public-profile-exposure-scan">View the €499 Scan</ButtonLink><ButtonLink href="/example-case/fourth-pillar" variant="secondary">View Another Example Case</ButtonLink></div></Container></section>
    </article>
  );
}
