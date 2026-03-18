import { useParams, Navigate } from "react-router-dom";
import { MOCK_PROPOSALS, MOCK_TALLIES } from "@/governance/lib/mock-data";
import { VotePanel } from "@/governance/components/voting/vote-panel";
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
  Clock,
  Users,
  Blocks,
  FileText,
  ArrowLeft,
  ExternalLink,
  Shield,
  Gavel,
  ThumbsUp,
  Building2,
  UserCheck,
  CalendarDays,
} from "lucide-react";
import { formatDistanceToNow, format, parseISO, isPast } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const RESOLUTION_COLORS: Record<string, string> = {
  ordinary: "text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10",
  special: "text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10",
  advisory: "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
};

export function VotePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const proposal = MOCK_PROPOSALS.find((p) => p.id === id);
  const tally = MOCK_TALLIES[id!];

  if (!proposal) return <Navigate to="/otc-uat/governance" replace />;

  const endDate = parseISO(proposal.endTime);
  const isEnded = isPast(endDate);
  const timeRemaining = isEnded
    ? t.voteDetail.windowClosed
    : formatDistanceToNow(endDate, { addSuffix: false }) + ` ${t.voteDetail.remaining}`;

  const categoryLabel = t.categories[proposal.category] ?? proposal.category;
  const resolutionLabel = t.resolution[proposal.resolutionType + "Full" as keyof typeof t.resolution] ?? proposal.resolutionType;
  const resolutionDesc = t.resolution[proposal.resolutionType + "Desc" as keyof typeof t.resolution] ?? "";

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative">
        {/* Back nav */}
        <Link
          to={proposal.assetTicker === "NEXBRIDGE" ? "/otc-uat/governance/community" : "/otc-uat/governance"}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.common.backToDashboard}
        </Link>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Left: Proposal details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  <Badge
                    variant={
                      proposal.status === "active" ? "default" : "secondary"
                    }
                    className="text-[10px] uppercase tracking-wider"
                  >
                    {t.status[proposal.status]}
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
                </div>
                <CardTitle className="text-xl">{proposal.title}</CardTitle>
                <CardDescription>{proposal.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Board recommendation banner */}
                {proposal.boardRecommendation && (
                  <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
                    <ThumbsUp className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-sm">
                      <span className="text-muted-foreground">
                        {t.voteDetail.boardRecommends}{" "}
                      </span>
                      <span className="font-semibold text-primary uppercase">
                        {proposal.boardRecommendation}
                      </span>
                    </p>
                  </div>
                )}

                {/* Proposal metadata grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {t.voteDetail.time}
                    </p>
                    <p className="font-medium">{timeRemaining}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Blocks className="h-3 w-3" />
                      {t.voteDetail.snapshot}
                    </p>
                    <p className="font-mono font-medium">
                      #{proposal.snapshotBlock.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {t.common.quorum}
                    </p>
                    <p className="font-medium">{proposal.quorumRequired}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Gavel className="h-3 w-3" />
                      {t.voteDetail.approval}
                    </p>
                    <p className="font-medium">
                      {proposal.resolutionType === "advisory"
                        ? t.voteDetail.advisory
                        : `>${proposal.approvalThreshold}%`}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Extra institutional details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {proposal.proposerType === "management" ? (
                        <Building2 className="h-3 w-3" />
                      ) : (
                        <UserCheck className="h-3 w-3" />
                      )}
                      {t.voteDetail.proposedBy}
                    </p>
                    <p className="font-medium capitalize">
                      {proposal.proposerType === "management"
                        ? t.common.management
                        : t.common.hodler}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {t.results.recordDate}
                    </p>
                    <p className="font-medium">
                      {format(parseISO(proposal.recordDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {t.results.meetingType}
                    </p>
                    <p className="font-medium">
                      {t.meeting[proposal.meetingType.replace("_", "") as keyof typeof t.meeting] ??
                        t.meeting[proposal.meetingType as keyof typeof t.meeting] ??
                        proposal.meetingType}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.results.eventDetails}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {proposal.description.split("\n").map((paragraph, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current results */}
            {tally && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.voteDetail.currentResults}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <VoteResultsChart tally={tally} />
                  <Separator />
                  <ParticipationBar
                    tally={tally}
                    quorumRequired={proposal.quorumRequired}
                  />
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.voteDetail.timeline}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.results.recordDate}</span>
                    <span>
                      {format(parseISO(proposal.recordDate), "PPP")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.voteDetail.created}</span>
                    <span>
                      {format(parseISO(proposal.createdAt), "PPP 'at' p")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.voteDetail.windowOpened}</span>
                    <span>
                      {format(parseISO(proposal.startTime), "PPP 'at' p")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.voteDetail.windowCloses}</span>
                    <span>
                      {format(parseISO(proposal.endTime), "PPP 'at' p")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.results.snapshotBlock}
                    </span>
                    <span className="font-mono">
                      #{proposal.snapshotBlock.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.voteDetail.blockRange}
                    </span>
                    <span className="font-mono">
                      #{proposal.startBlock.toLocaleString()} &mdash; #
                      {proposal.endBlock.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Vote panel */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <VotePanel proposal={proposal} />

            {/* Resolution type info */}
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {resolutionLabel}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {resolutionDesc}.{" "}
                  {proposal.resolutionType === "advisory"
                    ? t.voteDetail.advisoryNote
                    : t.voteDetail.quorumNote.replace("{quorum}", String(proposal.quorumRequired))}
                </p>
              </CardContent>
            </Card>

            {/* Execution disclaimer */}
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-2">
                <p className="text-[11px] text-muted-foreground">
                  {t.disclaimers.execution}
                </p>
              </CardContent>
            </Card>

            {/* Verification info */}
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{t.voteDetail.instructionVerification}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.voteDetail.verificationDesc}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs"
                  asChild
                >
                  <a
                    href="https://blockstream.info/liquid/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {t.voteDetail.verifyOnExplorer}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
