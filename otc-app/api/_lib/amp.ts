import type { TokenBalance } from "./types";

export const AMP_MODE = process.env.NEXTR_AMP_MODE || "mock";

export function isAmpLive(): boolean {
  return AMP_MODE === "live";
}

const AMP_API = {
  BASE_URL: process.env.AMP_BASE_URL || "https://amp.blockstream.com/api",
  ENDPOINTS: {
    AUTH: "/auth",
    AMP_IDS: "/gaid",
  },
};

const MOCK_BALANCES: TokenBalance[] = [
  {
    assetId: "asset_napl_001",
    ticker: "nAAPL",
    name: "Nexbridge Apple Inc.",
    amount: 15000,
    precision: 2,
    displayAmount: "150.00",
  },
  {
    assetId: "asset_nmsft_001",
    ticker: "nMSFT",
    name: "Nexbridge Microsoft Corp.",
    amount: 8500,
    precision: 2,
    displayAmount: "85.00",
  },
  {
    assetId: "asset_ntesla_001",
    ticker: "nTSLA",
    name: "Nexbridge Tesla Inc.",
    amount: 3200,
    precision: 2,
    displayAmount: "32.00",
  },
];

let ampToken: string | null = null;

async function ensureAmpToken(): Promise<string> {
  if (ampToken) return ampToken;
  const username = process.env.AMP_USERNAME;
  const password = process.env.AMP_PASSWORD;
  if (!username || !password) {
    throw new Error("AMP credentials not configured.");
  }
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

function ampHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `token ${token}`,
  };
}

async function validateGaidLive(ampId: string): Promise<boolean> {
  try {
    const token = await ensureAmpToken();
    const res = await fetch(
      `${AMP_API.BASE_URL}${AMP_API.ENDPOINTS.AMP_IDS}/${ampId}/validate`,
      { headers: ampHeaders(token) }
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function getGaidBalancesLive(ampId: string): Promise<TokenBalance[]> {
  const token = await ensureAmpToken();
  const res = await fetch(
    `${AMP_API.BASE_URL}${AMP_API.ENDPOINTS.AMP_IDS}/${ampId}/balance`,
    { headers: ampHeaders(token) }
  );
  if (!res.ok) throw new Error("Failed to fetch AmpId balances from AMP");
  return res.json();
}

export async function resolveGaidBalances(
  ampId: string
): Promise<{ verified: boolean; balances: TokenBalance[] }> {
  if (!isAmpLive()) {
    if (ampId.length < 10) {
      return { verified: false, balances: [] };
    }
    return { verified: true, balances: MOCK_BALANCES };
  }
  const valid = await validateGaidLive(ampId);
  if (!valid) {
    return { verified: false, balances: [] };
  }
  const balances = await getGaidBalancesLive(ampId);
  return { verified: true, balances };
}
