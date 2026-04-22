export type Locale = string;

export const DEFAULT_LOCALE: Locale = "en";

const FALLBACK_LOCALE: Locale = "en";

/**
 * Normalize lang query value to Locale (e.g. "zh" -> "zh-CN", "en" -> "en").
 */
function normalizeLangParam(value: string): Locale {
  const v = value.trim().slice(0, 5).toLowerCase();
  if (v === "zh" || v === "zh-cn") return "zh-CN";
  if (v === "zh-tw" || v === "zh-hk") return "zh-TW";
  if (v.slice(0, 2) === "zh") return "zh-CN";
  return v.slice(0, 2) || DEFAULT_LOCALE;
}

/**
 * Get locale from URL query (?lang=xxx), then payload, then navigator.
 * Priority: url lang query > payload.locale > navigator.language > default.
 */
export function getLocale(payload?: { locale?: string }): Locale {
  if (typeof window !== "undefined" && typeof URLSearchParams !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    if (lang) return normalizeLangParam(lang);
  }
  if (payload?.locale) return payload.locale;
  if (typeof navigator !== "undefined" && navigator.language) {
    const lang = navigator.language.slice(0, 2);
    return lang === "zh" ? (navigator.language.startsWith("zh-CN") ? "zh-CN" : "zh-TW") : lang;
  }
  return DEFAULT_LOCALE;
}

export type Messages = Record<string, string | Record<string, string>>;

/**
 * Look up a message by key. Supports dot-notation for nested keys.
 * @param messages - Locale messages: { en: { "key": "value" }, "zh-CN": { ... } } or flat { "key": "value" }
 * @param key - Message key (e.g. "tool.title")
 * @param locale - Locale code; falls back to "en" if key missing
 */
export function t(
  messages: Record<Locale, Messages> | Messages,
  key: string,
  locale: Locale = DEFAULT_LOCALE
): string {
  let byLocale: Messages;
  if (
    typeof messages === "object" &&
    messages !== null &&
    "en" in messages &&
    typeof (messages as Record<Locale, Messages>).en === "object"
  ) {
    const byLang = messages as Record<Locale, Messages>;
    byLocale = byLang[locale] ?? byLang[FALLBACK_LOCALE] ?? byLang.en ?? {};
  } else {
    byLocale = (messages as Messages) ?? {};
  }
  const value = key
    .split(".")
    .reduce(
      (obj: unknown, k) => (obj as Record<string, unknown>)?.[k],
      byLocale
    );
  return typeof value === "string" ? value : key;
}
