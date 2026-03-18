import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { WalletButton } from "@/governance/components/wallet/wallet-button";
import { ThemeToggle } from "@/governance/components/layout/theme-toggle";
import { LanguageSelector } from "@/governance/components/layout/language-selector";
import { useTranslation } from "@/governance/hooks/use-translation";
import {
  Landmark,
  Megaphone,
  HelpCircle,
  Menu,
} from "lucide-react";
import { NexTRLogo } from "@/components/ui/shadcn/nextr-logo";
import { Button } from "@/components/ui/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/shadcn/sheet";
import { useState } from "react";

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { href: "/otc-uat/governance", label: t.nav.governance, icon: Landmark },
    { href: "/otc-uat/governance/community", label: t.nav.community, icon: Megaphone },
    { href: "/otc-uat/governance/faq", label: t.nav.faq, icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/otc-uat/governance" className="group transition-transform hover:scale-[1.02]">
          <NexTRLogo size={36} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
          <WalletButton />

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle>
                <NexTRLogo size={28} />
              </SheetTitle>
              <nav className="mt-6 flex flex-col gap-2">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
