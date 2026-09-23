import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { siteConfig } from "@/config/site";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy", description: "Privacy information for the MelonCactus website.",
  alternates: languageAlternates("/privacy", "en"),
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy statement" intro="How we handle information submitted through this website." updated="23 September 2026">
      <h2>Who operates this site</h2><p>{siteConfig.operatorStatement} Contact us at <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a>.</p>
      <h2>Enquiries</h2><p>When you submit the form, we use the name, work email, company and enquiry details you provide to review and respond to your request. The form sends those details to our business inbox through Resend, our email delivery provider. If the form is unavailable, you may contact us directly by email.</p>
      <h2>Information to avoid</h2><p>Do not send passwords, credentials, unlawfully obtained material, special-category personal data or more personal information than is needed to explain your question.</p>
      <h2>Website technology</h2><p>We use Vercel Web Analytics to count page views on the English and Dutch pages. For aggregated statistics, it processes the page URL, referring website, approximate location, and browser and device type. This measurement does not use cookies. We do not use advertising trackers or behavioural profiling, and we do not sell enquiry information.</p>
      <h2>Your questions</h2><p>For questions about an enquiry or your personal information, email <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a>.</p>
    </LegalPageShell>
  );
}
