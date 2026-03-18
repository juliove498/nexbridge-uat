// ============================================================================
// LWK WASM Wallet Service — Real Liquid Network Integration
// Handles mnemonic management, wallet sync, PSET construction & signing
// ============================================================================

import { apiPost } from "@/governance/lib/api-client";

// LWK types — module is loaded dynamically to avoid SSR issues
// We import types directly for proper typing
import type {
  Network,
  Signer,
  Wollet,
  EsploraClient,
} from "lwk_wasm";

type LWK = typeof import("lwk_wasm");

let lwk: LWK | null = null;

/** Lazy-load LWK WASM module (browser-only) */
export async function loadLwk(): Promise<LWK> {
  if (lwk) return lwk;
  lwk = await import("lwk_wasm");
  return lwk;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ESPLORA_TESTNET = "https://blockstream.info/liquidtestnet/api";
const ESPLORA_MAINNET = "https://blockstream.info/liquid/api";

/**
 * Vote memo prefix — encoded in the transaction metadata.
 * Since LWK TxBuilder doesn't support OP_RETURN directly,
 * votes are cast by sending 1 sat of L-BTC to a deterministic
 * address derived from the vote choice, with the vote memo
 * stored in the wallet's local state and verified by the backend.
 *
 * Vote encoding: We use a "burn" of 1 sat of L-BTC as the vote signal.
 * The backend scans for these burn transactions and matches them to
 * voter AMP IDs via the AMP registry.
 */
export const VOTE_AMOUNT = BigInt(1); // 1 sat dust

// ---------------------------------------------------------------------------
// Wallet State
// ---------------------------------------------------------------------------

export interface LwkWalletState {
  mnemonic: string;
  descriptor: string;
  network: "testnet" | "mainnet";
  address: string;
  addressIndex: number;
}

export interface LwkBalance {
  assetId: string;
  amount: bigint;
}

export interface LwkTransaction {
  txid: string;
  height?: number;
  fee: bigint;
  balanceChanges: Map<string, bigint>;
}

// ---------------------------------------------------------------------------
// Wallet Service
// ---------------------------------------------------------------------------

export class LiquidWalletService {
  private lwk!: LWK;
  private network!: Network;
  private signer!: Signer;
  private wollet!: Wollet;
  private client!: EsploraClient;
  private _mnemonic!: string;
  private _descriptor!: string;
  private _network: "testnet" | "mainnet";
  private _initialized = false;

  constructor(networkType: "testnet" | "mainnet" = "testnet") {
    this._network = networkType;
  }

  get initialized() {
    return this._initialized;
  }

  get mnemonicPhrase() {
    return this._mnemonic;
  }

  get descriptorString() {
    return this._descriptor;
  }

  get policyAssetId(): string {
    return this.network.policyAsset().toString();
  }

  // -------------------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------------------

  /** Generate a new wallet with a random mnemonic */
  async createNew(): Promise<LwkWalletState> {
    this.lwk = await loadLwk();

    this.network =
      this._network === "testnet"
        ? this.lwk.Network.testnet()
        : this.lwk.Network.mainnet();

    const mnemonic = this.lwk.Mnemonic.fromRandom(12);
    this._mnemonic = mnemonic.toString();

    this.signer = new this.lwk.Signer(mnemonic, this.network);
    const descriptor = this.signer.wpkhSlip77Descriptor();
    this._descriptor = descriptor.toString();

    this.wollet = new this.lwk.Wollet(this.network, descriptor);

    const esploraUrl =
      this._network === "testnet" ? ESPLORA_TESTNET : ESPLORA_MAINNET;
    this.client = new this.lwk.EsploraClient(
      this.network,
      esploraUrl,
      false, // no waterfalls
      4, // concurrency
      false // not UTXO-only
    );

    this._initialized = true;

    const addrResult = this.wollet.address(null);
    return {
      mnemonic: this._mnemonic,
      descriptor: this._descriptor,
      network: this._network,
      address: addrResult.address().toString(),
      addressIndex: addrResult.index(),
    };
  }

  /** Restore a wallet from an existing mnemonic */
  async restore(mnemonicPhrase: string): Promise<LwkWalletState> {
    this.lwk = await loadLwk();

    this.network =
      this._network === "testnet"
        ? this.lwk.Network.testnet()
        : this.lwk.Network.mainnet();

    const mnemonic = new this.lwk.Mnemonic(mnemonicPhrase);
    this._mnemonic = mnemonicPhrase;

    this.signer = new this.lwk.Signer(mnemonic, this.network);
    const descriptor = this.signer.wpkhSlip77Descriptor();
    this._descriptor = descriptor.toString();

    this.wollet = new this.lwk.Wollet(this.network, descriptor);

    const esploraUrl =
      this._network === "testnet" ? ESPLORA_TESTNET : ESPLORA_MAINNET;
    this.client = new this.lwk.EsploraClient(
      this.network,
      esploraUrl,
      false,
      4,
      false
    );

    this._initialized = true;

    // Sync to discover existing transactions and UTXOs
    await this.sync();

    const addrResult = this.wollet.address(null);
    return {
      mnemonic: this._mnemonic,
      descriptor: this._descriptor,
      network: this._network,
      address: addrResult.address().toString(),
      addressIndex: addrResult.index(),
    };
  }

  // -------------------------------------------------------------------------
  // Blockchain Sync
  // -------------------------------------------------------------------------

  /** Sync wallet state with the blockchain */
  async sync(): Promise<void> {
    if (!this._initialized) throw new Error("Wallet not initialized");
    const update = await this.client.fullScan(this.wollet);
    if (update) {
      this.wollet.applyUpdate(update);
    }
  }

  // -------------------------------------------------------------------------
  // Address & Balance
  // -------------------------------------------------------------------------

  /** Get next unused address */
  getAddress(index?: number): { address: string; index: number } {
    if (!this._initialized) throw new Error("Wallet not initialized");
    const result = this.wollet.address(index ?? null);
    return {
      address: result.address().toString(),
      index: result.index(),
    };
  }

  /** Get all balances */
  getBalances(): LwkBalance[] {
    if (!this._initialized) throw new Error("Wallet not initialized");
    const balance = this.wollet.balance();
    const entries = balance.entries();
    const result: LwkBalance[] = [];
    for (const [assetId, amount] of entries) {
      result.push({ assetId: assetId.toString(), amount: BigInt(amount) });
    }
    return result;
  }

  /** Get L-BTC balance in satoshis */
  getLbtcBalance(): bigint {
    const balances = this.getBalances();
    const policyAsset = this.policyAssetId;
    const lbtc = balances.find((b) => b.assetId === policyAsset);
    return lbtc?.amount ?? BigInt(0);
  }

  /** Get transaction history */
  getTransactions(): LwkTransaction[] {
    if (!this._initialized) throw new Error("Wallet not initialized");
    const txs = this.wollet.transactions();
    return txs.map((wtx) => {
      const balanceEntries = wtx.balance().entries();
      const balanceChanges = new Map<string, bigint>();
      for (const [assetId, amount] of balanceEntries) {
        balanceChanges.set(assetId.toString(), BigInt(amount));
      }
      return {
        txid: wtx.txid().toString(),
        height: wtx.height(),
        fee: wtx.fee(),
        balanceChanges,
      };
    });
  }

  // -------------------------------------------------------------------------
  // Vote Transaction
  // -------------------------------------------------------------------------

  /**
   * Cast a vote by sending a dust L-BTC transaction.
   *
   * Since LWK TxBuilder doesn't natively support OP_RETURN,
   * we use a dust send to the voter's own address as the vote signal.
   * The vote metadata (proposalId, optionId, voterAddress) is returned
   * alongside the txid for backend indexing.
   *
   * The backend vote indexer will:
   * 1. Watch for dust transactions from registered voters
   * 2. Match the txid to the vote registration via the API
   * 3. Record the vote with the voter's balance at snapshot block
   */
  async castVote(
    proposalId: string,
    optionId: string,
    ampId?: string
  ): Promise<{
    txid: string;
    psetBase64: string;
    voterAddress: string;
  }> {
    if (!this._initialized) throw new Error("Wallet not initialized");

    // Ensure wallet is synced
    await this.sync();

    // Check L-BTC balance for fees
    const lbtcBalance = this.getLbtcBalance();
    if (lbtcBalance < BigInt(1000)) {
      throw new Error(
        `Insufficient L-BTC for transaction fees. Balance: ${lbtcBalance} sats. ` +
          `Get testnet L-BTC from https://liquidtestnet.com/faucet`
      );
    }

    // Get voter's own address as the dust recipient
    const addrResult = this.wollet.address(null);
    const voterAddress = addrResult.address();

    // Build the vote transaction: send dust to self
    const builder = this.network
      .txBuilder()
      .addLbtcRecipient(voterAddress, VOTE_AMOUNT)
      .feeRate(100); // 100 sat/vbyte (standard Liquid fee)

    // Build PSET
    const pset = builder.finish(this.wollet);
    const psetBase64 = pset.toString();

    // Sign
    const signedPset = this.signer.sign(pset);

    // Finalize
    const finalizedPset = this.wollet.finalize(signedPset);

    // Broadcast
    const txid = await this.client.broadcast(finalizedPset);

    // Register the vote with the backend
    // In production: POST /api/votes { txid, proposalId, optionId, voterAddress }
    await this.registerVote(txid.toString(), proposalId, optionId, ampId);

    return {
      txid: txid.toString(),
      psetBase64,
      voterAddress: voterAddress.toString(),
    };
  }

  /**
   * Register the vote with the NexTR backend.
   * The backend verifies the transaction exists on-chain and records the vote.
   */
  private async registerVote(
    txid: string,
    proposalId: string,
    optionId: string,
    ampId?: string
  ): Promise<void> {
    try {
      await apiPost("/api/votes", {
        txid,
        proposalId,
        optionId,
        voterAddress: this.getAddress().address,
        network: this._network,
        ...(ampId ? { voterAmpId: ampId } : {}),
      });
    } catch {
      // Vote is still on-chain even if backend registration fails
      console.warn("Backend unreachable, vote tx is on-chain:", txid);
    }
  }

  // -------------------------------------------------------------------------
  // General Transactions
  // -------------------------------------------------------------------------

  /** Send L-BTC to an address */
  async sendLbtc(
    toAddress: string,
    amountSats: bigint
  ): Promise<string> {
    if (!this._initialized) throw new Error("Wallet not initialized");
    await this.sync();

    const recipient = this.lwk.Address.parse(toAddress, this.network);
    const builder = this.network
      .txBuilder()
      .addLbtcRecipient(recipient, amountSats)
      .feeRate(100);

    const pset = builder.finish(this.wollet);
    const signed = this.signer.sign(pset);
    const finalized = this.wollet.finalize(signed);
    const txid = await this.client.broadcast(finalized);

    return txid.toString();
  }

  // -------------------------------------------------------------------------
  // Explorer
  // -------------------------------------------------------------------------

  /** Get explorer URL for a transaction */
  getExplorerUrl(txid: string): string {
    const base =
      this._network === "testnet"
        ? "https://blockstream.info/liquidtestnet/tx"
        : "https://blockstream.info/liquid/tx";
    return `${base}/${txid}`;
  }

  /** Get explorer URL for an address */
  getAddressExplorerUrl(address: string): string {
    const base =
      this._network === "testnet"
        ? "https://blockstream.info/liquidtestnet/address"
        : "https://blockstream.info/liquid/address";
    return `${base}/${address}`;
  }
}

// ---------------------------------------------------------------------------
// Singleton for the app
// ---------------------------------------------------------------------------

let walletService: LiquidWalletService | null = null;

export function getWalletService(): LiquidWalletService {
  if (!walletService) {
    walletService = new LiquidWalletService("testnet");
  }
  return walletService;
}

export function resetWalletService(): void {
  walletService = null;
}
