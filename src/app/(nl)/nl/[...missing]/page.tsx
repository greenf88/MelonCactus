import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false, follow: false },
  alternates: { canonical: null, languages: {} },
};

export default function MissingDutchPage() {
  notFound();
}
