import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Bespreek uw onderzoeksvraag",
  description: "Beschrijf de beslissing en de onderneming, markt of technologie waarover u inzicht zoekt. MelonCactus beoordeelt eerst bronnen en bewijsbehoefte en stelt dan opdracht, vaste prijs en datum voor.",
  alternates: languageAlternates("/contact", "nl"),
};

export default async function DutchContactPage({ searchParams }: { searchParams: Promise<{ report?: string; call?: string }> }) {
  const query = await searchParams;
  return (
    <section className="contact-section">
      <Container className="contact-layout">
        <header className="contact-intro">
          <Breadcrumbs items={[{ label: "Contact" }]} locale="nl" />
          <p className="eyebrow">Intelligencebeoordeling</p>
          <h1>Begin bij uw beslissing.</h1>
          <p className="page-intro">Welke beslissing probeert u te nemen? Welke onderneming, markt of technologie moet worden onderzocht?</p>
          <p>Wij beoordelen eerst de vraag, de beschikbaarheid van rechtmatige openbare bronnen en het benodigde bewijs. Vóór aanvang ontvangt u een afgebakende opdracht met resultaten, vaste prijs en afgesproken opleverdatum.</p>
        </header>
        <div className="contact-form-area">
          <ContactForm locale="nl" initialReport={query.report ?? ""} callRequested={query.call === "true"} />
          <aside className="contact-guidance">
            <h2>Van vraag naar opdracht</h2>
            <ol className="contact-steps">
              <li><span>01</span><p>Eerste beoordeling van uw beslissing, vraag en rechtmatige openbare bronnen.</p></li>
              <li><span>02</span><p>Afbakening van de opdracht en van wat het bewijs wel en niet kan aantonen.</p></li>
              <li><span>03</span><p>Een voorstel met resultaten, vaste prijs en opleverdatum.</p></li>
              <li><span>04</span><p>Onderzoek na schriftelijke overeenstemming, gevolgd door het rapport en bij grotere opdrachten een bespreking van de conclusies.</p></li>
            </ol>
            <p>Wij kunnen een vraag weigeren als die niet verantwoord met rechtmatige bronnen is te beantwoorden.</p>
          </aside>
        </div>
      </Container>
    </section>
  );
}
