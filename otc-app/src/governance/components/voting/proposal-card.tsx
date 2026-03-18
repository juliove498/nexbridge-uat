import { Link } from "react-router-dom";
import { formatDistanceToNow, isPast, parseISO } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import {
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Timer,
  Gavel,
  ThumbsUp,
  UserCheck,
  Building2,
  Megaphone,
} from "lucide-react";
import type { Proposal, VoteTally } from "@/governance/types";
import { useTranslation } from "@/governance/hooks/use-translation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProposalCardProps {
  proposal: Proposal;
  tally?: VoteTally;
  index?: number;
}

const STATUS_CONFIG = {
  draft: { variant: "outline" as const, icon: Timer },
  active: { variant: "default" as const, icon: Clock },
  closed: { variant: "secondary" as const, icon: CheckCircle2 },
  executed: { variant: "secondary" as const, icon: CheckCircle2 },
  cancelled: { variant: "destructive" as const, icon: XCircle },
};

export function ProposalCard({ proposal, tally, index = 0 }: ProposalCardProps) {
  const { t } = useTranslation();
  const status = STATUS_CONFIG[proposal.status];
  const StatusIcon = status.icon;
  const endDate = parseISO(proposal.endTime);
  const isEnded = isPast(endDate);
  const timeRemaining = isEnded
    ? t.common.ended
    : formatDistanceToNow(endDate, { addSuffix: false }) + ` ${t.common.left}`;

  const leadingOption = tally?.options.reduce((a, b) =>
    a.votingPower > b.votingPower ? a : b
  );

  const categoryLabel = t.categories[proposal.category] ?? proposal.category;
  const resolutionLabel = t.resolution[proposal.resolutionType as keyof typeof t.resolution] ?? proposal.resolutionType;

  const RESOLUTION_COLORS: Record<string, string> = {
    ordinary: "text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10",
    special: "text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10",
    advisory: "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={proposal.status === "closed" || proposal.status === "executed" ? `/otc-uat/governance/results/${proposal.id}` : `/otc-uat/governance/vote/${proposal.id}`}>
        <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 cursor-pointer">
          {/* Status accent bar */}
          <div
            className={cn(
              "absolute left-0 top-0 h-full w-1 transition-all group-hover:w-1.5",
              proposal.status === "active"
                ? "bg-emerald-500"
                : proposal.status === "closed"
                ? "bg-blue-500"
                : "bg-muted-foreground/30"
            )}
          />

          <CardHeader className="pb-4 pl-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={status.variant}
                    className="gap-1 text-[10px] uppercase tracking-wider"
                  >
                    <StatusIcon className="h-3 w-3" />
                    {t.status[proposal.status]}
                  </Badge>
                  <Badge variant="outline" className={cn(
                    "font-mono text-[10px]",
                    proposal.assetTicker === "NEXBRIDGE" && "text-purple-600 dark:text-purple-400 border-purple-500/30"
                  )}>
                    {proposal.assetTicker}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] gap-1", RESOLUTION_COLORS[proposal.resolutionType])}
                  >
                    <Gavel className="h-2.5 w-2.5" />
                    {resolutionLabel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-muted-foreground"
                  >
                    {categoryLabel}
                  </Badge>
                </div>
                <h3 className="text-base font-semibold leading-tight group-hover:text-primary transition-colors">
                  {proposal.title}
                </h3>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
            </div>
          </CardHeader>

          <CardContent className="pl-7 space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {proposal.summary}
            </p>

            {/* Board recommendation & proposer */}
            <div className="flex items-center gap-3 flex-wrap">
              {proposal.boardRecommendation && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ThumbsUp className="h-3 w-3" />
                  {t.voteDetail.boardRecommends}{" "}
                  <span className="font-semibold text-foreground uppercase">
                    {proposal.boardRecommendation}
                  </span>
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                {proposal.proposerType === "management" ? (
                  <Building2 className="h-3 w-3" />
                ) : proposal.proposerType === "community" ? (
                  <Megaphone className="h-3 w-3" />
                ) : (
                  <UserCheck className="h-3 w-3" />
                )}
                {proposal.proposerType === "management"
                  ? t.common.management
                  : proposal.proposerType === "community"
                  ? t.community.communityProposer
                  : t.common.hodler}{" "}
                {t.common.instruction}
              </span>
            </div>

            {/* Vote progress */}
            {tally && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {leadingOption?.label} leading at{" "}
                    <span className="font-medium text-foreground">
                      {leadingOption?.percentage.toFixed(1)}%
                    </span>
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      tally.quorumReached
                        ? "text-emerald-500"
                        : "text-amber-500"
                    )}
                  >
                    {tally.quorumReached ? t.common.quorumReached : t.common.quorumPending}
                  </span>
                </div>
                <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-muted">
                  {tally.options.map((opt) => (
                    <div
                      key={opt.optionId}
                      className={cn(
                        "h-full transition-all",
                        opt.label.toLowerCase().includes("for")
                          ? "bg-emerald-500"
                          : opt.label.toLowerCase().includes("against") ||
                            opt.label.toLowerCase().includes("withhold")
                          ? "bg-red-500"
                          : "bg-muted-foreground/30"
                      )}
                      style={{ width: `${opt.percentage}%` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeRemaining}
                </span>
                {tally && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {tally.totalVotes.toLocaleString()} {t.common.votes}
                  </span>
                )}
              </div>
              <span className="font-mono">
                #{proposal.snapshotBlock.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
