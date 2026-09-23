import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";
import type { Locale } from "@/lib/i18n";

export function LegalPageShell({
  title,
  intro,
  updated,
  children,
  locale = "en",
}: {
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
  locale?: Locale;
}) {
  return (
    <section className="legal-page">
      <Container className="legal-copy">
        <Breadcrumbs items={[{ label: title }]} locale={locale} />
        <header className="legal-page-header">
          <p className="eyebrow">{locale === "nl" ? "Informatie" : "Information"}</p>
          <h1>{title}</h1>
          <p className="page-intro">{intro}</p>
          <p className="legal-updated">{locale === "nl" ? "Laatst bijgewerkt" : "Last updated"}: {updated}</p>
        </header>
        {children}
      </Container>
    </section>
  );
}
