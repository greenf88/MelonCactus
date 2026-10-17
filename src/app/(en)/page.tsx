import type { Metadata } from "next";
import { CommercialHome } from "@/components/commercial-home";
import { languageAlternates } from "@/lib/i18n";
import { socialImageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Industrial Research & Practical AI | MelonCactus",
  description: "Market and competitor research plus practical AI and automation help for businesses. Defined scope, clear outcomes and a fixed fee agreed upfront.",
  alternates: languageAlternates("/", "en"),
  openGraph: {
    title: "Industrial Research & Practical AI | MelonCactus",
    description: "Understand information, make better decisions and work smarter with research and practical AI support.",
    url: "/",
    ...socialImageMetadata("en", "default", "MelonCactus: research and practical AI").openGraph,
  },
  twitter: socialImageMetadata("en", "default", "MelonCactus: research and practical AI").twitter,
};

export default function Home() {
  return <CommercialHome locale="en" />;
}
