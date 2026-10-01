import Link from "next/link";
import { siteConfig } from "@/config/site";
import { siteNl } from "@/config/site-nl";
import type { Locale } from "@/lib/i18n";
import { Container } from "./container";

export function Footer({ locale = "en" }: { locale?: Locale }) {
  const isNl = locale === "nl";
  const nav = isNl ? siteNl.nav : siteConfig.nav;
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-grid">
          <div>
            <div className="footer-mark">{siteConfig.name}</div>
            <p>{isNl ? siteNl.coreStatement : siteConfig.coreStatement}</p>
          </div>
          <div>
            <p className="footer-label">{isNl ? "Ontdek" : "Explore"}</p>
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href={isNl ? "/nl/voorbeeldrapport" : "/sample-report"}>{isNl ? "Voorbeeldrapport" : "Sample Report"}</Link>
            <Link href={isNl ? "/nl/diensten/openbare-informatiescan" : "/services/public-profile-exposure-scan"}>{isNl ? "Openbare-informatiescan" : "Public Profile Scan"}</Link>
          </div>
          <div>
            <p className="footer-label">Contact</p>
            <a href={`mailto:${siteConfig.businessEmail}`}>
              {siteConfig.businessEmail}
            </a>
            <a href={siteConfig.businessPhoneHref}>{siteConfig.businessPhoneDisplay}</a>
            <Link href={isNl ? "/nl/contact" : "/contact"}>{isNl ? "Bespreek uw onderzoeksvraag" : "Request an assessment"}</Link>
          </div>
          <div>
            <p className="footer-label">{isNl ? "Informatie" : "Information"}</p>
            <Link href={isNl ? "/nl/privacy" : "/privacy"}>Privacy</Link>
            <Link href={isNl ? "/nl/voorwaarden" : "/terms"}>{isNl ? "Voorwaarden" : "Terms"}</Link>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} {siteConfig.name}</span>
          <span>{isNl ? siteNl.operatorStatement : siteConfig.operatorStatement}</span>
          <span>{isNl ? "KvK" : "Dutch Chamber of Commerce"} {siteConfig.registrationNumber}</span>
        </div>
      </Container>
    </footer>
  );
}
