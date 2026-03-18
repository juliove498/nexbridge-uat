import { Globe } from "lucide-react";
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { useLanguageStore } from "@/governance/store/language-store";
import { LOCALE_CONFIGS } from "@/governance/i18n/types";

export function LanguageSelector() {
  const { locale, setLocale } = useLanguageStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(v) => setLocale(v as typeof locale)}
        >
          {LOCALE_CONFIGS.map((lc) => (
            <DropdownMenuRadioItem
              key={lc.code}
              value={lc.code}
              className="gap-2 cursor-pointer"
            >
              <span className="text-base leading-none">{lc.flag}</span>
              <span className="flex-1">{lc.nativeLabel}</span>
              <span className="text-[10px] uppercase text-muted-foreground font-mono">
                {lc.code}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
