import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/container";

export function LegalPageShell({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <section className="legal-page">
      <Container className="legal-copy">
        <Breadcrumbs items={[{ label: title }]} />
        <header className="legal-page-header">
          <p className="eyebrow">Information</p>
          <h1>{title}</h1>
          <p className="page-intro">{intro}</p>
          <p className="legal-updated">Last updated: {updated}</p>
        </header>
        {children}
      </Container>
    </section>
  );
}
