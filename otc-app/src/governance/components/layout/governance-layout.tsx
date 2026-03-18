import { Outlet } from "react-router-dom";
import { Providers } from "@/governance/components/layout/providers";
import { HtmlLangSync } from "@/governance/components/layout/html-lang-sync";
import { GovernanceNav } from "@/governance/components/layout/governance-nav";
import { Footer } from "@/governance/components/layout/footer";

export function GovernanceLayout() {
  return (
    <Providers>
      <HtmlLangSync />
      <div className="flex flex-col text-foreground antialiased">
        <GovernanceNav />
        <div className="flex-1 pt-6">
          <Outlet />
        </div>
        <Footer />
      </div>
    </Providers>
  );
}
