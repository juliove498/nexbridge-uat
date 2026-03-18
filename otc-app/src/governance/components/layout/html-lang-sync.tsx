import { useEffect } from "react";
import { useLanguageStore } from "@/governance/store/language-store";

export function HtmlLangSync() {
  const locale = useLanguageStore((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
