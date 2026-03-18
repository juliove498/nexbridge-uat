import { useState } from "react";
import { useWalletStore } from "@/governance/store/wallet-store";
import { useVotingStore } from "@/governance/store/voting-store";
import { getWalletService } from "@/governance/lib/lwk-wallet";
import { useTranslation } from "@/governance/hooks/use-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Badge } from "@/components/ui/shadcn/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/shadcn/dialog";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertTriangle,
  Send,
  Shield,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { Proposal, Vote } from "@/governance/types";
import {
  isCommunityProposal,
  computeCommunityVotingPower,
  formatCommunityVotingPower,
} from "@/governance/lib/community";

interface VotePanelProps {
  proposal: Proposal;
}

const OPTION_ICONS: Record<string, React.ElementType> = {
  "opt-for": CheckCircle2,
  "opt-against": XCircle,
  "opt-abstain": MinusCircle,
};

const OPTION_COLORS: Record<string, string> = {
  "opt-for": "border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10",
  "opt-against": "border-red-500/50 bg-red-500/5 hover:bg-red-500/10",
  "opt-abstain":
    "border-muted-foreground/30 bg-muted-foreground/5 hover:bg-muted-foreground/10",
};

const OPTION_ACTIVE_COLORS: Record<string, string> = {
  "opt-for": "border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30",
  "opt-against": "border-red-500 bg-red-500/15 ring-2 ring-red-500/30",
  "opt-abstain":
    "border-muted-foreground bg-muted-foreground/15 ring-2 ring-muted-foreground/30",
};

export function VotePanel({ proposal }: VotePanelProps) {
  const { connection, balances } = useWalletStore();
  const { userVotes, addVote } = useVotingStore();
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [_lastTxId, setLastTxId] = useState<string | null>(null);

  const existingVote = userVotes[proposal.id];
  const isCommunity = isCommunityProposal(proposal.assetTicker);

  let votingPower: number;
  let votingPowerDisplay: string;

  if (isCommunity) {
    // Community proposals: voting weight = total portfolio $ value
    const totalValue = computeCommunityVotingPower(balances);
    votingPower = Math.round(totalValue * 100); // cents for precision
    votingPowerDisplay = formatCommunityVotingPower(totalValue);
  } else {
    // Equity proposals: voting weight = specific asset token count
    const tokenBalance = balances.find(
      (b) => b.ticker === proposal.assetTicker
    );
    votingPower = tokenBalance ? tokenBalance.amount : 0;
    votingPowerDisplay = tokenBalance ? tokenBalance.displayAmount : "0";
  }

  const handleSubmitVote = async () => {
    if (!connection || !selectedOption) return;

    setSubmitting(true);
    try {
      let txId: string;
      let pset: string;

      // Always use LWK for signing (both AmpId and LWK-only modes have an LWK wallet)
      const service = getWalletService();
      if (!service.initialized) throw new Error("Signing wallet not initialized");
      const result = await service.castVote(
        proposal.id,
        selectedOption,
        connection.ampId
      );
      txId = result.txid;
      pset = result.psetBase64;

      const vote: Vote = {
        id: `vote_${Date.now()}`,
        proposalId: proposal.id,
        voter: connection.ampId,
        optionId: selectedOption,
        votingPower,
        txId,
        pset,
        blockHeight: proposal.snapshotBlock + 1,
        timestamp: new Date().toISOString(),
        signature: "lwk_signed",
      };

      addVote(vote);
      setLastTxId(txId);
      setConfirmOpen(false);

      toast.success(t.vote.instructionBroadcast, {
        description: `Tx: ${txId.slice(0, 16)}...`,
      });
    } catch (err) {
      toast.error(t.vote.instructionFailed, {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!connection) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm font-medium">{t.vote.connectWalletTitle}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            {t.vote.connectWalletDesc}{" "}
            {isCommunity ? "portfolio" : proposal.assetTicker}{" "}
            balance at snapshot block #{proposal.snapshotBlock.toLocaleString()}.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (existingVote) {
    const votedOption = proposal.options.find(
      (o) => o.id === existingVote.optionId
    );
    const explorerTxUrl = `https://blockstream.info/liquidtestnet/tx/${existingVote.txId}`;
    return (
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-3" />
          <p className="text-sm font-medium">
            {t.vote.instructionBroadcast}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t.vote.youSelected} <span className="font-semibold">{votedOption?.label}</span>{" "}
            {t.vote.withWeight} {votingPowerDisplay}{!isCommunity ? ` ${proposal.assetTicker}` : ""} {t.vote.instructionWeight.replace(":", "")}
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            Tx: {existingVote.txId.slice(0, 20)}...
          </p>
          <a
            href={explorerTxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-3"
          >
            <ExternalLink className="h-3 w-3" />
            {t.vote.viewOnExplorer}
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.vote.submitYourInstruction}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={cn("text-xs font-mono", isCommunity && "text-purple-600 dark:text-purple-400 border-purple-500/30")}>
              {proposal.assetTicker}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t.vote.instructionWeight}{" "}
              <span className="font-medium text-foreground">
                {votingPowerDisplay}{!isCommunity ? ` ${proposal.assetTicker}` : ""}
              </span>
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence>
            {proposal.options.map((option, i) => {
              const Icon = OPTION_ICONS[option.id] ?? CheckCircle2;
              const isSelected = selectedOption === option.id;
              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedOption(option.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg border p-4 text-left transition-all",
                    isSelected
                      ? OPTION_ACTIVE_COLORS[option.id]
                      : OPTION_COLORS[option.id]
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isSelected ? "opacity-100" : "opacity-50"
                    )}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{option.label}</span>
                    {option.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-2 w-2 rounded-full bg-primary"
                    />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>

          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={!selectedOption}
            className="w-full gap-2 mt-4"
            size="lg"
          >
            <Send className="h-4 w-4" />
            {t.vote.submitOnChain}
          </Button>

          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
            <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground">
              {t.vote.securityLwk}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.vote.confirmTitle}</DialogTitle>
            <DialogDescription>
              {t.vote.confirmDescLwk}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.vote.event}</span>
                <span className="font-medium text-right max-w-[200px] truncate">
                  {proposal.title}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.vote.yourInstruction}</span>
                <span className="font-semibold">
                  {proposal.options.find((o) => o.id === selectedOption)?.label}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.vote.instructionWeight}</span>
                <span className="font-mono">
                  {votingPowerDisplay}{!isCommunity ? ` ${proposal.assetTicker}` : ""}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.vote.network}</span>
                <span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-amber-500 border-amber-500/30">
                    Liquid Testnet
                  </Badge>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.vote.fee}</span>
                <span className="font-mono">~0.00000100 L-BTC</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmOpen(false)}
                className="flex-1"
                disabled={submitting}
              >
                {t.common.cancel}
              </Button>
              <Button
                onClick={handleSubmitVote}
                className="flex-1 gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t.vote.broadcasting}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t.vote.signBroadcast}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
