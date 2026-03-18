import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { WalletButton } from "@/governance/components/wallet/wallet-button";
import { LanguageSelector } from "@/governance/components/layout/language-selector";
import { useTranslation } from "@/governance/hooks/use-translation";
import { Landmark, Megaphone, HelpCircle } from "lucide-react";

export function GovernanceNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { href: "/otc-uat/governance", label: t.nav.governance, icon: Landmark, end: true },
    { href: "/otc-uat/governance/community", label: t.nav.community, icon: Megaphone, end: false },
    { href: "/otc-uat/governance/faq", label: t.nav.faq, icon: HelpCircle, end: false },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
      <nav className="flex items-center gap-1 overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.end
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 shrink-0">
        <LanguageSelector />
        <WalletButton />
      </div>
    </div>
  );
}
