import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/service-detail";
import { getServiceDetail, seoServices } from "@/data/seo-services";
import { counterpartPath, languageAlternates } from "@/lib/i18n";
import { socialImageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return seoServices.nl.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = getServiceDetail("nl", slug);
  if (!detail) return {};
  const path = `/nl/diensten/${slug}`;
  const counterpart = counterpartPath(path);
  if (!counterpart) throw new Error(`Missing English counterpart for ${path}`);
  const social = socialImageMetadata("nl", "service", `${detail.title} | MelonCactus`, slug);
  return { title: detail.metaTitle, description: detail.description, alternates: languageAlternates(counterpart, "nl"), openGraph: { type: "website", title: detail.metaTitle, description: detail.description, url: path, locale: "nl_NL", ...social.openGraph }, twitter: { title: detail.metaTitle, description: detail.description, ...social.twitter } };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const detail = getServiceDetail("nl", slug);
  if (!detail) notFound();
  return <ServiceDetailPage detail={detail} locale="nl" />;
}
