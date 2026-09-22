"use client";

import { useState } from "react";
import { reportOptions } from "@/config/site";
import { submitEnquiry } from "@/lib/enquiry-provider";

export function ContactForm({ initialReport = "", callRequested = false }: { initialReport?: string; callRequested?: boolean }) {
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const payload = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const result = await submitEnquiry(payload);
    if (!result.ok) {
      setMessage("Your details are complete, but online submission is not active yet. Nothing has been sent.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid two-columns">
        <label>Name <span aria-hidden="true">*</span><input name="name" autoComplete="name" required /></label>
        <label>Work email <span aria-hidden="true">*</span><input type="email" name="email" autoComplete="email" required /></label>
        <label>Company <span aria-hidden="true">*</span><input name="company" autoComplete="organization" required /></label>
        <label>Role<input name="role" autoComplete="organization-title" /></label>
      </div>
      <label>
        Research question <span aria-hidden="true">*</span>
        <textarea name="question" rows={5} required minLength={20} placeholder="What do you need to understand?" />
      </label>
      <label>
        Desired decision or outcome <span aria-hidden="true">*</span>
        <textarea name="outcome" rows={3} required minLength={10} placeholder="What decision will this research inform?" />
      </label>
      <label>Target company, market or technology<input name="target" /></label>
      <div className="form-grid two-columns">
        <label>
          Preferred delivery timeframe <span aria-hidden="true">*</span>
          <select name="timeframe" required defaultValue="">
            <option value="" disabled>Select a timeframe</option>
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
        Optional confidentiality note
        <textarea name="confidentiality" rows={3} defaultValue={callRequested ? "I would prefer to discuss this scope in a confidential call." : ""} />
      </label>
      <p className="form-warning">Do not submit passwords, illegally obtained material or unnecessary sensitive personal data.</p>
      <div className="form-submit-row">
        <button className="button button-primary" type="submit">Check request</button>
        <p>Online transmission is not active until a verified provider is connected.</p>
      </div>
      <div className="form-status" role="status" aria-live="polite">{message}</div>
    </form>
  );
}

