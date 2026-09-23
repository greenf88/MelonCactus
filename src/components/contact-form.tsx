"use client";

import { useState } from "react";
import { reportOptions, siteConfig } from "@/config/site";
import { reportOptionsNl } from "@/config/site-nl";
import { DEFAULT_DELIVERY_PRIORITY, deliveryOptions } from "@/config/delivery";
import type { Locale } from "@/lib/i18n";

const timeframes = [
  ["Within 1 week", "Binnen 1 week"],
  ["Within 2 weeks", "Binnen 2 weken"],
  ["Within 1 month", "Binnen 1 maand"],
  ["Flexible", "Flexibel"],
] as const;

const priorityLabelsNl: Record<string, string> = {
  standard: "Standaardlevering",
  "within-48-hours": "Binnen 48 uur — 2× de projectprijs",
  "within-24-hours": "Binnen 24 uur — 3× de projectprijs",
};

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function ContactForm({ initialReport = "", callRequested = false, locale = "en" }: { initialReport?: string; callRequested?: boolean; locale?: Locale }) {
  const nl = locale === "nl";
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  function translateInvalid(event: React.InvalidEvent<HTMLFormElement>) {
    if (!nl) return;
    const field = event.target as Field;
    if (field.validity.valueMissing) field.setCustomValidity("Vul dit veld in.");
    else if (field.validity.typeMismatch) field.setCustomValidity("Vul een geldig e-mailadres in.");
    else if (field.validity.tooShort && "minLength" in field) field.setCustomValidity(`Gebruik minimaal ${field.minLength} tekens.`);
    else if (field.validity.tooLong) field.setCustomValidity("Deze tekst is te lang.");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setState("sending");
    setMessage(nl ? "Uw aanvraag wordt verzonden…" : "Sending your enquiry…");
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept-Language": nl ? "nl-NL" : "en" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("delivery failed");
      const result: { ok?: boolean } = await response.json();
      if (!result.ok) throw new Error("delivery failed");
      setState("sent");
      setMessage(nl ? "Uw aanvraag is verzonden. Wij reageren per e-mail." : "Your enquiry has been sent. We will respond by email.");
      form.reset();
    } catch {
      setState("failed");
      setMessage(nl ? "Het formulier is tijdelijk niet beschikbaar. Stuur ons in plaats daarvan een e-mail." : "The form is temporarily unavailable. Please email us instead.");
    }
  }

  function clearValidity(event: React.SyntheticEvent<HTMLFormElement>) {
    if (nl && "setCustomValidity" in event.target) (event.target as Field).setCustomValidity("");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} onInvalidCapture={translateInvalid} onInputCapture={clearValidity} onChangeCapture={clearValidity} noValidate>
      <div className="form-grid two-columns">
        <label>{nl ? "Naam" : "Name"} <span aria-hidden="true">*</span><input name="name" autoComplete="name" maxLength={100} required /></label>
        <label>{nl ? "Zakelijk e-mailadres" : "Work email"} <span aria-hidden="true">*</span><input type="email" name="email" autoComplete="email" maxLength={254} required /></label>
        <label>{nl ? "Bedrijf" : "Company"} <span aria-hidden="true">*</span><input name="company" autoComplete="organization" maxLength={160} required /></label>
        <label>{nl ? "Functie" : "Role"}<input name="role" autoComplete="organization-title" maxLength={120} /></label>
      </div>
      <label>
        {nl ? "Onderzoeksvraag" : "Research question"} <span aria-hidden="true">*</span>
        <textarea name="question" rows={5} required minLength={20} maxLength={4000} placeholder={nl ? "Wat wilt u weten?" : "What do you need to understand?"} />
      </label>
      <label>
        {nl ? "Gewenste beslissing of uitkomst" : "Desired decision or outcome"} <span aria-hidden="true">*</span>
        <textarea name="outcome" rows={3} required minLength={10} maxLength={2000} placeholder={nl ? "Welke beslissing moet dit onderzoek ondersteunen?" : "What decision will this research inform?"} />
      </label>
      <label>{nl ? "Doelbedrijf, markt of technologie" : "Target company, market or technology"}<input name="target" maxLength={1000} /></label>
      <div className="form-grid two-columns">
        <label>
          {nl ? "Gewenste termijn voor de beslissing" : "Decision timeframe"} <span aria-hidden="true">*</span>
          <select name="timeframe" required defaultValue="">
            <option value="" disabled>{nl ? "Wanneer heeft u de bevindingen nodig?" : "Select when the findings are needed"}</option>
            {timeframes.map(([value, label]) => <option value={value} key={value}>{nl ? label : value}</option>)}
          </select>
        </label>
        <label>
          {nl ? "Indicatief budget / rapportoptie" : "Indicative budget / report option"} <span aria-hidden="true">*</span>
          <select name="report" required defaultValue={initialReport}>
            <option value="" disabled>{nl ? "Kies een optie" : "Select an option"}</option>
            {reportOptions.map((option, index) => <option key={option.name} value={option.name}>{nl ? reportOptionsNl[index].name : option.name} — {nl ? "vanaf" : "from"} {nl ? reportOptionsNl[index].price : option.price}</option>)}
            <option value="Not sure">{nl ? "Ik weet het nog niet" : "Not sure yet"}</option>
          </select>
        </label>
      </div>
      <label>
        {nl ? "Leveringsprioriteit" : "Delivery priority"} <span aria-hidden="true">*</span>
        <select name="deliveryPriority" required defaultValue={DEFAULT_DELIVERY_PRIORITY}>
          {deliveryOptions.map((option) => <option key={option.value} value={option.value}>{nl ? priorityLabelsNl[option.value] : option.formLabel}</option>)}
        </select>
      </label>
      <p className="form-field-note">{nl ? "Een keuze voor levering binnen 24 of 48 uur is een verzoek, afhankelijk van capaciteit, passende omvang en schriftelijke aanvaarding door MelonCactus. De termijn begint pas na schriftelijke bevestiging van opdracht, prijs en deadline en ontvangst van alle benodigde materialen." : "Selecting 24- or 48-hour delivery is a request, subject to capacity, scope suitability and written acceptance by MelonCactus. The period starts after written scope, fee and deadline confirmation and receipt of all required materials."}</p>
      <label>
        {nl ? "Aanvullende vertrouwelijkheidsopmerking" : "Optional confidentiality note"}
        <textarea name="confidentiality" rows={3} maxLength={2000} defaultValue={callRequested ? (nl ? "Ik bespreek de opdracht bij voorkeur in een vertrouwelijk gesprek." : "I would prefer to discuss this scope in a confidential call.") : ""} />
      </label>
      <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="form-warning">{nl ? "Stuur geen wachtwoorden, onrechtmatig verkregen materiaal of onnodige gevoelige persoonsgegevens." : "Do not submit passwords, illegally obtained material or unnecessary sensitive personal data."}</p>
      <div className="form-submit-row">
        <button className="button button-primary" type="submit" disabled={state === "sending"}>{state === "sending" ? (nl ? "Verzenden…" : "Sending…") : (nl ? "Aanvraag verzenden" : "Send enquiry")}</button>
        <p>{nl ? "Wij gebruiken uw gegevens om uw aanvraag te beoordelen en te beantwoorden." : "We use your details to review and respond to your enquiry."}</p>
      </div>
      <div className="form-status" role="status" aria-live="polite">{message}{state === "failed" && <> <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a></>}</div>
    </form>
  );
}
