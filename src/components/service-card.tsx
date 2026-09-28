import { ButtonLink } from "./buttons";
import type { ReportOption } from "@/config/site";
import type { Locale } from "@/lib/i18n";

export function ServiceCard({ service, locale = "en" }: { service: ReportOption; locale?: Locale }) {
  const isNl = locale === "nl";
  return (
    <article className={`service-card ${service.featured ? "featured" : ""}`}>
      <div>
        {service.featured ? <p className="card-flag">{isNl ? "Verdiepend onderzoek" : "In-depth assessment"}</p> : null}
        <h3>{service.name}</h3>
        <p className="price">
          <span>{service.priceQualifier}</span> {service.price}
        </p>
        <p>{service.summary}</p>
      </div>
      <ul className="check-list">
        {service.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="priority-card-note">{isNl ? "Opdracht, vaste prijs en opleverdatum worden vooraf afgestemd." : "Scope, fixed fee and delivery date are agreed before work begins."}</p>
      <ButtonLink href={`${isNl ? "/nl" : ""}/contact?report=${encodeURIComponent(service.formValue ?? service.name)}`} variant="text">
        {isNl ? "Bespreek deze opdracht" : "Discuss this assessment"} <span aria-hidden="true">→</span>
      </ButtonLink>
    </article>
  );
}
