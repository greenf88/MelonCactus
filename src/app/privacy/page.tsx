import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy", description: "Privacy information for the MelonCactus website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <>
    <PageHeader eyebrow="Information" title="Privacy statement" intro="How we handle information submitted through this website." breadcrumbs={[{ label: "Privacy" }]} />
    <section className="section"><Container className="legal-copy">
      <p className="legal-updated">Last updated: 22 September 2026</p>
      <h2>Who operates this site</h2><p>{siteConfig.operatorStatement} Contact us at <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a>.</p>
      <h2>Enquiries</h2><p>When you submit the form, we use the name, work email, company and enquiry details you provide to review and respond to your request. The form sends those details to our business inbox through Resend, our email delivery provider. If the form is unavailable, you may contact us directly by email.</p>
      <h2>Information to avoid</h2><p>Do not send passwords, credentials, unlawfully obtained material, special-category personal data or more personal information than is needed to explain your question.</p>
      <h2>Website technology</h2><p>This version does not use advertising trackers, behavioural profiling or non-essential cookies. We do not sell enquiry information.</p>
      <h2>Your questions</h2><p>For questions about an enquiry or your personal information, email <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a>.</p>
    </Container></section>
  </>;
}
