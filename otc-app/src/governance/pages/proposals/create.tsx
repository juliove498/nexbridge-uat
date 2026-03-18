import { Suspense, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWalletStore } from "@/governance/store/wallet-store";
import { useTranslation } from "@/governance/hooks/use-translation";
import {
  NEXBRIDGE_ASSETS,
  PROPOSAL_DEFAULTS,
  PROPOSAL_CATEGORIES,
  PROPOSAL_THRESHOLDS,
} from "@/governance/lib/constants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Badge } from "@/components/ui/shadcn/badge";
import { Separator } from "@/components/ui/shadcn/separator";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  AlertTriangle,
  FileText,
  Gavel,
  UserCheck,
  Megaphone,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { ResolutionType } from "@/governance/types";

interface OptionInput {
  label: string;
  description: string;
}

export function CreateProposalPage() {
  return (
    <Suspense>
      <CreateProposalContent />
    </Suspense>
  );
}

function CreateProposalContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCommunityMode = searchParams.get("type") === "community";
  const { connection } = useWalletStore();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [assetId, setAssetId] = useState(isCommunityMode ? "NEXBRIDGE" : "");
  const [categoryId, setCategoryId] = useState<string>("");
  const [quorum, setQuorum] = useState<number>(
    PROPOSAL_DEFAULTS.QUORUM_PERCENTAGE
  );
  const [votingPeriod, setVotingPeriod] = useState<number>(
    PROPOSAL_DEFAULTS.MIN_VOTING_PERIOD_BLOCKS
  );
  const [options, setOptions] = useState<OptionInput[]>([
    { label: "For", description: "Approve this proposal" },
    { label: "Against", description: "Reject this proposal" },
    { label: "Abstain", description: "Abstain from voting" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const selectedCategory = useMemo(
    () => PROPOSAL_CATEGORIES.find((c) => c.id === categoryId),
    [categoryId]
  );

  const resolutionType: ResolutionType = selectedCategory?.resolutionType ?? "ordinary";


  const availableCategories = PROPOSAL_CATEGORIES.filter((cat) =>
    isCommunityMode
      ? cat.proposerType === "community"
      : cat.shareholderSubmittable && cat.proposerType !== "community"
  );

  const resolutionLabel = t.resolution[resolutionType + "Full" as keyof typeof t.resolution] ?? resolutionType;
  const resolutionDesc = t.resolution[resolutionType + "Desc" as keyof typeof t.resolution] ?? "";

  const RESOLUTION_COLORS: Record<string, string> = {
    ordinary: "text-blue-600 dark:text-blue-400",
    special: "text-purple-600 dark:text-purple-400",
    advisory: "text-amber-600 dark:text-amber-400",
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    const cat = PROPOSAL_CATEGORIES.find((c) => c.id === value);
    if (cat) {
      if (cat.resolutionType === "special") {
        setQuorum(PROPOSAL_THRESHOLDS.SPECIAL_QUORUM);
      } else {
        setQuorum(PROPOSAL_THRESHOLDS.ORDINARY_QUORUM);
      }
    }
  };

  const addOption = () => {
    if (options.length >= 10) return;
    setOptions([...options, { label: "", description: "" }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (
    index: number,
    field: keyof OptionInput,
    value: string
  ) => {
    const updated = [...options];
    updated[index] = { ...updated[index]!, [field]: value };
    setOptions(updated);
  };

  const handleSubmit = async () => {
    if (!connection) {
      toast.error(t.common.connectWallet);
      return;
    }
    if (!title || !summary || !description || (!isCommunityMode && !assetId) || !categoryId) {
      toast.error("Fill in all required fields");
      return;
    }
    if (options.some((o) => !o.label.trim())) {
      toast.error("All options must have a label");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      toast.success(t.common.submitInstruction, {
        description: "Your instruction has been submitted to the network",
      });
      navigate(isCommunityMode ? "/otc-uat/governance/community" : "/otc-uat/governance");
    } catch {
      toast.error(t.vote.instructionFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const votingDays = Math.round(votingPeriod / 1440);

  if (!connection) {
    return (
      <div className="max-w-2xl py-8">
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h2 className="text-lg font-semibold">{t.create.walletRequired}</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              {t.create.walletRequiredDesc}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative max-w-3xl">
        <Link
          to={isCommunityMode ? "/community" : "/dashboard"}
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
          <div>
            <h1 className="text-2xl font-bold">
              {isCommunityMode ? t.community.submitCommunityProposal : t.create.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isCommunityMode ? t.community.subtitle : t.create.subtitle}
            </p>
          </div>

          {/* Eligibility notice */}
          <Card className={isCommunityMode ? "border-purple-500/20 bg-purple-500/5" : "border-primary/20 bg-primary/5"}>
            <CardContent className="flex items-start gap-3 p-4">
              {isCommunityMode ? (
                <Megaphone className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
              ) : (
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {isCommunityMode
                    ? t.community.votingWeightExplainer
                    : t.create.anyHodlerTitle}
                </p>
                {!isCommunityMode && (
                  <p className="text-xs text-muted-foreground">
                    {t.create.anyHodlerDesc}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category & Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Gavel className="h-4 w-4 text-primary" />
                {t.create.categoryTitle}
              </CardTitle>
              <CardDescription>
                {isCommunityMode ? t.create.categoryDescCommunity : t.create.categoryDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t.create.categoryLabel}</Label>
                <Select value={categoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.create.selectCategory} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          {isCommunityMode ? (
                            <Megaphone className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          {t.categories[cat.id] ?? cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <p className="text-xs text-muted-foreground">
                    {t.categoryDescs[selectedCategory.id] ?? selectedCategory.description}
                  </p>
                )}
              </div>

              {/* Auto-derived fields */}
              {selectedCategory && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {t.create.resolutionType}
                    </p>
                    <p
                      className={`text-sm font-medium ${RESOLUTION_COLORS[resolutionType]}`}
                    >
                      {resolutionLabel}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {resolutionDesc}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {t.create.proposerType}
                    </p>
                    <p className="text-sm font-medium flex items-center gap-1.5">
                      {isCommunityMode ? (
                        <Megaphone className="h-3.5 w-3.5" />
                      ) : (
                        <UserCheck className="h-3.5 w-3.5" />
                      )}
                      {isCommunityMode ? t.community.communityProposer : t.common.hodler}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {isCommunityMode ? t.create.proposerDescCommunity : t.create.proposerDesc}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                {t.create.detailsTitle}
              </CardTitle>
              <CardDescription>
                {t.create.detailsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t.create.titleLabel}</Label>
                <Input
                  id="title"
                  placeholder={t.create.titlePlaceholder}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/200 {t.create.characters}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">{t.create.summaryLabel}</Label>
                <Input
                  id="summary"
                  placeholder={t.create.summaryPlaceholder}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  maxLength={280}
                />
                <p className="text-xs text-muted-foreground">
                  {summary.length}/280 {t.create.characters}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t.create.fullDescLabel}</Label>
                <textarea
                  id="description"
                  className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder={t.create.fullDescPlaceholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={5000}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/5000 {t.create.characters}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.create.configuration}</CardTitle>
              <CardDescription>
                {t.create.configurationDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {!isCommunityMode && (
                  <div className="space-y-2">
                    <Label>{t.create.targetAsset}</Label>
                    <Select value={assetId} onValueChange={setAssetId}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.create.selectAsset} />
                      </SelectTrigger>
                      <SelectContent>
                        {NEXBRIDGE_ASSETS.filter((a) => a.category !== "platform").map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="font-mono text-[10px]"
                              >
                                {asset.ticker}
                              </Badge>
                              {asset.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>
                    {t.create.quorumRequired}
                    {selectedCategory && (
                      <span className="text-xs text-muted-foreground ml-1">
                        {t.create.autoSetNote}
                      </span>
                    )}
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={quorum}
                    onChange={(e) => setQuorum(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  {t.create.instructionWindow} ({votingDays} {votingDays !== 1 ? t.create.days : t.create.day})
                </Label>
                <input
                  type="range"
                  min={PROPOSAL_DEFAULTS.MIN_VOTING_PERIOD_BLOCKS}
                  max={PROPOSAL_DEFAULTS.MAX_VOTING_PERIOD_BLOCKS}
                  step={1440}
                  value={votingPeriod}
                  onChange={(e) => setVotingPeriod(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>3 {t.create.days}</span>
                  <span>30 {t.create.days}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vote options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.create.optionsTitle}</CardTitle>
              <CardDescription>
                {t.create.optionsDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {options.map((option, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted text-xs font-mono">
                    {i + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={t.create.optionLabel}
                      value={option.label}
                      onChange={(e) => updateOption(i, "label", e.target.value)}
                    />
                    <Input
                      placeholder={t.create.optionDescPlaceholder}
                      value={option.description}
                      onChange={(e) =>
                        updateOption(i, "description", e.target.value)
                      }
                    />
                  </div>
                  {options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(i)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {options.length < 10 && (
                <Button
                  variant="outline"
                  onClick={addOption}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t.create.addOption}
                </Button>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Submit */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground max-w-xs">
              {t.create.submitNote}
            </p>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !title || (!isCommunityMode && !assetId) || !categoryId}
              className="gap-2"
              size="lg"
            >
              {submitting ? (
                t.create.submitting
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t.common.submitInstruction}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
