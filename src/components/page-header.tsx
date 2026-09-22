import { Container } from "./container";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";

export function PageHeader({
  eyebrow,
  title,
  intro,
  breadcrumbs,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <header className="page-hero">
      <Container>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-intro">{intro}</p>
      </Container>
    </header>
  );
}

