import { publicProfileScan, reportOptions } from "@/config/site";
import { publicProfileScanNl, reportOptionsNl } from "@/config/site-nl";
import type { Locale } from "@/lib/i18n";

// Published indications, resolved from allowlisted services, never submitted prices.
export function contactPrice(topic: string, report: string, locale: Locale) {
  const nl = locale === "nl";
  const options = nl ? [publicProfileScanNl, ...reportOptionsNl] : [publicProfileScan, ...reportOptions];
  const index = [publicProfileScan, ...reportOptions].findIndex((option) => option.name === report);
  if (topic === "research" && index >= 0) {
    const option = options[index];
    return { label: `${option.priceQualifier} ${option.price}`, scope: option.name };
  }
  switch (topic) {
    case "ai-guidance": return { label: "€295", scope: nl ? "90 minuten online begeleiding voor één medewerker, met oefeningen en herbruikbare prompts voor één taak." : "90 minutes of online guidance for one person, with exercises and reusable prompts for one task." };
    case "ai-workday": return { label: nl ? "€1.295" : "€1,295", scope: nl ? "Een werkdag van maximaal 6 uur op locatie: één taak onderzoeken en samen oefenen met uw team. Geen volledige automatisering inbegrepen." : "An on-site workday of up to 6 hours: explore one task and practise with your team. Full automation is not included." };
    case "automation": return { label: nl ? "Vanaf €1.995" : "From €1,995", scope: nl ? "Een afgebakende proef voor één terugkerende taak. Koppelingen, ingebruikname en beheer worden afzonderlijk afgesproken." : "A bounded pilot for one recurring task. Integrations, production rollout and maintenance are agreed separately." };
    case "vacancy-tasks": return { label: nl ? "Kennismaking gratis" : "Free introductory call", scope: nl ? "Bespreek welke taken uit uw vacature mogelijk ondersteuning kunnen krijgen. Voor uitwerking ontvangt u eerst een vaste offerte." : "Discuss which tasks from your vacancy might benefit from support. Further work is quoted at a fixed fee first." };
    default: return { label: nl ? "Bedrijfsprofielscan €499 · Onderzoek vanaf €995" : "Public-profile scan €499 · Research from €995", scope: nl ? "De scan betreft uw eigen openbare bedrijfsprofiel. Een onderzoeksopdracht behandelt een afgebakende markt- of concurrentievraag." : "The scan reviews your own public business profile. A research assignment addresses a defined market or competitor question." };
  }
}
