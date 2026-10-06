import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/service-detail";
import { getServiceDetail, seoServices } from "@/data/seo-services";
import { languageAlternates } from "@/lib/i18n";
import { socialImageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return seoServices.en.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = getServiceDetail("en", slug);
  if (!detail) return {};
  const path = `/services/${slug}`;
  const social = socialImageMetadata("en", "service", `${detail.title} | MelonCactus`, slug);
  return { title: detail.metaTitle, description: detail.description, alternates: languageAlternates(path, "en"), openGraph: { type: "website", title: detail.metaTitle, description: detail.description, url: path, ...social.openGraph }, twitter: { title: detail.metaTitle, description: detail.description, ...social.twitter } };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const detail = getServiceDetail("en", slug);
  if (!detail) notFound();
  return <ServiceDetailPage detail={detail} locale="en" />;
}
