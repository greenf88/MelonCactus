import { ImageResponse } from "next/og";
import { getInsight } from "@/data/insights";
import { getInsightNl } from "@/data/insights-nl";

const serviceTitles = {
  en: {
    "public-profile-exposure-scan": "Public Profile Exposure Scan",
    "focused-intelligence-assessment": "Focused Intelligence Assessment",
    "technical-competitive-intelligence": "Technical & Competitive Intelligence",
    "strategic-intelligence-engagement": "Strategic Intelligence Engagement",
  },
  nl: {
    "openbare-informatiescan": "Openbare-informatiescan",
    "gerichte-intelligencebeoordeling": "Gerichte intelligencebeoordeling",
    "technische-concurrentie-intelligence": "Technische en concurrentie-intelligence",
    "strategische-intelligenceopdracht": "Strategische intelligenceopdracht",
  },
} as const;

export async function GET(_request: Request, context: { params: Promise<{ locale: string; kind: string; slug: string }> }) {
  const { locale, kind, slug } = await context.params;
  if (locale !== "en" && locale !== "nl") return new Response("Not found", { status: 404 });

  const title = kind === "default" && slug === "site"
    ? locale === "nl" ? "Industrieel onderzoek" : "Industrial Intelligence"
    : kind === "service"
      ? serviceTitles[locale][slug as keyof typeof serviceTitles[typeof locale]]
      : kind === "article"
        ? (locale === "nl" ? getInsightNl(slug) : getInsight(slug))?.title
        : undefined;
  if (!title) return new Response("Not found", { status: 404 });

  const category = kind === "article" ? locale === "nl" ? "ARTIKEL" : "INSIGHT"
    : kind === "service" ? locale === "nl" ? "DIENST" : "SERVICE"
      : locale === "nl" ? "INDUSTRIËLE INTELLIGENCE" : "INDUSTRIAL INTELLIGENCE";
  const subtitle = locale === "nl"
    ? "Openbaar bewijs voor onderbouwde beslissingen"
    : "Public evidence for better-informed decisions";

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#173d2d", color: "#f4f2e9", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 58, height: 58, border: "3px solid #d8c95d", borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 35, fontWeight: 700 }}>M</div>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1 }}>MelonCactus</div>
        </div>
        <div style={{ color: "#d8c95d", fontSize: 16, fontWeight: 700, letterSpacing: 3 }}>{category}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000 }}>
        <div style={{ width: 110, height: 5, background: "#d8c95d" }} />
        <div style={{ fontSize: title.length > 54 ? 48 : title.length > 36 ? 58 : 70, fontWeight: 700, lineHeight: 1.12, letterSpacing: -2 }}>{title}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #7e9d8a", paddingTop: 24, fontSize: 21 }}>
        <div>{subtitle}</div><div style={{ color: "#d8c95d" }}>meloncactus.com</div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
