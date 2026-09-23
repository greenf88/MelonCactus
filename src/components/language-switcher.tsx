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
  const en = locale === "en" ? pathname : counterpart ?? "/";
  const nl = locale === "nl" ? pathname : counterpart ?? "/nl";
  return (
    <nav className="language-switcher" aria-label={locale === "nl" ? "Taal kiezen" : "Choose language"}>
      <Link href={`${en}${suffix}`} lang="en" hrefLang="en" aria-current={locale === "en" ? "page" : undefined}>EN</Link>
      <span aria-hidden="true">/</span>
      <Link href={`${nl}${suffix}`} lang="nl" hrefLang="nl-NL" aria-current={locale === "nl" ? "page" : undefined}>NL</Link>
    </nav>
  );
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  return <Suspense fallback={<span className="language-switcher" aria-hidden="true">EN / NL</span>}><Links locale={locale} /></Suspense>;
}
