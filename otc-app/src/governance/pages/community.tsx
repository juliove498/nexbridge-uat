import { useState } from "react";
import { MOCK_PROPOSALS, MOCK_TALLIES } from "@/governance/lib/mock-data";
import { ProposalCard } from "@/governance/components/voting/proposal-card";
import { useWalletStore } from "@/governance/store/wallet-store";
import { useTranslation } from "@/governance/hooks/use-translation";
import {
  computeCommunityVotingPower,
  formatCommunityVotingPower,
  NEXBRIDGE_TICKER,
} from "@/governance/lib/community";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import {
  Megaphone,
  TrendingUp,
  Clock,
  CheckCircle2,
  Wallet,
  Tags,
  Vote,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const COMMUNITY_CATEGORY_FILTERS = [
  { id: "community_new_underlying", label: "New Underlying", color: "border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400" },
  { id: "community_listing_venue", label: "Listing Venue", color: "border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400" },
  { id: "community_bespoke_product", label: "Bespoke Product", color: "border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400" },
  { id: "community_program_features", label: "Features", color: "border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" },
  { id: "community_market_structure", label: "Market Structure", color: "border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400" },
  { id: "community_transparency", label: "Transparency", color: "border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400" },
  { id: "community_other", label: "Other", color: "border-zinc-500/40 bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-600 dark:text-zinc-400" },
];

export function CommunityPage() {
  const { connection, balances } = useWalletStore();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Only community proposals
  const communityProposals = MOCK_PROPOSALS.filter(
    (p) => p.assetTicker === NEXBRIDGE_TICKER
  );

  const filteredProposals = communityProposals.filter((p) => {
    const statusMatch = filter === "all" || p.status === filter;
    const categoryMatch = !categoryFilter || p.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const activeCount = communityProposals.filter(
    (p) => p.status === "active"
  ).length;
  const closedCount = communityProposals.filter(
    (p) => p.status === "closed" || p.status === "executed"
  ).length;

  const portfolioValue = connection
    ? computeCommunityVotingPower(balances)
    : 0;

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Megaphone className="h-5 w-5 text-purple-500" />
              <h1 className="text-2xl font-bold font-mono">{t.community.title}</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {t.community.subtitle}
            </p>
          </div>
          <Link to="/otc-uat/governance/proposals/create?type=community">
            <Button className="gap-2">
              <Megaphone className="h-4 w-4" />
              {t.community.submitCommunityProposal}
            </Button>
          </Link>
        </div>

        {/* Advisory disclaimer */}
        <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
          <CardContent className="flex items-start gap-3 p-4">
            <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                {t.community.advisoryDisclaimerShort}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.community.advisoryDisclaimer}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
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
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
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
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Tags className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{COMMUNITY_CATEGORY_FILTERS.length}</p>
                <p className="text-xs text-muted-foreground">
                  Categories
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Wallet className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {connection
                    ? formatCommunityVotingPower(portfolioValue)
                    : "--"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.community.totalPortfolioValue}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voting weight explainer */}
        {connection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-6 border-purple-500/20 bg-purple-500/5">
              <CardContent className="flex items-start gap-3 p-4">
                <Megaphone className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {t.community.votingWeightExplainer}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Proposals */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as typeof filter)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <TabsList>
              <TabsTrigger value="all" className="gap-1.5">
                {t.common.all}
                <Badge variant="secondary" className="text-[10px] px-1.5">
                  {communityProposals.length}
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

            {/* Category filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">
                {t.common.filter}
              </span>
              <button
                onClick={() => setCategoryFilter(null)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  !categoryFilter
                    ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30"
                    : "border-border bg-background text-muted-foreground hover:bg-accent"
                )}
              >
                {t.community.allCategories}
              </button>
              {COMMUNITY_CATEGORY_FILTERS.map((cf) => {
                const isActive = categoryFilter === cf.id;
                const count = communityProposals.filter(
                  (p) =>
                    p.category === cf.id &&
                    (filter === "all" || p.status === filter)
                ).length;
                if (count === 0 && !isActive) return null;
                return (
                  <button
                    key={cf.id}
                    onClick={() =>
                      setCategoryFilter(isActive ? null : cf.id)
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      isActive
                        ? cn(cf.color, "ring-1 ring-current/30")
                        : "border-border bg-background text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {t.categories[cf.id] ?? cf.label}
                    <span className="ml-1 opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <TabsContent value={filter} className="mt-0">
            <div className="grid gap-4">
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
                      {t.community.noProposalsFound}
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
