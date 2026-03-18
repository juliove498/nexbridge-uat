// Asset registry and product details — mirrors nexbridge.finance/explore

export interface Asset {
  ticker: string;
  pair: string;
  name: string;
  company: string;
  category: string;
  status: 'live' | 'soon';
  logo: string;
  apy: string;
  nav: string;
  supply: string;
  network: string;
  pairs: string[];
  venues: { name: string; url: string }[];
}

export interface ProductDetail {
  cnad: string;
  tags: string[];
  underlying: { label: string; value: string }[];
  venues: { name: string; url: string }[];
  links: { label: string; url: string }[];
  tradeUrl: string;
  learnUrl: string;
}

export interface Candle {
  ts: number;
  mid?: string;
  close?: string;
  p1?: string;
}

export interface ChartData {
  candles: Candle[];
  fetchedAt: number;
}

// Deposit flow types
export type DepositStep = 'review' | 'deposit' | 'awaiting' | 'complete';

export type DepositStatus =
  | 'pending_deposit'
  | 'detected'
  | 'confirming'
  | 'confirmed'
  | 'complete'
  | 'expired'
  | 'failed';

export interface DepositResponse {
  id: string;
  depositAddress: string;
  amount: number;
  network: 'ethereum';
  token: 'USDT';
  status: DepositStatus;
  expiresAt?: string;
  rate: number;
  outputAmount: number;
  outputAsset: string;
  createdAt: string;
}

export interface DepositStatusResponse {
  id: string;
  status: DepositStatus;
  depositAddress: string;
  amount: number;
  network: 'ethereum';
  token: 'USDT';
  confirmations?: number;
  requiredConfirmations: number;
  depositTxId?: string;
  outputTxId?: string;
  outputAmount?: number;
  rate: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const ASSET_REGISTRY: Asset[] = [
  { ticker: 'USTBL', pair: 'USTBL-USDT', name: 'U.S. Treasury Bills', company: 'U.S. Treasury Bills', category: 'Fixed Income', status: 'live', logo: '/otc-uat/issuance-logos/ustbl.svg', apy: '4.3%', nav: '$31,990,726', supply: '30,607,332', network: 'Liquid', pairs: ['USDT', 'USDC', 'USD'], venues: [{ name: 'Bitfinex', url: 'https://trading.bitfinex.com/t/USTBL:UST' }, { name: 'Coinstore', url: 'https://www.coinstore.com/spot/USTBLUSDT' }, { name: 'XT', url: 'https://www.xt.com/en/trade/ustbl_usdt' }] },
  { ticker: 'nMSTR', pair: 'nMSTR-USDT', name: 'MicroStrategy', company: 'MicroStrategy Inc.', category: 'Equities', status: 'soon', logo: '/otc-uat/issuance-logos/microstrategy.svg', apy: '--', nav: '--', supply: '--', network: 'Liquid', pairs: ['USDT'], venues: [] },
  { ticker: 'nTSLA', pair: 'nTSLA-USDT', name: 'Tesla', company: 'Tesla, Inc.', category: 'Equities', status: 'soon', logo: '/otc-uat/issuance-logos/tesla.svg', apy: '--', nav: '--', supply: '--', network: 'Liquid', pairs: ['USDT'], venues: [] },
  { ticker: 'nNSDQ', pair: 'nNSDQ-USDT', name: 'Nasdaq', company: 'Invesco QQQ Trust', category: 'ETFs', status: 'soon', logo: '/otc-uat/issuance-logos/invesco.svg', apy: '--', nav: '--', supply: '--', network: 'Liquid', pairs: ['USDT'], venues: [] },
  { ticker: 'USYLD', pair: 'USYLD-USDT', name: 'U.S. Yield Token', company: 'U.S. Yield Fund', category: 'Fixed Income', status: 'soon', logo: '/otc-uat/issuance-logos/usyld.svg', apy: '--', nav: '--', supply: '--', network: 'Liquid', pairs: ['USDT'], venues: [] },
];

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  USTBL: {
    cnad: 'CNAD: AD-00004',
    tags: ['Fixed Income', 'Elastic Supply'],
    underlying: [
      { label: 'Primary', value: 'iShares 0-1yr US Treasury ETF' },
      { label: 'ISIN', value: 'IE00BGSF1X88' },
      { label: 'Liquidity', value: 'Cash reserves' },
      { label: 'Trading Currencies', value: 'USDT, USDC, USD' },
    ],
    venues: [
      { name: 'Bitfinex \u00b7 USTBL/USDT', url: 'https://trading.bitfinex.com/t/USTBL:UST' },
      { name: 'Bitfinex \u00b7 USTBL/USD', url: 'https://trading.bitfinex.com/t/USTBL:USD' },
      { name: 'Coinstore \u00b7 USTBL/USDT', url: 'https://www.coinstore.com/spot/USTBLUSDT' },
      { name: 'Coinstore \u00b7 BTC/USTBL', url: 'https://www.coinstore.com/spot/BTCUSTBL' },
      { name: 'XT \u00b7 USTBL/USDT', url: 'https://www.xt.com/en/trade/ustbl_usdt' },
    ],
    links: [
      { label: 'ustbl.io', url: 'https://ustbl.io' },
      { label: 'Public Termsheet (RID)', url: 'https://ustbl.io/RID/rid.pdf' },
      { label: 'Latest Audit Report', url: 'https://ustbl.io/docs/Audits.pdf' },
      { label: 'Market Participants', url: 'https://ustbl.io/docs/USTBL%20-%20Market%20Participants%20(AD%20-%20AP)%20v03122025.pdf' },
      { label: 'Particula Rating (A)', url: 'https://ustbl.io/docs/Rating%20Report%20-%20Particula.pdf' },
      { label: 'API Endpoint', url: 'https://api.nexbridge.io/v1/ticker/USTBL' },
    ],
    tradeUrl: 'https://nexbridge.io/en/otc',
    learnUrl: 'https://ustbl.io',
  },
};

export const CHART_API = '/api/nexbridge-finance';
export const RANGE_MAP: Record<string, string> = { '1D': '1d', '1W': '1w', '1M': '1m', '3M': '3m', '1Y': '1y' };

export function getSlug(ticker: string): string {
  const asset = ASSET_REGISTRY.find(a => a.ticker === ticker);
  return asset ? asset.pair.split('-')[0] ?? ticker : ticker;
}

export function formatChartLabel(ts: number, range: string): string {
  const d = new Date(ts * 1000);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  if (range === '1d') {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } else if (range === '1w') {
    return `${months[d.getMonth()]} ${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:00`;
  }
  return `${months[d.getMonth()]} ${d.getDate()}`;
}
