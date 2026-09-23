import { Container } from "./container";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";
import type { Locale } from "@/lib/i18n";

export function PageHeader({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  locale = "en",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  breadcrumbs?: BreadcrumbItem[];
  locale?: Locale;
}) {
  return (
    <header className="page-hero">
      <Container>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} locale={locale} /> : null}
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-intro">{intro}</p>
      </Container>
    </header>
  );
}
