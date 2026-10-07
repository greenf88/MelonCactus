import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import { languageAlternates } from "@/lib/i18n";
import { PrivacyAnalytics } from "@/components/privacy-analytics";
import { entityGraph, socialImageUrl } from "@/lib/seo";
import { sourceSans, sourceSerif } from "../fonts";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "MelonCactus | Industrial Intelligence",
    template: "%s | MelonCactus",
  },
  description: siteConfig.description,
  referrer: "origin",
  alternates: languageAlternates("/", "en"),
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "MelonCactus | Industrial Intelligence",
    description: siteConfig.description,
    url: "/",
    images: [{ url: socialImageUrl("en", "default"), width: 1200, height: 630, alt: "MelonCactus Industrial Intelligence: public evidence for decisions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MelonCactus | Industrial Intelligence",
    description: siteConfig.description,
    images: [socialImageUrl("en", "default")],
  },
  robots: process.env.VERCEL_ENV === "preview"
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f2e9",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${sourceSerif.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <StructuredData data={entityGraph()} />
        <PrivacyAnalytics />
      </body>
    </html>
  );
}
