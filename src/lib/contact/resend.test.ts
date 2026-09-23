import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validPayload } from "./fixture";
import { validateEnquiry } from "./enquiry";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));

import { deliverEnquiry } from "./resend";

const parsed = validateEnquiry(validPayload);
if (!parsed.ok) throw new Error("test fixture is invalid");
const enquiry = parsed.enquiry;

describe("Resend delivery", () => {
  let logError: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    logError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("RESEND_API_KEY", "re_test_only");
    vi.stubEnv("CONTACT_TO_EMAIL", "contact@meloncactus.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "MelonCactus Website <website@send.meloncactus.com>");
    send.mockReset();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    logError.mockRestore();
  });

  it("reports missing configuration without calling Resend", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect(await deliverEnquiry(enquiry)).toEqual({ ok: false, reason: "unavailable" });
    expect(send).not.toHaveBeenCalled();
    expect(logError).toHaveBeenCalledWith("[contact] Delivery configuration unavailable", expect.objectContaining({ missingApiKey: true }));
  });
  it("reports provider errors", async () => {
    send.mockResolvedValue({ error: { name: "validation_error", statusCode: 403, message: "private enquiry details" } });
    expect(await deliverEnquiry(enquiry)).toEqual({ ok: false, reason: "provider-error" });
    expect(logError).toHaveBeenCalledWith("[contact] Resend delivery failed", {
      providerError: true, errorName: "validation_error", statusCode: 403,
    });
    expect(JSON.stringify(logError.mock.calls)).not.toContain("private enquiry details");
  });
  it("reports success only after provider confirmation and sets Reply-To", async () => {
    send.mockResolvedValue({ data: { id: "test-id" }, error: null });
    expect(await deliverEnquiry(enquiry)).toEqual({ ok: true });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      to: "contact@meloncactus.com",
      from: "MelonCactus Website <website@send.meloncactus.com>",
      replyTo: "alex@business.test",
      text: expect.stringContaining("Standard delivery"),
    }));
  });
});
