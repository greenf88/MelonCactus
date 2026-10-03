import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
  alternates: { canonical: null, languages: {} },
};

export default function MissingEnglishPage() {
  notFound();
}
