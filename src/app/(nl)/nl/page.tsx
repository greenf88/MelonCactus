import type { Metadata } from "next";
import { CommercialHome } from "@/components/commercial-home";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Industrieel onderzoek voor onderbouwde beslissingen",
  description: "Onderbouwd onderzoek naar concurrenten, technologie, markten en uw eigen openbare profiel. Heldere opdracht, herleidbare bronnen en zichtbare onzekerheid.",
  alternates: languageAlternates("/", "nl"),
  openGraph: {
    title: "Industrieel onderzoek voor onderbouwde beslissingen | MelonCactus",
    description: "Openbaar bewijs voor beslissingen over concurrenten, technologie en markten.",
    url: "/nl",
  },
};

export default function DutchHome() {
  return <CommercialHome locale="nl" />;
}
