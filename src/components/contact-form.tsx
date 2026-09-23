"use client";

import { useState } from "react";
import { reportOptions, siteConfig } from "@/config/site";
import { DEFAULT_DELIVERY_PRIORITY, deliveryOptions } from "@/config/delivery";

export function ContactForm({ initialReport = "", callRequested = false }: { initialReport?: string; callRequested?: boolean }) {
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setState("sending");
    setMessage("Sending your enquiry…");
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("delivery failed");
      const result: { ok?: boolean } = await response.json();
      if (!result.ok) throw new Error("delivery failed");
      setState("sent");
      setMessage("Your enquiry has been sent. We will respond by email.");
      form.reset();
    } catch {
      setState("failed");
      setMessage("The form is temporarily unavailable. Please email us instead.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid two-columns">
        <label>Name <span aria-hidden="true">*</span><input name="name" autoComplete="name" maxLength={100} required /></label>
        <label>Work email <span aria-hidden="true">*</span><input type="email" name="email" autoComplete="email" maxLength={254} required /></label>
        <label>Company <span aria-hidden="true">*</span><input name="company" autoComplete="organization" maxLength={160} required /></label>
        <label>Role<input name="role" autoComplete="organization-title" maxLength={120} /></label>
      </div>
      <label>
        Research question <span aria-hidden="true">*</span>
        <textarea name="question" rows={5} required minLength={20} maxLength={4000} placeholder="What do you need to understand?" />
      </label>
      <label>
        Desired decision or outcome <span aria-hidden="true">*</span>
        <textarea name="outcome" rows={3} required minLength={10} maxLength={2000} placeholder="What decision will this research inform?" />
      </label>
      <label>Target company, market or technology<input name="target" maxLength={1000} /></label>
      <div className="form-grid two-columns">
        <label>
          Decision timeframe <span aria-hidden="true">*</span>
          <select name="timeframe" required defaultValue="">
            <option value="" disabled>Select when the findings are needed</option>
            <option>Within 1 week</option><option>Within 2 weeks</option><option>Within 1 month</option><option>Flexible</option>
          </select>
        </label>
        <label>
          Indicative budget / report option <span aria-hidden="true">*</span>
          <select name="report" required defaultValue={initialReport}>
            <option value="" disabled>Select an option</option>
            {reportOptions.map((option) => <option key={option.name} value={option.name}>{option.name} — from {option.price}</option>)}
            <option value="Not sure">Not sure yet</option>
          </select>
        </label>
      </div>
      <label>
        Delivery priority <span aria-hidden="true">*</span>
        <select name="deliveryPriority" required defaultValue={DEFAULT_DELIVERY_PRIORITY}>
          {deliveryOptions.map((option) => <option key={option.value} value={option.value}>{option.formLabel}</option>)}
        </select>
      </label>
      <p className="form-field-note">Selecting 24- or 48-hour delivery is a request, subject to capacity, scope suitability and written acceptance by MelonCactus. The period starts after written scope, fee and deadline confirmation and receipt of all required materials.</p>
      <label>
        Optional confidentiality note
        <textarea name="confidentiality" rows={3} maxLength={2000} defaultValue={callRequested ? "I would prefer to discuss this scope in a confidential call." : ""} />
      </label>
      <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="form-warning">Do not submit passwords, illegally obtained material or unnecessary sensitive personal data.</p>
      <div className="form-submit-row">
        <button className="button button-primary" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send enquiry"}</button>
        <p>We use your details to review and respond to your enquiry.</p>
      </div>
      <div className="form-status" role="status" aria-live="polite">{message}{state === "failed" && <> <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a></>}</div>
    </form>
  );
}
