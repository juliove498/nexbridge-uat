// ============================================================================
// Liquid Network Integration Layer
// Communicates with Liquid via Esplora API + AMP API
// In production, LWK WASM bindings would handle PSET creation / signing
// ============================================================================

import { LIQUID_NETWORK, AMP_API, VOTE_MEMO_PREFIX } from "./constants";
import type {
  AssetId,
  AmpId,
  LiquidAddress,
  LiquidTransaction,
  AMPAsset,
  AMPOwnership,
  AMPRegisteredUser,
  TokenBalance,
  PSETHex,
} from "@/governance/types";

// ---------------------------------------------------------------------------
// Esplora API (public blockchain data)
// ---------------------------------------------------------------------------

const esploraBase = LIQUID_NETWORK.MAINNET_ESPLORA;

export async function getAddressUtxos(address: LiquidAddress) {
  const res = await fetch(`${esploraBase}/address/${address}/utxo`);
  if (!res.ok) throw new Error(`Failed to fetch UTXOs: ${res.statusText}`);
  return res.json();
}

export async function getTransaction(txId: string): Promise<LiquidTransaction> {
  const res = await fetch(`${esploraBase}/tx/${txId}`);
  if (!res.ok) throw new Error(`Failed to fetch tx: ${res.statusText}`);
  return res.json();
}

export async function getBlockHeight(): Promise<number> {
  const res = await fetch(`${esploraBase}/blocks/tip/height`);
  if (!res.ok) throw new Error(`Failed to fetch block height: ${res.statusText}`);
  return res.json();
}

export async function broadcastTransaction(txHex: string): Promise<string> {
  const res = await fetch(`${esploraBase}/tx`, {
    method: "POST",
    body: txHex,
  });
  if (!res.ok) throw new Error(`Broadcast failed: ${res.statusText}`);
  return res.text(); // returns txid
}

export async function getAssetInfo(assetId: AssetId) {
  const res = await fetch(`${esploraBase}/asset/${assetId}`);
  if (!res.ok) throw new Error(`Failed to fetch asset: ${res.statusText}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// AMP API (Asset Management Platform)
// ---------------------------------------------------------------------------

let ampToken: string | null = null;

export async function ampAuthenticate(
  username: string,
  password: string
): Promise<string> {
  const res = await fetch(`${AMP_API.BASE_URL}${AMP_API.ENDPOINTS.AUTH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("AMP authentication failed");
  const data = await res.json();
  ampToken = data.token;
  return data.token;
}

function ampHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(ampToken ? { Authorization: `token ${ampToken}` } : {}),
  };
}

export async function getAMPAssets(): Promise<AMPAsset[]> {
  const res = await fetch(`${AMP_API.BASE_URL}${AMP_API.ENDPOINTS.ASSETS}/`, {
    headers: ampHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch AMP assets");
  return res.json();
}

export async function getAssetOwnerships(
  assetUuid: string
): Promise<AMPOwnership[]> {
  const res = await fetch(
    `${AMP_API.BASE_URL}${AMP_API.ENDPOINTS.ASSETS}/${assetUuid}/ownerships`,
    { headers: ampHeaders() }
  );
  if (!res.ok) throw new Error("Failed to fetch ownerships");
  return res.json();
}

export async function validateAmpId(ampId: AmpId): Promise<boolean> {
  const res = await fetch(
    `${AMP_API.BASE_URL}${AMP_API.ENDPOINTS.AMP_IDS}/${ampId}/validate`,
    { headers: ampHeaders() }
  );
  return res.ok;
}

export async function getAmpIdBalance(
  ampId: AmpId,
  assetUuid?: string
): Promise<TokenBalance[]> {
  const path = assetUuid
    ? `${AMP_API.ENDPOINTS.AMP_IDS}/${ampId}/balance/${assetUuid}`
    : `${AMP_API.ENDPOINTS.AMP_IDS}/${ampId}/balance`;
  const res = await fetch(`${AMP_API.BASE_URL}${path}`, {
    headers: ampHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch AmpId balance");
  return res.json();
}

export async function getRegisteredUsers(): Promise<AMPRegisteredUser[]> {
  const res = await fetch(
    `${AMP_API.BASE_URL}${AMP_API.ENDPOINTS.REGISTERED_USERS}/`,
    { headers: ampHeaders() }
  );
  if (!res.ok) throw new Error("Failed to fetch registered users");
  return res.json();
}

// ---------------------------------------------------------------------------
// Vote Transaction Construction
// ---------------------------------------------------------------------------

/**
 * Constructs a vote transaction memo.
 * Format: NEXTR_VOTE:<proposalId>:<optionId>:<voterAmpId>
 *
 * On Liquid Network, votes are cast by sending a dust amount of the
 * equity token to a deterministic vote-collection address, with the
 * vote choice encoded in the OP_RETURN memo. The token amount held
 * at the snapshot block determines voting power.
 *
 * This is a "signal" transaction — the voter doesn't lose tokens.
 * They send a minimal dust amount (1 sat of the asset) to signal
 * their vote choice, keeping the rest in their wallet.
 */
export function createVoteMemo(
  proposalId: string,
  optionId: string,
  voterAmpId: AmpId
): string {
  return `${VOTE_MEMO_PREFIX}${proposalId}:${optionId}:${voterAmpId}`;
}

/**
 * Parse a vote memo from a transaction.
 */
export function parseVoteMemo(
  memo: string
): { proposalId: string; optionId: string; voterAmpId: AmpId } | null {
  if (!memo.startsWith(VOTE_MEMO_PREFIX)) return null;
  const parts = memo.slice(VOTE_MEMO_PREFIX.length).split(":");
  if (parts.length !== 3) return null;
  return {
    proposalId: parts[0]!,
    optionId: parts[1]!,
    voterAmpId: parts[2]!,
  };
}

/**
 * In production this would use LWK WASM to construct a proper PSET:
 * 1. Create a PSET sending dust amount of the equity asset
 * 2. Add OP_RETURN output with vote memo
 * 3. Return unsigned PSET for the wallet to sign
 *
 * For now, returns a mock PSET structure that demonstrates the flow.
 */
export async function constructVotePSET(params: {
  voterAddress: LiquidAddress;
  assetId: AssetId;
  proposalId: string;
  optionId: string;
  voterAmpId: AmpId;
}): Promise<PSETHex> {
  const memo = createVoteMemo(
    params.proposalId,
    params.optionId,
    params.voterAmpId
  );

  // In production: use lwk_wollet WASM to create PSET
  // const wollet = new LwkWollet(descriptor);
  // const pset = wollet.createTx({
  //   recipients: [{ address: voteCollectorAddress, amount: 1, asset: params.assetId }],
  //   opReturn: memo,
  // });

  const mockPset = Buffer.from(
    JSON.stringify({
      type: "nextr_vote_pset",
      version: 1,
      memo,
      assetId: params.assetId,
      voter: params.voterAddress,
      timestamp: new Date().toISOString(),
    })
  ).toString("hex");

  return mockPset;
}

/**
 * Verify a vote transaction on the Liquid blockchain.
 */
export async function verifyVoteTransaction(txId: string): Promise<{
  valid: boolean;
  proposalId?: string;
  optionId?: string;
  voterAmpId?: AmpId;
  votingPower?: number;
}> {
  try {
    await getTransaction(txId);
    // In production: decode OP_RETURN, verify signature, check snapshot balance
    return {
      valid: true,
      proposalId: "mock",
      optionId: "mock",
      voterAmpId: "mock",
      votingPower: 0,
    };
  } catch {
    return { valid: false };
  }
}
