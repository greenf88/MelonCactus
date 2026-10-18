import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { siteConfig } from "@/config/site";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Bespreek uw bedrijfsvraag",
  description: "Bespreek markt- en concurrentieonderzoek, praktische AI-begeleiding of een taak die u wilt automatiseren. Wij spreken opdracht, vaste prijs en planning vooraf af.",
  alternates: languageAlternates("/contact", "nl"),
};

export default async function DutchContactPage({ searchParams }: { searchParams: Promise<{ topic?: string; report?: string; call?: string }> }) {
  const query = await searchParams;
  return (
    <section className="contact-section">
      <Container className="contact-layout">
        <header className="contact-intro">
          <Breadcrumbs items={[{ label: "Contact" }]} locale="nl" />
          <p className="eyebrow">Onderzoek · Praktische AI</p>
          <h1>Begin bij uw vraag.</h1>
          <p className="page-intro">Vertel wat u beter wilt begrijpen, beslissen of verbeteren. Een korte omschrijving is genoeg voor een eerste beoordeling.</p>
          <p>Neemt u liever rechtstreeks contact op? Mail <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a> of bel <a href={siteConfig.businessPhoneHref}>{siteConfig.businessPhoneDisplay}</a>. MelonCactus wordt vanuit Enschede geëxploiteerd door GFNI.</p>
        </header>
        <div className="contact-form-area">
          <ContactForm locale="nl" initialTopic={query.topic} initialReport={query.report ?? ""} callRequested={query.call === "true"} />
          <aside className="contact-guidance">
            <h2>Van vraag naar opdracht</h2>
            <ol className="contact-steps">
              <li><span>01</span><p>Eerste beoordeling van uw vraag, gewenste uitkomst en relevante informatie.</p></li>
              <li><span>02</span><p>Afbakening van de opdracht, grenzen en benodigde controles.</p></li>
              <li><span>03</span><p>Een voorstel met resultaten, vaste prijs en opleverdatum.</p></li>
              <li><span>04</span><p>Start na schriftelijke overeenstemming, gevolgd door het afgesproken rapport, de begeleiding of een getoetste oplevering.</p></li>
            </ol>
          </aside>
        </div>
      </Container>
    </section>
  );
}
