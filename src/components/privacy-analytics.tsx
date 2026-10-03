"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { routePairs } from "@/lib/i18n";

const publicPaths = new Set<string>(routePairs.flat());

export function redactAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null {
  if (event.type !== "pageview") return null;
  try {
    const url = new URL(event.url);
    if (!publicPaths.has(url.pathname)) return null;
    return { ...event, url: `${url.origin}${url.pathname}` };
  } catch {
    return null;
  }
}

export function PrivacyAnalytics() {
  return <Analytics beforeSend={redactAnalyticsEvent} />;
}
