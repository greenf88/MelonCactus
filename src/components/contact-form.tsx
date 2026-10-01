"use client";

import { useState } from "react";
import Link from "next/link";
import { publicProfileScan, reportOptions, siteConfig } from "@/config/site";
import { publicProfileScanNl, reportOptionsNl } from "@/config/site-nl";
import { DEFAULT_DELIVERY_PRIORITY, deliveryOptions } from "@/config/delivery";
import type { Locale } from "@/lib/i18n";

const priorityLabelsNl: Record<(typeof deliveryOptions)[number]["value"], string> = {
  standard: "Standaard — planning na beoordeling van de opdracht",
  priority: "Prioriteit — voor een tijdgevoelige beslissing",
  critical: "Kritiek / 24–48 uur — alleen geselecteerde opdrachten",
};

const previousReportMapping: Record<string, string> = {
  "Rapid Intelligence Scan": "Focused Intelligence Assessment",
  "Competitor Snapshot": "Focused Intelligence Assessment",
  "Technical Deep Dive": "Technical & Competitive Intelligence",
  "Strategic Intelligence Report": "Strategic Intelligence Engagement",
};

const assessmentOptions = [publicProfileScan, ...reportOptions];
const assessmentOptionsNl = [publicProfileScanNl, ...reportOptionsNl];

function initialAssessment(value: string) {
  const mapped = previousReportMapping[value] ?? value;
  return assessmentOptions.some((option) => option.name === mapped) ? mapped : "";
}

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
        <label>{nl ? "Functie of rol" : "Role"} <span aria-hidden="true">*</span><input name="role" autoComplete="organization-title" maxLength={120} required /></label>
      </div>
      <label>
        {nl ? "Welke beslissing probeert u te nemen?" : "What decision are you trying to make?"} <span aria-hidden="true">*</span>
        <textarea name="decision" rows={3} required minLength={20} maxLength={2000} placeholder={nl ? "Welke keuze moet het onderzoek helpen onderbouwen?" : "What choice should the research help you assess?"} />
      </label>
      <label>
        {nl ? "Te onderzoeken onderneming, markt of technologie" : "Company, market or technology to examine"} <span aria-hidden="true">*</span>
        <input name="target" required minLength={3} maxLength={1000} placeholder={nl ? "Omschrijf het onderzoeksobject kort" : "Briefly identify the subject"} />
      </label>
      <label>
        {nl ? "Gewenste termijn" : "Requested timing"} <span aria-hidden="true">*</span>
        <select name="deliveryPriority" required defaultValue={DEFAULT_DELIVERY_PRIORITY}>
          {deliveryOptions.map((option) => <option key={option.value} value={option.value}>{nl ? priorityLabelsNl[option.value] : option.formLabel}</option>)}
        </select>
      </label>
      <p className="form-field-note">{nl ? "Een versnelde termijn is een verzoek, geen automatische aanvaarding. De opdracht, vaste prijs en opleverdatum worden eerst schriftelijk bevestigd. De benodigde informatie moet zijn ontvangen voordat een afgesproken termijn ingaat." : "An accelerated timeframe is a request, not automatic acceptance. Scope, fixed fee and delivery date are confirmed in writing first. Any agreed period starts after required information has been received."}</p>
      <label>
        {nl ? "Indicatief opdrachtniveau (optioneel)" : "Indicative assessment level (optional)"}
        <select name="report" defaultValue={initialAssessment(initialReport)}>
          <option value="">{nl ? "Nog te bepalen" : "To be discussed"}</option>
          {assessmentOptions.map((option, index) => <option key={option.name} value={option.name}>{nl ? assessmentOptionsNl[index].name : option.name}</option>)}
        </select>
      </label>
      <div className="form-grid two-columns">
        <label>{nl ? "Geografisch gebied (optioneel)" : "Geography (optional)"}<input name="geography" maxLength={160} /></label>
        <label>{nl ? "Indicatief budget (optioneel)" : "Indicative budget (optional)"}<input name="budget" maxLength={100} /></label>
      </div>
      <label>
        {nl ? "Aanvullende context (optioneel)" : "Additional context (optional)"}
        <textarea name="context" rows={3} maxLength={2000} defaultValue={callRequested ? (nl ? "Ik bespreek de vraag bij voorkeur eerst in een gesprek." : "I would prefer to discuss the question in a call first.") : ""} />
      </label>
      <label className="checkbox-row">
        <input type="checkbox" name="ndaRequest" value="on" />
        <span>{nl ? "Ik bespreek graag een geheimhoudingsovereenkomst voordat wij inhoudelijke details uitwisselen." : "I would like to discuss an NDA before sharing substantive details."}</span>
      </label>
      <p className="form-field-note">{nl ? "Dit is een verzoek om vooraf contact op te nemen; met deze keuze komt geen overeenkomst tot stand." : "This is a request to discuss arrangements first; selecting it does not create an agreement."}</p>
      <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="form-warning">{nl ? "Stuur in dit formulier geen vertrouwelijke documenten, toegangsgegevens of onrechtmatig verkregen materiaal." : "Do not submit confidential documents, credentials or unlawfully obtained material in this form."}</p>
      <p className="form-field-note">{nl ? <>Wij gebruiken uw gegevens om uw vraag te beoordelen en te beantwoorden. Lees vóór verzending onze <Link href="/nl/privacy">privacyverklaring</Link>. Een aanvraag is geen opdracht en het verzoek om een geheimhoudingsovereenkomst vormt nog geen overeenkomst.</> : <>We use your details to review and respond to your question. Please read our <Link href="/privacy">privacy statement</Link> before sending. An enquiry is not an accepted assignment, and an NDA request does not create an agreement.</>}</p>
      <div className="form-submit-row">
        <button className="button button-primary" type="submit" disabled={state === "sending"}>{state === "sending" ? (nl ? "Verzenden…" : "Sending…") : (nl ? "Onderzoeksvraag versturen" : "Send assessment request")}</button>
        <p>{nl ? "Wij gebruiken uw gegevens om uw vraag te beoordelen en te beantwoorden." : "We use your details to review and respond to your question."}</p>
      </div>
      <div className="form-status" role="status" aria-live="polite">{message}{state === "failed" && <> <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a></>}</div>
    </form>
  );
}
