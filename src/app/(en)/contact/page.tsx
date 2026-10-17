import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { siteConfig } from "@/config/site";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Discuss Your Business Question",
  description: "Discuss market and competitor research, practical AI guidance or a task you want to automate. Scope, fixed fee and timing are agreed in writing first.",
  alternates: languageAlternates("/contact", "en"),
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string; report?: string; call?: string }> }) {
  const query = await searchParams;

  return (
    <section className="contact-section">
      <Container className="contact-layout">
        <header className="contact-intro">
          <Breadcrumbs items={[{ label: "Contact" }]} />
          <p className="eyebrow">Research · Practical AI</p>
          <h1>Start with your question.</h1>
          <p className="page-intro">Tell us what you want to understand, decide or improve. A concise description is enough for an initial review.</p>
          <p>For research, we assess the question and available lawful sources. For practical AI, we first define the task, information, tools and human checks. Before work begins, you receive a defined scope, deliverables, fixed fee and agreed schedule.</p>
          <p>Prefer to contact us directly? Email <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a> or call <a href={siteConfig.businessPhoneHref}>{siteConfig.businessPhoneDisplay}</a>. MelonCactus is operated by GFNI in Enschede, Netherlands.</p>
        </header>

        <div className="contact-form-area">
          <ContactForm initialTopic={query.topic} initialReport={query.report ?? ""} callRequested={query.call === "true"} />
          <aside className="contact-guidance">
            <h2>From question to assignment</h2>
            <ol className="contact-steps">
              <li><span>01</span><p>Initial review of your question, desired outcome and relevant information.</p></li>
              <li><span>02</span><p>Definition of the scope, boundaries and the checks needed.</p></li>
              <li><span>03</span><p>A proposal with deliverables, a fixed fee and delivery date.</p></li>
              <li><span>04</span><p>Work starts after written agreement, followed by the agreed report, guidance or tested deliverable.</p></li>
            </ol>
            <p>We may decline work that cannot be performed responsibly within the requested scope, available evidence or selected tools.</p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
