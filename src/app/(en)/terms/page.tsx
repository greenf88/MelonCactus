import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { siteConfig } from "@/config/site";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Website Terms", description: "Basic terms for use of the MelonCactus website.",
  alternates: languageAlternates("/terms", "en"),
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Website terms" intro="Basic conditions for using this website and its public educational material." updated="29 September 2026">
      <h2>Information, not advice</h2><p>Website content is general information about industrial intelligence and public-source research. It is not legal, financial, investment, engineering or security advice for a specific situation.</p>
      <h2>No client relationship</h2><p>Using this website or submitting an enquiry does not create a client relationship. Any engagement begins only after scope, terms, timing and fees are agreed in writing.</p>
      <h2>Timing and urgent requests</h2><p>Standard scheduling is agreed after scope review. Priority timing for time-sensitive decisions and critical 24–48-hour timing are considered only where scope, evidence requirements and capacity allow. An urgent request is individually scoped and quoted before work begins; selecting a timing option does not mean it is accepted.</p><p>The fixed fee and applicable deadline are included in the written scope confirmation. An agreed delivery period begins only after MelonCactus has confirmed the scope, fee and deadline in writing and received all required information. We may decline a request if responsible evidence verification is not possible in time. Our evidence and quality standards do not change.</p>
      <h2>Sample material</h2><p>The sample report and example cases are fictional demonstrations. They do not describe real companies, commissioned assignments or verified industrial capabilities.</p>
      <h2>Responsible use</h2><p>You must not use the website to submit illegal material, credentials, malware or information you are not authorised to share.</p>
      <h2>Accuracy and availability</h2><p>Reasonable care is taken with public content, but the website may be changed and uninterrupted availability is not guaranteed. External sources can change after publication.</p>
      <h2>Business details</h2><p>{siteConfig.operatorStatement} Contact: <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a>.</p>
    </LegalPageShell>
  );
}
