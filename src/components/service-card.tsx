import { ButtonLink } from "./buttons";
import type { ReportOption } from "@/config/site";

export function ServiceCard({ service }: { service: ReportOption }) {
  return (
    <article className={`service-card ${service.featured ? "featured" : ""}`}>
      <div>
        {service.featured ? <p className="card-flag">Most comprehensive technical option</p> : null}
        <h3>{service.name}</h3>
        <p className="price">
          <span>from</span> {service.price}
        </p>
        <p>{service.summary}</p>
      </div>
      <ul className="check-list">
        {service.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <ButtonLink href={`/contact?report=${encodeURIComponent(service.name)}`} variant="text">
        Discuss this report <span aria-hidden="true">→</span>
      </ButtonLink>
    </article>
  );
}

