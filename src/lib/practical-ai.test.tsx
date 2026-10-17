import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { ContactForm } from "@/components/contact-form";
import { PracticalAiPage, practicalAiMetadata } from "@/components/practical-ai-page";
import { enquiryTopics } from "@/config/enquiry-topics";
import { aiPaths, practicalAi } from "@/config/practical-ai";
import { languageAlternates } from "@/lib/i18n";

describe("practical AI service", () => {
  const english = renderToStaticMarkup(createElement(PracticalAiPage, { locale: "en" }));
  const dutch = renderToStaticMarkup(createElement(PracticalAiPage, { locale: "nl" }));

  it("renders the three offers, bounded examples and responsible claims in both languages", () => {
    for (const [locale, html] of [["en", english], ["nl", dutch]] as const) {
      const content = practicalAi[locale];
      expect(content.offers).toHaveLength(3);
      expect(content.examples).toHaveLength(6);
      for (const offer of content.offers) expect(html).toContain(offer.title);
      for (const [title] of content.examples) expect(html).toContain(title);
      expect(html).toContain(content.examplesIntro);
      expect(html.replaceAll("&#x27;", "'")).toContain(content.privacyLimit);
      expect(html).toContain(content.vacancy);
      expect(html).not.toMatch(/client result|klantresultaat|guaranteed saving|gegarandeerde besparing/i);
    }
    expect(dutch).not.toMatch(/\bje\b|\bjouw\b/i);
    expect(`${english}${dutch}`).not.toMatch(/fixed AI tariffs|vaste AI-tarieven/i);
  });

  it("keeps matching canonicals, hreflang and sitemap entries", () => {
    expect(practicalAiMetadata("en").alternates).toEqual(languageAlternates(aiPaths.en, "en"));
    expect(practicalAiMetadata("nl").alternates).toEqual(languageAlternates(aiPaths.en, "nl"));
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(languageAlternates(aiPaths.en, "en").canonical);
    expect(urls).toContain(languageAlternates(aiPaths.en, "nl").canonical);
  });

  it("publishes visible FAQ and Service structured data", () => {
    for (const [locale, html] of [["en", english], ["nl", dutch]] as const) {
      const scripts = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
        .map((match) => JSON.parse(match[1]) as { "@type": string; name?: string; mainEntity?: unknown[] });
      const service = scripts.find((schema) => schema["@type"] === "Service");
      const faq = scripts.find((schema) => schema["@type"] === "FAQPage");
      expect(service?.name).toBe(practicalAi[locale].title);
      expect(faq?.mainEntity).toHaveLength(practicalAi[locale].faq.length);
    }
  });

  it("defaults the contact form to research and respects valid AI preselection", () => {
    const defaultForm = renderToStaticMarkup(createElement(ContactForm));
    const aiForm = renderToStaticMarkup(createElement(ContactForm, { locale: "nl", initialTopic: "automation" }));
    const invalidForm = renderToStaticMarkup(createElement(ContactForm, { initialTopic: "untrusted-topic" }));
    expect(enquiryTopics).toHaveLength(5);
    expect(defaultForm).toMatch(/<option value="research" selected="">/);
    expect(invalidForm).toMatch(/<option value="research" selected="">/);
    expect(aiForm).toMatch(/<option value="automation" selected="">/);
    expect(aiForm).toContain('type="hidden" name="deliveryPriority" value="standard"');
    expect(aiForm).not.toContain("Kritiek / 24–48 uur");
  });
});
