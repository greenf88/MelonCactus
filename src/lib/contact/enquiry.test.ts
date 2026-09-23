import { describe, expect, it } from "vitest";
import { composeEnquiry, validateEnquiry } from "./enquiry";
import { validPayload } from "./fixture";

describe("enquiry validation", () => {
  it("accepts a valid enquiry", () => {
    const result = validateEnquiry(validPayload);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.enquiry.email).toBe(validPayload.email);
  });
  it("rejects missing fields and invalid email", () => {
    expect(validateEnquiry({ ...validPayload, name: "" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, email: "invalid" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, deliveryPriority: "" }).ok).toBe(false);
  });
  it("rejects excess length, malformed fields and header injection", () => {
    expect(validateEnquiry({ ...validPayload, question: "x".repeat(4001) }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, company: "ACME\r\nBcc: victim@business.test" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, name: ["Alex"] }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, timeframe: "Whenever" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, report: "Unknown report" }).ok).toBe(false);
  });
  it("rejects the honeypot", () => {
    expect(validateEnquiry({ ...validPayload, website: "bot" })).toEqual({ ok: false, reason: "honeypot" });
  });
  it("allows only the three delivery priorities and rejects submitted price overrides", () => {
    for (const deliveryPriority of ["standard", "within-48-hours", "within-24-hours"]) {
      expect(validateEnquiry({ ...validPayload, deliveryPriority }).ok).toBe(true);
    }
    expect(validateEnquiry({ ...validPayload, deliveryPriority: "overnight" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, multiplier: 1 }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, price: "€995" }).ok).toBe(false);
  });
  it("includes the selected priority in plain text and HTML email", () => {
    const result = validateEnquiry({ ...validPayload, deliveryPriority: "within-48-hours" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const email = composeEnquiry(result.enquiry, new Date("2026-09-23T12:00:00Z"));
    expect(email.text).toContain("Within 48 hours — 2× project fee");
    expect(email.html).toContain("Within 48 hours — 2× project fee");
    expect(email.text).toContain("subject to written acceptance");
  });
  it("escapes visitor HTML while preserving plain text", () => {
    const result = validateEnquiry({ ...validPayload, company: "<Acme>", question: "What does <script>alert(1)</script> indicate?" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const message = composeEnquiry(result.enquiry, new Date("2026-09-22T12:00:00Z"));
    expect(message.html).toContain("&lt;script&gt;");
    expect(message.html).not.toContain("<script>");
    expect(message.text).toContain("<script>");
  });
});
