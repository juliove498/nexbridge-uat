"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  type AssetEntry,
  type PriceData,
  type CandlePoint,
  ASSET_REGISTRY,
  PRICES_API,
  USTBL_TICKER_API,
  PRICE_REFRESH_MS,
  CHART_REFRESH_MS,
  RANGE_MAP,
  API_BASE,
} from "@/lib/data/explore-assets";
import { computeChart, fmtNum, cleanInput, type ChartResult } from "@/lib/explore-helpers";

export function useExploreData() {
  const [selectedTicker, setSelectedTicker] = useState("USTBL");
  const [timeframe, setTimeframe] = useState("1D");
  const [pricesMap, setPricesMap] = useState<Record<string, PriceData>>({});
  const [registryState, setRegistryState] = useState<AssetEntry[]>(ASSET_REGISTRY);

  // Chart state
  const [chartData, setChartData] = useState<ChartResult | null>(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState<{ text: string; active: boolean }>({ text: "Live", active: false });

  // Swap state
  const [swapPay, setSwapPay] = useState("");
  const [swapReceive, setSwapReceive] = useState("");
  const [swapReversed, setSwapReversed] = useState(false);
  const [swapLastField, setSwapLastField] = useState<"pay" | "receive">("pay");

  // Details panel
  const [detailsOpen, setDetailsOpen] = useState(false);

  const chartCacheRef = useRef<Record<string, { candles: CandlePoint[]; fetchedAt: number }>>({});
  const abortRef = useRef<AbortController | null>(null);
  const registryRef = useRef<AssetEntry[]>(ASSET_REGISTRY);
  useEffect(() => { registryRef.current = registryState; }, [registryState]);

  const selectedAsset = registryState.find((a) => a.ticker === selectedTicker) || registryState[0];
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
    } catch { /* silent */ }
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
                nav: "$" + nav.toLocaleString("en-US", { maximumFractionDigits: 0 }),
                supply: circulating.toLocaleString("en-US", { maximumFractionDigits: 0 }),
              }
            : a,
        ),
      );
    } catch { /* silent */ }
  }, []);

  /* --- Chart fetching --- */
  const fetchAndDrawChart = useCallback(async (ticker: string, tf: string) => {
    const asset = registryRef.current.find((a) => a.ticker === ticker);
    if (!asset) return;
    const slug = asset.pair.split("-")[0];
    const range = RANGE_MAP[tf];
    if (!range) return;
    const cacheKey = `${slug}:${range}`;

    const cached = chartCacheRef.current[cacheKey];
    if (cached && Date.now() - cached.fetchedAt < 55000) {
      const result = computeChart(cached.candles, range);
      if (result) { setChartData(result); setChartError(null); setChartLoading(false); }
      else setChartError("Not enough data");
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

      chartCacheRef.current[cacheKey] = { candles: pts, fetchedAt: Date.now() };
      const result = computeChart(pts, range);
      if (result) { setChartData(result); setChartError(null); }
      else setChartError("Not enough data");
      setLiveStatus({ text: "Live", active: true });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (cached) {
        const result = computeChart(cached.candles, range);
        if (result) { setChartData(result); setChartError(null); }
        setLiveStatus({ text: "Stale", active: false });
      } else {
        setChartError("No price data available");
        setLiveStatus({ text: "Delayed", active: false });
      }
    } finally {
      setChartLoading(false);
    }
  }, []);

  /* --- Swap calculation --- */
  const calcSwap = useCallback(
    (payVal: string, recVal: string, field: "pay" | "receive", reversed: boolean) => {
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
    return () => { clearInterval(priceInterval); clearInterval(tickerInterval); };
  }, [fetchPrices, fetchUSTBLTicker]);

  useEffect(() => {
    fetchAndDrawChart(selectedTicker, timeframe);
    const interval = setInterval(() => fetchAndDrawChart(selectedTicker, timeframe), CHART_REFRESH_MS);
    return () => clearInterval(interval);
  }, [selectedTicker, timeframe, fetchAndDrawChart]);

  useEffect(() => {
    if (swapPay || swapReceive) {
      const result = calcSwap(swapPay, swapReceive, swapLastField, swapReversed);
      if (swapLastField === "pay" && result.receive !== swapReceive) setSwapReceive(result.receive);
      if (swapLastField === "receive" && result.pay !== swapPay) setSwapPay(result.pay);
    }
  }, [currentPrice]); // eslint-disable-line react-hooks/exhaustive-deps

  /* --- Actions --- */
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

  return {
    // State
    selectedTicker, timeframe, setTimeframe,
    registryState, pricesMap,
    selectedAsset, currentPrice, bid, ask, mid,
    // Chart
    chartData, chartLoading, chartError, liveStatus,
    // Swap
    swapPay, swapReceive, swapReversed,
    // Details
    detailsOpen, setDetailsOpen,
    // Actions
    selectAsset, handleSwapPayInput, handleSwapRecInput, handleSwapFlip,
  };
}
