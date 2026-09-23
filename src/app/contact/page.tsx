import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Request a Report",
  description: "Describe the industrial intelligence question, decision and timeframe you need MelonCactus to assess.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ report?: string; call?: string }> }) {
  const query = await searchParams;

  return (
    <section className="contact-section">
      <Container className="contact-layout">
        <header className="contact-intro">
          <Breadcrumbs items={[{ label: "Contact" }]} />
          <p className="eyebrow">Confidential enquiry</p>
          <h1>Start with your question.</h1>
          <p className="page-intro">Describe the decision and the uncertainty behind it. We confirm scope, timing and fee before research begins.</p>
        </header>

        <div className="contact-form-area">
          <ContactForm initialReport={query.report ?? ""} callRequested={query.call === "true"} />
        </div>

        <aside className="contact-guidance">
          <p className="eyebrow">What happens next</p>
          <ol className="contact-steps">
            <li><span>01</span><p>We clarify the decision, target and useful evidence threshold.</p></li>
            <li><span>02</span><p>We confirm scope, exclusions, timing and fee in writing.</p></li>
            <li><span>03</span><p>Research begins only after the scope is agreed.</p></li>
          </ol>
          <div className="confidentiality-note">
            <h2>Discreet by design.</h2>
            <p>No public client list by default. No named client cases without written permission. Information supplied for scoping is kept to what is necessary for the enquiry.</p>
          </div>
        </aside>
      </Container>
    </section>
  );
}
