"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { counterpartPath, type Locale } from "@/lib/i18n";

function Links({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const counterpart = counterpartPath(pathname);
  const query = pathname.endsWith("/contact") ? searchParams.toString() : "";
  const suffix = query ? `?${query}` : "";
  const en = locale === "en" ? pathname : counterpart;
  const nl = locale === "nl" ? pathname : counterpart;
  return (
    <nav className="language-switcher" aria-label={locale === "nl" ? "Taal kiezen" : "Choose language"}>
      {en ? <Link href={`${en}${suffix}`} lang="en" hrefLang="en" aria-current={locale === "en" ? "page" : undefined}>EN</Link> : <span className="language-unavailable" lang="en" aria-label="English version unavailable">EN</span>}
      <span aria-hidden="true">/</span>
      {nl ? <Link href={`${nl}${suffix}`} lang="nl" hrefLang="nl-NL" aria-current={locale === "nl" ? "page" : undefined}>NL</Link> : <span className="language-unavailable" lang="nl" aria-label="Nederlandse versie niet beschikbaar">NL</span>}
    </nav>
  );
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  return <Suspense fallback={<span className="language-switcher" aria-hidden="true">EN / NL</span>}><Links locale={locale} /></Suspense>;
}
