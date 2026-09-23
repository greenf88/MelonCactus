import type { Metadata } from "next";
import { ButtonLink } from "@/components/buttons";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() { return <section className="not-found"><Container><p className="eyebrow">404 / Not found</p><h1>This evidence trail ends here.</h1><p>The page may have moved, or the address may be incomplete.</p><div className="button-row"><ButtonLink href="/">Return Home</ButtonLink><ButtonLink href="/contact" variant="secondary">Request a Report</ButtonLink></div></Container></section>; }
