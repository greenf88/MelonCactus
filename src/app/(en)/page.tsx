import type { Metadata } from "next";
import { CommercialHome } from "@/components/commercial-home";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Industrial Intelligence for Better-Informed Decisions | MelonCactus",
  description: "Evidence-led research into competitors, technology, markets and your own public profile. Defined scope, traceable sources and explicit uncertainty.",
  alternates: languageAlternates("/", "en"),
  openGraph: {
    title: "Industrial Intelligence for Better-Informed Decisions | MelonCactus",
    description: "Public evidence for decisions about competitors, technology and markets.",
    url: "/",
  },
};

export default function Home() {
  return <CommercialHome locale="en" />;
}
