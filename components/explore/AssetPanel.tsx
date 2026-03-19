import type { AssetEntry, PriceData } from "@/lib/data/explore-assets";
import { TAB_TICKERS } from "@/lib/data/explore-assets";

interface AssetPanelProps {
  t: (key: string) => string;
  selectedAsset: AssetEntry;
  selectedTicker: string;
  pricesMap: Record<string, PriceData>;
  registryState: AssetEntry[];
  detailsOpen: boolean;
  setDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectAsset: (ticker: string) => void;
  children: React.ReactNode;
}

export default function AssetPanel({
  t,
  selectedAsset,
  selectedTicker,
  pricesMap,
  registryState,
  detailsOpen,
  setDetailsOpen,
  selectAsset,
  children,
}: AssetPanelProps) {
  const tabAssets = TAB_TICKERS.map((tk) =>
    registryState.find((a) => a.ticker === tk),
  ).filter(Boolean) as AssetEntry[];

  return (
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

          {/* Content (Chart+Swap or Details) rendered as children */}
          {children}
        </div>
      </div>
    </section>
  );
}
