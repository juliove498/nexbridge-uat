import type { ChartResult } from "@/lib/explore-helpers";
import { fmtPrice, fmtSpread } from "@/lib/explore-helpers";
import type { AssetEntry, PriceData } from "@/lib/data/explore-assets";

interface PriceChartProps {
  t: (key: string) => string;
  selectedAsset: AssetEntry;
  currentPrice: PriceData | undefined;
  bid: number;
  ask: number;
  mid: number;
  chartData: ChartResult | null;
  chartLoading: boolean;
  chartError: string | null;
  liveStatus: { text: string; active: boolean };
  timeframe: string;
  setTimeframe: (tf: string) => void;
  changePct: string;
}

export default function PriceChart({
  t,
  selectedAsset,
  currentPrice,
  bid,
  ask,
  mid,
  chartData,
  chartLoading,
  chartError,
  liveStatus,
  timeframe,
  setTimeframe,
  changePct,
}: PriceChartProps) {
  const priceDisplay = mid
    ? "$" + (mid >= 100 ? mid.toFixed(2) : mid.toFixed(4))
    : "--";

  return (
    <div className="bg-white/2 border border-white/6 rounded-lg p-3.5 sm:p-4 md:p-5 relative z-1 flex flex-col">
      {/* Price header + timeframe */}
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-[livePulse_2s_ease-in-out_infinite]" />
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

      {/* SVG Chart */}
      <div className="flex h-35 sm:h-40 md:h-50 max-w-full overflow-hidden">
        <div className="relative flex-1 min-w-0 border border-white/6 rounded-md bg-white/1.5 overflow-hidden cursor-crosshair">
          {chartLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-5 bg-[rgba(10,10,12,0.7)] rounded-md">
              <div className="w-7 h-7 border-[3px] border-white/10 border-t-orange rounded-full animate-[chartSpin_0.8s_linear_infinite]" />
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
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8642C" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#E8642C" stopOpacity="0" />
              </linearGradient>
            </defs>
            {chartData && (
              <>
                <line
                  x1="0"
                  y1={chartData.gridY.high}
                  x2="800"
                  y2={chartData.gridY.high}
                  style={{ stroke: "rgba(255,255,255,0.04)", strokeWidth: 1 }}
                />
                <line
                  x1="0"
                  y1={chartData.gridY.mid}
                  x2="800"
                  y2={chartData.gridY.mid}
                  style={{ stroke: "rgba(255,255,255,0.04)", strokeWidth: 1 }}
                />
                <line
                  x1="0"
                  y1={chartData.gridY.low}
                  x2="800"
                  y2={chartData.gridY.low}
                  style={{ stroke: "rgba(255,255,255,0.04)", strokeWidth: 1 }}
                />
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
                    filter: "drop-shadow(0 0 4px rgba(232,100,44,0.4))",
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
            {chartData?.yAxis.high ?? "--"}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-sans tabular-nums text-text-tertiary whitespace-nowrap leading-none">
            {chartData?.yAxis.mid ?? "--"}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-sans tabular-nums text-text-tertiary whitespace-nowrap leading-none">
            {chartData?.yAxis.low ?? "--"}
          </span>
        </div>
      </div>

      {/* X labels */}
      <div className="flex justify-between pt-2 px-1">
        {(chartData?.labels ?? []).map((label, i) => (
          <span
            key={i}
            className="text-[10px] text-text-tertiary tracking-[0.3px]"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex gap-4 sm:gap-6 mt-4 flex-wrap">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-text-tertiary uppercase tracking-[1px] font-medium">
            {t("chart.high")}
          </span>
          <span className="font-display text-sm font-semibold text-text-secondary">
            {chartData?.stats.high ?? "--"}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-text-tertiary uppercase tracking-[1px] font-medium">
            {t("chart.low")}
          </span>
          <span className="font-display text-sm font-semibold text-text-secondary">
            {chartData?.stats.low ?? "--"}
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
              ? fmtSpread(parseFloat(String(currentPrice.spread_bps)))
              : "--"}
          </span>
        </div>
      </div>

      {/* Bottom metrics */}
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
  );
}
