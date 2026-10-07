"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { siteNl } from "@/config/site-nl";
import type { Locale } from "@/lib/i18n";
import { isNavItemActive } from "@/lib/navigation";

export function MobileNav({ locale = "en" }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isNl = locale === "nl";
  const nav = isNl ? siteNl.nav : siteConfig.nav;

  return (
    <div className="mobile-nav">
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{isNl ? "Navigatie openen of sluiten" : "Toggle navigation"}</span>
        <span aria-hidden="true" className="menu-lines">
          <span />
          <span />
        </span>
      </button>
      {open ? (
        <nav id="mobile-menu" className="mobile-menu" aria-label={isNl ? "Mobiele navigatie" : "Mobile navigation"}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isNavItemActive(pathname, item.href) ? "page" : undefined} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link className="button button-primary" href={isNl ? "/nl/contact" : "/contact"} aria-current={pathname === (isNl ? "/nl/contact" : "/contact") ? "page" : undefined} onClick={() => setOpen(false)}>
            {isNl ? "Bespreek uw vraag" : "Discuss a Requirement"}
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
