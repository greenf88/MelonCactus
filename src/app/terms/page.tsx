import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Website Terms", description: "Basic terms for use of the MelonCactus website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <>
    <PageHeader eyebrow="Information" title="Website terms" intro="Basic conditions for using this website and its public educational material." breadcrumbs={[{ label: "Terms" }]} />
    <section className="section"><Container className="legal-copy">
      <p className="legal-updated">Last updated: 23 September 2026</p>
      <h2>Information, not advice</h2><p>Website content is general information about industrial intelligence and public-source research. It is not legal, financial, investment, engineering or security advice for a specific situation.</p>
      <h2>No client relationship</h2><p>Using this website or submitting an enquiry does not create a client relationship. Any engagement begins only after scope, terms, timing and fees are agreed in writing.</p>
      <h2>Priority delivery</h2><p>Standard delivery has a date confirmed after scope review at 1× the agreed project fee. A requested 48-hour delivery totals 2× the agreed project fee (a 100% surcharge); a requested 24-hour delivery totals 3× the agreed project fee (a 200% surcharge). The multiplier applies to the final agreed project fee.</p><p>Priority options depend on capacity and scope suitability and are not accepted merely by selecting one in the form. The applicable deadline and final fee are included in the written scope confirmation. A priority period begins only after MelonCactus has confirmed the scope, fee and deadline in writing and received all required materials. We may decline a request if responsible evidence verification is not possible within the requested period; evidence and quality standards do not change.</p>
      <h2>Sample material</h2><p>The sample report is a fictional demonstration. It does not describe a real company, commissioned assignment or verified industrial capability.</p>
      <h2>Responsible use</h2><p>You must not use the website to submit illegal material, credentials, malware or information you are not authorised to share.</p>
      <h2>Accuracy and availability</h2><p>Reasonable care is taken with public content, but the website may be changed and uninterrupted availability is not guaranteed. External sources can change after publication.</p>
      <h2>Business details</h2><p>{siteConfig.operatorStatement} Contact: <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a>.</p>
    </Container></section>
  </>;
}
