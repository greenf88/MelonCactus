"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { siteNl } from "@/config/site-nl";
import type { Locale } from "@/lib/i18n";

export function MobileNav({ locale = "en" }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
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
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link className="button button-primary" href={isNl ? "/nl/contact" : "/contact"} onClick={() => setOpen(false)}>
            {isNl ? "Rapport aanvragen" : "Request a Report"}
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
