"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { routePairs } from "@/lib/i18n";
import {
  browserPreferenceStorage,
  preferenceAfterStorageEvent,
  readAnalyticsPreference,
  saveAnalyticsPreference,
  storedPreferenceAllowsMeasurement,
  type AnalyticsPreference,
  type PreferenceStorage,
} from "@/lib/analytics-preference";

const publicPaths = new Set<string>(routePairs.flat());
const preferenceChangeEvent = "meloncactus:analytics-preference-change";
type PreferenceState = AnalyticsPreference | "checking";

// The Vercel script and its callbacks can survive an Analytics component
// unmount. This gate also protects any callback left by a previous mount.
let analyticsEnabledInThisDocument = false;

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

export function permittedAnalyticsEvent(
  event: BeforeSendEvent,
  enabledInThisDocument: boolean,
  storage: PreferenceStorage | null,
): BeforeSendEvent | null {
  if (!enabledInThisDocument || !storedPreferenceAllowsMeasurement(storage)) return null;
  return redactAnalyticsEvent(event);
}

function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  return permittedAnalyticsEvent(event, analyticsEnabledInThisDocument, browserPreferenceStorage());
}

function useAnalyticsPreference(onChange?: (status: AnalyticsPreference) => void) {
  const [status, setStatus] = useState<PreferenceState>("checking");
  const current = useRef<AnalyticsPreference>("unavailable");

  const update = useCallback((next: AnalyticsPreference) => {
    current.current = next;
    onChange?.(next);
    setStatus(next);
  }, [onChange]);

  useEffect(() => {
    // Browser storage is unavailable during server rendering. Defer the
    // initial synchronization until after hydration rather than setting
    // React state synchronously in the effect itself.
    let active = true;
    queueMicrotask(() => {
      if (active) update(readAnalyticsPreference(browserPreferenceStorage()));
    });

    function onStorage(event: StorageEvent) {
      update(preferenceAfterStorageEvent(
        current.current,
        event.key,
        event.oldValue,
        event.newValue,
        browserPreferenceStorage(),
      ));
    }

    function onLocalChange(event: Event) {
      update((event as CustomEvent<AnalyticsPreference>).detail);
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener(preferenceChangeEvent, onLocalChange);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(preferenceChangeEvent, onLocalChange);
      onChange?.("unavailable");
    };
  }, [onChange, update]);

  const choose = useCallback((choice: "on" | "off") => {
    // Fail closed immediately, before a surviving Vercel callback can run.
    if (choice === "off") analyticsEnabledInThisDocument = false;
    const next = saveAnalyticsPreference(browserPreferenceStorage(), choice);
    window.dispatchEvent(new CustomEvent<AnalyticsPreference>(preferenceChangeEvent, { detail: next }));
  }, []);

  return { status, choose };
}

function setAnalyticsGate(status: AnalyticsPreference) {
  analyticsEnabledInThisDocument = status === "enabled";
}

export function PrivacyAnalytics() {
  const { status } = useAnalyticsPreference(setAnalyticsGate);
  return status === "enabled" ? <Analytics beforeSend={beforeSend} /> : null;
}

export function AnalyticsPreferenceControl({ locale }: { locale: "en" | "nl" }) {
  const { status, choose } = useAnalyticsPreference();
  const dutch = locale === "nl";

  return (
    <section className="analytics-preference" aria-labelledby="analytics-preference-title">
      <h3 id="analytics-preference-title">{dutch ? "Analytics in deze browser" : "Analytics in this browser"}</h3>
      <p aria-live="polite">
        {status === "checking" && (dutch ? "Instelling wordt gecontroleerd." : "Checking your setting.")}
        {status === "enabled" && (dutch ? "Analytics staat aan in deze browser." : "Analytics is on in this browser.")}
        {status === "disabled" && (dutch ? "Analytics staat uit in deze browser." : "Analytics is off in this browser.")}
        {status === "unavailable" && (dutch
          ? "Analytics staat uit. Deze browser laat ons de keuze niet betrouwbaar bewaren; controleer de instelling opnieuw na herladen."
          : "Analytics is off. This browser will not reliably save the choice; check the setting again after reloading.")}
      </p>
      {status === "enabled" && (
        <button type="button" className="button button-secondary" onClick={() => choose("off")}>
          {dutch ? "Analytics uitschakelen in deze browser" : "Turn off Analytics in this browser"}
        </button>
      )}
      {(status === "disabled" || status === "unavailable") && (
        <button type="button" className="button button-secondary" onClick={() => choose("on")}>
          {dutch ? "Analytics opnieuw inschakelen" : "Turn Analytics back on"}
        </button>
      )}
    </section>
  );
}
