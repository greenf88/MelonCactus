import Link from "next/link";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { MethodStep } from "@/components/method-step";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { reportOptions, siteConfig } from "@/config/site";
import { focusedServices } from "@/config/focused-services";

const investigations = [
  "Competitors and corporate capabilities",
  "Products and technologies",
  "Manufacturing and laboratory capabilities",
  "Public photographs and video",
  "Suppliers, customers and project ecosystems",
  "Markets, tenders and growth signals",
  "Public information exposure",
  "Ongoing intelligence monitoring",
];

const questions = [
  "What can public evidence tell us about a competitor’s actual technical capabilities?",
  "Which suppliers, partners and customers appear connected to a product or project?",
  "What can facility imagery reveal—and what cannot be concluded responsibly?",
  "Where is a competitor investing, hiring or expanding?",
  "Which public information exposes more than the organisation may realise?",
  "What evidence supports a claimed market or technology position?",
];

const method = [
  ["01", "Define", "Set the decision, scope and research question."],
  ["02", "Collect", "Gather lawful evidence from relevant public sources."],
  ["03", "Verify", "Cross-reference sources, provenance and recency."],
  ["04", "Assess", "Separate fact, assessment, inference and unknowns."],
  ["05", "Deliver", "Present conclusions with an auditable evidence trail."],
] as const;

const reportContents = [
  "Executive summary",
  "Scope and research question",
  "Key findings",
  "Evidence and source references",
  "Confidence levels",
  "Alternative explanations",
  "Information gaps",
  "Strategic implications",
  "Recommended next questions",
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <Container className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Industrial Intelligence</p>
            <h1>Industrial intelligence built from public evidence.</h1>
            <p className="hero-intro">
              MelonCactus provides industrial competitor analysis, public-source
              manufacturing capability analysis and public-information exposure
              review. We turn fragmented public information into evidence-backed
              intelligence for industrial and technology leaders.
            </p>
            <div className="button-row">
              <ButtonLink href="/contact">Request a Report</ButtonLink>
              <ButtonLink href="/sample-report" variant="secondary">
                View a Sample Report
              </ButtonLink>
            </div>
            <p className="core-statement">{siteConfig.coreStatement}</p>
          </div>
          <div className="evidence-panel" role="group" aria-label="Example evidence classification">
            <div className="evidence-panel-top">
              <span>Evidence record</span>
              <span>MC / 001</span>
            </div>
            <div className="evidence-lines" aria-hidden="true">
              <span className="line long" />
              <span className="line medium" />
              <span className="line short" />
            </div>
            <dl>
              <div><dt>Source</dt><dd>Primary publication</dd></div>
              <div><dt>Provenance</dt><dd>Recorded and traceable</dd></div>
              <div><dt>Assessment</dt><dd>Corroborated</dd></div>
              <div><dt>Confidence</dt><dd><span className="badge confirmed">Confirmed</span></dd></div>
            </dl>
            <p className="evidence-note">
              Conclusions are only as strong as the evidence that supports them.
            </p>
          </div>
        </Container>
      </section>

      <section className="section section-muted">
        <Container>
          <SectionHeading eyebrow="Focused services" title="Three ways to test a consequential assumption." intro="Start with the question behind your decision. Each service explains its evidence sources, deliverable and limits." />
          <div className="focused-services-grid">
            {focusedServices.map((service, index) => <article className="focused-service-card" key={service.slug}><span>{String(index + 1).padStart(2, "0")}</span><h3><Link href={`/services/${service.slug}`}>{service.title}</Link></h3><p>{service.summary}</p><Link className="section-link" href={`/services/${service.slug}`}>Explore this service <span aria-hidden="true">→</span></Link></article>)}
          </div>
        </Container>
      </section>

      <section className="trust-band">
        <Container className="trust-grid">
          <h2>Discreet by design. Evidence-led by default.</h2>
          <div className="trust-points">
            <p>Enquiries and research scopes are handled discreetly.</p>
            <p>Research uses lawful, publicly available sources.</p>
            <p>Facts, assessments and inferences are clearly distinguished.</p>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeading
            eyebrow="Research scope"
            title="What MelonCactus investigates"
            intro="Focused research for decisions where technical detail, source quality and commercial context all matter."
          />
          <div className="investigation-grid">
            {investigations.map((item, index) => (
              <div className="investigation-item" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item}</h3>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section section-muted">
        <Container>
          <SectionHeading
            eyebrow="Example research questions"
            title="Start with the decision you need to make."
            intro="These are representative questions, not claims about completed client assignments."
          />
          <ol className="question-list">
            {questions.map((question, index) => (
              <li key={question}>
                <span>Q{index + 1}</span>
                <p>{question}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeading
            eyebrow="Method"
            title="A disciplined path from question to conclusion."
          />
          <div className="method-grid">
            {method.map(([number, title, description]) => (
              <MethodStep key={number} number={number} title={title} description={description} />
            ))}
          </div>
          <Link className="section-link" href="/methodology">
            Read the full methodology <span aria-hidden="true">→</span>
          </Link>
        </Container>
      </section>

      <section className="section pricing-section">
        <Container>
          <SectionHeading
            eyebrow="Report options"
            title="A scope matched to the question."
            intro="Starting prices are indicative. Final scope, delivery time and fee are confirmed before work begins."
          />
          <div className="pricing-grid">
            {reportOptions.map((service) => (
              <ServiceCard service={service} key={service.name} />
            ))}
          </div>
        </Container>
      </section>

      <section className="section sample-section">
        <Container className="sample-grid">
          <div>
            <p className="eyebrow">Inside the report</p>
            <h2>Conclusions you can inspect, question and use.</h2>
            <p className="section-intro">
              Each report explains what the evidence supports, where uncertainty remains
              and which questions deserve further attention.
            </p>
            <ButtonLink href="/sample-report" variant="secondary">
              View the Sample Report
            </ButtonLink>
          </div>
          <ul className="report-contents">
            {reportContents.map((item, index) => (
              <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="closing-cta">
        <Container className="closing-inner">
          <div>
            <p className="eyebrow">A useful starting point</p>
            <h2>Describe the question you need answered.</h2>
            <p>We will define the evidence, limits and appropriate research scope before work begins.</p>
          </div>
          <div className="button-row">
            <ButtonLink href="/contact">Request a Report</ButtonLink>
            <ButtonLink href="/contact?call=true" variant="secondary">
              Arrange a Confidential Call
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
