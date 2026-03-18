import { createHmac } from "crypto";
import type { TokenBalance, WalletSession } from "./types";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    console.warn(
      "SESSION_SECRET not set — using insecure dev fallback. Set SESSION_SECRET in production."
    );
    return "nextr-dev-session-key-change-in-production";
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encodeToken(session: WalletSession): string {
  const json = Buffer.from(JSON.stringify(session)).toString("base64url");
  const hmac = sign(json);
  return `${json}.${hmac}`;
}

function decodeToken(token: string): WalletSession | null {
  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return null;

  const json = token.slice(0, dotIndex);
  const hmac = token.slice(dotIndex + 1);

  if (sign(json) !== hmac) return null;

  try {
    return JSON.parse(Buffer.from(json, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}

export function createSession(
  ampId: string,
  balances: TokenBalance[]
): WalletSession {
  const now = new Date();
  const session: WalletSession = {
    token: "", // placeholder — replaced with signed token below
    ampId,
    lwkAddress: null,
    balances,
    verified: true,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
  };

  session.token = encodeToken(session);
  return session;
}

export function getSession(token: string): WalletSession | null {
  const session = decodeToken(token);
  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) return null;
  return session;
}

export function linkLwkAddress(
  token: string,
  lwkAddress: string
): { success: boolean; newToken?: string } {
  const session = getSession(token);
  if (!session) return { success: false };
  session.lwkAddress = lwkAddress;
  session.token = "";
  session.token = encodeToken(session);
  return { success: true, newToken: session.token };
}

export function getVotingPower(
  session: WalletSession,
  assetTicker: string
): number {
  const balance = session.balances.find((b) => b.ticker === assetTicker);
  return balance?.amount ?? 0;
}
