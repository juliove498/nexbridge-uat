import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../components/ui/Spinner';
import { useSettings, useWallets } from '../../hooks/useApi';
import { ASSET_REGISTRY, PRODUCT_DETAILS, CHART_API, RANGE_MAP, getSlug } from './data';
import type { Candle, ChartData } from './data';
import { PriceChart } from './PriceChart';
import { DetailsPanel } from './DetailsPanel';
import { SwapWidget } from './SwapWidget';
import { DepositStepper } from './DepositStepper';

interface DepositFlowData {
  side: 'buy' | 'sell';
  amount: number;
  walletId: string;
  notes?: string;
}

export function CreateRequest() {
  const navigate = useNavigate();
  const { data: settings, isLoading: loadingSettings } = useSettings();
  const { data: wallets, isLoading: loadingWallets } = useWallets();

  const [selectedTicker, setSelectedTicker] = useState('USTBL');
  const [showDetails, setShowDetails] = useState(false);
  const [timeframe, setTimeframe] = useState('1D');
  const [error, setError] = useState('');
  const [depositFlow, setDepositFlow] = useState<DepositFlowData | null>(null);

  // Chart state
  const [chartCandles, setChartCandles] = useState<Candle[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState('');
  const [livePrice, setLivePrice] = useState<{ mid: number; bid: number; ask: number; spreadBps: number; bidSize: string; askSize: string } | null>(null);
  const [tickerData, setTickerData] = useState<{ createPrice: number; redeemPrice: number; circulating: number; nav: number; lastUpdated: string } | null>(null);
  const refreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedAsset = ASSET_REGISTRY.find(a => a.ticker === selectedTicker) ?? ASSET_REGISTRY[0]!;
  const isLive = selectedAsset.status === 'live';
  const detail = PRODUCT_DETAILS[selectedTicker];

  // Fetch chart data from real API
  const fetchChart = useCallback(async (ticker: string, tf: string) => {
    const slug = getSlug(ticker);
    const range = RANGE_MAP[tf];
    if (!range) return;
    const cacheKey = `nexbridge_chart_cache_v1:${slug}:${range}`;

    setChartLoading(true);
    setChartError('');

    try {
      const res = await fetch(`${CHART_API}/prices/${encodeURIComponent(slug)}/history?range=${encodeURIComponent(range)}`, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const pts: Candle[] = json.points || json.candles || [];
      if (pts.length === 0) throw new Error('NO_DATA');

      setChartCandles(pts);
      setChartLoading(false);
      try { localStorage.setItem(cacheKey, JSON.stringify({ candles: pts, fetchedAt: Date.now() })); } catch {}
    } catch {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed: ChartData = JSON.parse(cached);
          if (parsed.candles?.length) { setChartCandles(parsed.candles); setChartLoading(false); return; }
        }
      } catch {}
      setChartError('Live chart temporarily unavailable');
      setChartLoading(false);
    }
  }, []);

  // Fetch live prices (includes bid/ask sizes)
  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(`${CHART_API}/prices`, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) return;
      const json = await res.json();
      const all = json.data ?? json;
      const priceData = all[selectedAsset.pair] || all[selectedAsset.ticker];
      if (priceData) {
        setLivePrice({
          mid: parseFloat(priceData.mid),
          bid: parseFloat(priceData.bid),
          ask: parseFloat(priceData.ask),
          spreadBps: priceData.spread_bps || 0,
          bidSize: priceData.bid_size || '0',
          askSize: priceData.ask_size || '0',
        });
      }
    } catch { /* silent */ }
  }, [selectedAsset]);

  // Fetch ticker fundamentals (NAV, supply, create/redeem prices) from nexbridge.io
  const fetchTicker = useCallback(async (ticker: string) => {
    try {
      const res = await fetch(`https://api.nexbridge.io/v1/ticker/${encodeURIComponent(ticker)}`, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) { setTickerData(null); return; }
      const d = await res.json();
      setTickerData({
        createPrice: d.create_price,
        redeemPrice: d.redeem_price,
        circulating: d.circulating,
        nav: d.nav,
        lastUpdated: d.last_updated,
      });
    } catch { setTickerData(null); }
  }, []);

  useEffect(() => {
    if (isLive) { fetchChart(selectedTicker, timeframe); fetchPrices(); fetchTicker(selectedTicker); }
    else { setChartCandles([]); setLivePrice(null); setTickerData(null); }
  }, [selectedTicker, timeframe, isLive, fetchChart, fetchPrices, fetchTicker]);

  useEffect(() => {
    if (isLive) {
      refreshRef.current = setInterval(() => { fetchChart(selectedTicker, timeframe); fetchPrices(); fetchTicker(selectedTicker); }, 60000);
      return () => { if (refreshRef.current) clearInterval(refreshRef.current); };
    }
  }, [selectedTicker, timeframe, isLive, fetchChart, fetchPrices, fetchTicker]);

  // Derived price values
  const chartVals = chartCandles.map(c => c.p1 ? parseFloat(c.p1) : parseFloat(c.mid || c.close || '0'));
  const currentPrice = livePrice?.mid ?? (chartVals.length > 0 ? chartVals[chartVals.length - 1]! : null);
  const firstPrice = chartVals.length > 0 ? chartVals[0]! : null;
  const priceChange = currentPrice && firstPrice ? ((currentPrice - firstPrice) / firstPrice) * 100 : null;
  const highPrice = chartVals.length > 0 ? Math.max(...chartVals) : null;
  const lowPrice = chartVals.length > 0 ? Math.min(...chartVals) : null;
  const bidPrice = livePrice?.bid ?? (currentPrice ? currentPrice - 0.001 : null);
  const askPrice = livePrice?.ask ?? (currentPrice ? currentPrice + 0.001 : null);
  const spreadPct = livePrice?.spreadBps ? (livePrice.spreadBps / 100).toFixed(2) : (bidPrice && askPrice ? ((askPrice - bidPrice) / askPrice * 100).toFixed(2) : null);

  const decimals = currentPrice ? (currentPrice >= 100 ? 2 : currentPrice >= 1 ? 4 : 6) : 4;
  const priceText = currentPrice ? `$${currentPrice.toFixed(decimals)}` : '--';

  function getTabPrice(ticker: string): string {
    if (ticker === selectedTicker && currentPrice) return `$${currentPrice >= 100 ? currentPrice.toFixed(2) : currentPrice.toFixed(3)}`;
    return '--';
  }

  function handleStartDeposit(data: DepositFlowData) {
    setError('');
    setDepositFlow(data);
  }

  if (loadingSettings || loadingWallets) return <div className="flex justify-center py-20"><Spinner size={32} /></div>;

  return (
    <div className="flex flex-col gap-0">
      <div className="font-mono text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--text-tertiary)] mb-4">Markets</div>

      <div className="bg-secondary border border-[rgba(232,100,44,0.12)] rounded-[var(--radius-xl-compat)] overflow-hidden relative transition-all duration-300 hover:border-[rgba(232,100,44,0.2)] hover:shadow-[0_0_40px_rgba(232,100,44,0.06)]">
        {/* Header */}
        <div className="flex items-center justify-between p-7 pb-0">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden [&_img]:w-6 [&_img]:h-6 [&_img]:object-contain"><img src={selectedAsset.logo} alt={selectedAsset.ticker} /></div>
            <div>
              <h2 className="font-mono text-lg font-bold text-foreground flex items-center gap-2">
                {selectedAsset.ticker}
                {isLive ? <span className="text-[10px] font-semibold py-0.5 px-2 rounded-full bg-[var(--success-bg)] text-[var(--success)]">Live</span> : <span className="text-[10px] font-semibold py-0.5 px-2 rounded-full bg-[var(--warning-bg)] text-[var(--warning)]">Coming Soon</span>}
                <span className="text-[10px] font-semibold py-0.5 px-2 rounded-full bg-secondary text-muted-foreground border border-border">{selectedAsset.category}</span>
              </h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{selectedAsset.company}</p>
            </div>
          </div>
          <div>
            {detail && (
              <button type="button" className={`flex items-center gap-1.5 py-1.5 px-3 rounded-[var(--radius-sm-compat)] bg-transparent border border-border text-muted-foreground text-xs font-medium cursor-pointer transition-all duration-200 hover:border-[var(--border-hover)] hover:text-foreground ${showDetails ? 'bg-accent text-foreground' : ''}`} onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? (
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                ) : (
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                )}
                {showDetails ? 'Trading' : 'Details'}
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-0 border-b border-border mx-8 mt-6">
          {ASSET_REGISTRY.map(a => (
            <div key={a.ticker} className={`flex items-center gap-3 py-3 px-4 cursor-pointer border-b-2 border-transparent transition-all duration-200 hover:bg-secondary ${a.ticker === selectedTicker ? 'border-b-2 border-primary! bg-secondary' : ''}`} onClick={() => { setSelectedTicker(a.ticker); setShowDetails(false); setTimeframe('1D'); }}>
              <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden [&_img]:w-4 [&_img]:h-4"><img src={a.logo} alt={a.ticker} /></div>
              <div className="flex flex-col">
                <div className="font-mono text-xs font-semibold text-foreground flex items-center gap-1.5">
                  {a.ticker}
                  <span className={a.status === 'live' ? 'text-[8px] font-bold py-px px-1.5 rounded-full bg-[var(--success-bg)] text-[var(--success)]' : 'text-[8px] font-bold py-px px-1.5 rounded-full bg-[var(--warning-bg)] text-[var(--warning)]'}>{a.status === 'live' ? 'Live' : 'Soon'}</span>
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)]">{getTabPrice(a.ticker)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Details Panel */}
        {showDetails && detail && (
          <DetailsPanel asset={selectedAsset} detail={detail} priceText={priceText} onTrade={() => setShowDetails(false)} />
        )}

        {/* Chart + Swap */}
        {!showDetails && (
          <>
            <div className="flex gap-0">
              {/* Chart */}
              <div className="flex-1 flex flex-col min-w-0 p-8">
                {/* Asset Info Strip */}
                {isLive && (tickerData || livePrice) && (
                  <div className="flex items-center gap-4 py-2.5 px-4 bg-[rgba(255,255,255,0.02)] rounded-[var(--radius-sm-compat)] border border-border mb-4 overflow-x-auto text-[11px]">
                    {tickerData && (
                      <>
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <span className="text-[9px] uppercase tracking-wider text-[var(--text-tertiary)]">NAV</span>
                          <span className="text-[11px] font-semibold text-foreground">${(tickerData.nav / 1e6).toFixed(2)}M</span>
                        </div>
                        <div className="w-px h-6 bg-border shrink-0" />
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <span className="text-[9px] uppercase tracking-wider text-[var(--text-tertiary)]">Supply</span>
                          <span className="text-[11px] font-semibold text-foreground">{(tickerData.circulating / 1e6).toFixed(2)}M</span>
                        </div>
                        <div className="w-px h-6 bg-border shrink-0" />
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <span className="text-[9px] uppercase tracking-wider text-[var(--text-tertiary)]">Mint</span>
                          <span className="text-[11px] font-semibold text-foreground">${tickerData.createPrice.toFixed(4)}</span>
                        </div>
                        <div className="w-px h-6 bg-border shrink-0" />
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <span className="text-[9px] uppercase tracking-wider text-[var(--text-tertiary)]">Redeem</span>
                          <span className="text-[11px] font-semibold text-foreground">${tickerData.redeemPrice.toFixed(4)}</span>
                        </div>
                        <div className="w-px h-6 bg-border shrink-0" />
                      </>
                    )}
                    {livePrice && (
                      <>
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <span className="text-[9px] uppercase tracking-wider text-[var(--text-tertiary)]">Bid Depth</span>
                          <span className="text-[11px] font-semibold text-foreground text-[var(--success)]">{parseFloat(livePrice.bidSize).toLocaleString()}</span>
                        </div>
                        <div className="w-px h-6 bg-border shrink-0" />
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <span className="text-[9px] uppercase tracking-wider text-[var(--text-tertiary)]">Ask Depth</span>
                          <span className="text-[11px] font-semibold text-foreground text-[var(--error)]">{parseFloat(livePrice.askSize).toLocaleString()}</span>
                        </div>
                        <div className="w-px h-6 bg-border shrink-0" />
                        <div className="flex flex-col gap-0.5 shrink-0">
                          <span className="text-[9px] uppercase tracking-wider text-[var(--text-tertiary)]">Spread</span>
                          <span className="text-[11px] font-semibold text-foreground">{(livePrice.spreadBps / 100).toFixed(2)}%</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto py-1 px-2.5 rounded-full bg-[var(--success-bg)] text-[var(--success)] text-[10px] font-semibold shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                      Instant Settlement
                    </div>
                  </div>
                )}

                <div className="flex items-end justify-between mb-4">
                  <div className="flex items-baseline gap-3">
                    <div className="font-mono text-[28px] font-bold text-foreground">{priceText}</div>
                    {priceChange !== null && (
                      <div className={`text-sm font-semibold ${priceChange >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                      </div>
                    )}
                    {isLive && chartCandles.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--success)] font-semibold ml-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />Live</div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {['1D', '1W', '1M', '3M', '1Y'].map(tf => (
                      <button key={tf} type="button" className={`py-1 px-2.5 rounded-md text-[11px] font-semibold bg-transparent border-none text-[var(--text-tertiary)] cursor-pointer transition-all duration-200 hover:text-foreground hover:bg-secondary ${timeframe === tf ? 'bg-accent text-foreground' : ''}`} onClick={() => setTimeframe(tf)}>{tf}</button>
                    ))}
                  </div>
                </div>

                {chartLoading && <div className="flex items-center justify-center h-[200px]"><Spinner size={24} /></div>}
                {chartError && !chartLoading && <div className="flex items-center justify-center h-[200px] text-[var(--text-tertiary)] text-sm">{chartError}</div>}
                {!chartLoading && !chartError && chartCandles.length > 0 && (
                  <PriceChart candles={chartCandles} range={RANGE_MAP[timeframe] ?? '1m'} />
                )}
                {!chartLoading && !chartError && chartCandles.length === 0 && !isLive && (
                  <div className="flex gap-3 relative"><div className="flex-1 min-w-0"><div className="flex items-center justify-center h-[200px] text-[var(--text-tertiary)] text-sm">Chart available when asset goes live</div></div><div className="flex flex-col justify-between text-[10px] text-[var(--text-tertiary)] font-mono py-3"><span>--</span><span>--</span><span>--</span></div></div>
                )}

                {/* Chart Stats */}
                <div className="flex gap-6 mt-4 pt-4 border-t border-border">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-[var(--text-tertiary)] uppercase">High</span><span className="text-[13px] font-semibold font-mono">{highPrice ? `$${highPrice.toFixed(decimals)}` : '--'}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-[var(--text-tertiary)] uppercase">Low</span><span className="text-[13px] font-semibold font-mono">{lowPrice ? `$${lowPrice.toFixed(decimals)}` : '--'}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-[var(--text-tertiary)] uppercase">Bid</span><span className="text-[13px] font-semibold font-mono text-[var(--success)]">{bidPrice ? `$${bidPrice.toFixed(decimals > 3 ? decimals : 3)}` : '--'}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-[var(--text-tertiary)] uppercase">Ask</span><span className="text-[13px] font-semibold font-mono text-[var(--error)]">{askPrice ? `$${askPrice.toFixed(decimals > 3 ? decimals : 3)}` : '--'}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-[var(--text-tertiary)] uppercase">Spread</span><span className="text-[13px] font-semibold font-mono">{spreadPct ? `${spreadPct}%` : '--'}</span></div>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-[var(--text-tertiary)] uppercase">24h Change</span><span className={`text-[13px] font-semibold font-mono ${priceChange !== null ? (priceChange >= 0 ? 'text-[var(--success)]' : 'text-[var(--error)]') : ''}`}>{priceChange !== null ? `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%` : '--'}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-[var(--text-tertiary)] uppercase">{selectedAsset.category === 'Equities' || selectedAsset.category === 'ETFs' ? 'Market Cap' : 'ATM Yield'}</span><span className={`text-[13px] font-semibold font-mono ${selectedAsset.apy !== '--' ? 'text-[var(--success)]' : ''}`}>{selectedAsset.apy}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-[var(--text-tertiary)] uppercase">NAV</span><span className="text-[13px] font-semibold font-mono">{selectedAsset.nav}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-[var(--text-tertiary)] uppercase">Circulating Supply</span><span className="text-[13px] font-semibold font-mono">{selectedAsset.supply}</span></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] text-[var(--text-tertiary)] uppercase">Network</span><span className="text-[13px] font-semibold font-mono">{selectedAsset.network}</span></div>
                </div>
              </div>

              {/* Swap / Deposit Stepper */}
              {depositFlow ? (
                <DepositStepper
                  asset={selectedAsset}
                  side={depositFlow.side}
                  amount={depositFlow.amount}
                  walletId={depositFlow.walletId}
                  notes={depositFlow.notes}
                  currentPrice={currentPrice}
                  bidPrice={bidPrice}
                  askPrice={askPrice}
                  wallets={wallets}
                  settings={settings}
                  onCancel={() => setDepositFlow(null)}
                  onComplete={(id) => navigate(`/otc-uat/requests/${id}`)}
                />
              ) : (
                <SwapWidget
                  asset={selectedAsset}
                  isLive={isLive}
                  currentPrice={currentPrice}
                  bidPrice={bidPrice}
                  askPrice={askPrice}
                  wallets={wallets}
                  onStartDeposit={handleStartDeposit}
                  error={error}
                />
              )}
            </div>

            <div className="flex items-center gap-8 py-5 px-8 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Trading Pairs</span>
                {selectedAsset.pairs.map(p => <span key={p} className="text-[11px] py-0.5 px-2.5 rounded-full bg-secondary border border-border text-muted-foreground font-medium">{p}</span>)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Venues</span>
                {selectedAsset.venues.length > 0 ? selectedAsset.venues.map(v => (
                  <a key={v.name} href={v.url} target="_blank" rel="noopener noreferrer" className="text-[11px] py-0.5 px-2.5 rounded-full bg-secondary border border-border text-muted-foreground font-medium no-underline hover:border-primary hover:text-primary transition-all duration-200">{v.name}</a>
                )) : <span className="text-[11px] py-0.5 px-2.5 rounded-full bg-secondary border border-border text-muted-foreground font-medium">--</span>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
