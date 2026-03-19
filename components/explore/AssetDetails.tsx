import type { AssetEntry } from "@/lib/data/explore-assets";
import { fmtPriceLong } from "@/lib/explore-helpers";

interface AssetDetailsProps {
  t: (key: string) => string;
  selectedAsset: AssetEntry;
  selectedTicker: string;
  mid: number;
}

export default function AssetDetails({
  t,
  selectedAsset,
  selectedTicker,
  mid,
}: AssetDetailsProps) {
  const priceDisplay = mid ? fmtPriceLong(mid) : "--";

  return (
    <div className="block p-5 px-4 sm:py-7 sm:px-8 max-[480px]:p-5 max-[480px]:px-4 relative z-1">
      <div className="flex gap-1.5 flex-wrap mb-6">
        <span className="inline-flex items-center gap-1.5 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-[#34D399] text-[11px] font-semibold py-[5px] px-3 rounded-full font-display tracking-[0.5px]">
          <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full animate-[livePulse_2s_ease-in-out_infinite]" />{" "}
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
          {[
            ["Primary", "iShares 0-1yr US Treasury ETF"],
            ["ISIN", "IE00BGSF1X88"],
            ["Liquidity", "Cash reserves"],
            ["Trading Currencies", "USDT, USDC, USD"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center py-2.5 border-b border-white/4 last:border-b-0"
            >
              <span className="text-[13px] text-text-secondary">{label}</span>
              <span className="text-[13px] font-medium text-text-primary">
                {value}
              </span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="font-display text-xs font-bold tracking-[1.5px] uppercase text-text-tertiary mb-3.5">
            Trading Venues
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {[
              {
                label: "Bitfinex · USTBL/USDT",
                url: "https://trading.bitfinex.com/t/USTBL:UST",
              },
              {
                label: "Bitfinex · USTBL/USD",
                url: "https://trading.bitfinex.com/t/USTBL:USD",
              },
              {
                label: "Coinstore · USTBL/USDT",
                url: "https://www.coinstore.com/spot/USTBLUSDT",
              },
              {
                label: "Coinstore · BTC/USTBL",
                url: "https://www.coinstore.com/spot/BTCUSTBL",
              },
              {
                label: "XT · USTBL/USDT",
                url: "https://www.xt.com/en/trade/ustbl_usdt",
              },
            ].map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs py-1.5 px-3.5 rounded-full bg-white/4 border border-white/6 text-text-secondary no-underline transition-all duration-200 hover:border-orange hover:text-orange hover:bg-[rgba(232,100,44,0.08)]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 max-[480px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-7">
        {[
          { icon: "globe", label: "ustbl.io", url: "https://ustbl.io" },
          {
            icon: "doc",
            label: "Public Termsheet (RID)",
            url: "https://ustbl.io/RID/rid.pdf",
          },
          {
            icon: "shield",
            label: "Latest Audit Report",
            url: "https://ustbl.io/docs/Audits.pdf",
          },
          {
            icon: "code",
            label: "API Endpoint",
            url: "https://api.nexbridge.io/v1/ticker/USTBL",
          },
        ].map(({ icon, label, url }) => (
          <a
            key={label}
            href={url}
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
              {icon === "globe" && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
              )}
              {icon === "doc" && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              )}
              {icon === "shield" && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              )}
              {icon === "code" && (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                />
              )}
            </svg>
            {label}
          </a>
        ))}
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
  );
}
