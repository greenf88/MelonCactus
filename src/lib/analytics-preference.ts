export const analyticsPreferenceKey = "meloncactus.analytics.preference";

export type AnalyticsPreference = "enabled" | "disabled" | "unavailable";

export type PreferenceStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function browserPreferenceStorage(): PreferenceStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readAnalyticsPreference(storage: PreferenceStorage | null): AnalyticsPreference {
  if (!storage) return "unavailable";
  try {
    const value = storage.getItem(analyticsPreferenceKey);
    if (value === "off") return "disabled";
    if (value !== null && value !== "on") return "disabled";

    // An apparently readable store may still reject writes. In that case we
    // must not enable measurement that a visitor could not subsequently stop.
    storage.setItem(analyticsPreferenceKey, "on");
    return storage.getItem(analyticsPreferenceKey) === "on" ? "enabled" : "unavailable";
  } catch {
    return "unavailable";
  }
}

export function saveAnalyticsPreference(
  storage: PreferenceStorage | null,
  choice: "on" | "off",
): AnalyticsPreference {
  if (!storage) return "unavailable";
  try {
    storage.setItem(analyticsPreferenceKey, choice);
    if (storage.getItem(analyticsPreferenceKey) !== choice) return "unavailable";
    return readAnalyticsPreference(storage);
  } catch {
    return "unavailable";
  }
}

export function preferenceAfterStorageEvent(
  current: AnalyticsPreference,
  key: string | null,
  oldValue: string | null,
  newValue: string | null,
  storage: PreferenceStorage | null,
): AnalyticsPreference {
  if (key !== analyticsPreferenceKey && key !== null) return current;
  // Clearing browser data can erase an opt-out. Keep an already open tab off
  // until an explicit "on" choice is received or the page is restarted.
  if (current !== "enabled" && !(oldValue === "off" && newValue === "on")) return current;
  return readAnalyticsPreference(storage);
}

export function storedPreferenceAllowsMeasurement(storage: PreferenceStorage | null): boolean {
  if (!storage) return false;
  try {
    const value = storage.getItem(analyticsPreferenceKey);
    return value === "on";
  } catch {
    return false;
  }
}
