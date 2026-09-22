"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">Toggle navigation</span>
        <span aria-hidden="true" className="menu-lines">
          <span />
          <span />
        </span>
      </button>
      {open ? (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link className="button button-primary" href="/contact" onClick={() => setOpen(false)}>
            Request a Report
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
