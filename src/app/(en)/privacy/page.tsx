import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { siteConfig } from "@/config/site";
import { languageAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy statement", description: "How MelonCactus handles enquiries, website measurement and personal information in public-source research.",
  alternates: languageAlternates("/privacy", "en"),
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy statement" intro="How we handle personal information when you visit the site, make an enquiry or work with us." updated="1 October 2026">
      <h2>Who is responsible?</h2>
      <p>MelonCactus is operated by {siteConfig.legalName} (Dutch Chamber of Commerce number {siteConfig.registrationNumber}). For questions or privacy requests, email <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a> or call <a href={siteConfig.businessPhoneHref}>{siteConfig.businessPhoneDisplay}</a>. We do not publish a postal address on this site.</p>
      <h2>Enquiries and business correspondence</h2>
      <p>The form asks for your name, work email, company and role, the decision and research subject, and requested timing. The assessment level, geography, budget, additional context and NDA discussion request are optional. We use these details, and any subsequent business correspondence, to assess and answer your question, prepare a possible proposal and communicate with you. An enquiry is not an accepted assignment; requesting an NDA does not create one. Please do not send passwords, credentials, unlawfully obtained material, confidential documents or unnecessary sensitive personal data in the initial form.</p>
      <p>For a person contracting in their own name, processing needed for a requested proposal or agreed contract may rely on steps before or performance of a contract. For employees or other contacts acting for a company, we rely on our legitimate interest in handling relevant B2B enquiries and correspondence, subject to a proportionality assessment and your right to object. We do not use the form for marketing subscriptions.</p>
      <h2>Assignments and public-source research</h2>
      <p>If a business assignment is agreed, we may process contact, project and invoice details to perform and administer it. Contract performance may apply to an individual client; for a company’s representatives we assess legitimate interests. Statutory record-keeping duties may require us to retain financial records. Research can involve business-related personal information from lawfully accessible public sources. Public availability does not remove privacy protection. We assess necessity, proportionality, professional relevance, source reliability, information duties for indirectly collected data and our respective roles with the client for each assignment. We do not assume that an exception to giving information automatically applies.</p>
      <h2>Hosting, security and website measurement</h2>
      <p>Vercel hosts the website and may process technical request and security information needed to serve and protect it. Vercel Web Analytics counts page views across the English and Dutch pages. We restrict measurement to known public page paths and remove query strings and fragments before a page view is sent. Vercel describes collecting the time, path, referring website, approximate location, browser, operating system and device category for aggregated statistics. It uses a short-lived visitor hash rather than analytics cookies. We do not send form fields as analytics events, use advertising trackers or build behavioural profiles. We rely on a limited legitimate interest in understanding aggregate site use; this does not remove our duty to assess the actual configuration and its impact.</p>
      <h2>Recipients and international processing</h2>
      <p>Form submissions are delivered by Resend to our business mailbox, provided by OVHcloud using Zimbra. Vercel provides hosting and analytics. The applicable mailbox contract and data-processing arrangements must still be checked before this notice is approved for publication. We share information with service providers only as needed for these purposes and with the client or other recipients where an agreed assignment requires it. These providers may process data outside the EEA. We do not claim EEA-only storage. We assess the applicable transfer mechanism, provider terms and any further safeguards before relying on them.</p>
      <h2>How long do we keep information?</h2>
      <p>Enquiries that do not become assignments, including related correspondence, are deleted from our active business mailbox and working files no later than twelve months after the last substantive contact. We delete them sooner when further follow-up is no longer needed. Research working files for a completed assignment are deleted from our active working files no later than 24 months after final delivery, or sooner when no longer needed. We keep final reports for no longer than five years after final delivery to handle corrections and proportionate contractual claims. Scope confirmations and other records needed for financial administration are kept for the applicable statutory period, generally seven years in the Netherlands. A concrete legal claim may justify longer retention of only the relevant records, assessed separately. Hosting and analytics retention depend on the configured provider services; Vercel states that its visitor-session identifier is discarded after 24 hours. We review these periods and delete or anonymise information when the applicable purpose ends. The backup process must still be verified before publication.</p>
      <h2>Your rights</h2>
      <p>You may request access, correction, deletion or restriction of processing, and object to processing based on legitimate interests. Data portability applies where its legal conditions are met. If we ever rely on consent for a particular processing operation, you may withdraw it without affecting earlier lawful processing. Contact us by email; we may ask only for information needed to verify your identity. You can also complain to the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).</p>
      <h2>Changes</h2>
      <p>We update this notice when our processing materially changes and show the revision date above. Material changes should be communicated through an appropriate channel where required.</p>
    </LegalPageShell>
  );
}
