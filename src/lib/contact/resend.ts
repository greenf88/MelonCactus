import "server-only";
import { Resend } from "resend";
import { composeEnquiry, type Enquiry } from "./enquiry";
import { siteConfig } from "@/config/site";

export type DeliveryResult = { ok: true } | { ok: false; reason: "unavailable" | "provider-error" };

export async function deliverEnquiry(enquiry: Enquiry): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || to !== siteConfig.businessEmail || !from || /[\r\n]/.test(from)) return { ok: false, reason: "unavailable" };
  const message = composeEnquiry(enquiry, new Date());
  try {
    const { data, error } = await new Resend(apiKey).emails.send({ from, to, replyTo: enquiry.email, ...message });
    return error || !data?.id ? { ok: false, reason: "provider-error" } : { ok: true };
  } catch {
    return { ok: false, reason: "provider-error" };
  }
}
