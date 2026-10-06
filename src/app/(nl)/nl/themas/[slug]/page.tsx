import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicPage } from "@/components/topic-page";
import { getTopic, seoTopics } from "@/data/seo-topics";
import { counterpartPath, languageAlternates } from "@/lib/i18n";
import { socialImageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return seoTopics.nl.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic("nl", slug);
  if (!topic) return {};
  const path = `/nl/themas/${slug}`;
  const enPath = counterpartPath(path);
  if (!enPath) throw new Error(`Missing counterpart: ${path}`);
  return { title: topic.metaTitle, description: topic.description, alternates: languageAlternates(enPath, "nl"), openGraph: { title: topic.metaTitle, description: topic.description, url: path, locale: "nl_NL", ...socialImageMetadata("nl", "default", topic.title).openGraph }, twitter: socialImageMetadata("nl", "default", topic.title).twitter };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const topic = getTopic("nl", slug);
  if (!topic) notFound();
  return <TopicPage topic={topic} locale="nl" />;
}
