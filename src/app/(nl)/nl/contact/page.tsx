import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Rapport aanvragen",
  description: "Beschrijf de industriële onderzoeksvraag, beslissing en termijn die u door MelonCactus wilt laten beoordelen.",
  alternates: languageAlternates("/contact", "nl"),
};

export default async function DutchContactPage({ searchParams }: { searchParams: Promise<{ report?: string; call?: string }> }) {
  const query = await searchParams;
  return (
    <section className="contact-section">
      <Container className="contact-layout">
        <header className="contact-intro">
          <Breadcrumbs items={[{ label: "Contact" }]} locale="nl" />
          <p className="eyebrow">Vertrouwelijke aanvraag</p>
          <h1>Begin met uw vraag.</h1>
          <p className="page-intro">Beschrijf de beslissing en de onzekerheid daarachter. Wij bevestigen de opdracht, termijn en prijs voordat het onderzoek begint.</p>
        </header>
        <div className="contact-form-area"><ContactForm locale="nl" initialReport={query.report ?? ""} callRequested={query.call === "true"} /></div>
        <aside className="contact-guidance">
          <p className="eyebrow">Hoe gaat het verder?</p>
          <ol className="contact-steps">
            <li><span>01</span><p>Wij verduidelijken uw beslissing, onderzoeksdoel en de benodigde bewijsstandaard.</p></li>
            <li><span>02</span><p>Wij bevestigen de opdracht, beperkingen, termijn en prijs schriftelijk.</p></li>
            <li><span>03</span><p>Het onderzoek begint pas nadat de opdracht is overeengekomen.</p></li>
          </ol>
          <div className="confidentiality-note">
            <h2>Discreet van opzet.</h2>
            <p>Standaard publiceren wij geen klantenlijst. Zonder schriftelijke toestemming noemen wij geen klantcases. Voor het bepalen van de opdracht vragen wij alleen informatie die daarvoor nodig is.</p>
          </div>
        </aside>
      </Container>
    </section>
  );
}
