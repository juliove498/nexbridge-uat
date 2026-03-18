import { Progress } from "@/components/ui/shadcn/progress";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/governance/hooks/use-translation";
import type { VoteTally } from "@/governance/types";

interface ParticipationBarProps {
  tally: VoteTally;
  quorumRequired: number;
}

export function ParticipationBar({
  tally,
  quorumRequired,
}: ParticipationBarProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{t.common.participation}</span>
        <span
          className={cn(
            "font-medium",
            tally.quorumReached ? "text-emerald-500" : "text-amber-500"
          )}
        >
          {tally.participationRate.toFixed(1)}%
        </span>
      </div>
      <div className="relative">
        <Progress value={tally.participationRate} className="h-3" />
        {/* Quorum marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground/50"
          style={{ left: `${quorumRequired}%` }}
        />
        <div
          className="absolute -top-5 text-[10px] text-muted-foreground font-mono"
          style={{ left: `${quorumRequired}%`, transform: "translateX(-50%)" }}
        >
          {quorumRequired}% {t.common.quorum}
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{tally.totalVotes.toLocaleString()} {t.common.totalVotes}</span>
        <span>{tally.totalVotingPower.toLocaleString()} {t.common.votingPower}</span>
      </div>
    </div>
  );
}
