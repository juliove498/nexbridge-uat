import { useState, useEffect, useRef } from "react";
import { apiPost } from "@/governance/lib/api-client";
import { useWalletStore } from "@/governance/store/wallet-store";
import type { ConnectionStep } from "@/governance/types";
import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { Label } from "@/components/ui/shadcn/label";
import { Badge } from "@/components/ui/shadcn/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import {
  Wallet,
  LogOut,
  Copy,
  CheckCircle,
  Shield,
  Terminal,
  Plus,
  KeyRound,
  RefreshCw,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Eye,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Progress stepper step definitions
// ---------------------------------------------------------------------------

interface StepDef {
  key: ConnectionStep;
  label: string;
  doneLabel?: string;
}

const AMP_ID_STEPS: StepDef[] = [
  { key: "authenticating", label: "Signing in with NexBridge..." },
  { key: "validating", label: "Verifying portfolio..." },
  { key: "provisioning", label: "Preparing signing wallet..." },
  { key: "syncing", label: "Syncing with Liquid Network..." },
  { key: "linking", label: "Linking identity..." },
];

const STEP_ORDER: ConnectionStep[] = [
  "authenticating",
  "validating",
  "provisioning",
  "syncing",
  "linking",
  "ready",
];

function stepIndex(step: ConnectionStep): number {
  const idx = STEP_ORDER.indexOf(step);
  return idx === -1 ? -1 : idx;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function WalletButton() {
  const {
    connection,
    isConnecting,
    isSyncing,
    connectionStep,
    connectLwkOnly,
    disconnect,
    syncLwk,
    balances,
    lwkMnemonic,
    lwkAddress,
    lwkLbtcBalance,
    error,
    nexBridgeUser,
    authenticateWithNexBridge,
    selectPortfolio,
    clearNexBridgeAuth,
  } = useWalletStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [screen, setScreen] = useState<"auth" | "portfolios" | "progress" | "summary" | "lwk">(
    "auth"
  );
  const [mnemonicInput, setMnemonicInput] = useState("");
  const [lwkTab, setLwkTab] = useState<"create" | "restore">("create");
  const [copied, setCopied] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [mnemonicCopied, setMnemonicCopied] = useState(false);
  const [requestingFaucet, setRequestingFaucet] = useState(false);
  const [isFirstTimeWallet, setIsFirstTimeWallet] = useState(false);

  // Track whether a mnemonic already existed before we started connecting
  const hadMnemonicRef = useRef(false);

  // Transition screens based on connectionStep and NexBridge auth state
  useEffect(() => {
    // When NexBridge user arrives with multiple portfolios and no connection yet
    if (nexBridgeUser && nexBridgeUser.portfolios.length > 1 && !connection && connectionStep === "idle") {
      setScreen("portfolios");
      return;
    }

    if (
      connectionStep !== "idle" &&
      connectionStep !== "error" &&
      connectionStep !== "ready" &&
      screen !== "lwk"
    ) {
      setScreen("progress");
    }
    if (connectionStep === "ready" && screen === "progress") {
      // Determine if this is a first-time wallet (mnemonic was created fresh)
      if (!hadMnemonicRef.current && lwkMnemonic) {
        setIsFirstTimeWallet(true);
      }
      setScreen("summary");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionStep, nexBridgeUser, connection]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleNexBridgeSignIn = async () => {
    await authenticateWithNexBridge();
  };

  const handleSelectPortfolio = async (ampId: string) => {
    hadMnemonicRef.current = !!lwkMnemonic;
    await selectPortfolio(ampId);
  };

  const handleLwkConnect = async () => {
    try {
      if (lwkTab === "create") {
        await connectLwkOnly("create");
      } else {
        if (!mnemonicInput.trim()) {
          toast.error("Enter your 12-word mnemonic");
          return;
        }
        await connectLwkOnly("restore", mnemonicInput.trim());
      }
      toast.success("Liquid testnet wallet connected", {
        description: "Syncing with Liquid testnet...",
      });
      if (lwkTab === "restore") {
        setDialogOpen(false);
        resetDialog();
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to connect wallet"
      );
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowMnemonic(false);
    setIsFirstTimeWallet(false);
    toast.info("Wallet disconnected");
  };

  const handleCopyGaid = () => {
    if (!connection?.ampId) return;
    navigator.clipboard.writeText(connection.ampId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("AmpId copied to clipboard");
  };

  const handleCopyAddress = () => {
    const addr = lwkAddress || connection?.lwkAddress || connection?.address;
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Address copied to clipboard");
  };

  const handleCopyMnemonic = () => {
    if (!lwkMnemonic) return;
    navigator.clipboard.writeText(lwkMnemonic);
    setMnemonicCopied(true);
    setTimeout(() => setMnemonicCopied(false), 2000);
    toast.success("Mnemonic copied -- store it safely!");
  };

  const handleSync = async () => {
    await syncLwk();
    toast.success("Wallet synced");
  };

  const handleRequestFaucet = async () => {
    const addr = lwkAddress || connection?.lwkAddress;
    if (!addr) return;
    setRequestingFaucet(true);
    try {
      const data = await apiPost<{ success?: boolean; error?: string }>("/api/faucet", { address: addr });
      if (data.success !== false) {
        toast.success("Testnet L-BTC requested!", {
          description: "Syncing wallet to check balance...",
        });
        setTimeout(() => syncLwk(), 3000);
      } else {
        toast.error("Faucet request failed", {
          description: data.error || "Try the manual faucet link instead",
        });
      }
    } catch {
      toast.error("Faucet request failed", {
        description: "Try the manual faucet link instead",
      });
    } finally {
      setRequestingFaucet(false);
    }
  };

  const handleTryAgain = () => {
    if (nexBridgeUser) {
      setScreen("portfolios");
    } else {
      setScreen("auth");
    }
    useWalletStore.getState().setError(null);
  };

  const resetDialog = () => {
    setScreen("auth");
    setShowMnemonic(false);
    setIsFirstTimeWallet(false);
    setMnemonicInput("");
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const truncate = (s: string, head = 6, tail = 4) =>
    s.length > head + tail + 3
      ? `${s.slice(0, head)}...${s.slice(-tail)}`
      : s;

  const isGaidMode = connection?.method === "ampId";
  const isLwkOnly = connection?.method === "lwk-only";
  const signingAddress =
    lwkAddress || connection?.lwkAddress || connection?.address || "";

  // Split balances for AmpId mode display
  const ampBalances = balances.filter((b) => b.ticker !== "L-BTC");

  // ---------------------------------------------------------------------------
  // Connected state -- dropdown
  // ---------------------------------------------------------------------------

  if (connection) {
    const displayAddr = isGaidMode
      ? connection.ampId
      : signingAddress;

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 font-mono text-xs">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {truncate(displayAddr)}
              {isLwkOnly && (
                <Badge
                  variant="outline"
                  className="text-[9px] px-1 py-0 ml-1 text-amber-500 border-amber-500/30"
                >
                  TESTNET
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80">
            {/* Header */}
            <div className="px-3 py-2">
              <p className="text-xs text-muted-foreground">Connected via</p>
              <p className="text-sm font-medium">
                {isGaidMode ? "AmpId" : "LWK (Testnet)"}
              </p>
            </div>
            <DropdownMenuSeparator />

            {/* AmpId mode sections */}
            {isGaidMode && (
              <>
                {/* AmpId Identity */}
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-muted-foreground">AmpId</p>
                    {connection.ampIdVerified && (
                      <Badge className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10">
                        <Shield className="h-2.5 w-2.5 mr-0.5" />
                        AMP Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-mono break-all text-muted-foreground">
                    {connection.ampId}
                  </p>
                </div>
                <DropdownMenuSeparator />

                {/* Token Holdings */}
                <div className="px-3 py-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Token Holdings
                  </p>
                  {ampBalances.length > 0 ? (
                    ampBalances.map((b) => (
                      <div
                        key={b.assetId}
                        className="flex justify-between text-sm"
                      >
                        <span className="font-medium">{b.ticker}</span>
                        <span className="tabular-nums">
                          {b.displayAmount}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No token holdings found.
                    </p>
                  )}
                </div>
                <DropdownMenuSeparator />

                {/* Signing Wallet */}
                <div className="px-3 py-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Signing Wallet
                  </p>
                  <p className="text-xs font-mono break-all text-muted-foreground">
                    {truncate(signingAddress, 10, 6)}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">L-BTC</span>
                    <span className="tabular-nums">
                      {(lwkLbtcBalance / 1e8).toFixed(8)}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
              </>
            )}

            {/* LWK-only mode sections */}
            {isLwkOnly && (
              <>
                {/* No AMP identity warning */}
                <div className="px-3 py-2">
                  <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-amber-700 dark:text-amber-400">
                      LWK-only mode has no AMP identity — no voting power on
                      governance proposals. Reconnect with your AmpId to vote.
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />

                {/* Testnet Address */}
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-muted-foreground">
                      Testnet Address
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1 py-0 text-amber-500 border-amber-500/30"
                    >
                      TESTNET
                    </Badge>
                  </div>
                  <p className="text-xs font-mono break-all text-muted-foreground">
                    {signingAddress}
                  </p>
                </div>
                <DropdownMenuSeparator />

                {/* Balances */}
                <div className="px-3 py-2 space-y-1">
                  <p className="text-xs text-muted-foreground">Balances</p>
                  {balances.length > 0 ? (
                    balances.map((b) => (
                      <div
                        key={b.assetId}
                        className="flex justify-between text-sm"
                      >
                        <span className="font-medium">{b.ticker}</span>
                        <span className="tabular-nums">
                          {b.displayAmount}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No balances found. Get testnet L-BTC from the faucet.
                    </p>
                  )}
                </div>
                <DropdownMenuSeparator />
              </>
            )}

            {/* LWK actions (both modes have an LWK wallet) */}
            <DropdownMenuItem onClick={handleSync} className="gap-2">
              {isSyncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isSyncing ? "Syncing..." : "Sync Wallet"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleRequestFaucet}
              disabled={requestingFaucet}
              className="gap-2"
            >
              {requestingFaucet ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {requestingFaucet ? "Requesting..." : "Request Testnet L-BTC"}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href="https://liquidtestnet.com/faucet"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Manual Faucet
              </a>
            </DropdownMenuItem>
            {signingAddress && (
              <DropdownMenuItem asChild>
                <a
                  href={`https://blockstream.info/liquidtestnet/address/${signingAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <Globe className="h-4 w-4" />
                  View on Explorer
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />

            {/* Copy actions */}
            {isGaidMode && (
              <DropdownMenuItem onClick={handleCopyGaid} className="gap-2">
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Copy AmpId
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleCopyAddress} className="gap-2">
              {copied ? (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              Copy Address
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleDisconnect}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Post-connect dialog for mnemonic backup (first-time LWK-only create) */}
        {isLwkOnly && lwkMnemonic && connectionStep === "ready" && (
          <MnemonicBackupDialog
            open={isFirstTimeWallet && dialogOpen}
            onClose={() => {
              setDialogOpen(false);
              setIsFirstTimeWallet(false);
            }}
            lwkMnemonic={lwkMnemonic}
            lwkAddress={signingAddress}
            showMnemonic={showMnemonic}
            setShowMnemonic={setShowMnemonic}
            mnemonicCopied={mnemonicCopied}
            handleCopyMnemonic={handleCopyMnemonic}
          />
        )}
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // Disconnected state -- connect dialog
  // ---------------------------------------------------------------------------

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          resetDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {/* ----------------------------------------------------------------- */}
        {/* Screen 1: Sign in with NexBridge */}
        {/* ----------------------------------------------------------------- */}
        {screen === "auth" && (
          <>
            <DialogHeader>
              <DialogTitle>Connect Your Wallet</DialogTitle>
              <DialogDescription>
                Sign in with your NexBridge account to access your portfolios
                and participate in governance.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <Button
                onClick={handleNexBridgeSignIn}
                disabled={isConnecting}
                className="w-full gap-2"
                size="lg"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4" />
                    Sign in with NexBridge
                  </>
                )}
              </Button>

              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                <Shield className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-[11px] text-muted-foreground">
                  You will be redirected to NexBridge to authenticate with your
                  passkey or 2FA. Your portfolio holdings determine your
                  governance voting power. Only AMP-verified holders can
                  participate in votes.
                </p>
              </div>

              {connectionStep === "error" && error && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Screen 1b: Select Portfolio */}
        {/* ----------------------------------------------------------------- */}
        {screen === "portfolios" && nexBridgeUser && (
          <>
            <DialogHeader>
              <DialogTitle>Select Portfolio</DialogTitle>
              <DialogDescription>
                Welcome, {nexBridgeUser.displayName}. Choose which portfolio
                to connect for governance.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              {nexBridgeUser.portfolios.map((portfolio) => (
                <button
                  key={portfolio.ampId}
                  onClick={() => handleSelectPortfolio(portfolio.ampId)}
                  disabled={isConnecting}
                  className="w-full rounded-lg border p-4 text-left hover:bg-muted/50 transition-colors disabled:opacity-50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{portfolio.label}</span>
                    {portfolio.verified && (
                      <Badge className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10">
                        <Shield className="h-2.5 w-2.5 mr-0.5" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    {portfolio.ampId.slice(0, 10)}...{portfolio.ampId.slice(-6)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.balances.map((b) => (
                      <span
                        key={b.assetId}
                        className="text-xs bg-muted rounded-md px-2 py-0.5 font-mono"
                      >
                        {b.displayAmount} {b.ticker}
                      </span>
                    ))}
                  </div>
                </button>
              ))}

              <Button
                variant="outline"
                onClick={() => {
                  clearNexBridgeAuth();
                  setScreen("auth");
                }}
                className="w-full"
              >
                Back
              </Button>
            </div>
          </>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Screen 2: Progress Stepper */}
        {/* ----------------------------------------------------------------- */}
        {screen === "progress" && (
          <>
            <DialogHeader>
              <DialogTitle>Connecting Wallet</DialogTitle>
              <DialogDescription>
                Setting up your identity and signing wallet...
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              {AMP_ID_STEPS.map((s) => {
                const current = stepIndex(connectionStep);
                const mine = stepIndex(s.key);
                const isDone = current > mine;
                const isActive =
                  connectionStep === s.key && connectionStep !== "error";
                return (
                  <div key={s.key} className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : isActive ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted" />
                      )}
                    </div>

                    {/* Label + inline data */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          isDone
                            ? "text-emerald-600 dark:text-emerald-400"
                            : isActive
                            ? "font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {isDone
                          ? s.label.replace("...", "")
                          : s.label}
                      </p>

                      {/* Show AMP balances inline after validation completes */}
                      {s.key === "validating" && isDone && balances.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                          {balances
                            .filter((b) => b.ticker !== "L-BTC")
                            .map(
                              (b) =>
                                `${b.displayAmount} ${b.ticker}`
                            )
                            .join(" \u00b7 ")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Error state */}
              {connectionStep === "error" && error && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    <p className="text-xs text-destructive">{error}</p>
                  </div>
                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Screen 3: Connected Summary */}
        {/* ----------------------------------------------------------------- */}
        {screen === "summary" && (() => {
          // Re-read connection from store since TS narrowed it to null
          // in the disconnected branch. When screen === "summary",
          // connectionStep === "ready" and connection is guaranteed set.
          const conn = useWalletStore.getState().connection;
          if (!conn) return null;
          return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Connected
              </DialogTitle>
              <DialogDescription>
                Your wallet is ready for governance participation.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Identity */}
              <div className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Identity</p>
                  {conn.ampIdVerified && (
                    <Badge className="text-[9px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10">
                      <Shield className="h-2.5 w-2.5 mr-0.5" />
                      AMP Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-mono">
                  {truncate(conn.ampId, 6, 4)}
                </p>
              </div>

              {/* Holdings */}
              {ampBalances.length > 0 && (
                <div className="rounded-lg border p-3 space-y-2">
                  <p className="text-xs text-muted-foreground">Holdings</p>
                  {ampBalances.map((b) => (
                    <div
                      key={b.assetId}
                      className="flex justify-between text-sm"
                    >
                      <span className="font-medium">{b.ticker}</span>
                      <span className="tabular-nums">{b.displayAmount}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Signing wallet */}
              <div className="rounded-lg border p-3 space-y-2">
                <p className="text-xs text-muted-foreground">Signing Wallet</p>
                <p className="text-xs font-mono break-all text-muted-foreground">
                  {truncate(signingAddress, 10, 6)}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">L-BTC</span>
                  <span className="tabular-nums">
                    {(lwkLbtcBalance / 1e8).toFixed(8)}
                  </span>
                </div>
              </div>

              {/* Mnemonic backup for first-time wallets */}
              {isFirstTimeWallet && lwkMnemonic && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                      Save Your Recovery Phrase
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A signing wallet was created automatically. Write down these
                    12 words in order. This is the only way to recover your
                    signing wallet. Never share it with anyone.
                  </p>

                  <div className="relative">
                    <div
                      className={`rounded-lg bg-muted p-3 font-mono text-sm leading-relaxed ${
                        showMnemonic ? "" : "blur-sm select-none"
                      }`}
                    >
                      {lwkMnemonic}
                    </div>
                    {!showMnemonic && (
                      <button
                        onClick={() => setShowMnemonic(true)}
                        className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        Click to reveal
                      </button>
                    )}
                  </div>

                  {showMnemonic && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyMnemonic}
                      className="w-full gap-2"
                    >
                      {mnemonicCopied ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy Mnemonic
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}

              <Button
                onClick={() => {
                  setDialogOpen(false);
                  resetDialog();
                }}
                className="w-full"
              >
                Done
              </Button>
            </div>
          </>
          );
        })()}

        {/* ----------------------------------------------------------------- */}
        {/* Screen: LWK Only (Advanced) */}
        {/* ----------------------------------------------------------------- */}
        {screen === "lwk" && !connection && !lwkMnemonic && (
          <>
            <DialogHeader>
              <DialogTitle>Liquid Testnet Wallet</DialogTitle>
              <DialogDescription>
                Create a new wallet or restore from mnemonic. This connects to
                Liquid testnet for real on-chain voting.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <Tabs
                value={lwkTab}
                onValueChange={(v) => setLwkTab(v as "create" | "restore")}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="create" className="flex-1 gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Create New
                  </TabsTrigger>
                  <TabsTrigger value="restore" className="flex-1 gap-1.5">
                    <KeyRound className="h-3.5 w-3.5" />
                    Restore
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="space-y-4">
                  <div className="rounded-lg border p-4 space-y-2 text-center">
                    <Terminal className="h-8 w-8 mx-auto text-primary" />
                    <p className="text-sm font-medium">
                      Create a Liquid Testnet Wallet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      A new 12-word mnemonic will be generated. You&apos;ll need
                      testnet L-BTC from the faucet to vote.
                    </p>
                  </div>

                  <Button
                    onClick={handleLwkConnect}
                    disabled={isConnecting}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating wallet...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Testnet Wallet
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="restore" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mnemonic">12-Word Mnemonic</Label>
                    <textarea
                      id="mnemonic"
                      placeholder="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
                      value={mnemonicInput}
                      onChange={(e) => setMnemonicInput(e.target.value)}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <Button
                    onClick={handleLwkConnect}
                    disabled={isConnecting || !mnemonicInput.trim()}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Restoring wallet...
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" />
                        Restore Wallet
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>

              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => setScreen("auth")}
                className="w-full"
              >
                Back
              </Button>
            </div>
          </>
        )}

        {/* LWK screen: Show mnemonic after wallet creation */}
        {screen === "lwk" && lwkMnemonic && !connection && (
          <LwkMnemonicCreatedScreen
            lwkMnemonic={lwkMnemonic}
            lwkAddress={lwkAddress}
            showMnemonic={showMnemonic}
            setShowMnemonic={setShowMnemonic}
            mnemonicCopied={mnemonicCopied}
            handleCopyMnemonic={handleCopyMnemonic}
            onDone={() => {
              setDialogOpen(false);
              resetDialog();
            }}
          />
        )}

        {/* LWK screen: wallet connected via LWK-only (show summary) */}
        {screen === "lwk" && connection && connectionStep === "ready" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Testnet Wallet Connected
              </DialogTitle>
              <DialogDescription>
                Your Liquid testnet wallet is ready.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {lwkAddress && (
                <div className="rounded-lg border p-3 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Your Testnet Address
                  </p>
                  <p className="text-xs font-mono break-all">{lwkAddress}</p>
                </div>
              )}

              <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3">
                <ExternalLink className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Get testnet L-BTC from{" "}
                  <a
                    href="https://liquidtestnet.com/faucet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    liquidtestnet.com/faucet
                  </a>{" "}
                  to pay for vote transaction fees.
                </p>
              </div>

              <Button
                onClick={() => {
                  setDialogOpen(false);
                  resetDialog();
                }}
                className="w-full"
              >
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

/** Mnemonic backup screen shown after LWK wallet creation */
function LwkMnemonicCreatedScreen({
  lwkMnemonic,
  lwkAddress,
  showMnemonic,
  setShowMnemonic,
  mnemonicCopied,
  handleCopyMnemonic,
  onDone,
}: {
  lwkMnemonic: string;
  lwkAddress: string | null;
  showMnemonic: boolean;
  setShowMnemonic: (v: boolean) => void;
  mnemonicCopied: boolean;
  handleCopyMnemonic: () => void;
  onDone: () => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Wallet Created</DialogTitle>
        <DialogDescription>
          Back up your recovery phrase before continuing.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 pt-2">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              Save Your Recovery Phrase
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Write down these 12 words in order. This is the only way to recover
            your wallet. Never share it with anyone.
          </p>

          <div className="relative">
            <div
              className={`rounded-lg bg-muted p-3 font-mono text-sm leading-relaxed ${
                showMnemonic ? "" : "blur-sm select-none"
              }`}
            >
              {lwkMnemonic}
            </div>
            {!showMnemonic && (
              <button
                onClick={() => setShowMnemonic(true)}
                className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Eye className="h-4 w-4" />
                Click to reveal
              </button>
            )}
          </div>

          {showMnemonic && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMnemonic}
              className="w-full gap-2"
            >
              {mnemonicCopied ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Mnemonic
                </>
              )}
            </Button>
          )}
        </div>

        {lwkAddress && (
          <div className="rounded-lg border p-3 space-y-1">
            <p className="text-xs text-muted-foreground">
              Your Testnet Address
            </p>
            <p className="text-xs font-mono break-all">{lwkAddress}</p>
          </div>
        )}

        <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3">
          <ExternalLink className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Get testnet L-BTC from{" "}
            <a
              href="https://liquidtestnet.com/faucet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              liquidtestnet.com/faucet
            </a>{" "}
            to pay for vote transaction fees.
          </p>
        </div>

        <Button onClick={onDone} className="w-full">
          Done -- I&apos;ve saved my mnemonic
        </Button>
      </div>
    </>
  );
}

/** Standalone mnemonic backup dialog (used from connected dropdown) */
function MnemonicBackupDialog({
  open,
  onClose,
  lwkMnemonic,
  lwkAddress,
  showMnemonic,
  setShowMnemonic,
  mnemonicCopied,
  handleCopyMnemonic,
}: {
  open: boolean;
  onClose: () => void;
  lwkMnemonic: string;
  lwkAddress: string;
  showMnemonic: boolean;
  setShowMnemonic: (v: boolean) => void;
  mnemonicCopied: boolean;
  handleCopyMnemonic: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <LwkMnemonicCreatedScreen
          lwkMnemonic={lwkMnemonic}
          lwkAddress={lwkAddress}
          showMnemonic={showMnemonic}
          setShowMnemonic={setShowMnemonic}
          mnemonicCopied={mnemonicCopied}
          handleCopyMnemonic={handleCopyMnemonic}
          onDone={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
