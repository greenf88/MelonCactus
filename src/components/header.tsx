import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "./container";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="site-header">
      <Container className="header-inner">
        <Link className="wordmark" href="/" aria-label="Lemon Cactus home">
          <span className="wordmark-name">
            Lemon <i aria-hidden="true" /> Cactus
          </span>
          <span className="wordmark-descriptor">{siteConfig.descriptor}</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="button button-primary button-small" href="/contact">
            Request a Report
          </Link>
        </nav>
        <MobileNav />
      </Container>
    </header>
  );
}

