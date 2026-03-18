import { useState } from "react";
import { MOCK_PROPOSALS, MOCK_TALLIES, MOCK_ASSETS } from "@/governance/lib/mock-data";
import { ProposalCard } from "@/governance/components/voting/proposal-card";
import { useWalletStore } from "@/governance/store/wallet-store";
import { useTranslation } from "@/governance/hooks/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import {
  Vote,
  TrendingUp,
  Clock,
  CheckCircle2,
  Wallet,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Unique asset tickers from proposals for filtering (equity instruments only)
const ASSET_FILTERS = [
  { ticker: "nAAPL", label: "Apple", color: "border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400" },
  { ticker: "nMSFT", label: "Microsoft", color: "border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" },
  { ticker: "nTSLA", label: "Tesla", color: "border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400" },
];

export function DashboardPage() {
  const { connection, balances } = useWalletStore();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");
  const [assetFilter, setAssetFilter] = useState<string | null>(null);

  // Equity proposals only (exclude community / NEXBRIDGE)
  const equityProposals = MOCK_PROPOSALS.filter(
    (p) => p.assetTicker !== "NEXBRIDGE"
  );
  const equityAssets = MOCK_ASSETS.filter((a) => a.category !== "platform");

  const filteredProposals = equityProposals.filter((p) => {
    const statusMatch = filter === "all" || p.status === filter;
    const assetMatch = !assetFilter || p.assetTicker === assetFilter;
    return statusMatch && assetMatch;
  });

  const activeCount = equityProposals.filter(
    (p) => p.status === "active"
  ).length;
  const closedCount = equityProposals.filter(
    (p) => p.status === "closed" || p.status === "executed"
  ).length;

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-mono">{t.dashboard.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t.dashboard.subtitle}
            </p>
          </div>
          <Link to="/otc-uat/governance/proposals/create">
            <Button className="gap-2" size="lg">
              <Vote className="h-4 w-4" />
              {t.common.submitInstruction}
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeCount}</p>
                <p className="text-xs text-muted-foreground">
                  {t.dashboard.activeEvents}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{closedCount}</p>
                <p className="text-xs text-muted-foreground">
                  {t.dashboard.completed}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{equityAssets.length}</p>
                <p className="text-xs text-muted-foreground">
                  {t.dashboard.supportedInstruments}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                <Wallet className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {connection ? balances.length : "--"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.dashboard.yourHoldings}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio (when connected) */}
        {connection && balances.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {t.dashboard.holdingsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {balances.map((b) => (
                  <div
                    key={b.assetId}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2"
                  >
                    <Badge variant="outline" className="font-mono text-xs">
                      {b.ticker}
                    </Badge>
                    <span className="text-sm font-medium tabular-nums">
                      {b.displayAmount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Proposals */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" className="gap-1.5">
                {t.common.all}
                <Badge variant="secondary" className="text-[10px] px-1.5">
                  {equityProposals.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="gap-1.5">
                <Clock className="h-3 w-3" />
                {t.common.active}
                <Badge variant="secondary" className="text-[10px] px-1.5">
                  {activeCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="closed" className="gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                {t.common.closed}
              </TabsTrigger>
            </TabsList>

            {/* Asset / Company filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">
                {t.common.filter}
              </span>
              <button
                onClick={() => setAssetFilter(null)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  !assetFilter
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                    : "border-border bg-background text-muted-foreground hover:bg-accent"
                )}
              >
                {t.common.allInstruments}
              </button>
              {ASSET_FILTERS.map((af) => {
                const isActive = assetFilter === af.ticker;
                const count = equityProposals.filter(
                  (p) =>
                    p.assetTicker === af.ticker &&
                    (filter === "all" || p.status === filter)
                ).length;
                return (
                  <button
                    key={af.ticker}
                    onClick={() =>
                      setAssetFilter(isActive ? null : af.ticker)
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      isActive
                        ? cn(af.color, "ring-1 ring-current/30")
                        : "border-border bg-background text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {af.ticker}
                    <span className="ml-1 opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <TabsContent value={filter} className="mt-0">
            <div className="grid gap-5">
              {filteredProposals.map((proposal, i) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  tally={MOCK_TALLIES[proposal.id]}
                  index={i}
                />
              ))}
              {filteredProposals.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Vote className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {t.dashboard.noEventsFound}
                      {assetFilter ? ` for ${assetFilter}` : ""}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
