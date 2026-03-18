import type { NexBridgeUser, NexBridgePortfolio } from "./types";

export const AUTH_MODE = process.env.NEXTR_AUTH_MODE || "mock";

export function isAuthLive(): boolean {
  return AUTH_MODE === "live";
}

const MOCK_PORTFOLIOS: NexBridgePortfolio[] = [
  {
    ampId: "GA1a2b3c4d5e6f7890abcdef1234567890",
    label: "Personal Portfolio",
    balances: [
      { assetId: "asset_napl_001", ticker: "nAAPL", name: "NexBridge Apple Inc.", amount: 15000, precision: 2, displayAmount: "150.00" },
      { assetId: "asset_nmsft_001", ticker: "nMSFT", name: "NexBridge Microsoft Corp.", amount: 8500, precision: 2, displayAmount: "85.00" },
    ],
    verified: true,
  },
  {
    ampId: "GA9f8e7d6c5b4a3029182736455463728190",
    label: "Retirement Account (IRA)",
    balances: [
      { assetId: "asset_ntesla_001", ticker: "nTSLA", name: "NexBridge Tesla Inc.", amount: 3200, precision: 2, displayAmount: "32.00" },
      { assetId: "asset_ustbl_001", ticker: "USTBL", name: "NexBridge US Treasury Bills", amount: 250000000, precision: 8, displayAmount: "2.50" },
    ],
    verified: true,
  },
  {
    ampId: "GAff00112233445566778899aabbccddeeff",
    label: "Joint Account",
    balances: [
      { assetId: "asset_napl_001", ticker: "nAAPL", name: "NexBridge Apple Inc.", amount: 5000, precision: 2, displayAmount: "50.00" },
      { assetId: "asset_nspy_001", ticker: "nSPY", name: "NexBridge S&P 500 Index", amount: 12000, precision: 2, displayAmount: "120.00" },
    ],
    verified: true,
  },
];

const MOCK_USER: NexBridgeUser = {
  nexbridgeId: "nb-user-mock-001",
  displayName: "Demo Hodler",
  email: "demo@nexbridge.io",
  portfolios: MOCK_PORTFOLIOS,
};

async function authenticateMock(): Promise<NexBridgeUser> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return MOCK_USER;
}

async function authenticateLive(authCode: string): Promise<NexBridgeUser> {
  void authCode;
  throw new Error(
    "Live NexBridge authentication is not yet configured. Set NEXTR_AUTH_MODE=mock to use mock authentication."
  );
}

export async function authenticateWithNexBridge(
  authCode?: string
): Promise<NexBridgeUser> {
  if (!isAuthLive()) {
    return authenticateMock();
  }
  if (!authCode) {
    throw new Error("Authorization code required for live authentication");
  }
  return authenticateLive(authCode);
}

export function getAuthorizeUrl(state: string): string | null {
  if (!isAuthLive()) return null;

  const clientId = process.env.NEXBRIDGE_CLIENT_ID;
  const redirectUri = process.env.NEXBRIDGE_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    console.warn("NEXBRIDGE_CLIENT_ID or NEXBRIDGE_REDIRECT_URI not set — cannot build authorize URL");
    return null;
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid profile email",
    state,
  });
  return `https://login.nexbridge.io/oauth2/authorize?${params.toString()}`;
}
