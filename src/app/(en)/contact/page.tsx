import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { languageAlternates } from "@/lib/i18n";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Request an Intelligence Assessment",
  description: "Describe the decision, company, market or technology you need assessed. MelonCactus reviews lawful sources and evidence needs before proposing a fixed scope, fee and date.",
  alternates: languageAlternates("/contact", "en"),
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ report?: string; call?: string }> }) {
  const query = await searchParams;

  return (
    <section className="contact-section">
      <Container className="contact-layout">
        <header className="contact-intro">
          <Breadcrumbs items={[{ label: "Contact" }]} />
          <p className="eyebrow">Intelligence assessment</p>
          <h1>Start with the decision.</h1>
          <p className="page-intro">What decision are you trying to make, and which company, market or technology should be examined?</p>
          <p>We first assess the question, the availability of lawful public sources and the evidence needed. Before work begins, you receive a defined scope, deliverables, fixed fee and agreed delivery date.</p>
          <p>Prefer to speak first? Call <a href={siteConfig.businessPhoneHref}>{siteConfig.businessPhoneDisplay}</a> or email <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a>.</p>
        </header>

        <div className="contact-form-area">
          <ContactForm initialReport={query.report ?? ""} callRequested={query.call === "true"} />
          <aside className="contact-guidance">
            <h2>From question to assignment</h2>
            <ol className="contact-steps">
              <li><span>01</span><p>Initial review of your decision, question and lawful public sources.</p></li>
              <li><span>02</span><p>Definition of the scope and what the evidence can and cannot establish.</p></li>
              <li><span>03</span><p>A proposal with deliverables, a fixed fee and delivery date.</p></li>
              <li><span>04</span><p>Research after written agreement, followed by the report and, for larger assignments, a discussion of the conclusions.</p></li>
            </ol>
            <p>We may decline a question that cannot be answered responsibly using lawful sources.</p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
