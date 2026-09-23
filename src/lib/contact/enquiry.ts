import { reportOptions } from "@/config/site";
import { deliveryOptionFor } from "@/config/delivery";

export const MAX_BODY_BYTES = 32_768;

const limits = {
  name: 100, email: 254, company: 160, role: 120, question: 4_000,
  outcome: 2_000, target: 1_000, timeframe: 100, report: 160, deliveryPriority: 32,
  confidentiality: 2_000, website: 200,
} as const;

export type Enquiry = Omit<{ -readonly [K in keyof typeof limits]: string }, "website">;
type ValidationResult = { ok: true; enquiry: Enquiry } | { ok: false; reason: "invalid" | "honeypot" };
const required = ["name", "email", "company", "question", "outcome", "timeframe", "report", "deliveryPriority"] as const;
const singleLine = ["name", "email", "company", "role", "target", "timeframe", "report", "deliveryPriority"] as const;
const multiline = ["question", "outcome", "confidentiality"] as const;
const timeframes = new Set(["Within 1 week", "Within 2 weeks", "Within 1 month", "Flexible"]);
const reports = new Set([...reportOptions.map((option) => option.name), "Not sure"]);

export function validateEnquiry(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, reason: "invalid" };
  const record = input as Record<string, unknown>;
  if (Object.keys(record).some((key) => !(key in limits))) return { ok: false, reason: "invalid" };
  const values = {} as { -readonly [K in keyof typeof limits]: string };
  for (const key of Object.keys(limits) as (keyof typeof limits)[]) {
    const raw = record[key] ?? "";
    if (typeof raw !== "string" || raw.length > limits[key]) return { ok: false, reason: "invalid" };
    values[key] = raw.trim();
  }
  if (values.website) return { ok: false, reason: "honeypot" };
  if (required.some((key) => !values[key])) return { ok: false, reason: "invalid" };
  if (singleLine.some((key) => /[\r\n\x00-\x1f\x7f\u2028\u2029]/.test(values[key]))) return { ok: false, reason: "invalid" };
  if (multiline.some((key) => /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(values[key]))) return { ok: false, reason: "invalid" };
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email)) return { ok: false, reason: "invalid" };
  if (values.question.length < 20 || values.outcome.length < 10) return { ok: false, reason: "invalid" };
  if (!timeframes.has(values.timeframe) || !reports.has(values.report)) return { ok: false, reason: "invalid" };
  if (!deliveryOptionFor(values.deliveryPriority)) return { ok: false, reason: "invalid" };
  const { website: _website, ...enquiry } = values;
  void _website;
  return { ok: true, enquiry };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] ?? character);
}

export function composeEnquiry(enquiry: Enquiry, receivedAt: Date) {
  const delivery = deliveryOptionFor(enquiry.deliveryPriority);
  if (!delivery) throw new Error("Invalid delivery priority");
  const fields = [
    ["Name", enquiry.name], ["Work email", enquiry.email], ["Company", enquiry.company],
    ["Role", enquiry.role], ["Research question", enquiry.question],
    ["Desired decision or outcome", enquiry.outcome], ["Target", enquiry.target],
    ["Decision timeframe", enquiry.timeframe], ["Report option", enquiry.report],
    ["Delivery priority (requested; subject to written acceptance)", delivery.formLabel],
    ["Confidentiality note", enquiry.confidentiality], ["Received (UTC)", receivedAt.toISOString()],
  ] as const;
  return {
    subject: `MelonCactus enquiry — ${enquiry.company}`,
    text: fields.map(([label, value]) => `${label}:\n${value || "Not provided"}`).join("\n\n"),
    html: `<h1>New MelonCactus enquiry</h1>${fields.map(([label, value]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value || "Not provided").replace(/\n/g, "<br>")}</p>`).join("")}`,
  };
}
