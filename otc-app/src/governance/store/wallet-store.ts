// ============================================================================
// Wallet Connection State (Zustand)
// Unified flow: AmpId identity (AMP) + LWK signing wallet
// ============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  WalletConnection,
  TokenBalance,
  VoterProfile,
  ConnectionStep,
  NexBridgeUser,
} from "@/governance/types";
import { getWalletService, resetWalletService } from "@/governance/lib/lwk-wallet";
import { apiPost } from "@/governance/lib/api-client";
import { toast } from "sonner";

interface WalletState {
  connection: WalletConnection | null;
  profile: VoterProfile | null;
  balances: TokenBalance[];
  isConnecting: boolean;
  isSyncing: boolean;
  error: string | null;
  connectionStep: ConnectionStep;

  // LWK signing wallet state
  lwkMnemonic: string | null;
  lwkAddress: string | null;
  lwkLbtcBalance: number;
  lwkNetwork: "testnet" | "mainnet";

  // Session
  sessionToken: string | null;
  lastGaid: string | null;

  // NexBridge OAuth
  nexBridgeUser: NexBridgeUser | null;

  // Actions
  authenticateWithNexBridge: () => Promise<void>;
  selectPortfolio: (ampId: string) => Promise<void>;
  clearNexBridgeAuth: () => void;
  connectWithGaid: (ampId: string) => Promise<void>;
  connectLwkOnly: (
    mode: "create" | "restore",
    mnemonic?: string
  ) => Promise<void>;
  disconnect: () => void;
  syncLwk: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      connection: null,
      profile: null,
      balances: [],
      isConnecting: false,
      isSyncing: false,
      error: null,
      connectionStep: "idle",
      lwkMnemonic: null,
      lwkAddress: null,
      lwkLbtcBalance: 0,
      lwkNetwork: "testnet",
      sessionToken: null,
      lastGaid: null,
      nexBridgeUser: null,

      // =====================================================================
      // NexBridge OAuth2 Authentication
      // =====================================================================
      authenticateWithNexBridge: async () => {
        set({
          isConnecting: true,
          error: null,
          connectionStep: "authenticating",
          nexBridgeUser: null,
        });

        try {
          const data = await apiPost<{ success: boolean; data?: { user: NexBridgeUser }; error?: string }>("/api/auth/nexbridge");

          if (!data.success) {
            throw new Error(
              data.error || "NexBridge authentication failed"
            );
          }

          const user = data.data!.user as NexBridgeUser;

          set({
            nexBridgeUser: user,
            isConnecting: false,
            connectionStep: "idle",
          });

          // If user has exactly 1 portfolio, auto-select it
          if (user.portfolios.length === 1) {
            await get().selectPortfolio(user.portfolios[0]!.ampId);
          }
        } catch (err) {
          set({
            isConnecting: false,
            connectionStep: "error",
            error:
              err instanceof Error ? err.message : "Authentication failed",
          });
        }
      },

      // =====================================================================
      // Select portfolio from NexBridge user (feeds into connectWithGaid)
      // =====================================================================
      selectPortfolio: async (ampId: string) => {
        const user = get().nexBridgeUser;
        if (!user) {
          set({ error: "Not authenticated with NexBridge" });
          return;
        }

        const portfolio = user.portfolios.find((p) => p.ampId === ampId);
        if (!portfolio) {
          set({ error: "Portfolio not found" });
          return;
        }

        // Feed the selected AmpId into the existing connection flow
        await get().connectWithGaid(ampId);
      },

      // =====================================================================
      // Clear NexBridge authentication (back to sign-in screen)
      // =====================================================================
      clearNexBridgeAuth: () => {
        set({
          nexBridgeUser: null,
          connectionStep: "idle",
          error: null,
        });
      },

      // =====================================================================
      // Primary flow: Connect with AmpId (identity + auto-provision LWK)
      // =====================================================================
      connectWithGaid: async (ampId: string) => {
        set({
          isConnecting: true,
          error: null,
          connectionStep: "validating",
        });

        try {
          // Step 1: Validate AmpId via server → AMP API
          const connectData = await apiPost<{ success: boolean; data?: { sessionToken: string; balances: TokenBalance[]; verified: boolean }; error?: string }>("/api/wallet/connect", { ampId });

          if (!connectData.success) {
            throw new Error(
              connectData.error || "AmpId verification failed"
            );
          }

          const {
            sessionToken,
            balances: ampBalances,
            verified,
          } = connectData.data as {
            sessionToken: string;
            balances: TokenBalance[];
            verified: boolean;
          };

          // Step 2: Provision LWK signing wallet
          set({ connectionStep: "provisioning" });

          const service = getWalletService();
          const existingMnemonic = get().lwkMnemonic;
          let walletState;

          if (existingMnemonic) {
            // Restore existing LWK wallet silently
            walletState = await service.restore(existingMnemonic);
          } else {
            // Auto-create new LWK wallet
            walletState = await service.createNew();
          }

          // Step 3: Sync with blockchain
          set({ connectionStep: "syncing" });
          await service.sync();

          const lbtcBalance = service.getLbtcBalance();
          const lwkAddress = walletState.address;

          // Step 4: Link AmpId ↔ LWK address on server
          set({ connectionStep: "linking" });
          await apiPost("/api/wallet/link", { sessionToken, lwkAddress });

          // Build final state
          const connection: WalletConnection = {
            ampId,
            address: lwkAddress,
            connected: true,
            method: "ampId",
            pubkey: "",
            sessionToken,
            ampIdVerified: verified,
            lwkAddress,
          };

          const votingPower: Record<string, number> = {};
          for (const b of ampBalances) {
            votingPower[b.assetId] = b.amount;
          }

          const profile: VoterProfile = {
            ampId,
            registeredAt: new Date().toISOString(),
            kycVerified: verified,
            balances: ampBalances,
            votingPower,
          };

          set({
            connection,
            profile,
            balances: ampBalances,
            isConnecting: false,
            isSyncing: false,
            connectionStep: "ready",
            sessionToken,
            lastGaid: ampId,
            lwkMnemonic: walletState.mnemonic,
            lwkAddress,
            lwkLbtcBalance: Number(lbtcBalance),
          });
        } catch (err) {
          set({
            isConnecting: false,
            isSyncing: false,
            connectionStep: "error",
            error:
              err instanceof Error ? err.message : "Connection failed",
          });
        }
      },

      // =====================================================================
      // Advanced: LWK-only mode (developers without a AmpId)
      // =====================================================================
      connectLwkOnly: async (mode, mnemonic?) => {
        set({ isConnecting: true, error: null, connectionStep: "provisioning" });
        try {
          const service = getWalletService();
          let state;

          if (mode === "create") {
            state = await service.createNew();
          } else {
            if (!mnemonic) throw new Error("Mnemonic required for restore");
            state = await service.restore(mnemonic);
          }

          set({ connectionStep: "syncing", isSyncing: true });
          await service.sync();

          const lbtcBalance = service.getLbtcBalance();
          const allBalances = service.getBalances();

          const tokenBalances: TokenBalance[] = allBalances.map((b) => {
            const isLbtc = b.assetId === service.policyAssetId;
            return {
              assetId: b.assetId,
              ticker: isLbtc ? "L-BTC" : b.assetId.slice(0, 8),
              name: isLbtc ? "Liquid Bitcoin" : `Asset ${b.assetId.slice(0, 8)}`,
              amount: Number(b.amount),
              precision: 8,
              displayAmount: isLbtc
                ? (Number(b.amount) / 1e8).toFixed(8)
                : b.amount.toString(),
            };
          });

          // Simulated nStock balances for LWK-only testnet mode
          const simulatedNStocks: TokenBalance[] = [
            {
              assetId: "sim_naapl_testnet",
              ticker: "nAAPL",
              name: "Nexbridge Apple Inc.",
              amount: 15000,
              precision: 2,
              displayAmount: "150.00",
            },
            {
              assetId: "sim_nmsft_testnet",
              ticker: "nMSFT",
              name: "Nexbridge Microsoft Corp.",
              amount: 8500,
              precision: 2,
              displayAmount: "85.00",
            },
            {
              assetId: "sim_ntesla_testnet",
              ticker: "nTSLA",
              name: "Nexbridge Tesla Inc.",
              amount: 3200,
              precision: 2,
              displayAmount: "32.00",
            },
          ];

          const allTokenBalances = [...tokenBalances, ...simulatedNStocks];

          const connection: WalletConnection = {
            ampId: state.address.slice(0, 20),
            address: state.address,
            connected: true,
            method: "lwk-only",
            pubkey: "",
            lwkAddress: state.address,
          };

          const votingPower: Record<string, number> = {};
          for (const b of simulatedNStocks) {
            votingPower[b.assetId] = b.amount;
          }

          const profile: VoterProfile = {
            ampId: connection.ampId,
            registeredAt: new Date().toISOString(),
            kycVerified: false,
            balances: allTokenBalances,
            votingPower,
          };

          set({
            connection,
            profile,
            balances: allTokenBalances,
            isConnecting: false,
            isSyncing: false,
            connectionStep: "ready",
            lwkMnemonic: state.mnemonic,
            lwkAddress: state.address,
            lwkLbtcBalance: Number(lbtcBalance),
          });

          // ---------------------------------------------------------------
          // Auto-request testnet L-BTC from faucet if balance is zero.
          // Fire-and-forget — wallet is already connected, faucet runs in
          // the background and syncs the wallet once funds arrive.
          // ---------------------------------------------------------------
          if (Number(lbtcBalance) === 0 && state.address) {
            (async () => {
              try {
                toast.info("Requesting testnet L-BTC...", {
                  description:
                    "Auto-funding your wallet so you can vote immediately.",
                  duration: 5000,
                });

                const faucetData = await apiPost<{ success?: boolean; error?: string }>("/api/faucet", { address: state.address });

                if (faucetData.success !== false) {
                  toast.success("Testnet L-BTC received!", {
                    description: "Syncing wallet to update balance...",
                    duration: 4000,
                  });
                  // Wait for the faucet tx to propagate, then sync
                  setTimeout(() => get().syncLwk(), 4000);
                } else {
                  toast.warning("Auto-faucet unavailable", {
                    description:
                      faucetData.error ||
                      "Use the manual faucet link in the wallet menu.",
                    duration: 6000,
                  });
                }
              } catch {
                toast.warning("Auto-faucet unavailable", {
                  description:
                    "Use the manual faucet link in the wallet menu.",
                  duration: 6000,
                });
              }
            })();
          }
        } catch (err) {
          set({
            isConnecting: false,
            isSyncing: false,
            connectionStep: "error",
            error:
              err instanceof Error ? err.message : "LWK connection failed",
          });
        }
      },

      // =====================================================================
      // Disconnect
      // =====================================================================
      disconnect: () => {
        resetWalletService();
        set({
          connection: null,
          profile: null,
          balances: [],
          error: null,
          connectionStep: "idle",
          lwkMnemonic: null,
          lwkAddress: null,
          lwkLbtcBalance: 0,
          sessionToken: null,
          nexBridgeUser: null,
        });
      },

      // =====================================================================
      // Sync LWK wallet
      // =====================================================================
      syncLwk: async () => {
        const { connection, balances: currentBalances } = get();
        if (!connection) return;

        set({ isSyncing: true });
        try {
          const service = getWalletService();
          if (!service.initialized) return;

          await service.sync();
          const lbtcBalance = service.getLbtcBalance();
          const allBalances = service.getBalances();

          const onChainBalances: TokenBalance[] = allBalances.map((b) => {
            const isLbtc = b.assetId === service.policyAssetId;
            return {
              assetId: b.assetId,
              ticker: isLbtc ? "L-BTC" : b.assetId.slice(0, 8),
              name: isLbtc
                ? "Liquid Bitcoin"
                : `Asset ${b.assetId.slice(0, 8)}`,
              amount: Number(b.amount),
              precision: 8,
              displayAmount: isLbtc
                ? (Number(b.amount) / 1e8).toFixed(8)
                : b.amount.toString(),
            };
          });

          // For AmpId mode: keep AMP balances, only update L-BTC
          // For LWK-only mode: keep simulated balances, update on-chain
          if (connection.method === "ampId") {
            // AMP balances stay as-is, just update L-BTC info
            set({
              lwkLbtcBalance: Number(lbtcBalance),
              isSyncing: false,
            });
          } else {
            // LWK-only: preserve simulated nStock balances
            const simulatedBalances = currentBalances.filter((b) =>
              b.assetId.startsWith("sim_")
            );
            set({
              balances: [...onChainBalances, ...simulatedBalances],
              lwkLbtcBalance: Number(lbtcBalance),
              isSyncing: false,
            });
          }
        } catch (err) {
          set({
            isSyncing: false,
            error: err instanceof Error ? err.message : "Sync failed",
          });
        }
      },

      setError: (error) => set({ error }),
    }),
    {
      name: "nextr-wallet",
      partialize: (state) => ({
        connection: state.connection,
        lwkAddress: state.lwkAddress,
        lwkNetwork: state.lwkNetwork,
        lastGaid: state.lastGaid,
      }),
    }
  )
);
