import { useLanguageStore } from "@/governance/store/language-store";
import { getTranslations } from "@/governance/i18n";
import type { Translations, Locale } from "@/governance/i18n/types";

export function useTranslation(): { t: Translations; locale: Locale } {
  const locale = useLanguageStore((s) => s.locale);
  return { t: getTranslations(locale), locale };
}
