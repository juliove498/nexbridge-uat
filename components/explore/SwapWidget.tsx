import type { AssetEntry } from "@/lib/data/explore-assets";

interface SwapWidgetProps {
  t: (key: string) => string;
  selectedAsset: AssetEntry;
  selectedTicker: string;
  mid: number;
  swapPay: string;
  swapReceive: string;
  swapReversed: boolean;
  onPayInput: (val: string) => void;
  onRecInput: (val: string) => void;
  onFlip: () => void;
}

export default function SwapWidget({
  t,
  selectedAsset,
  selectedTicker,
  mid,
  swapPay,
  swapReceive,
  swapReversed,
  onPayInput,
  onRecInput,
  onFlip,
}: SwapWidgetProps) {
  const swapRate = mid
    ? !swapReversed
      ? `1 ${selectedTicker} ≈ ${mid >= 100 ? mid.toFixed(2) : mid.toFixed(3)} USDT`
      : `1 USDT ≈ ${(1 / mid).toFixed(6)} ${selectedTicker}`
    : `1 ${selectedTicker} ≈ -- USDT`;

  const hasSwapAmount =
    !!(swapPay && parseFloat(swapPay) > 0) ||
    !!(swapReceive && parseFloat(swapReceive) > 0);

  const tokenBadge = (showToken: boolean) => (
    <div className="flex items-center gap-2 py-1.5 pl-2 pr-3.5 bg-white/6 border border-white/6 rounded-full shrink-0 cursor-default">
      {showToken ? (
        <>
          {selectedAsset.logo ? (
            <img
              src={selectedAsset.logo}
              alt={selectedAsset.ticker}
              className="w-5.5 h-5.5 rounded-full"
            />
          ) : (
            <div className="w-5.5 h-5.5 rounded-full bg-linear-to-br from-[#26A17B] to-[#1d8c6b] flex items-center justify-center text-[10px] font-bold text-white">
              {selectedAsset.ticker.replace("n", "").charAt(0)}
            </div>
          )}
          <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
            {selectedAsset.ticker}
          </span>
        </>
      ) : (
        <>
          <div className="w-5.5 h-5.5 rounded-full bg-linear-to-br from-[#26A17B] to-[#1d8c6b] flex items-center justify-center text-[10px] font-bold text-white">
            $
          </div>
          <span className="text-sm font-semibold text-text-primary whitespace-nowrap">
            USDT
          </span>
        </>
      )}
    </div>
  );

  return (
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

      {/* Pay input */}
      <div className="bg-white/4 border border-white/6 rounded-md p-3.5 transition-colors duration-200 hover:border-white/12 focus-within:border-[rgba(232,100,44,0.35)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-medium text-text-tertiary block">
            {t("swap.youPay")}
          </span>
          <span className="text-[11px] text-text-tertiary">Balance: —</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            placeholder="0"
            inputMode="decimal"
            autoComplete="off"
            className="flex-1 bg-transparent border-none outline-none font-display text-[1.25rem] sm:text-[1.4rem] font-medium text-text-primary min-w-0 placeholder:text-text-tertiary"
            value={swapPay}
            onChange={(e) => onPayInput(e.target.value)}
            disabled={selectedAsset.status !== "live"}
          />
          {tokenBadge(swapReversed)}
        </div>
      </div>

      {/* Flip button */}
      <div className="flex items-center justify-center py-1 relative z-1">
        <div
          className={`w-9 h-9 rounded-full bg-linear-to-br from-orange to-orange-light border-[3px] border-bg-card flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(232,100,44,0.25)] transition-transform duration-200${swapReversed ? " rotate-180 hover:rotate-0" : " hover:rotate-180"}`}
          onClick={onFlip}
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

      {/* Receive input */}
      <div className="bg-white/2 border border-white/6 rounded-md p-3.5 transition-colors duration-200 hover:border-white/12 focus-within:border-[rgba(232,100,44,0.35)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-medium text-text-tertiary block">
            {t("swap.youReceive")}
          </span>
          <span className="text-[11px] text-text-tertiary">Balance: —</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            placeholder="0"
            inputMode="decimal"
            autoComplete="off"
            className="flex-1 bg-transparent border-none outline-none font-display text-[1.25rem] sm:text-[1.4rem] font-medium text-text-primary min-w-0 placeholder:text-text-tertiary"
            value={swapReceive}
            onChange={(e) => onRecInput(e.target.value)}
            disabled={selectedAsset.status !== "live"}
          />
          {tokenBadge(!swapReversed)}
        </div>
      </div>

      {/* Info rows */}
      <div className="py-2.5 pb-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-text-secondary">
          <span className="text-text-tertiary">{t("swap.rate")}</span>
          <span className="font-medium">{swapRate}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-text-secondary">
          <span className="text-text-tertiary">{t("swap.priceImpact")}</span>
          <span style={{ color: "var(--green)" }}>&lt; 0.01%</span>
        </div>
        <div className="flex justify-between items-center text-xs text-text-secondary">
          <span className="text-text-tertiary">{t("chart.network")}</span>
          <span>Liquid Network</span>
        </div>
      </div>

      {/* CTA */}
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
                className="w-4 h-4 ml-1.5"
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
        <span className="flex items-center justify-center gap-2 w-full py-3.5 px-5 bg-white/6 border border-white/6 rounded-md text-text-tertiary font-sans text-sm font-semibold cursor-default mt-auto opacity-50 pointer-events-none">
          {t("markets.comingSoon")}
        </span>
      )}
    </div>
  );
}
