import type { AssetId } from "./types";

export interface SecEntity {
  ticker: string;
  companyName: string;
  cik: string;
  assetId: AssetId;
  totalSupply: number;
  hasProxy: boolean;
  category: "equity" | "index";
}

export const SEC_ENTITY_REGISTRY: SecEntity[] = [
  {
    ticker: "nAAPL",
    companyName: "Apple Inc.",
    cik: "0000320193",
    assetId: "ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258ffa9865a37bd2",
    totalSupply: 1_000_000,
    hasProxy: true,
    category: "equity",
  },
  {
    ticker: "nMSFT",
    companyName: "Microsoft Corp.",
    cik: "0000789019",
    assetId: "a31c5b77a45ec36d2432c31a81b3124f21073c1e6c5de62bcb5e5cf6e9aabe2d",
    totalSupply: 800_000,
    hasProxy: true,
    category: "equity",
  },
  {
    ticker: "nTSLA",
    companyName: "Tesla Inc.",
    cik: "0001318605",
    assetId: "b2e15d7c8a4f3e6d9c1b2a5f8e7d4c3b2a1f9e8d7c6b5a4f3e2d1c0b9a8f7e6",
    totalSupply: 500_000,
    hasProxy: true,
    category: "equity",
  },
  {
    ticker: "nSPY",
    companyName: "SPDR S&P 500 ETF Trust",
    cik: "0000884394",
    assetId: "d4f6e8a2c1b3d5f7e9a0b2c4d6f8e1a3b5c7d9e0f2a4b6c8d1e3f5a7b9c0d2e4",
    totalSupply: 2_000_000,
    hasProxy: true,
    category: "index",
  },
];

export function getProxyEntities(): SecEntity[] {
  return SEC_ENTITY_REGISTRY.filter((e) => e.hasProxy);
}

export function getEntityByTicker(ticker: string): SecEntity | undefined {
  return SEC_ENTITY_REGISTRY.find((e) => e.ticker === ticker);
}

export function getEntityByCik(cik: string): SecEntity | undefined {
  return SEC_ENTITY_REGISTRY.find((e) => e.cik === cik);
}
