import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "./container";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-grid">
          <div>
            <div className="footer-mark">{siteConfig.name}</div>
            <p>{siteConfig.coreStatement}</p>
          </div>
          <div>
            <p className="footer-label">Explore</p>
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="footer-label">Contact</p>
            <a href={`mailto:${siteConfig.businessEmail}`}>
              {siteConfig.businessEmail}
            </a>
            <Link href="/contact">Request a report</Link>
          </div>
          <div>
            <p className="footer-label">Information</p>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} {siteConfig.name}</span>
          <span>{siteConfig.operatorStatement}</span>
        </div>
      </Container>
    </footer>
  );
}
