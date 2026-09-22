export type EnquiryPayload = Record<string, string>;

export async function submitEnquiry(_payload: EnquiryPayload) {
  // Integration point: replace this stub with a server-side provider when a
  // verified endpoint and sender domain are available. Never add secrets here.
  void _payload;
  return { ok: false as const, reason: "not-configured" as const };
}
