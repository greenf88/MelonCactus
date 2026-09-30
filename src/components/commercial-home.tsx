import Link from "next/link";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { commercialHome, type HomeLocale } from "@/config/commercial-home";
import { publicProfileScan, reportOptions, siteConfig } from "@/config/site";
import { publicProfileScanNl, reportOptionsNl } from "@/config/site-nl";

export function CommercialHome({ locale }: { locale: HomeLocale }) {
  const content = commercialHome[locale];
  const isNl = locale === "nl";
  const contact = isNl ? "/nl/contact" : "/contact";
  const sample = isNl ? "/nl/voorbeeldrapport" : "/sample-report";
  const services = isNl ? "/nl/diensten" : "/services";
  const methodology = isNl ? "/nl/werkwijze" : "/methodology";
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />

      <section className="hero home-hero">
        <Container className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <h1>{content.hero.title}</h1>
            <p className="hero-intro">{content.hero.intro}</p>
            <div className="button-row">
              <ButtonLink href={contact}>{content.hero.primary}</ButtonLink>
              <ButtonLink href={sample} variant="secondary">{content.hero.secondary}</ButtonLink>
            </div>
          </div>
          <div className="evidence-panel" role="group" aria-label={isNl ? "Illustratieve bewijsclassificatie" : "Illustrative evidence classification"}>
            <div className="evidence-panel-top"><span>{isNl ? "Bewijsregistratie" : "Evidence record"}</span><span>MC / DEMO</span></div>
            <p className="home-evidence-question">{isNl ? "Wat ondersteunen de bronnen werkelijk?" : "What do the sources actually support?"}</p>
            <dl>
              <div><dt>{isNl ? "Bron" : "Source"}</dt><dd>{isNl ? "Herleidbaar" : "Traceable"}</dd></div>
              <div><dt>{isNl ? "Beoordeling" : "Assessment"}</dt><dd>{isNl ? "Afzonderlijk vermeld" : "Stated separately"}</dd></div>
              <div><dt>{isNl ? "Onbekend" : "Unknown"}</dt><dd>{isNl ? "Zichtbaar gelaten" : "Kept visible"}</dd></div>
            </dl>
            <p className="evidence-note">{isNl ? "Illustratief schema, geen onderzoeksbevinding." : "Illustrative format, not a research finding."}</p>
          </div>
        </Container>
      </section>

      <section className="application-band" aria-label={isNl ? "Toepassingsgebieden" : "Areas of application"}>
        <Container className="application-grid">
          {content.applications.map((application, index) => (
            <p key={application}><span>{String(index + 1).padStart(2, "0")}</span>{application}</p>
          ))}
        </Container>
      </section>

      <section className="section" id={isNl ? "beslissingen" : "decisions"}>
        <Container>
          <SectionHeading {...content.decisions} />
          <div className="decision-grid">
            {content.decisions.items.map((item, index) => (
              <article className="decision-card" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3><p>{item.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section section-muted report-preview-section" id={isNl ? "rapport" : "report"}>
        <Container className="report-preview-grid">
          <div className="report-preview-copy">
            <p className="eyebrow">{content.deliverable.eyebrow}</p>
            <h2>{content.deliverable.title}</h2>
            <p>{content.deliverable.intro}</p>
            <ul className="report-preview-list">
              {[content.deliverable.summary, content.deliverable.findings, content.deliverable.scope, content.deliverable.sources, content.deliverable.implications].map((item) => <li key={item}>{item}</li>)}
            </ul>
            <ButtonLink href={sample} variant="secondary">{content.deliverable.cta}</ButtonLink>
          </div>
          <article className="report-sheet" aria-label={isNl ? "Fictief rapportfragment" : "Fictional report extract"}>
            <div className="report-sheet-top"><span>MelonCactus</span><span>MC-DEMO-001</span></div>
            <p className="report-sheet-disclaimer">{content.deliverable.fictional}</p>
            <h3>{content.deliverable.decision}</h3>
            <div className="report-sheet-findings">
              <p>{content.deliverable.evidence}</p>
              <p>{content.deliverable.assessment}</p>
              <p>{content.deliverable.inference}</p>
              <p>{content.deliverable.unknown}</p>
            </div>
            <p className="report-sheet-confidence">{content.deliverable.confidence}</p>
          </article>
        </Container>
      </section>

      <section className="section" id={isNl ? "voorbeelden" : "examples"}>
        <Container>
          <SectionHeading eyebrow={content.examples.eyebrow} title={content.examples.title} intro={content.examples.intro} />
          <div className="example-grid">
            {content.examples.items.map((example) => (
              <article className="example-card" key={example.href}>
                <p className="example-status">{isNl ? "Fictief voorbeeld · geen werkelijke klantcase" : "Fictional example · not a real client case"}</p>
                <h3>{example.title}</h3>
                <dl>
                  <div><dt>{content.examples.questionLabel}</dt><dd>{example.question}</dd></div>
                  <div><dt>{content.examples.signalsLabel}</dt><dd>{example.signals}</dd></div>
                  <div><dt>{content.examples.findingLabel}</dt><dd>{example.finding}</dd></div>
                  <div><dt>{content.examples.unknownLabel}</dt><dd>{example.unknown}</dd></div>
                  <div><dt>{content.examples.decisionLabel}</dt><dd>{example.decision}</dd></div>
                </dl>
                <Link className="section-link" href={example.href}>{example.cta} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
          <p className="example-disclaimer">{content.examples.disclaimer}</p>
        </Container>
      </section>

      <section className="section comparison-section">
        <Container>
          <SectionHeading eyebrow={content.comparison.eyebrow} title={content.comparison.title} intro={content.comparison.intro} />
          <div className="comparison-head"><span>{content.comparison.us}</span><span>{content.comparison.alternative}</span></div>
          <div className="comparison-rows">
            {content.comparison.rows.map((row) => <div key={row.us}><p data-label={content.comparison.us}>{row.us}</p><p data-label={content.comparison.alternative}>{row.alternative}</p></div>)}
          </div>
          <p className="comparison-note">{content.comparison.note}</p>
        </Container>
      </section>

      <section className="section pricing-section" id={isNl ? "prijzen" : "pricing"}>
        <Container>
          <SectionHeading eyebrow={content.pricing.eyebrow} title={content.pricing.title} intro={content.pricing.intro} />
          <p className="pricing-distinction">{content.pricing.distinction}</p>
          <div className="pricing-grid pricing-grid-four">
            {[isNl ? publicProfileScanNl : publicProfileScan, ...(isNl ? reportOptionsNl : reportOptions)].map((service) => (
              <ServiceCard service={service} locale={locale} key={service.name} />
            ))}
          </div>
          <p className="pricing-note">{content.pricing.note}</p>
          <div className="pricing-links">
            <Link className="section-link" href={services}>{content.pricing.cta} <span aria-hidden="true">→</span></Link>
            <Link className="section-link" href={isNl ? "/nl/diensten/openbare-informatiescan" : "/services/public-profile-exposure-scan"}>{isNl ? "Bekijk de scope van de €499-scan" : "View the €499 scan scope"} <span aria-hidden="true">→</span></Link>
          </div>
        </Container>
      </section>

      <section className="section" id={isNl ? "samenwerken" : "working-together"}>
        <Container>
          <SectionHeading eyebrow={content.process.eyebrow} title={content.process.title} intro={content.process.intro} />
          <p className="process-question"><span>{isNl ? "Kernvraag" : "The starting question"}</span>{content.process.question}</p>
          <ol className="commercial-process">
            {content.process.items.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}
          </ol>
          <p className="process-note">{content.process.note}</p>
          <Link className="section-link" href={methodology}>{content.process.cta} <span aria-hidden="true">→</span></Link>
        </Container>
      </section>

      <section className="section section-muted" id="faq">
        <Container>
          <SectionHeading eyebrow={content.faq.eyebrow} title={content.faq.title} />
          <div className="faq-grid">
            {content.faq.items.map(({ question, answer }) => <details key={question} className="faq-item"><summary>{question}</summary><p>{answer}</p></details>)}
          </div>
        </Container>
      </section>

      <section className="section identity-section">
        <Container className="identity-grid">
          <div><p className="eyebrow">{content.identity.eyebrow}</p><h2>{content.identity.title}</h2></div>
          <div><p>{content.identity.body}</p><ul><li>{content.identity.operator}</li><li>{content.identity.boundary}</li></ul><p className="identity-email"><span>{content.identity.emailLabel}</span><a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a></p></div>
        </Container>
      </section>

      <section className="closing-cta"><Container className="closing-inner"><div><p className="eyebrow">{content.closing.eyebrow}</p><h2>{content.closing.title}</h2><p>{content.closing.body}</p></div><div className="button-row"><ButtonLink href={contact}>{content.closing.primary}</ButtonLink><ButtonLink href={sample} variant="secondary">{content.closing.secondary}</ButtonLink></div></Container></section>
    </>
  );
}
