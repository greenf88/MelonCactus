import { describe, expect, it } from "vitest";
import { composeEnquiry, validateEnquiry } from "./enquiry";
import { validPayload } from "./fixture";
import { publicProfileScan } from "@/config/site";

describe("enquiry validation", () => {
  it("accepts a valid enquiry", () => {
    const result = validateEnquiry(validPayload);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.enquiry.email).toBe(validPayload.email);
  });
  it("accepts the fixed-scope public-profile scan as an assessment choice", () => {
    const result = validateEnquiry({ ...validPayload, report: publicProfileScan.name });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.enquiry.report).toBe(publicProfileScan.name);
  });
  it("rejects missing fields and invalid email", () => {
    expect(validateEnquiry({ ...validPayload, name: "" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, email: "invalid" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, role: "" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, decision: "" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, target: "" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, deliveryPriority: "" }).ok).toBe(false);
  });
  it("rejects excess length, malformed fields and header injection", () => {
    expect(validateEnquiry({ ...validPayload, decision: "x".repeat(2001) }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, company: "ACME\r\nBcc: victim@business.test" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, name: ["Alex"] }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, report: "Unknown report" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, ndaRequest: "signed" }).ok).toBe(false);
  });
  it("rejects the honeypot", () => {
    expect(validateEnquiry({ ...validPayload, website: "bot" })).toEqual({ ok: false, reason: "honeypot" });
  });
  it("accepts omitted optional details and treats an unchecked NDA box as no request", () => {
    const { report: _report, geography: _geography, budget: _budget, context: _context, ndaRequest: _ndaRequest, ...minimal } = validPayload;
    void _report; void _geography; void _budget; void _context; void _ndaRequest;
    const result = validateEnquiry(minimal);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.enquiry.ndaRequest).toBe("");
    expect(composeEnquiry(result.enquiry, new Date("2026-09-28T12:00:00Z")).text).toContain("Discuss NDA before substantive details:\nNo");
  });
  it("allows only the three timing requests and rejects submitted price overrides", () => {
    for (const deliveryPriority of ["standard", "priority", "critical"]) {
      expect(validateEnquiry({ ...validPayload, deliveryPriority }).ok).toBe(true);
    }
    expect(validateEnquiry({ ...validPayload, deliveryPriority: "overnight" }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, multiplier: 1 }).ok).toBe(false);
    expect(validateEnquiry({ ...validPayload, price: "€995" }).ok).toBe(false);
  });
  it("includes the decision, optional details, requested timing and NDA preference in both email versions", () => {
    const result = validateEnquiry({ ...validPayload, deliveryPriority: "critical" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const email = composeEnquiry(result.enquiry, new Date("2026-09-23T12:00:00Z"));
    expect(email.text).toContain(validPayload.decision);
    expect(email.text).toContain(validPayload.target);
    expect(email.text).toContain(validPayload.geography);
    expect(email.text).toContain(validPayload.budget);
    expect(email.text).toContain("Critical / 24–48 hours — selected assignments only");
    expect(email.html).toContain("Critical / 24–48 hours — selected assignments only");
    expect(email.text).toContain("Yes — request only, no NDA concluded");
    expect(email.text).toContain("subject to written acceptance");
  });
  it("escapes visitor HTML while preserving plain text", () => {
    const result = validateEnquiry({ ...validPayload, company: "<Acme>", decision: "Decide what <script>alert(1)</script> evidence means for procurement." });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const message = composeEnquiry(result.enquiry, new Date("2026-09-22T12:00:00Z"));
    expect(message.html).toContain("&lt;script&gt;");
    expect(message.html).not.toContain("<script>");
    expect(message.text).toContain("<script>");
  });
});
