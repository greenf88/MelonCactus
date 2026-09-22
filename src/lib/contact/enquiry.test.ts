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
