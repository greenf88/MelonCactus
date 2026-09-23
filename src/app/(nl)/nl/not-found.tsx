import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";

export const metadata: Metadata = { title: "Pagina niet gevonden", robots: { index: false, follow: false } };

export default function DutchNotFound() {
  return <section className="not-found"><Container><p className="eyebrow">404 / Niet gevonden</p><h1>Dit bronnenpad eindigt hier.</h1><p>De pagina is mogelijk verplaatst of het adres is onvolledig.</p><div className="button-row"><ButtonLink href="/nl">Terug naar de startpagina</ButtonLink><ButtonLink href="/nl/contact" variant="secondary">Rapport aanvragen</ButtonLink></div></Container></section>;
}
