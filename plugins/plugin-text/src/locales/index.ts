import { getLocale, t, type Locale } from "@codeexpander/dev-tools-i18n";
import en from "./en.json";
import zh from "./zh.json";

const messages: Record<string, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  "zh-CN": zh as Record<string, unknown>,
  zh: zh as Record<string, unknown>,
};

export function getPluginLocale(payload?: { locale?: string }): Locale {
  return getLocale(payload);
}

export function useT(locale: Locale) {
  return (key: string) => t(messages, key, locale);
}
