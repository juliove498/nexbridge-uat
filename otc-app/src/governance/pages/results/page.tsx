import { useParams, Navigate } from "react-router-dom";
import { MOCK_PROPOSALS, MOCK_TALLIES } from "@/governance/lib/mock-data";
import { VoteResultsChart } from "@/governance/components/charts/vote-results-chart";
import { ParticipationBar } from "@/governance/components/charts/participation-bar";
import { useTranslation } from "@/governance/hooks/use-translation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/shadcn/card";
import { Badge } from "@/components/ui/shadcn/badge";
import { Separator } from "@/components/ui/shadcn/separator";
import { Button } from "@/components/ui/shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/table";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ExternalLink,
  Trophy,
  BarChart3,
  Gavel,
  ThumbsUp,
  Building2,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const RESOLUTION_COLORS: Record<string, string> = {
  ordinary: "text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10",
  special: "text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10",
  advisory: "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
};

export function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const proposal = MOCK_PROPOSALS.find((p) => p.id === id);
  const tally = MOCK_TALLIES[id!];

  if (!proposal || !tally) return <Navigate to="/otc-uat/governance" replace />;

  const winningOption = tally.options.reduce((a, b) =>
    a.votingPower > b.votingPower ? a : b
  );

  const forOption = tally.options.find(
    (o) => o.label.toLowerCase().includes("for")
  );
  const forPercentage = forOption?.percentage ?? 0;
  const passed =
    proposal.resolutionType === "advisory"
      ? forPercentage > 50 && tally.quorumReached
      : forPercentage > proposal.approvalThreshold && tally.quorumReached;

  const categoryLabel = t.categories[proposal.category] ?? proposal.category;
  const resolutionLabel = t.resolution[proposal.resolutionType + "Full" as keyof typeof t.resolution] ?? proposal.resolutionType;

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative">
        <Link
          to={proposal.assetTicker === "NEXBRIDGE" ? "/otc-uat/governance/community" : "/otc-uat/governance"}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.common.backToDashboard}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Result banner */}
          <Card
            className={cn(
              "overflow-hidden",
              passed ? "border-emerald-500/30" : "border-red-500/30"
            )}
          >
            <div
              className={cn(
                "h-1",
                passed ? "bg-emerald-500" : "bg-red-500"
              )}
            />
            <CardHeader>
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                <Badge variant="secondary" className="text-[10px] uppercase">
                  {t.status.closed}
                </Badge>
                <Badge variant="outline" className="font-mono text-[10px]">
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
                <Badge
                  variant={passed ? "default" : "destructive"}
                  className="gap-1"
                >
                  {passed ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      {proposal.resolutionType === "advisory"
                        ? t.common.approvedAdvisory
                        : t.common.passed}
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      {tally.quorumReached ? t.common.rejected : t.common.quorumNotReached}
                    </>
                  )}
                </Badge>
              </div>
              <CardTitle className="text-xl">{proposal.title}</CardTitle>
              <CardDescription>{proposal.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 flex-wrap text-sm">
                {proposal.boardRecommendation && (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {t.voteDetail.boardRecommends}{" "}
                    <span className="font-semibold text-foreground uppercase">
                      {proposal.boardRecommendation}
                    </span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  {proposal.proposerType === "management" ? (
                    <Building2 className="h-3.5 w-3.5" />
                  ) : (
                    <UserCheck className="h-3.5 w-3.5" />
                  )}
                  {proposal.proposerType === "management"
                    ? t.common.management
                    : t.common.hodler}{" "}
                  {t.common.instruction}
                </span>
                {proposal.resolutionType === "advisory" && (
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {t.common.nonBinding}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  {t.results.finalResults}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoteResultsChart tally={tally} />
              </CardContent>
            </Card>

            {/* Breakdown table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  {t.results.instructionBreakdown}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.results.option}</TableHead>
                      <TableHead className="text-right">{t.common.votes}</TableHead>
                      <TableHead className="text-right">{t.results.power}</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tally.options.map((opt) => (
                      <TableRow key={opt.optionId}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "h-2.5 w-2.5 rounded-full",
                                opt.label.toLowerCase().includes("for")
                                  ? "bg-emerald-500"
                                  : opt.label.toLowerCase().includes("against") ||
                                    opt.label.toLowerCase().includes("withhold")
                                  ? "bg-red-500"
                                  : "bg-muted-foreground"
                              )}
                            />
                            {opt.label}
                            {opt.optionId === winningOption.optionId && (
                              <Badge
                                variant="outline"
                                className="text-[9px] px-1"
                              >
                                {t.common.winner}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {opt.votes.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-mono text-xs">
                          {opt.votingPower.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          {opt.percentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Participation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t.results.participationAndQuorum}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ParticipationBar
                tally={tally}
                quorumRequired={proposal.quorumRequired}
              />
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.results.eventDetails}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {proposal.description.split("\n").map((paragraph, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
              <Separator />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.results.category}</span>
                  <span>{categoryLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.results.resolutionType}</span>
                  <span className="capitalize">{proposal.resolutionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.results.meetingType}</span>
                  <span className="capitalize">
                    {proposal.meetingType.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.results.recordDate}</span>
                  <span>
                    {format(parseISO(proposal.recordDate), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.results.instructionWindow}</span>
                  <span>
                    {format(parseISO(proposal.startTime), "MMM d")} &mdash;{" "}
                    {format(parseISO(proposal.endTime), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.results.snapshotBlock}</span>
                  <span className="font-mono">
                    #{proposal.snapshotBlock.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.results.totalParticipants}</span>
                  <span>{tally.totalVotes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t.results.totalInstructionWeight}
                  </span>
                  <span className="font-mono">
                    {tally.totalVotingPower.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t.results.approvalThreshold}
                  </span>
                  <span>
                    {proposal.resolutionType === "advisory"
                      ? t.results.advisoryNonBinding
                      : `>${proposal.approvalThreshold}%`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Execution disclaimer */}
          <Card className="border-dashed">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">
                {t.disclaimers.execution}
              </p>
            </CardContent>
          </Card>

          {/* Verify */}
          <div className="flex justify-center">
            <Button variant="outline" className="gap-2" asChild>
              <a
                href="https://blockstream.info/liquid/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                {t.results.verifyAll}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
