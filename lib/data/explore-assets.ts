/* ------------------------------------------------------------------ */
/*  Explore page: types, asset registry, pipeline data                */
/* ------------------------------------------------------------------ */

export type AssetEntry = {
  ticker: string;
  pair: string;
  name: string;
  company: string;
  category: string;
  status: "live" | "soon";
  logo: string | null;
  apy: string;
  nav: string;
  supply: string;
  network: string;
  pairs: string[];
  venues: string[];
};

export type PriceData = {
  bid: number;
  ask: number;
  mid: number;
  spread_bps: number;
  stale: boolean;
};

export type CandlePoint = {
  ts: number;
  p1?: string;
  mid?: string;
  close?: string;
};

export const API_BASE = "/api/nexbridge-finance";
export const PRICES_API = `${API_BASE}/prices`;
export const USTBL_TICKER_API = "/api/ticker/USTBL";
export const PRICE_REFRESH_MS = 10_000;
export const CHART_REFRESH_MS = 60_000;

export const RANGE_MAP: Record<string, string> = {
  "1D": "1d",
  "1W": "1w",
  "1M": "1m",
  "3M": "3m",
  "1Y": "1y",
};

export const TAB_TICKERS = ["USTBL", "nMSTR", "nTSLA", "nNSDQ", "USYLD"];

export const ASSET_REGISTRY: AssetEntry[] = [
  {
    ticker: "USTBL",
    pair: "USTBL-USDT",
    name: "U.S. Treasury Bills",
    company: "U.S. Treasury Bills",
    category: "Fixed Income",
    status: "live",
    logo: "/issuance-logos/ustbl.svg",
    apy: "4.3%",
    nav: "$31,990,726",
    supply: "30,607,332",
    network: "Liquid",
    pairs: ["USDT", "USDC", "USD"],
    venues: ["Bitfinex", "Coinstore", "XT"],
  },
  {
    ticker: "nMSTR",
    pair: "nMSTR-USDT",
    name: "MicroStrategy",
    company: "MicroStrategy Inc.",
    category: "Equities",
    status: "soon",
    logo: "/issuance-logos/microstrategy.1530cc8d.svg",
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
  {
    ticker: "nTSLA",
    pair: "nTSLA-USDT",
    name: "Tesla",
    company: "Tesla, Inc.",
    category: "Equities",
    status: "soon",
    logo: "/issuance-logos/tesla.043c73d1.svg",
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
  {
    ticker: "nNVDA",
    pair: "nNVDA-USDT",
    name: "NVIDIA",
    company: "NVIDIA Corporation",
    category: "Equities",
    status: "soon",
    logo: "/issuance-logos/nvidia.df7eed26.svg",
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
  {
    ticker: "nAAPL",
    pair: "nAAPL-USDT",
    name: "Apple",
    company: "Apple Inc.",
    category: "Equities",
    status: "soon",
    logo: "/issuance-logos/apple.3ad88a52.svg",
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
  {
    ticker: "nAMZN",
    pair: "nAMZN-USDT",
    name: "Amazon",
    company: "Amazon.com, Inc.",
    category: "Equities",
    status: "soon",
    logo: "/issuance-logos/amazon.2c56f1bd.svg",
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
  {
    ticker: "nGOOG",
    pair: "nGOOG-USDT",
    name: "Alphabet",
    company: "Alphabet Inc.",
    category: "Equities",
    status: "soon",
    logo: "/issuance-logos/alphabet.d14fd52f.svg",
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
  {
    ticker: "nMSFT",
    pair: "nMSFT-USDT",
    name: "Microsoft",
    company: "Microsoft Corp.",
    category: "Equities",
    status: "soon",
    logo: "/issuance-logos/microsoft.2dff5972.svg",
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
  {
    ticker: "nMETA",
    pair: "nMETA-USDT",
    name: "Meta",
    company: "Meta Platforms, Inc.",
    category: "Equities",
    status: "soon",
    logo: "/issuance-logos/meta.0f668911.svg",
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
  {
    ticker: "nNFLX",
    pair: "nNFLX-USDT",
    name: "Netflix",
    company: "Netflix, Inc.",
    category: "Equities",
    status: "soon",
    logo: "/issuance-logos/netflix.cf67946d.svg",
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
  {
    ticker: "nSPY",
    pair: "nSPY-USDT",
    name: "S&P 500 ETF",
    company: "SPDR S&P 500 ETF",
    category: "ETFs",
    status: "soon",
    logo: null,
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
  {
    ticker: "nNSDQ",
    pair: "nNSDQ-USDT",
    name: "Nasdaq",
    company: "Invesco QQQ Trust",
    category: "ETFs",
    status: "soon",
    logo: "/issuance-logos/invesco.cb5db553.svg",
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
  {
    ticker: "USYLD",
    pair: "USYLD-USDT",
    name: "U.S. Yield Token",
    company: "U.S. Yield Fund",
    category: "Fixed Income",
    status: "soon",
    logo: "/issuance-logos/usyld.svg",
    apy: "--",
    nav: "--",
    supply: "--",
    network: "Liquid",
    pairs: ["USDT"],
    venues: ["--"],
  },
];

export const VENUE_URLS: Record<string, Record<string, string>> = {
  Bitfinex: { USTBL: "https://trading.bitfinex.com/t/USTBL:UST" },
  Coinstore: { USTBL: "https://www.coinstore.com/spot/USTBLUSDT" },
  XT: { USTBL: "https://www.xt.com/en/trade/ustbl_usdt" },
};

export type PipelineItem = {
  ticker: string;
  company: string;
  logo: string | null;
};

export const PIPELINE_EQUITIES: PipelineItem[] = [
  { ticker: "nMSTR", company: "MicroStrategy", logo: "/issuance-logos/microstrategy.1530cc8d.svg" },
  { ticker: "nTSLA", company: "Tesla", logo: "/issuance-logos/tesla.043c73d1.svg" },
  { ticker: "nNVDA", company: "NVIDIA", logo: "/issuance-logos/nvidia.df7eed26.svg" },
  { ticker: "nAAPL", company: "Apple", logo: "/issuance-logos/apple.3ad88a52.svg" },
  { ticker: "nMSFT", company: "Microsoft", logo: "/issuance-logos/microsoft.2dff5972.svg" },
  { ticker: "nAMZN", company: "Amazon", logo: "/issuance-logos/amazon.2c56f1bd.svg" },
  { ticker: "nGOOG", company: "Alphabet", logo: "/issuance-logos/alphabet.d14fd52f.svg" },
  { ticker: "nMETA", company: "Meta Platforms", logo: "/issuance-logos/meta.0f668911.svg" },
  { ticker: "nNFLX", company: "Netflix", logo: "/issuance-logos/netflix.cf67946d.svg" },
  { ticker: "nADBE", company: "Adobe", logo: "/issuance-logos/adobe.b80aff1d.svg" },
  { ticker: "nAMD", company: "AMD", logo: "/issuance-logos/amd.1c6f2b7b.svg" },
  { ticker: "nCRM", company: "Salesforce", logo: "/issuance-logos/salesforce.fc98a73e.svg" },
  { ticker: "nV", company: "Visa", logo: "/issuance-logos/visa.ce9e2802.svg" },
  { ticker: "nMA", company: "Mastercard", logo: "/issuance-logos/mastercard.da611feb.svg" },
  { ticker: "nBRK", company: "Berkshire Hathaway", logo: "/issuance-logos/berkshire-hathaway.1b72b181.svg" },
  { ticker: "nJNJ", company: "Johnson & Johnson", logo: "/issuance-logos/johnson-johnson.d80d4d02.svg" },
  { ticker: "nPG", company: "Procter & Gamble", logo: "/issuance-logos/proctor-gamble.a46dd365.svg" },
  { ticker: "nXOM", company: "ExxonMobil", logo: "/issuance-logos/exxon-mobile.d1f47e81.svg" },
  { ticker: "nHD", company: "Home Depot", logo: "/issuance-logos/home-deput.5e1ae305.svg" },
  { ticker: "nWMT", company: "Walmart", logo: "/issuance-logos/walmart.87408de8.svg" },
];

export const PIPELINE_INDEXES: PipelineItem[] = [
  { ticker: "nNSDQ", company: "Invesco QQQ Trust", logo: "/issuance-logos/invesco.cb5db553.svg" },
  { ticker: "nSPY", company: "S&P 500 ETF", logo: null },
  { ticker: "nDJI", company: "Dow Jones Industrial", logo: null },
];
