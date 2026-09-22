import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Request a Report", description: "Describe the industrial intelligence question, decision and timeframe you need MelonCactus to assess.", alternates: { canonical: "/contact" } };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ report?: string; call?: string }> }) {
  const query = await searchParams;
  return <><PageHeader eyebrow="Confidential enquiry" title="Start with the question you need answered." intro="Share enough context to define a responsible scope. Final timing and fees are confirmed before any research begins." breadcrumbs={[{ label: "Contact" }]} /><section className="section"><Container className="contact-layout"><aside><p className="eyebrow">What happens next</p><ol className="contact-steps"><li><span>01</span><p>We clarify the decision, target and useful evidence threshold.</p></li><li><span>02</span><p>We confirm scope, exclusions, timing and fee in writing.</p></li><li><span>03</span><p>Research begins only after the scope is agreed.</p></li></ol><div className="confidentiality-note"><h2>Discreet by design.</h2><p>No public client list by default. No named client cases without written permission. Information supplied for scoping is kept to what is necessary for the enquiry.</p></div></aside><div><ContactForm initialReport={query.report ?? ""} callRequested={query.call === "true"} /></div></Container></section></>;
}
