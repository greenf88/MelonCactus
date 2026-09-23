import { ButtonLink } from "./buttons";
import type { ReportOption } from "@/config/site";
import type { Locale } from "@/lib/i18n";

export function ServiceCard({ service, locale = "en" }: { service: ReportOption; locale?: Locale }) {
  const isNl = locale === "nl";
  return (
    <article className={`service-card ${service.featured ? "featured" : ""}`}>
      <div>
        {service.featured ? <p className="card-flag">{isNl ? "Meest uitgebreide technische optie" : "Most comprehensive technical option"}</p> : null}
        <h3>{service.name}</h3>
        <p className="price">
          <span>{isNl ? "vanaf" : "from"}</span> {service.price}
        </p>
        <p>{service.summary}</p>
      </div>
      <ul className="check-list">
        {service.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="priority-card-note">{isNl ? "Spoedlevering is mogelijk na schriftelijke bevestiging." : "Priority delivery may be available, subject to written confirmation."}</p>
      <ButtonLink href={`${isNl ? "/nl" : ""}/contact?report=${encodeURIComponent(service.formValue ?? service.name)}`} variant="text">
        {isNl ? "Bespreek dit rapport" : "Discuss this report"} <span aria-hidden="true">→</span>
      </ButtonLink>
    </article>
  );
}
