import type { Locale } from "@/lib/i18n";

export const enquiryTopics = [
  { value: "research", en: "Market and competitor research", nl: "Markt- en concurrentieonderzoek" },
  { value: "ai-guidance", en: "AI explanation or guidance", nl: "AI-uitleg of begeleiding" },
  { value: "ai-workday", en: "An on-site AI workday", nl: "Een AI-werkdag op locatie" },
  { value: "automation", en: "Automate a task", nl: "Een taak automatiseren" },
  { value: "vacancy-tasks", en: "Tasks from a job vacancy", nl: "Taken uit een vacature" },
] as const;

export type EnquiryTopic = (typeof enquiryTopics)[number]["value"];
export function isEnquiryTopic(value: string): value is EnquiryTopic {
  return enquiryTopics.some((topic) => topic.value === value);
}
export function enquiryTopic(value: unknown): EnquiryTopic {
  return typeof value === "string" && isEnquiryTopic(value) ? value : "research";
}
export function enquiryTopicLabel(value: string, locale: Locale = "en") {
  const topic = enquiryTopics.find((option) => option.value === value);
  return topic?.[locale] ?? value;
}
export function enquiryHref(locale: Locale, topic: EnquiryTopic) {
  return `${locale === "nl" ? "/nl/contact" : "/contact"}?topic=${topic}`;
}
