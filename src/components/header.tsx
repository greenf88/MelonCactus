import Link from "next/link";
import { siteConfig } from "@/config/site";
import { siteNl } from "@/config/site-nl";
import type { Locale } from "@/lib/i18n";
import { Container } from "./container";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

export function Header({ locale = "en" }: { locale?: Locale }) {
  const isNl = locale === "nl";
  const nav = isNl ? siteNl.nav : siteConfig.nav;
  return (
    <header className="site-header">
      <Container className="header-inner">
        <Link className="wordmark" href={isNl ? "/nl" : "/"} aria-label={isNl ? "MelonCactus startpagina" : "MelonCactus home"}>
          <span className="wordmark-name">{siteConfig.name}</span>
          <span className="wordmark-descriptor">{isNl ? siteNl.descriptor : siteConfig.descriptor}</span>
        </Link>
        <nav className="desktop-nav" aria-label={isNl ? "Hoofdnavigatie" : "Primary navigation"}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="button button-primary button-small" href={isNl ? "/nl/contact" : "/contact"}>
            {isNl ? "Rapport aanvragen" : "Request a Report"}
          </Link>
        </nav>
        <div className="header-actions"><LanguageSwitcher locale={locale} /><MobileNav locale={locale} /></div>
      </Container>
    </header>
  );
}
