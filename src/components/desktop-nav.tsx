"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { siteNl } from "@/config/site-nl";
import type { Locale } from "@/lib/i18n";
import { isNavItemActive } from "@/lib/navigation";

export function DesktopNav({ locale = "en" }: { locale?: Locale }) {
  const pathname = usePathname();
  const isNl = locale === "nl";
  const nav = isNl ? siteNl.nav : siteConfig.nav;
  const contactHref = isNl ? "/nl/contact" : "/contact";

  return (
    <nav className="desktop-nav" aria-label={isNl ? "Hoofdnavigatie" : "Primary navigation"}>
      {nav.map((item) => (
        <Link key={item.href} href={item.href} aria-current={isNavItemActive(pathname, item.href) ? "page" : undefined}>
          {item.label}
        </Link>
      ))}
      <Link className="button button-primary button-small" href={contactHref} aria-current={pathname === contactHref ? "page" : undefined}>
        {isNl ? "Bespreek uw vraag" : "Discuss a Requirement"}
      </Link>
    </nav>
  );
}
