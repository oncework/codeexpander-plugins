import React, { createContext, useContext } from "react";
import type { Locale } from "@codeexpander/dev-tools-i18n";

type TFunc = (key: string) => string;

const I18nContext = createContext<{ locale: Locale; t: TFunc } | null>(null);

export function I18nProvider({
  locale,
  t,
  children,
}: {
  locale: Locale;
  t: TFunc;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, t }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  return ctx ?? { locale: "en" as Locale, t: (key: string) => key };
}
