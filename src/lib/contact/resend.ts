import "server-only";
import { Resend } from "resend";
import { composeEnquiry, type Enquiry } from "./enquiry";
import { siteConfig } from "@/config/site";

export type DeliveryResult = { ok: true } | { ok: false; reason: "unavailable" | "provider-error" };

export async function deliverEnquiry(enquiry: Enquiry): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const invalidFrom = Boolean(from && /[\r\n]/.test(from));
  if (!apiKey || to !== siteConfig.businessEmail || !from || invalidFrom) {
    console.error("[contact] Delivery configuration unavailable", {
      missingApiKey: !apiKey,
      recipientMismatch: to !== siteConfig.businessEmail,
      missingFrom: !from,
      invalidFrom,
    });
    return { ok: false, reason: "unavailable" };
  }
  const message = composeEnquiry(enquiry, new Date());
  try {
    const { data, error } = await new Resend(apiKey).emails.send({ from, to, replyTo: enquiry.email, ...message });
    if (error || !data?.id) {
      console.error("[contact] Resend delivery failed", {
        providerError: Boolean(error),
        errorName: error?.name,
        statusCode: error?.statusCode,
      });
      return { ok: false, reason: "provider-error" };
    }
    return { ok: true };
  } catch (error) {
    console.error("[contact] Resend request failed", {
      errorType: error instanceof Error ? error.name : typeof error,
    });
    return { ok: false, reason: "provider-error" };
  }
}
