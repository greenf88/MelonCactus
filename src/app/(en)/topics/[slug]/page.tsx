import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopicPage } from "@/components/topic-page";
import { getTopic, seoTopics } from "@/data/seo-topics";
import { languageAlternates } from "@/lib/i18n";
import { socialImageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return seoTopics.en.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic("en", slug);
  if (!topic) return {};
  const path = `/topics/${slug}`;
  return { title: topic.metaTitle, description: topic.description, alternates: languageAlternates(path, "en"), openGraph: { title: topic.metaTitle, description: topic.description, url: path, ...socialImageMetadata("en", "default", topic.title).openGraph }, twitter: socialImageMetadata("en", "default", topic.title).twitter };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const topic = getTopic("en", slug);
  if (!topic) notFound();
  return <TopicPage topic={topic} locale="en" />;
}
