import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import { siteNl } from "@/config/site-nl";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: { default: "MelonCactus | Industrieel onderzoek", template: "%s | MelonCactus" },
  description: siteNl.description,
  alternates: languageAlternates("/", "nl"),
  openGraph: { type: "website", siteName: siteConfig.name, title: "MelonCactus | Industrieel onderzoek", description: siteNl.description, url: "/nl", locale: "nl_NL" },
  twitter: { card: "summary", title: "MelonCactus | Industrieel onderzoek", description: siteNl.description },
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = { colorScheme: "light", themeColor: "#f4f2e9" };

export default function DutchLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <a className="skip-link" href="#main-content">Ga naar de inhoud</a>
        <Header locale="nl" />
        <main id="main-content">{children}</main>
        <Footer locale="nl" />
        <StructuredData data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          description: siteNl.description,
          url: `${siteConfig.siteUrl}/nl`,
          inLanguage: "nl-NL",
        }} />
      </body>
    </html>
  );
}
