export { LOCALES, LOCALE_CONFIGS } from "./types";
export type { Locale, LocaleConfig, Translations } from "./types";

import type { Locale, Translations } from "./types";
import { en } from "./en";

const translationMap: Record<Locale, () => Promise<Translations>> = {
  en: async () => en,
  es: () => import("./es").then((m) => m.es),
  it: () => import("./it").then((m) => m.it),
  fr: () => import("./fr").then((m) => m.fr),
};

// Synchronous map (all loaded eagerly for client-side use)
// We start with en and lazily populate as locales are activated
const loadedTranslations: Partial<Record<Locale, Translations>> = { en };

export function getTranslations(locale: Locale): Translations {
  return loadedTranslations[locale] ?? en;
}

export async function loadTranslations(locale: Locale): Promise<Translations> {
  if (loadedTranslations[locale]) return loadedTranslations[locale]!;
  const t = await translationMap[locale]();
  loadedTranslations[locale] = t;
  return t;
}

export { en };
