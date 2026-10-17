import type { Metadata } from "next";
import { CommercialHome } from "@/components/commercial-home";
import { languageAlternates } from "@/lib/i18n";
import { socialImageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Industrieel onderzoek & praktische AI",
  description: "Markt- en concurrentieonderzoek plus praktische AI- en automatiseringshulp voor bedrijven. Heldere opdracht, concrete uitkomst en vaste prijs vooraf.",
  alternates: languageAlternates("/", "nl"),
  openGraph: {
    title: "Industrieel onderzoek & praktische AI | MelonCactus",
    description: "Informatie begrijpen, beter beslissen en slimmer werken met onderzoek en praktische AI-hulp.",
    url: "/nl",
    ...socialImageMetadata("nl", "default", "MelonCactus: onderzoek en praktische AI").openGraph,
  },
  twitter: socialImageMetadata("nl", "default", "MelonCactus: onderzoek en praktische AI").twitter,
};

export default function DutchHome() {
  return <CommercialHome locale="nl" />;
}
