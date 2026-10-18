"use client";

import { useState } from "react";
import Link from "next/link";
import { publicProfileScan, reportOptions, siteConfig } from "@/config/site";
import { publicProfileScanNl, reportOptionsNl } from "@/config/site-nl";
import { DEFAULT_DELIVERY_PRIORITY } from "@/config/delivery";
import { contactPrice } from "@/config/contact-pricing";
import { enquiryTopic, enquiryTopics, type EnquiryTopic } from "@/config/enquiry-topics";
import type { Locale } from "@/lib/i18n";

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

type ContactFormProps = {
  initialReport?: string;
  initialTopic?: string;
  callRequested?: boolean;
  locale?: Locale;
};

export function ContactForm({ initialReport = "", initialTopic = "research", callRequested = false, locale = "en" }: ContactFormProps) {
  const nl = locale === "nl";
  const startingTopic: EnquiryTopic = initialReport ? "research" : enquiryTopic(initialTopic);
  const startingChoice = initialAssessment(initialReport) || startingTopic;
  const [choice, setChoice] = useState(startingChoice);
  const report = initialAssessment(choice);
  const topic: EnquiryTopic = report ? "research" : enquiryTopic(choice);
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
      setChoice(startingChoice);
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
      <p className="form-intro">{nl ? "Vijf korte vragen. Daarna bespreken we samen de beste aanpak." : "Five short questions. Then we discuss the best approach together."}</p>
      <div className="form-grid two-columns">
        <label>{nl ? "Uw naam" : "Your name"} <span aria-hidden="true">*</span><input name="name" autoComplete="name" maxLength={100} required /></label>
        <label>{nl ? "Uw e-mailadres" : "Your email"} <span aria-hidden="true">*</span><input type="email" name="email" autoComplete="email" maxLength={254} required /></label>
      </div>
      <label>{nl ? "Uw bedrijf" : "Your company"} <span aria-hidden="true">*</span><input name="company" autoComplete="organization" maxLength={160} required /></label>
      <label>
        {nl ? "Waar kunnen wij u bij helpen?" : "How can we help?"} <span aria-hidden="true">*</span>
        <select required value={choice} onChange={(event) => setChoice(event.target.value)} aria-describedby="contact-price">
          <option value="research">{nl ? "Onderzoek — samen de juiste aanpak kiezen" : "Research — help me choose an approach"}</option>
          <optgroup label={nl ? "Onderzoek" : "Research"}>
            {assessmentOptions.map((option, index) => <option key={option.name} value={option.name}>{nl ? assessmentOptionsNl[index].name : option.name} — {contactPrice("research", option.name, locale).label}</option>)}
          </optgroup>
          <optgroup label={nl ? "Praktische AI" : "Practical AI"}>
            {enquiryTopics.filter((option) => option.value !== "research").map((option) => <option key={option.value} value={option.value}>{nl ? option.nl : option.en} — {contactPrice(option.value, "", locale).label}</option>)}
          </optgroup>
        </select>
      </label>
      <input type="hidden" name="topic" value={topic} />
      <input type="hidden" name="report" value={report} />
      <input type="hidden" name="deliveryPriority" value={DEFAULT_DELIVERY_PRIORITY} />
      <div className="form-price" id="contact-price" aria-live="polite">
        <strong>{contactPrice(topic, report, locale).label}</strong>
        <p>{contactPrice(topic, report, locale).scope}</p>
        <small>{nl ? "Bedragen excl. btw. Opdracht, vaste prijs en planning spreken we vooraf af. Software en eventuele reiskosten worden apart vermeld in het voorstel." : "Fees exclude VAT. Scope, fixed fee and timing are agreed upfront. Software and any travel costs are listed separately in the proposal."}</small>
      </div>
      <label>
        {nl ? "Wat wilt u aanpakken?" : "What would you like to work on?"} <span aria-hidden="true">*</span>
        <textarea name="decision" rows={3} required minLength={5} maxLength={2000} placeholder={nl ? "Bijvoorbeeld: offertes sneller vergelijken, AI leren gebruiken of een concurrent beter begrijpen." : "For example: compare quotations faster, learn to use AI or understand a competitor."} defaultValue={callRequested ? (nl ? "Ik bespreek mijn vraag graag eerst in een gesprek." : "I would like to discuss my question in a call first.") : ""} />
      </label>
      <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="form-field-note form-privacy">{nl ? <>Deel nog geen vertrouwelijke informatie. We gebruiken uw gegevens om te reageren; zie onze <Link href="/nl/privacy">privacyverklaring</Link>. Uw aanvraag is vrijblijvend.</> : <>Please do not share confidential information yet. We use your details to reply; see our <Link href="/privacy">privacy statement</Link>. Your enquiry carries no obligation.</>}</p>
      <div className="form-submit-row">
        <button className="button button-primary" type="submit" disabled={state === "sending" || state === "sent"}>{state === "sending" ? (nl ? "Verzenden…" : "Sending…") : state === "sent" ? (nl ? "Verzonden" : "Sent") : (nl ? "Bespreek mijn vraag" : "Discuss my question")}</button>
      </div>
      <div className={`form-status form-status-${state}`} role="status" aria-live="polite">{message}{state === "failed" && <> <a href={`mailto:${siteConfig.businessEmail}`}>{siteConfig.businessEmail}</a></>}</div>
    </form>
  );
}
