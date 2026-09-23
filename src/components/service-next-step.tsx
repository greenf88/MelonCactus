import Link from "next/link";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";
import { type FocusedService, serviceContactHref } from "@/config/focused-services";

export function ServiceNextStep({ service, scopeNote }: { service: FocusedService; scopeNote: string }) {
  return (
    <section className="section section-muted service-next-step">
      <Container className="service-detail-grid">
        <div>
          <p className="eyebrow">Scope and report</p>
          <h2>A useful starting point, not a fixed quotation.</h2>
          <p>{scopeNote}</p>
          <p><strong>{service.report.name}</strong> starts at <strong>{service.report.price}</strong>. The final scope, delivery date and fee are confirmed in writing before research begins. Priority delivery, if requested, is subject to the separate confirmation conditions on the <Link href="/services#priority-delivery">services overview</Link>.</p>
          <ButtonLink href={serviceContactHref(service)}>Request a Report</ButtonLink>
        </div>
        <aside className="service-reading">
          <h3>Review the approach first</h3>
          <ul>
            <li><Link href={`/insights/${service.articleSlug}`}>{service.articleTitle}</Link></li>
            <li><Link href="/methodology">Research methodology and evidence standards</Link></li>
            <li><Link href="/sample-report">Fictional sample report and evidence trail</Link></li>
          </ul>
          <p>The sample is a fictional demonstration, not a completed client assignment.</p>
        </aside>
      </Container>
    </section>
  );
}
