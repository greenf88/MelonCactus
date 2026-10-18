import { contactPrice } from "@/config/contact-pricing";
import { publicProfileScan, reportOptions } from "@/config/site";
import { deliveryOptionFor } from "@/config/delivery";
import { enquiryTopicLabel, isEnquiryTopic } from "@/config/enquiry-topics";

export const MAX_BODY_BYTES = 32_768;

const limits = {
  name: 100, email: 254, company: 160, role: 120, topic: 32, decision: 2_000,
  target: 1_000, deliveryPriority: 32, report: 160, geography: 160,
  budget: 100, context: 2_000, ndaRequest: 2, website: 200,
} as const;

export type Enquiry = Omit<{ -readonly [K in keyof typeof limits]: string }, "website">;
type ValidationResult = { ok: true; enquiry: Enquiry } | { ok: false; reason: "invalid" | "honeypot" };
const required = ["name", "email", "company", "topic", "decision"] as const;
const singleLine = ["name", "email", "company", "role", "topic", "target", "deliveryPriority", "report", "geography", "budget", "ndaRequest"] as const;
const multiline = ["decision", "context"] as const;
const reports = new Set(["", publicProfileScan.name, ...reportOptions.map((option) => option.name)]);

export function validateEnquiry(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, reason: "invalid" };
  const record = input as Record<string, unknown>;
  if (Object.keys(record).some((key) => !Object.hasOwn(limits, key))) return { ok: false, reason: "invalid" };
  const values = {} as { -readonly [K in keyof typeof limits]: string };
  for (const key of Object.keys(limits) as (keyof typeof limits)[]) {
    const raw = record[key] ?? (key === "deliveryPriority" ? "standard" : "");
    if (typeof raw !== "string" || raw.length > limits[key]) return { ok: false, reason: "invalid" };
    values[key] = raw.trim();
  }
  if (values.website) return { ok: false, reason: "honeypot" };
  if (required.some((key) => !values[key])) return { ok: false, reason: "invalid" };
  if (singleLine.some((key) => /[\r\n\x00-\x1f\x7f\u2028\u2029]/.test(values[key]))) return { ok: false, reason: "invalid" };
  if (multiline.some((key) => /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(values[key]))) return { ok: false, reason: "invalid" };
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email)) return { ok: false, reason: "invalid" };
  if (values.decision.length < 5 || (values.target !== "" && values.target.length < 3)) return { ok: false, reason: "invalid" };
  if (!isEnquiryTopic(values.topic)) return { ok: false, reason: "invalid" };
  if (!reports.has(values.report) || !["", "on"].includes(values.ndaRequest)) return { ok: false, reason: "invalid" };
  if (!deliveryOptionFor(values.deliveryPriority)) return { ok: false, reason: "invalid" };
  if (values.topic !== "research" && (values.deliveryPriority !== "standard" || values.report !== "")) return { ok: false, reason: "invalid" };
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
    ["Enquiry topic", enquiryTopicLabel(enquiry.topic, "en")],
    ["Decision or improvement sought", enquiry.decision],
    ["Published fee indication (excl. VAT; not an order)", contactPrice(enquiry.topic, enquiry.report, "en").label],
    ["Task, process, company, market or technology", enquiry.target],
    ["Requested timing (subject to written acceptance)", delivery.formLabel],
    ["Indicative assessment level", enquiry.report], ["Geography", enquiry.geography],
    ["Indicative budget", enquiry.budget], ["Additional context", enquiry.context],
    ["Discuss NDA before substantive details", enquiry.ndaRequest === "on" ? "Yes — request only, no NDA concluded" : "No"],
    ["Received (UTC)", receivedAt.toISOString()],
  ] as const;
  return {
    subject: `MelonCactus enquiry — ${enquiry.company}`,
    text: fields.map(([label, value]) => `${label}:\n${value || "Not provided"}`).join("\n\n"),
    html: `<h1>New MelonCactus enquiry</h1>${fields.map(([label, value]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value || "Not provided").replace(/\n/g, "<br>")}</p>`).join("")}`,
  };
}
