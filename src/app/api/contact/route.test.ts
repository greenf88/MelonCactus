import { describe, expect, it, vi } from "vitest";
import { validPayload } from "@/lib/contact/fixture";

const { deliver } = vi.hoisted(() => ({ deliver: vi.fn() }));
vi.mock("@/lib/contact/resend", () => ({ deliverEnquiry: deliver }));
import { POST } from "./route";

function request(payload: unknown) {
  return new Request("https://meloncactus.com/api/contact", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
  });
}

describe("contact endpoint", () => {
  it("rejects invalid input and oversized bodies", async () => {
    expect((await POST(request({ ...validPayload, email: "bad" }))).status).toBe(400);
    expect((await POST(request({ ...validPayload, website: "bot" }))).status).toBe(400);
    expect((await POST(request({ ...validPayload, question: "x".repeat(33000) }))).status).toBe(413);
    expect(deliver).not.toHaveBeenCalled();
  });
  it("rejects malformed JSON and unsupported content types", async () => {
    const malformed = new Request("https://meloncactus.com/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: "{invalid",
    });
    expect((await POST(malformed)).status).toBe(400);
    const wrongType = new Request("https://meloncactus.com/api/contact", {
      method: "POST", headers: { "Content-Type": "text/plain" }, body: "test",
    });
    expect((await POST(wrongType)).status).toBe(415);
  });
  it("returns service unavailable when email cannot be sent", async () => {
    deliver.mockResolvedValue({ ok: false, reason: "unavailable" });
    expect((await POST(request(validPayload))).status).toBe(503);
  });
  it("keeps provider failure details out of the response", async () => {
    deliver.mockResolvedValue({ ok: false, reason: "provider-error" });
    const response = await POST(request(validPayload));
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toContain("provider-error");
  });
  it("returns success after confirmed delivery", async () => {
    deliver.mockResolvedValue({ ok: true });
    const response = await POST(request(validPayload));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, message: "Your enquiry has been sent." });
  });
});
