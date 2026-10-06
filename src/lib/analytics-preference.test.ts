import { describe, expect, it } from "vitest";
import {
  analyticsPreferenceKey,
  preferenceAfterStorageEvent,
  readAnalyticsPreference,
  saveAnalyticsPreference,
  storedPreferenceAllowsMeasurement,
  type PreferenceStorage,
} from "./analytics-preference";
import { permittedAnalyticsEvent } from "@/components/privacy-analytics";

function memoryStorage(): PreferenceStorage {
  const items = new Map<string, string>();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => { items.set(key, value); },
    removeItem: (key) => { items.delete(key); },
  };
}

const pageview = { type: "pageview" as const, url: "https://meloncactus.com/nl/contact?report=assessment#form" };

describe("browser-bound Analytics preference", () => {
  it("enables ordinary measurement only after a writable preference store is checked", () => {
    const storage = memoryStorage();
    expect(readAnalyticsPreference(storage)).toBe("enabled");
    expect(storage.getItem(analyticsPreferenceKey)).toBe("on");
    expect(permittedAnalyticsEvent(pageview, true, storage)).toEqual({
      type: "pageview", url: "https://meloncactus.com/nl/contact",
    });
  });

  it("blocks a surviving callback after opting out, including navigation and reload", () => {
    const storage = memoryStorage();
    readAnalyticsPreference(storage);
    expect(saveAnalyticsPreference(storage, "off")).toBe("disabled");
    expect(readAnalyticsPreference(storage)).toBe("disabled");
    expect(permittedAnalyticsEvent(pageview, true, storage)).toBeNull();
    expect(permittedAnalyticsEvent({ type: "pageview", url: "https://meloncactus.com/privacy" }, true, storage)).toBeNull();
    expect(permittedAnalyticsEvent({ type: "pageview", url: "https://meloncactus.com/nl/privacy" }, true, storage)).toBeNull();
  });

  it("re-enables only after an explicit choice and keeps the allowlist", () => {
    const storage = memoryStorage();
    saveAnalyticsPreference(storage, "off");
    expect(saveAnalyticsPreference(storage, "on")).toBe("enabled");
    expect(permittedAnalyticsEvent(pageview, true, storage)).toEqual({ type: "pageview", url: "https://meloncactus.com/nl/contact" });
    expect(permittedAnalyticsEvent({ type: "event", url: "https://meloncactus.com/contact" }, true, storage)).toBeNull();
    expect(permittedAnalyticsEvent(pageview, false, storage)).toBeNull();
  });

  it("follows explicit changes from another tab without re-enabling after storage is cleared", () => {
    const storage = memoryStorage();
    readAnalyticsPreference(storage);
    storage.setItem(analyticsPreferenceKey, "off");
    expect(preferenceAfterStorageEvent("enabled", analyticsPreferenceKey, "on", "off", storage)).toBe("disabled");
    storage.removeItem(analyticsPreferenceKey);
    expect(preferenceAfterStorageEvent("disabled", analyticsPreferenceKey, "off", null, storage)).toBe("disabled");
    storage.setItem(analyticsPreferenceKey, "on");
    expect(preferenceAfterStorageEvent("disabled", analyticsPreferenceKey, "off", "on", storage)).toBe("enabled");
  });

  it("fails closed when preference storage cannot be read or written", () => {
    expect(readAnalyticsPreference(null)).toBe("unavailable");
    expect(storedPreferenceAllowsMeasurement(null)).toBe(false);
    const unreadable: PreferenceStorage = {
      getItem: () => { throw new Error("blocked"); },
      setItem: () => {},
      removeItem: () => {},
    };
    const unwritable: PreferenceStorage = {
      getItem: () => null,
      setItem: () => { throw new Error("blocked"); },
      removeItem: () => {},
    };
    expect(readAnalyticsPreference(unreadable)).toBe("unavailable");
    expect(readAnalyticsPreference(unwritable)).toBe("unavailable");
    expect(saveAnalyticsPreference(unwritable, "off")).toBe("unavailable");
    const ignoredWrites: PreferenceStorage = {
      getItem: () => "on",
      setItem: () => {},
      removeItem: () => {},
    };
    expect(saveAnalyticsPreference(ignoredWrites, "off")).toBe("unavailable");
    expect(permittedAnalyticsEvent(pageview, true, unreadable)).toBeNull();
    expect(permittedAnalyticsEvent(pageview, true, unwritable)).toBeNull();
  });
});
