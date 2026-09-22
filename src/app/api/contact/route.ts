import { deliverEnquiry } from "@/lib/contact/resend";
import { MAX_BODY_BYTES, validateEnquiry } from "@/lib/contact/enquiry";

export const runtime = "nodejs";
const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return Response.json({ ok: false, message: "Please check your enquiry and try again." }, { status: 415, headers });
  }
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return Response.json({ ok: false, message: "Please shorten your enquiry and try again." }, { status: 413, headers });
  }
  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return Response.json({ ok: false, message: "Please shorten your enquiry and try again." }, { status: 413, headers });
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return Response.json({ ok: false, message: "Please check your enquiry and try again." }, { status: 400, headers });
  }
  const result = validateEnquiry(input);
  if (!result.ok) return Response.json({ ok: false, message: "Please check your enquiry and try again." }, { status: 400, headers });
  const delivery = await deliverEnquiry(result.enquiry);
  if (!delivery.ok) return Response.json({ ok: false, message: "The form is temporarily unavailable. Please email us instead." }, { status: 503, headers });
  return Response.json({ ok: true, message: "Your enquiry has been sent." }, { headers });
}
