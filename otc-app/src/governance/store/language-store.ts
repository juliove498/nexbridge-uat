import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/governance/i18n/types";
import { loadTranslations } from "@/governance/i18n";

interface LanguageState {
  locale: Locale;
  loaded: boolean;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: "en",
      loaded: true,
      setLocale: async (locale) => {
        await loadTranslations(locale);
        set({ locale, loaded: true });
      },
    }),
    {
      name: "nextr-language",
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        if (state && state.locale !== "en") {
          loadTranslations(state.locale).then(() => {
            state.loaded = true;
          });
        }
      },
    }
  )
);
