"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@/i18n/navigation";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                 */
/* ------------------------------------------------------------------ */

type AssetEntry = {
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

type PriceData = {
  bid: number;
  ask: number;
  mid: number;
  spread_bps: number;
  stale: boolean;
};

type CandlePoint = {
  ts: number;
  p1?: string;
  mid?: string;
  close?: string;
};

const API_BASE = "/api/nexbridge-finance";
const PRICES_API = `${API_BASE}/prices`;
const USTBL_TICKER_API = "/api/ticker/USTBL";
const PRICE_REFRESH_MS = 10_000;
const CHART_REFRESH_MS = 60_000;

const RANGE_MAP: Record<string, string> = {
  "1D": "1d",
  "1W": "1w",
  "1M": "1m",
  "3M": "3m",
  "1Y": "1y",
};
const TAB_TICKERS = ["USTBL", "nMSTR", "nTSLA", "nNSDQ", "USYLD"];

const ASSET_REGISTRY: AssetEntry[] = [
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

const VENUE_URLS: Record<string, Record<string, string>> = {
  Bitfinex: { USTBL: "https://trading.bitfinex.com/t/USTBL:UST" },
  Coinstore: { USTBL: "https://www.coinstore.com/spot/USTBLUSDT" },
  XT: { USTBL: "https://www.xt.com/en/trade/ustbl_usdt" },
};

const PIPELINE_EQUITIES = [
  {
    ticker: "nMSTR",
    company: "MicroStrategy",
    logo: "/issuance-logos/microstrategy.1530cc8d.svg",
  },
  {
    ticker: "nTSLA",
    company: "Tesla",
    logo: "/issuance-logos/tesla.043c73d1.svg",
  },
  {
    ticker: "nNVDA",
    company: "NVIDIA",
    logo: "/issuance-logos/nvidia.df7eed26.svg",
  },
  {
    ticker: "nAAPL",
    company: "Apple",
    logo: "/issuance-logos/apple.3ad88a52.svg",
  },
  {
    ticker: "nMSFT",
    company: "Microsoft",
    logo: "/issuance-logos/microsoft.2dff5972.svg",
  },
  {
    ticker: "nAMZN",
    company: "Amazon",
    logo: "/issuance-logos/amazon.2c56f1bd.svg",
  },
  {
    ticker: "nGOOG",
    company: "Alphabet",
    logo: "/issuance-logos/alphabet.d14fd52f.svg",
  },
  {
    ticker: "nMETA",
    company: "Meta Platforms",
    logo: "/issuance-logos/meta.0f668911.svg",
  },
  {
    ticker: "nNFLX",
    company: "Netflix",
    logo: "/issuance-logos/netflix.cf67946d.svg",
  },
  {
    ticker: "nADBE",
    company: "Adobe",
    logo: "/issuance-logos/adobe.b80aff1d.svg",
  },
  { ticker: "nAMD", company: "AMD", logo: "/issuance-logos/amd.1c6f2b7b.svg" },
  {
    ticker: "nCRM",
    company: "Salesforce",
    logo: "/issuance-logos/salesforce.fc98a73e.svg",
  },
  { ticker: "nV", company: "Visa", logo: "/issuance-logos/visa.ce9e2802.svg" },
  {
    ticker: "nMA",
    company: "Mastercard",
    logo: "/issuance-logos/mastercard.da611feb.svg",
  },
  {
    ticker: "nBRK",
    company: "Berkshire Hathaway",
    logo: "/issuance-logos/berkshire-hathaway.1b72b181.svg",
  },
  {
    ticker: "nJNJ",
    company: "Johnson & Johnson",
    logo: "/issuance-logos/johnson-johnson.d80d4d02.svg",
  },
  {
    ticker: "nPG",
    company: "Procter & Gamble",
    logo: "/issuance-logos/proctor-gamble.a46dd365.svg",
  },
  {
    ticker: "nXOM",
    company: "ExxonMobil",
    logo: "/issuance-logos/exxon-mobile.d1f47e81.svg",
  },
  {
    ticker: "nHD",
    company: "Home Depot",
    logo: "/issuance-logos/home-deput.5e1ae305.svg",
  },
  {
    ticker: "nWMT",
    company: "Walmart",
    logo: "/issuance-logos/walmart.87408de8.svg",
  },
];

const PIPELINE_INDEXES = [
  {
    ticker: "nNSDQ",
    company: "Invesco QQQ Trust",
    logo: "/issuance-logos/invesco.cb5db553.svg",
  },
  { ticker: "nSPY", company: "S&P 500 ETF", logo: null },
  { ticker: "nDJI", company: "Dow Jones Industrial", logo: null },
];

/* ------------------------------------------------------------------ */
/*  Helper functions                                                  */
/* ------------------------------------------------------------------ */

function fmtPrice(n: number) {
  return "$" + (n >= 100 ? n.toFixed(2) : n.toFixed(3));
}
function fmtPriceLong(n: number) {
  return "$" + (n >= 100 ? n.toFixed(2) : n.toFixed(4));
}
function fmtSpread(bps: number) {
  return (bps / 100).toFixed(2) + "%";
}
function fmtNum(n: number, d: number) {
  if (isNaN(n) || n === 0) return "";
  const parts = n.toFixed(d).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
function cleanInput(v: string) {
  let c = v.replace(/[^0-9.]/g, "");
  const p = c.split(".");
  if (p.length > 2) c = p[0] + "." + p.slice(1).join("");
  return c;
}

function formatLabel(ts: number, range: string) {
  const d = new Date(ts * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (range === "1d") {
    return (
      (d.getHours() < 10 ? "0" : "") +
      d.getHours() +
      ":" +
      (d.getMinutes() < 10 ? "0" : "") +
      d.getMinutes()
    );
  } else if (range === "1w") {
    return (
      months[d.getMonth()] +
      " " +
      d.getDate() +
      " " +
      (d.getHours() < 10 ? "0" : "") +
      d.getHours() +
      ":00"
    );
  }
  return months[d.getMonth()] + " " + d.getDate();
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */

export default function ExploreClient() {
  const t = useTranslations("ExplorePage");

  const [selectedTicker, setSelectedTicker] = useState("USTBL");
  const [timeframe, setTimeframe] = useState("1D");
  const [pricesMap, setPricesMap] = useState<Record<string, PriceData>>({});
  const [registryState, setRegistryState] =
    useState<AssetEntry[]>(ASSET_REGISTRY);

  // Chart state
  const [chartData, setChartData] = useState<{
    line: string;
    area: string;
    dotX: number;
    dotY: number;
  } | null>(null);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartYAxis, setChartYAxis] = useState({
    high: "--",
    mid: "--",
    low: "--",
  });
  const [chartGridY, setChartGridY] = useState({
    high: 30,
    mid: 100,
    low: 170,
  });
  const [chartStats, setChartStats] = useState({ high: "--", low: "--" });
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<{
    text: string;
    active: boolean;
  }>({ text: "Live", active: false });

  // Swap state (inline)
  const [swapPay, setSwapPay] = useState("");
  const [swapReceive, setSwapReceive] = useState("");
  const [swapReversed, setSwapReversed] = useState(false);
  const [swapLastField, setSwapLastField] = useState<"pay" | "receive">("pay");

  // Details panel
  const [detailsOpen, setDetailsOpen] = useState(false);

  const chartCacheRef = useRef<
    Record<string, { candles: CandlePoint[]; fetchedAt: number }>
  >({});
  const abortRef = useRef<AbortController | null>(null);
  const registryRef = useRef<AssetEntry[]>(ASSET_REGISTRY);
  useEffect(() => {
    registryRef.current = registryState;
  }, [registryState]);

  const selectedAsset =
    registryState.find((a) => a.ticker === selectedTicker) || registryState[0];
  const currentPrice = pricesMap[selectedAsset.pair];

  const bid = currentPrice ? parseFloat(String(currentPrice.bid)) : 0;
  const ask = currentPrice ? parseFloat(String(currentPrice.ask)) : 0;
  const mid = currentPrice ? parseFloat(String(currentPrice.mid)) : 0;

  /* --- Price fetching --- */
  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(PRICES_API);
      if (!res.ok) return;
      const json = await res.json();
      const allPrices = json.data || json;
      const mapped: Record<string, PriceData> = {};
      registryRef.current.forEach((asset) => {
        const slug = asset.pair.split("-")[0];
        if (allPrices[slug]) mapped[asset.pair] = allPrices[slug];
      });
      setPricesMap(mapped);
    } catch {
      /* silent */
    }
  }, []);

  const fetchUSTBLTicker = useCallback(async () => {
    try {
      const res = await fetch(USTBL_TICKER_API);
      if (!res.ok) return;
      const data = await res.json();
      const circulating = parseFloat(data.circulating);
      const nav = parseFloat(data.nav);
      setRegistryState((prev) =>
        prev.map((a) =>
          a.ticker === "USTBL"
            ? {
                ...a,
                nav:
                  "$" +
                  nav.toLocaleString("en-US", { maximumFractionDigits: 0 }),
                supply: circulating.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                }),
              }
            : a,
        ),
      );
    } catch {
      /* silent */
    }
  }, []);

  /* --- Chart fetching & rendering --- */
  const fetchAndDrawChart = useCallback(async (ticker: string, tf: string) => {
    const asset = registryRef.current.find((a) => a.ticker === ticker);
    if (!asset) return;
    const slug = asset.pair.split("-")[0];
    const range = RANGE_MAP[tf];
    if (!range) return;
    const cacheKey = `${slug}:${range}`;

    const cached = chartCacheRef.current[cacheKey];
    if (cached && Date.now() - cached.fetchedAt < 55000) {
      drawChart(cached.candles, range);
      setLiveStatus({ text: "Live", active: true });
      return;
    }

    setChartLoading(true);
    setChartError(null);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const url = `${API_BASE}/prices/${encodeURIComponent(slug)}/history?range=${encodeURIComponent(range)}`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const pts: CandlePoint[] = json.points || json.candles || [];
      if (!pts.length) throw new Error("NO_DATA");

      chartCacheRef.current[cacheKey] = {
        candles: pts,
        fetchedAt: Date.now(),
      };
      drawChart(pts, range);
      setLiveStatus({ text: "Live", active: true });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (cached) {
        drawChart(cached.candles, range);
        setLiveStatus({ text: "Stale", active: false });
      } else {
        setChartError("No price data available");
        setLiveStatus({ text: "Delayed", active: false });
      }
    } finally {
      setChartLoading(false);
    }
  }, []);

  function drawChart(candles: CandlePoint[], range: string) {
    let p1vals = candles.map((c) =>
      c.p1 ? parseFloat(c.p1) : parseFloat(c.mid || c.close || "0"),
    );
    let timestamps = candles.map((c) => c.ts);

    if (p1vals.length < 2) {
      setChartError("Not enough data");
      return;
    }

    const maxPts: Record<string, number> = {
      "1d": 60,
      "1w": 80,
      "1m": 90,
      "3m": 120,
      "1y": 150,
    };
    const target = maxPts[range] || 120;
    if (p1vals.length > target) {
      const step = (p1vals.length - 1) / (target - 1);
      const nv: number[] = [],
        nt: number[] = [];
      for (let i = 0; i < target; i++) {
        const idx = Math.min(Math.round(i * step), p1vals.length - 1);
        nv.push(p1vals[idx]);
        nt.push(timestamps[idx]);
      }
      p1vals = nv;
      timestamps = nt;
    }

    const smoothW: Record<string, number> = {
      "1d": 3,
      "1w": 3,
      "1m": 2,
      "3m": 2,
    };
    const sw = smoothW[range] || 0;
    if (sw > 1 && p1vals.length > sw * 2) {
      const smoothed = p1vals.map((_, i) => {
        const s = Math.max(0, i - Math.floor(sw / 2));
        const e = Math.min(p1vals.length - 1, i + Math.floor(sw / 2));
        let sum = 0;
        for (let j = s; j <= e; j++) sum += p1vals[j];
        return sum / (e - s + 1);
      });
      smoothed[0] = p1vals[0];
      smoothed[smoothed.length - 1] = p1vals[p1vals.length - 1];
      p1vals = smoothed;
    }

    const W = 800,
      H = 200;
    const pad = { top: 12, bottom: 12, left: 4, right: 8 };

    let dataMin = Math.min(...p1vals),
      dataMax = Math.max(...p1vals);
    let dataRange = dataMax - dataMin;
    if (dataRange === 0) dataRange = dataMax * 0.001 || 0.001;

    const minSpread = dataMax * 0.002;
    if (dataRange < minSpread) {
      const midVal = (dataMax + dataMin) / 2;
      const m = minSpread / 2;
      dataMin = midVal - m;
      dataMax = midVal + m;
      dataRange = dataMax - dataMin;
    }

    const margin = dataRange * 0.15;
    const p1min = dataMin - margin,
      p1max = dataMax + margin;
    const p1range = p1max - p1min || 0.0001;

    const points = p1vals.map((price, i) => ({
      x: pad.left + (i / (p1vals.length - 1)) * (W - pad.left - pad.right),
      y: pad.top + (1 - (price - p1min) / p1range) * (H - pad.top - pad.bottom),
    }));

    const linePath = points
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
      )
      .join(" ");
    const last = points[points.length - 1];
    const areaPath = `${linePath} L${last.x.toFixed(1)},${H} L${points[0].x.toFixed(1)},${H} Z`;

    setChartData({
      line: linePath,
      area: areaPath,
      dotX: last.x,
      dotY: last.y,
    });

    // Y-axis labels
    let yDec = 2;
    let tF = Math.pow(10, yDec);
    let tH = Math.ceil(dataMax * tF) / tF;
    let tL = Math.floor(dataMin * tF) / tF;
    while (tH - tL < 2 / tF && yDec < 4) {
      yDec++;
      tF = Math.pow(10, yDec);
      tH = Math.ceil(dataMax * tF) / tF;
      tL = Math.floor(dataMin * tF) / tF;
    }
    const f = Math.pow(10, yDec);
    const nH = Math.ceil(dataMax * f) / f;
    const nL = Math.floor(dataMin * f) / f;
    const nM = Math.round(((nH + nL) / 2) * f) / f;

    setChartYAxis({
      high: "$" + nH.toFixed(yDec),
      mid: "$" + nM.toFixed(yDec),
      low: "$" + nL.toFixed(yDec),
    });

    const chartH = H - pad.top - pad.bottom;
    const priceToY = (price: number) =>
      pad.top + (1 - (price - p1min) / p1range) * chartH;
    setChartGridY({ high: priceToY(nH), mid: priceToY(nM), low: priceToY(nL) });

    // Stats
    const dec = p1vals[p1vals.length - 1] >= 100 ? 2 : 4;
    setChartStats({
      high: "$" + Math.max(...p1vals).toFixed(dec),
      low: "$" + Math.min(...p1vals).toFixed(dec),
    });

    // X labels
    const labelCount = 5;
    const labelStep = Math.max(
      1,
      Math.floor(timestamps.length / (labelCount - 1)),
    );
    const labels: string[] = [];
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.min(i * labelStep, timestamps.length - 1);
      labels.push(formatLabel(timestamps[idx], range));
    }
    setChartLabels(labels);

    setChartLoading(false);
    setChartError(null);
  }

  /* --- Swap calculation --- */
  const calcSwap = useCallback(
    (
      payVal: string,
      recVal: string,
      field: "pay" | "receive",
      reversed: boolean,
    ) => {
      const bidP = currentPrice?.bid ?? 1.044;
      const askP = currentPrice?.ask ?? 1.046;
      if (field === "pay") {
        const pv = parseFloat(payVal);
        if (isNaN(pv) || pv === 0) return { pay: payVal, receive: "" };
        const result = !reversed ? pv / askP : pv * bidP;
        return { pay: payVal, receive: fmtNum(result, 6) };
      } else {
        const rv = parseFloat(recVal);
        if (isNaN(rv) || rv === 0) return { pay: "", receive: recVal };
        const result = !reversed ? rv * askP : rv / bidP;
        return { pay: fmtNum(result, 6), receive: recVal };
      }
    },
    [currentPrice],
  );

  /* --- Effects --- */
  useEffect(() => {
    fetchPrices();
    fetchUSTBLTicker();
    const priceInterval = setInterval(fetchPrices, PRICE_REFRESH_MS);
    const tickerInterval = setInterval(fetchUSTBLTicker, 60000);
    return () => {
      clearInterval(priceInterval);
      clearInterval(tickerInterval);
    };
  }, [fetchPrices, fetchUSTBLTicker]);

  useEffect(() => {
    fetchAndDrawChart(selectedTicker, timeframe);
    const interval = setInterval(
      () => fetchAndDrawChart(selectedTicker, timeframe),
      CHART_REFRESH_MS,
    );
    return () => clearInterval(interval);
  }, [selectedTicker, timeframe, fetchAndDrawChart]);

  useEffect(() => {
    if (swapPay || swapReceive) {
      const result = calcSwap(
        swapPay,
        swapReceive,
        swapLastField,
        swapReversed,
      );
      if (swapLastField === "pay" && result.receive !== swapReceive)
        setSwapReceive(result.receive);
      if (swapLastField === "receive" && result.pay !== swapPay)
        setSwapPay(result.pay);
    }
  }, [currentPrice]); // eslint-disable-line react-hooks/exhaustive-deps

  function selectAsset(ticker: string) {
    setSelectedTicker(ticker);
    setTimeframe("1D");
    setDetailsOpen(false);
    setSwapPay("");
    setSwapReceive("");
    setSwapReversed(false);
  }

  function handleSwapPayInput(val: string) {
    const cleaned = cleanInput(val);
    setSwapPay(cleaned);
    setSwapLastField("pay");
    const result = calcSwap(cleaned, swapReceive, "pay", swapReversed);
    setSwapReceive(result.receive);
  }

  function handleSwapRecInput(val: string) {
    const cleaned = cleanInput(val);
    setSwapReceive(cleaned);
    setSwapLastField("receive");
    const result = calcSwap(swapPay, cleaned, "receive", swapReversed);
    setSwapPay(result.pay);
  }

  function handleSwapFlip() {
    setSwapReversed((r) => !r);
    setSwapPay(swapReceive);
    setSwapReceive(swapPay);
  }

  const swapRate = mid
    ? !swapReversed
      ? `1 ${selectedTicker} ≈ ${mid >= 100 ? mid.toFixed(2) : mid.toFixed(3)} USDT`
      : `1 USDT ≈ ${(1 / mid).toFixed(6)} ${selectedTicker}`
    : `1 ${selectedTicker} ≈ -- USDT`;

  const hasSwapAmount =
    !!(swapPay && parseFloat(swapPay) > 0) ||
    !!(swapReceive && parseFloat(swapReceive) > 0);

  const priceDisplay = mid ? fmtPriceLong(mid) : "--";
  const changePct = "--";

  const tabAssets = TAB_TICKERS.map((t2) =>
    registryState.find((a) => a.ticker === t2),
  ).filter(Boolean) as AssetEntry[];

  return (
    <>
      {/* HERO */}
      <section className="pt-30 pb-9 md:pt-32.5 md:pb-12 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none bg-size-[60px_60px]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          }}
        />
        <div className="container">
          <div className="relative z-2 reveal">
            <div className="flex flex-col items-start gap-3 mb-6 flex-wrap md:flex-row md:items-center md:justify-between">
              <div className="flex gap-2.5 flex-wrap">
                <div className="inline-flex items-center gap-2 py-2 px-4 bg-white/3 border border-white/6 rounded-full text-[13px] text-text-secondary">
                  {t("hero.totalNav")}{" "}
                  <span className="font-display font-bold text-text-primary">
                    {selectedAsset.ticker === "USTBL"
                      ? registryState.find((a) => a.ticker === "USTBL")?.nav ||
                        "$31.9M"
                      : "$31.9M"}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 py-2 px-4 bg-white/3 border border-white/6 rounded-full text-[13px] text-text-secondary">
                  {t("hero.assets")}{" "}
                  <span className="font-display font-bold text-text-primary">
                    24+
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 py-2 px-4 bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)] rounded-full text-[13px] font-medium text-[#10B981]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-[livePulse_2s_ease-in-out_infinite]"></span>
                {t("hero.updatedLive")}
              </div>
            </div>
            <h1 className="font-display text-[1.4rem] sm:text-[clamp(1.6rem,3.5vw,2.2rem)] font-extrabold leading-[1.2] mb-2.5 tracking-[-0.02em]">
              {t("hero.heading")}
            </h1>
            <p className="text-[0.9rem] sm:text-[0.95rem] text-text-secondary max-w-150 leading-[1.65]">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* ACTIVE ASSET */}
      <section className="pt-12">
        <div className="container">
          <div className="font-display text-[10px] font-bold tracking-[2.5px] uppercase text-text-tertiary mb-4 reveal">
            {t("markets.label")}
          </div>
          <div className="bg-white/2 border border-[rgba(232,100,44,0.12)] rounded-xl overflow-hidden relative transition-all duration-300 hover:border-[rgba(232,100,44,0.2)] hover:shadow-[0_0_40px_rgba(232,100,44,0.06)] reveal">
            <div
              className="absolute -inset-px rounded-xl pointer-events-none"
              style={{
                padding: 1,
                background:
                  "linear-gradient(135deg, rgba(232,100,44,0.2), transparent 50%, rgba(232,100,44,0.08))",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[rgba(232,100,44,0.04)] blur-[60px] pointer-events-none" />
            {/* Header */}
            <div className="flex items-center justify-between pt-5 px-4 sm:pt-6 sm:px-5 lg:pt-7 lg:px-8 relative z-1 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-[14px] bg-white/4 border border-white/8 flex items-center justify-center overflow-hidden">
                  {selectedAsset.logo ? (
                    <img
                      src={selectedAsset.logo}
                      alt={selectedAsset.ticker}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div
                      style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--orange)",
                      }}
                    >
                      {selectedAsset.ticker.replace("n", "").charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="font-display text-[1.35rem] font-bold flex items-center gap-2.5">
                    {selectedAsset.ticker}{" "}
                    <span
                      className={
                        selectedAsset.status === "live"
                          ? "text-[10px] font-bold py-[3px] px-2.5 rounded-full bg-[rgba(16,185,129,0.12)] text-[#10B981] uppercase tracking-[0.5px]"
                          : "static text-[10px] font-bold py-[3px] px-2.5 rounded-full bg-[rgba(251,191,36,0.1)] text-[#FBBF24] uppercase tracking-[0.5px]"
                      }
                    >
                      {selectedAsset.status === "live"
                        ? t("markets.live")
                        : t("markets.comingSoon")}
                    </span>{" "}
                    <span className="text-[11px] font-medium py-[3px] px-2.5 rounded-full bg-white/4 text-text-tertiary border border-white/6">
                      {selectedAsset.category === "Fixed Income"
                        ? t("markets.fixedIncome")
                        : selectedAsset.category === "Equities"
                          ? t("markets.equities")
                          : t("markets.etfs")}
                    </span>
                  </h2>
                  <p className="text-[13px] text-text-secondary mt-0.5">
                    {selectedAsset.company}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap md:flex-nowrap">
                {selectedAsset.status === "live" ? (
                  <a
                    href="https://nexbridge.io/en/otc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-3 px-7 bg-linear-to-br from-orange to-orange-light text-white no-underline rounded-full font-semibold text-sm transition-all duration-300 border-none cursor-pointer shadow-[0_0_20px_rgba(232,100,44,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,100,44,0.3)]"
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                    {t("markets.trade")}
                  </a>
                ) : (
                  <span
                    className="inline-flex items-center gap-2 py-3 px-7 bg-linear-to-br from-orange to-orange-light text-white rounded-full font-semibold text-sm shadow-[0_0_20px_rgba(232,100,44,0.15)]"
                    style={{ opacity: 0.5, pointerEvents: "none" }}
                  >
                    {t("markets.comingSoon")}
                  </span>
                )}
                <button
                  className={`inline-flex items-center gap-2 py-3 px-5.5 rounded-full font-semibold text-sm transition-all duration-300 border cursor-pointer${detailsOpen ? " border-[rgba(232,100,44,0.5)] bg-[rgba(232,100,44,0.1)] text-orange" : " bg-transparent text-text-secondary border-white/6 hover:text-text-primary hover:border-[rgba(232,100,44,0.4)] hover:bg-[rgba(232,100,44,0.06)] hover:-translate-y-0.5"}`}
                  onClick={() => setDetailsOpen((o) => !o)}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  {t("markets.details")}
                </button>
              </div>
            </div>

            {/* Tab Bar */}
            <div className="flex gap-1 sm:gap-2 px-4 md:px-5 lg:px-8 mt-5 mb-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative z-1">
              {tabAssets.map((asset) => {
                const pd = pricesMap[asset.pair];
                const midVal = pd?.mid ? parseFloat(String(pd.mid)) : null;
                const priceText =
                  midVal !== null
                    ? "$" +
                      (midVal >= 100 ? midVal.toFixed(2) : midVal.toFixed(3))
                    : "--";
                return (
                  <div
                    key={asset.ticker}
                    className={`flex items-center gap-2 sm:gap-2.5 py-2 px-2.5 sm:py-2.5 sm:px-4 border border-b-2 rounded-t-md cursor-pointer transition-all duration-250 shrink-0 min-w-0${asset.ticker === selectedTicker ? " bg-[rgba(232,100,44,0.06)] border-[rgba(232,100,44,0.15)] border-b-orange" : " bg-white/2 border-white/6 border-b-transparent hover:bg-white/4 hover:border-white/12 hover:border-b-transparent"}`}
                    onClick={() => selectAsset(asset.ticker)}
                  >
                    {asset.logo ? (
                      <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-[7px] bg-white/4 border border-white/8 flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={asset.logo}
                          alt={asset.ticker}
                          className="w-full h-full object-contain p-[3px]"
                        />
                      </div>
                    ) : (
                      <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-[7px] bg-linear-to-br from-[rgba(232,100,44,0.15)] to-[rgba(232,100,44,0.05)] border border-[rgba(232,100,44,0.2)] flex items-center justify-center font-display text-[11px] font-bold text-orange shrink-0">
                        {asset.ticker.replace("n", "").charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col gap-px min-w-0">
                      <div className="font-display text-xs font-bold text-text-primary flex items-center gap-2 whitespace-nowrap">
                        {asset.ticker}{" "}
                        <span
                          className={`text-[8px] font-bold py-px px-[5px] rounded-full uppercase tracking-[0.3px] shrink-0 ${asset.status === "live" ? "bg-[rgba(16,185,129,0.12)] text-[#34D399]" : "bg-white/6 text-text-tertiary"}`}
                        >
                          {asset.status === "live"
                            ? t("markets.live")
                            : t("markets.soon")}
                        </span>
                      </div>
                      <div className="font-display text-[11px] font-medium text-text-tertiary whitespace-nowrap">
                        {priceText}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart + Swap or Details */}
            {!detailsOpen ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_380px] gap-4 lg:gap-6 mt-3 mx-2.5 sm:mt-4 sm:mx-3 md:mt-6 md:mx-5 lg:mx-8 relative z-1 items-stretch max-w-full overflow-hidden">
                  {/* Chart */}
                  <div className="bg-white/2 border border-white/6 rounded-lg p-3.5 sm:p-4 md:p-5 relative z-1 flex flex-col">
                    <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between mb-4">
                      <div className="flex items-baseline gap-3">
                        <div className="font-display text-2xl sm:text-[2rem] font-bold text-text-primary">
                          {priceDisplay}
                        </div>
                        <div className="text-sm font-semibold py-[3px] px-2.5 rounded-full">
                          {changePct}
                        </div>
                        <div
                          className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#10B981] py-[3px] px-2.5 rounded-full bg-[rgba(52,211,153,0.1)] transition-opacity duration-[400ms]${liveStatus.active ? " opacity-100" : " opacity-0"}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-[livePulse_2s_ease-in-out_infinite]"></span>
                          {liveStatus.text}
                        </div>
                      </div>
                      <div className="flex gap-1 bg-white/3 border border-white/6 rounded-full p-[3px]">
                        {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
                          <button
                            key={tf}
                            className={`text-[11px] font-semibold py-[5px] px-3.5 rounded-full border-none bg-transparent cursor-pointer transition-all duration-200 font-sans hover:text-text-secondary${timeframe === tf ? " bg-white/8 text-text-primary" : " text-text-tertiary"}`}
                            onClick={() => setTimeframe(tf)}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex h-35 sm:h-40 md:h-50 max-w-full overflow-hidden">
                      <div className="relative flex-1 min-w-0 border border-white/6 rounded-md bg-white/1.5 overflow-hidden cursor-crosshair">
                        {chartLoading && (
                          <div className="absolute inset-0 flex items-center justify-center z-5 bg-[rgba(10,10,12,0.7)] rounded-md">
                            <div className="w-7 h-7 border-[3px] border-white/10 border-t-orange rounded-full animate-[chartSpin_0.8s_linear_infinite]"></div>
                          </div>
                        )}
                        {chartError && (
                          <div className="absolute inset-0 flex items-center justify-center z-5 bg-[rgba(10,10,12,0.7)] rounded-md">
                            <div className="text-[13px] text-text-tertiary text-center leading-normal">
                              {chartError}
                            </div>
                          </div>
                        )}
                        <svg
                          viewBox="0 0 800 200"
                          preserveAspectRatio="none"
                          className="w-full h-full block"
                        >
                          <defs>
                            <linearGradient
                              id="chartGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#E8642C"
                                stopOpacity="0.3"
                              />
                              <stop
                                offset="100%"
                                stopColor="#E8642C"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>
                          <line
                            x1="0"
                            y1={chartGridY.high}
                            x2="800"
                            y2={chartGridY.high}
                            style={{
                              stroke: "rgba(255,255,255,0.04)",
                              strokeWidth: 1,
                            }}
                          />
                          <line
                            x1="0"
                            y1={chartGridY.mid}
                            x2="800"
                            y2={chartGridY.mid}
                            style={{
                              stroke: "rgba(255,255,255,0.04)",
                              strokeWidth: 1,
                            }}
                          />
                          <line
                            x1="0"
                            y1={chartGridY.low}
                            x2="800"
                            y2={chartGridY.low}
                            style={{
                              stroke: "rgba(255,255,255,0.04)",
                              strokeWidth: 1,
                            }}
                          />
                          {chartData && (
                            <>
                              <path
                                className="opacity-30"
                                d={chartData.area}
                                style={{ fill: "url(#chartGradient)" }}
                              />
                              <path
                                d={chartData.line}
                                style={{
                                  fill: "none",
                                  stroke: "#E8642C",
                                  strokeWidth: 2.5,
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                }}
                              />
                              <circle
                                cx={chartData.dotX}
                                cy={chartData.dotY}
                                r="3.5"
                                style={{
                                  fill: "#E8642C",
                                  filter:
                                    "drop-shadow(0 0 4px rgba(232,100,44,0.4))",
                                  stroke: "rgba(232,100,44,0.3)",
                                  strokeWidth: 2,
                                }}
                              />
                            </>
                          )}
                        </svg>
                      </div>
                      <div className="flex flex-col justify-between w-11 sm:w-12 md:w-14 shrink-0 py-1.5 pl-1 sm:pl-1.5 md:pl-2">
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-sans tabular-nums text-text-tertiary whitespace-nowrap leading-none">
                          {chartYAxis.high}
                        </span>
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-sans tabular-nums text-text-tertiary whitespace-nowrap leading-none">
                          {chartYAxis.mid}
                        </span>
                        <span className="text-[9px] sm:text-[10px] md:text-[11px] font-sans tabular-nums text-text-tertiary whitespace-nowrap leading-none">
                          {chartYAxis.low}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2 px-1">
                      {chartLabels.map((label, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-text-tertiary tracking-[0.3px]"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 sm:gap-6 mt-4 flex-wrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-[1px] font-medium">
                          {t("chart.high")}
                        </span>
                        <span className="font-display text-sm font-semibold text-text-secondary">
                          {chartStats.high}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-[1px] font-medium">
                          {t("chart.low")}
                        </span>
                        <span className="font-display text-sm font-semibold text-text-secondary">
                          {chartStats.low}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-[1px] font-medium">
                          {t("chart.bid")}
                        </span>
                        <span
                          className="font-display text-sm font-semibold"
                          style={{ color: "var(--green)" }}
                        >
                          {bid ? fmtPrice(bid) : "--"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-[1px] font-medium">
                          {t("chart.ask")}
                        </span>
                        <span
                          className="font-display text-sm font-semibold"
                          style={{ color: "#FBBF24" }}
                        >
                          {ask ? fmtPrice(ask) : "--"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-[1px] font-medium">
                          {t("chart.spread")}
                        </span>
                        <span className="font-display text-sm font-semibold text-text-secondary">
                          {currentPrice
                            ? fmtSpread(
                                parseFloat(String(currentPrice.spread_bps)),
                              )
                            : "--"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap mt-4 pt-4 border-t border-white/6 gap-3 md:gap-0 lg:flex-nowrap">
                      <div className="flex flex-col gap-1 w-[calc(50%-6px)] sm:w-[calc(33%-8px)] p-0 lg:flex-1 lg:w-auto lg:min-w-0 lg:px-3 lg:border-r lg:border-white/6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-[0.8px] font-medium whitespace-nowrap">
                          {t("chart.change24h")}
                        </span>
                        <span className="font-display text-sm font-semibold text-text-primary">
                          {changePct}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 w-[calc(50%-6px)] sm:w-[calc(33%-8px)] p-0 lg:flex-1 lg:w-auto lg:min-w-0 lg:px-3 lg:border-r lg:border-white/6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-[0.8px] font-medium whitespace-nowrap">
                          {selectedAsset.category === "Equities" ||
                          selectedAsset.category === "ETFs"
                            ? "Market Cap"
                            : t("chart.atmYield")}
                        </span>
                        <span
                          className={`font-display text-sm font-semibold${selectedAsset.apy !== "--" ? " text-[#10B981]" : " text-text-primary"}`}
                        >
                          {selectedAsset.apy}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 w-[calc(50%-6px)] sm:w-[calc(33%-8px)] p-0 lg:flex-1 lg:w-auto lg:min-w-0 lg:px-3 lg:border-r lg:border-white/6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-[0.8px] font-medium whitespace-nowrap">
                          {t("chart.nav")}
                        </span>
                        <span className="font-display text-sm font-semibold text-text-primary">
                          {selectedAsset.nav}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 w-[calc(50%-6px)] sm:w-[calc(33%-8px)] p-0 lg:flex-1 lg:w-auto lg:min-w-0 lg:px-3 lg:border-r lg:border-white/6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-[0.8px] font-medium whitespace-nowrap">
                          {t("chart.circulatingSupply")}
                        </span>
                        <span className="font-display text-sm font-semibold text-text-primary">
                          {selectedAsset.supply}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 w-[calc(50%-6px)] sm:w-[calc(33%-8px)] p-0 lg:flex-1 lg:w-auto lg:min-w-0 lg:px-3 lg:border-r lg:border-white/6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-[0.8px] font-medium whitespace-nowrap">
                          {t("chart.network")}
                        </span>
                        <span className="font-display text-sm font-semibold text-text-primary">
                          {selectedAsset.network}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Inline Swap Widget */}
                  <div className="bg-white/2 border border-white/6 rounded-lg p-5 relative flex flex-col min-w-0 max-w-full overflow-hidden md:overflow-visible">
                    <div
                      className="absolute -inset-px rounded-lg pointer-events-none"
                      style={{
                        padding: 1,
                        background:
                          "linear-gradient(135deg, rgba(232,100,44,0.12), transparent 60%, rgba(232,100,44,0.06))",
                        WebkitMask:
                          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                    />
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="font-display text-base font-semibold text-text-primary">
                        {t("swap.title")}
                      </div>
                      <div className="text-[10px] font-semibold py-[3px] px-2.5 rounded-full bg-orange-subtle text-orange uppercase tracking-[0.5px]">
                        OTC
                      </div>
                    </div>
                    <div className="bg-white/4 border border-white/6 rounded-md p-3.5 transition-colors duration-200 hover:border-white/12 focus-within:border-[rgba(232,100,44,0.35)]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-medium text-text-tertiary block">
                          {t("swap.youPay")}
                        </span>
                        <span className="text-[11px] text-text-tertiary">
                          Balance: —
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          placeholder="0"
                          inputMode="decimal"
                          autoComplete="off"
                          className="flex-1 bg-transparent border-none outline-none font-display text-[1.25rem] sm:text-[1.4rem] font-medium text-text-primary min-w-0 placeholder:text-text-tertiary"
                          value={swapPay}
                          onChange={(e) => handleSwapPayInput(e.target.value)}
                          disabled={selectedAsset.status !== "live"}
                        />
                        <div className="flex items-center gap-2 py-1.5 pl-2 pr-3.5 bg-white/6 border border-white/6 rounded-full shrink-0 cursor-default">
                          {!swapReversed ? (
                            <>
                              <div className="w-5.5 h-5.5 rounded-full bg-linear-to-br from-[#26A17B] to-[#1d8c6b] flex items-center justify-center text-[10px] font-bold text-white">
                                $
                              </div>
                              <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
                                USDT
                              </span>
                            </>
                          ) : (
                            <>
                              {selectedAsset.logo ? (
                                <img
                                  src={selectedAsset.logo}
                                  alt={selectedAsset.ticker}
                                  style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: "50%",
                                  }}
                                />
                              ) : (
                                <div className="w-5.5 h-5.5 rounded-full bg-linear-to-br from-[#26A17B] to-[#1d8c6b] flex items-center justify-center text-[10px] font-bold text-white">
                                  {selectedAsset.ticker
                                    .replace("n", "")
                                    .charAt(0)}
                                </div>
                              )}
                              <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
                                {selectedAsset.ticker}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center py-1 relative z-1">
                      <div
                        className={`w-9 h-9 rounded-full bg-linear-to-br from-orange to-orange-light border-[3px] border-bg-card flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(232,100,44,0.25)] transition-transform duration-200${swapReversed ? " rotate-180 hover:rotate-0" : " hover:rotate-180"}`}
                        onClick={handleSwapFlip}
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          className="w-4 h-4 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="bg-white/2 border border-white/6 rounded-md p-3.5 transition-colors duration-200 hover:border-white/12 focus-within:border-[rgba(232,100,44,0.35)]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-medium text-text-tertiary block">
                          {t("swap.youReceive")}
                        </span>
                        <span className="text-[11px] text-text-tertiary">
                          Balance: —
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          placeholder="0"
                          inputMode="decimal"
                          autoComplete="off"
                          className="flex-1 bg-transparent border-none outline-none font-display text-[1.25rem] sm:text-[1.4rem] font-medium text-text-primary min-w-0 placeholder:text-text-tertiary"
                          value={swapReceive}
                          onChange={(e) => handleSwapRecInput(e.target.value)}
                          disabled={selectedAsset.status !== "live"}
                        />
                        <div className="flex items-center gap-2 py-1.5 pl-2 pr-3.5 bg-white/6 border border-white/6 rounded-full shrink-0 cursor-default">
                          {swapReversed ? (
                            <>
                              <div className="w-5.5 h-5.5 rounded-full bg-linear-to-br from-[#26A17B] to-[#1d8c6b] flex items-center justify-center text-[10px] font-bold text-white">
                                $
                              </div>
                              <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
                                USDT
                              </span>
                            </>
                          ) : (
                            <>
                              {selectedAsset.logo ? (
                                <img
                                  src={selectedAsset.logo}
                                  alt={selectedAsset.ticker}
                                  style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: "50%",
                                  }}
                                />
                              ) : (
                                <div className="w-5.5 h-5.5 rounded-full bg-linear-to-br from-[#26A17B] to-[#1d8c6b] flex items-center justify-center text-[10px] font-bold text-white">
                                  {selectedAsset.ticker
                                    .replace("n", "")
                                    .charAt(0)}
                                </div>
                              )}
                              <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
                                {selectedAsset.ticker}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="py-2.5 pb-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs text-text-secondary">
                        <span className="text-text-tertiary">
                          {t("swap.rate")}
                        </span>
                        <span className="font-medium">{swapRate}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-text-secondary">
                        <span className="text-text-tertiary">
                          {t("swap.priceImpact")}
                        </span>
                        <span style={{ color: "var(--green)" }}>
                          &lt; 0.01%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-text-secondary">
                        <span className="text-text-tertiary">
                          {t("chart.network")}
                        </span>
                        <span>Liquid Network</span>
                      </div>
                    </div>
                    {selectedAsset.status === "live" ? (
                      <a
                        href="https://nexbridge.io/en/otc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-md font-sans text-sm font-semibold no-underline transition-all duration-250 mt-auto${hasSwapAmount ? " bg-linear-to-br from-orange to-orange-light border-none text-white cursor-pointer shadow-[0_4px_20px_rgba(232,100,44,0.25)] hover:shadow-[0_4px_28px_rgba(232,100,44,0.4)] hover:-translate-y-px" : " bg-white/6 border border-white/6 text-text-tertiary cursor-default"}`}
                      >
                        {hasSwapAmount ? (
                          <>
                            {t("swap.tradeOnOtc")}{" "}
                            <svg
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              style={{
                                width: 16,
                                height: 16,
                                marginLeft: 6,
                                verticalAlign: "middle",
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                              />
                            </svg>
                          </>
                        ) : (
                          t("swap.enterAmount")
                        )}
                      </a>
                    ) : (
                      <span
                        className="flex items-center justify-center gap-2 w-full py-3.5 px-5 bg-white/6 border border-white/6 rounded-md text-text-tertiary font-sans text-sm font-semibold cursor-default mt-auto"
                        style={{ opacity: 0.5, pointerEvents: "none" }}
                      >
                        {t("markets.comingSoon")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Row */}
                <div className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:py-4 sm:px-5 sm:pb-5 lg:py-5 lg:px-8 lg:pb-6 relative z-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-tertiary mr-1">
                      {t("tradingInfo.tradingPairs")}
                    </span>
                    {selectedAsset.pairs.map((p) => (
                      <span
                        key={p}
                        className="text-[11px] font-semibold py-1 px-2.5 rounded-full bg-orange-subtle border border-[rgba(232,100,44,0.12)] text-orange"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-text-tertiary mr-1">
                      {t("tradingInfo.venues")}
                    </span>
                    {selectedAsset.venues.map((v) => {
                      const url = VENUE_URLS[v]?.[selectedTicker];
                      return url ? (
                        <a
                          key={v}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold py-1 px-3 rounded-full bg-white/4 border border-white/6 text-text-secondary no-underline transition-all duration-200 hover:border-orange hover:text-orange hover:bg-[rgba(232,100,44,0.08)]"
                        >
                          {v}
                        </a>
                      ) : (
                        <span
                          key={v}
                          className="text-[11px] font-semibold py-1 px-3 rounded-full bg-white/4 border border-white/6 text-text-secondary"
                        >
                          {v}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="block p-5 px-4 sm:py-7 sm:px-8 max-[480px]:p-5 max-[480px]:px-4 relative z-1">
                <div className="flex gap-1.5 flex-wrap mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-[#34D399] text-[11px] font-semibold py-[5px] px-3 rounded-full font-display tracking-[0.5px]">
                    <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full animate-[livePulse_2s_ease-in-out_infinite]"></span>{" "}
                    {t("markets.live")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/4 border border-white/6 text-text-tertiary text-[11px] font-semibold py-[5px] px-3 rounded-full font-display tracking-[0.5px]">
                    CNAD: AD-00004
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/4 border border-white/6 text-text-tertiary text-[11px] font-semibold py-[5px] px-3 rounded-full font-display tracking-[0.5px]">
                    {t("markets.fixedIncome")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/4 border border-white/6 text-text-tertiary text-[11px] font-semibold py-[5px] px-3 rounded-full font-display tracking-[0.5px]">
                    Elastic Supply
                  </span>
                </div>
                <div className="grid grid-cols-1 max-[480px]:grid-cols-1 sm:grid-cols-3 gap-px bg-white/6 rounded-md overflow-hidden mb-7">
                  <div className="bg-bg-dark py-4.5 px-4 text-center">
                    <div className="text-[11px] text-text-tertiary uppercase tracking-[1px] mb-1.5">
                      {t("chart.lastPrice")}
                    </div>
                    <div
                      className="font-display text-[1.1rem] font-bold text-text-primary"
                      style={{ color: "#34D399" }}
                    >
                      {priceDisplay}
                    </div>
                  </div>
                  <div className="bg-bg-dark py-4.5 px-4 text-center">
                    <div className="text-[11px] text-text-tertiary uppercase tracking-[1px] mb-1.5">
                      {t("chart.circulatingSupply")}
                    </div>
                    <div className="font-display text-[1.1rem] font-bold text-text-primary">
                      {selectedAsset.supply}
                    </div>
                  </div>
                  <div className="bg-bg-dark py-4.5 px-4 text-center">
                    <div className="text-[11px] text-text-tertiary uppercase tracking-[1px] mb-1.5">
                      {t("chart.nav")}
                    </div>
                    <div className="font-display text-[1.1rem] font-bold text-text-primary">
                      {selectedAsset.nav}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 mb-7">
                  <div>
                    <h4 className="font-display text-xs font-bold tracking-[1.5px] uppercase text-text-tertiary mb-3.5">
                      Underlying Asset
                    </h4>
                    <div className="flex justify-between items-center py-2.5 border-b border-white/4 last:border-b-0">
                      <span className="text-[13px] text-text-secondary">
                        Primary
                      </span>
                      <span className="text-[13px] font-medium text-text-primary">
                        iShares 0-1yr US Treasury ETF
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-white/4 last:border-b-0">
                      <span className="text-[13px] text-text-secondary">
                        ISIN
                      </span>
                      <span className="text-[13px] font-medium text-text-primary">
                        IE00BGSF1X88
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-white/4 last:border-b-0">
                      <span className="text-[13px] text-text-secondary">
                        Liquidity
                      </span>
                      <span className="text-[13px] font-medium text-text-primary">
                        Cash reserves
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-white/4 last:border-b-0">
                      <span className="text-[13px] text-text-secondary">
                        Trading Currencies
                      </span>
                      <span className="text-[13px] font-medium text-text-primary">
                        USDT, USDC, USD
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-display text-xs font-bold tracking-[1.5px] uppercase text-text-tertiary mb-3.5">
                      Trading Venues
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      <a
                        href="https://trading.bitfinex.com/t/USTBL:UST"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs py-1.5 px-3.5 rounded-full bg-white/4 border border-white/6 text-text-secondary no-underline transition-all duration-200 hover:border-orange hover:text-orange hover:bg-[rgba(232,100,44,0.08)]"
                      >
                        Bitfinex · USTBL/USDT
                      </a>
                      <a
                        href="https://trading.bitfinex.com/t/USTBL:USD"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs py-1.5 px-3.5 rounded-full bg-white/4 border border-white/6 text-text-secondary no-underline transition-all duration-200 hover:border-orange hover:text-orange hover:bg-[rgba(232,100,44,0.08)]"
                      >
                        Bitfinex · USTBL/USD
                      </a>
                      <a
                        href="https://www.coinstore.com/spot/USTBLUSDT"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs py-1.5 px-3.5 rounded-full bg-white/4 border border-white/6 text-text-secondary no-underline transition-all duration-200 hover:border-orange hover:text-orange hover:bg-[rgba(232,100,44,0.08)]"
                      >
                        Coinstore · USTBL/USDT
                      </a>
                      <a
                        href="https://www.coinstore.com/spot/BTCUSTBL"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs py-1.5 px-3.5 rounded-full bg-white/4 border border-white/6 text-text-secondary no-underline transition-all duration-200 hover:border-orange hover:text-orange hover:bg-[rgba(232,100,44,0.08)]"
                      >
                        Coinstore · BTC/USTBL
                      </a>
                      <a
                        href="https://www.xt.com/en/trade/ustbl_usdt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs py-1.5 px-3.5 rounded-full bg-white/4 border border-white/6 text-text-secondary no-underline transition-all duration-200 hover:border-orange hover:text-orange hover:bg-[rgba(232,100,44,0.08)]"
                      >
                        XT · USTBL/USDT
                      </a>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 max-[480px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-7">
                  <a
                    href="https://ustbl.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-3 px-3.5 bg-white/2 border border-white/6 rounded-md text-text-secondary no-underline text-xs font-medium transition-all duration-200 hover:bg-[rgba(232,100,44,0.06)] hover:border-[rgba(232,100,44,0.3)] hover:text-orange"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="w-4 h-4 shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                      />
                    </svg>{" "}
                    ustbl.io
                  </a>
                  <a
                    href="https://ustbl.io/RID/rid.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-3 px-3.5 bg-white/2 border border-white/6 rounded-md text-text-secondary no-underline text-xs font-medium transition-all duration-200 hover:bg-[rgba(232,100,44,0.06)] hover:border-[rgba(232,100,44,0.3)] hover:text-orange"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="w-4 h-4 shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>{" "}
                    Public Termsheet (RID)
                  </a>
                  <a
                    href="https://ustbl.io/docs/Audits.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-3 px-3.5 bg-white/2 border border-white/6 rounded-md text-text-secondary no-underline text-xs font-medium transition-all duration-200 hover:bg-[rgba(232,100,44,0.06)] hover:border-[rgba(232,100,44,0.3)] hover:text-orange"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="w-4 h-4 shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>{" "}
                    Latest Audit Report
                  </a>
                  <a
                    href="https://api.nexbridge.io/v1/ticker/USTBL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-3 px-3.5 bg-white/2 border border-white/6 rounded-md text-text-secondary no-underline text-xs font-medium transition-all duration-200 hover:bg-[rgba(232,100,44,0.06)] hover:border-[rgba(232,100,44,0.3)] hover:text-orange"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      className="w-4 h-4 shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                      />
                    </svg>{" "}
                    API Endpoint
                  </a>
                </div>
                <div className="flex gap-2.5 max-[480px]:flex-col">
                  <a
                    href="https://nexbridge.io/en/otc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3.5 px-6 rounded-full font-semibold text-sm no-underline transition-all duration-300 bg-linear-to-br from-orange to-orange-light text-white hover:shadow-[0_8px_24px_rgba(232,100,44,0.3)]"
                  >
                    Trade {selectedTicker} →
                  </a>
                  <a
                    href="https://ustbl.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3.5 px-6 rounded-full font-semibold text-sm no-underline transition-all duration-300 bg-transparent border border-white/6 text-text-secondary hover:border-[rgba(232,100,44,0.4)] hover:text-text-primary"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SWAP WIDGET (standalone - hidden) */}
      <section className="hidden">
        <div className="container">
          <div className="max-w-120 mx-auto">
            <div className="font-display text-[10px] font-bold tracking-[2.5px] uppercase text-text-tertiary mb-4 reveal">
              {t("quickTrade.label")}
            </div>
            <div className="bg-white/2 border border-white/6 rounded-lg p-6 sm:p-5 sm:px-4 relative reveal">
              <div
                className="absolute -inset-px rounded-lg pointer-events-none"
                style={{
                  padding: 1,
                  background:
                    "linear-gradient(135deg, rgba(232,100,44,0.12), transparent 60%, rgba(232,100,44,0.06))",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
              <div className="flex items-center justify-between mb-5">
                <div className="font-display text-base font-semibold text-text-primary">
                  {t("swap.title")}
                </div>
                <div className="text-[10px] font-semibold py-[3px] px-2.5 rounded-full bg-orange-subtle text-orange uppercase tracking-[0.5px]">
                  OTC
                </div>
              </div>
              <div className="bg-white/3 border border-white/6 rounded-md p-4 transition-colors duration-200 hover:border-white/12">
                <span className="text-xs font-medium text-text-tertiary mb-2.5 block">
                  {t("swap.youPay")}
                </span>
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="0.00"
                    inputMode="decimal"
                    className="flex-1 bg-transparent border-none outline-none font-display text-[1.25rem] sm:text-2xl font-semibold text-text-primary min-w-0 placeholder:text-text-tertiary"
                  />
                  <div className="flex items-center gap-2 py-1.5 pl-2 pr-3.5 bg-white/6 border border-white/6 rounded-full shrink-0 cursor-default">
                    <div className="w-5.5 h-5.5 rounded-full bg-linear-to-br from-[#26A17B] to-[#1d8c6b] flex items-center justify-center text-[10px] font-bold text-white">
                      $
                    </div>
                    <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
                      USDT
                    </span>
                  </div>
                </div>
                <div className="text-xs text-text-tertiary mt-2.5">
                  Balance: --
                </div>
              </div>
              <div className="flex items-center justify-center py-1 relative z-1">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange to-orange-light border-[3px] border-bg-card flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(232,100,44,0.25)] transition-transform duration-200 hover:rotate-180">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    className="w-4 h-4 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-white/3 border border-white/6 rounded-md p-4 transition-colors duration-200 hover:border-white/12">
                <span className="text-xs font-medium text-text-tertiary mb-2.5 block">
                  {t("swap.youReceive")}
                </span>
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="0.00"
                    inputMode="decimal"
                    className="flex-1 bg-transparent border-none outline-none font-display text-[1.25rem] sm:text-2xl font-semibold text-text-primary min-w-0 placeholder:text-text-tertiary"
                  />
                  <div className="flex items-center gap-2 py-1.5 pl-2 pr-3.5 bg-white/6 border border-white/6 rounded-full shrink-0 cursor-default">
                    <img
                      src="/issuance-logos/ustbl.svg"
                      alt="USTBL"
                      className="w-5.5 h-5.5 rounded-full"
                    />
                    <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
                      USTBL
                    </span>
                  </div>
                </div>
                <div className="text-xs text-text-tertiary mt-2.5">
                  Balance: --
                </div>
              </div>
              <div className="flex items-center justify-between py-3 pb-4 text-xs text-text-tertiary">
                <span>{t("swap.rate")}</span>
                <span className="text-text-secondary font-medium">
                  {mid
                    ? `1 USTBL = ${mid.toFixed(3)} USDT`
                    : "1 USTBL = -- USDT"}
                </span>
              </div>
              <a
                href="https://nexbridge.io/en/otc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-white/6 border border-white/6 rounded-md text-text-tertiary font-sans text-[15px] font-semibold no-underline cursor-default transition-all duration-250"
              >
                {t("swap.tradeOnOtc")}
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  className="w-4 h-4 transition-transform duration-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <section className="pt-14">
        <div className="container">
          <div className="font-display text-[10px] font-bold tracking-[2.5px] uppercase text-text-tertiary mb-4 reveal">
            {t("pipeline.label")}
          </div>
          <div className="flex flex-col gap-8">
            <div className="reveal">
              <div className="font-display text-xs font-bold tracking-[2px] uppercase text-text-tertiary mb-3 flex items-center gap-2 before:content-[''] before:w-4 before:h-px before:bg-text-tertiary">
                {t("pipeline.equities")}
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(110px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 sm:gap-2.5">
                {PIPELINE_EQUITIES.map((item) => (
                  <div
                    key={item.ticker}
                    className="flex flex-col items-center gap-2 py-4 px-2.5 rounded-md bg-white/1.5 border border-white/4 transition-all duration-250 text-center hover:bg-white/4 hover:border-white/12 hover:-translate-y-0.5"
                  >
                    <div className="w-9 h-9 rounded-[9px] bg-white/4 border border-white/6 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.logo}
                        alt={item.company}
                        className="w-full h-full object-contain p-[5px]"
                      />
                    </div>
                    <div className="font-display text-xs font-bold text-text-primary">
                      {item.ticker}
                    </div>
                    <div className="text-[10px] text-text-tertiary leading-[1.3]">
                      {item.company}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal">
              <div className="font-display text-xs font-bold tracking-[2px] uppercase text-text-tertiary mb-3 flex items-center gap-2 before:content-[''] before:w-4 before:h-px before:bg-text-tertiary">
                {t("pipeline.indexes")}
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(110px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 sm:gap-2.5">
                {PIPELINE_INDEXES.map((item) => (
                  <div
                    key={item.ticker}
                    className="flex flex-col items-center gap-2 py-4 px-2.5 rounded-md bg-white/1.5 border border-white/4 transition-all duration-250 text-center hover:bg-white/4 hover:border-white/12 hover:-translate-y-0.5"
                  >
                    <div
                      className="w-9 h-9 rounded-[9px] bg-white/4 border border-white/6 flex items-center justify-center overflow-hidden"
                      style={
                        !item.logo
                          ? {
                              background: "rgba(232,100,44,0.06)",
                              borderColor: "rgba(232,100,44,0.12)",
                            }
                          : undefined
                      }
                    >
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt={item.company}
                          className="w-full h-full object-contain p-[5px]"
                        />
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          style={{ color: "var(--orange)" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="font-display text-xs font-bold text-text-primary">
                      {item.ticker}
                    </div>
                    <div className="text-[10px] text-text-tertiary leading-[1.3]">
                      {item.company}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal">
              <div className="font-display text-xs font-bold tracking-[2px] uppercase text-text-tertiary mb-3 flex items-center gap-2 before:content-[''] before:w-4 before:h-px before:bg-text-tertiary">
                {t("pipeline.aaSeries")}
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(110px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 sm:gap-2.5">
                <div className="flex flex-col items-center gap-2 py-4 px-2.5 rounded-md bg-white/1.5 border border-white/4 transition-all duration-250 text-center hover:bg-white/4 hover:border-white/12 hover:-translate-y-0.5">
                  <div className="w-9 h-9 rounded-[9px] bg-white/4 border border-white/6 flex items-center justify-center overflow-hidden">
                    <img
                      src="/issuance-logos/usyld.svg"
                      alt="USYLD"
                      className="w-full h-full object-contain p-[5px]"
                    />
                  </div>
                  <div className="font-display text-xs font-bold text-text-primary">
                    USYLD
                  </div>
                  <div className="text-[10px] text-text-tertiary leading-[1.3]">
                    U.S. Yield Token
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-16 pb-25">
        <div className="container">
          <div
            className="border border-white/6 rounded-xl py-14 px-12 sm:py-9 sm:px-6 text-center relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-orange before:to-transparent reveal"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,100,44,0.1), transparent), linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.5) 40%, rgba(5,5,5,0.6) 100%), url(/cta-bg.jpg) center 60%/cover no-repeat",
            }}
          >
            <h2 className="font-display text-[1.6rem] font-bold mb-2.5 relative z-1">
              {t("cta.title")}
            </h2>
            <p className="text-text-secondary text-[0.95rem] max-w-130 mx-auto mb-8 leading-[1.65] relative z-1">
              {t("cta.desc")}
            </p>
            <div className="flex gap-3 justify-center flex-wrap relative z-1">
              <a
                href="https://nexbridge.io/en/otc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-linear-to-br min-w-60 from-orange to-orange-light text-white no-underline rounded-full font-semibold text-[0.95rem] transition-all duration-300 border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,100,44,0.25)]"
              >
                {t("cta.ctaPrimary")}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-white/4 border min-w-60 border-white/6 text-text-primary no-underline rounded-full font-semibold text-[0.95rem] transition-all duration-300 hover:bg-white/8 hover:border-white/12"
              >
                {t("cta.ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
