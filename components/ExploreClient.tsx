"use client";

import { useTranslations } from "next-intl";
import { useExploreData } from "@/hooks/useExploreData";
import { fmtPriceLong } from "@/lib/explore-helpers";
import { VENUE_URLS } from "@/lib/data/explore-assets";

import ExploreHero from "@/components/explore/ExploreHero";
import AssetPanel from "@/components/explore/AssetPanel";
import PriceChart from "@/components/explore/PriceChart";
import SwapWidget from "@/components/explore/SwapWidget";
import AssetDetails from "@/components/explore/AssetDetails";
import PipelineSection from "@/components/explore/PipelineSection";
import ExploreCTA from "@/components/explore/ExploreCTA";

export default function ExploreClient() {
  const t = useTranslations("ExplorePage");
  const tFn = (key: string) => t(key as never);

  const {
    selectedTicker,
    timeframe,
    setTimeframe,
    registryState,
    pricesMap,
    selectedAsset,
    currentPrice,
    bid,
    ask,
    mid,
    chartData,
    chartLoading,
    chartError,
    liveStatus,
    swapPay,
    swapReceive,
    swapReversed,
    detailsOpen,
    setDetailsOpen,
    selectAsset,
    handleSwapPayInput,
    handleSwapRecInput,
    handleSwapFlip,
  } = useExploreData();

  const priceDisplay = mid ? fmtPriceLong(mid) : "--";
  const changePct = "--";

  return (
    <>
      <ExploreHero
        t={tFn}
        selectedAsset={selectedAsset}
        registryState={registryState}
      />

      <AssetPanel
        t={tFn}
        selectedAsset={selectedAsset}
        selectedTicker={selectedTicker}
        pricesMap={pricesMap}
        registryState={registryState}
        detailsOpen={detailsOpen}
        setDetailsOpen={setDetailsOpen}
        selectAsset={selectAsset}
      >
        {!detailsOpen ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_380px] gap-4 lg:gap-6 mt-3 mx-2.5 sm:mt-4 sm:mx-3 md:mt-6 md:mx-5 lg:mx-8 relative z-1 items-stretch max-w-full overflow-hidden">
              <PriceChart
                t={tFn}
                selectedAsset={selectedAsset}
                currentPrice={currentPrice}
                bid={bid}
                ask={ask}
                mid={mid}
                chartData={chartData}
                chartLoading={chartLoading}
                chartError={chartError}
                liveStatus={liveStatus}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                changePct={changePct}
              />
              <SwapWidget
                t={tFn}
                selectedAsset={selectedAsset}
                selectedTicker={selectedTicker}
                mid={mid}
                swapPay={swapPay}
                swapReceive={swapReceive}
                swapReversed={swapReversed}
                onPayInput={handleSwapPayInput}
                onRecInput={handleSwapRecInput}
                onFlip={handleSwapFlip}
              />
            </div>

            {/* Footer Row */}
            <div className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:py-4 sm:px-5 sm:pb-5 lg:py-5 lg:px-8 lg:pb-6 relative z-1 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-tertiary mr-1">
                  {tFn("tradingInfo.tradingPairs")}
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
                  {tFn("tradingInfo.venues")}
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
          <AssetDetails
            t={tFn}
            selectedAsset={selectedAsset}
            selectedTicker={selectedTicker}
            mid={mid}
          />
        )}
      </AssetPanel>

      <PipelineSection t={tFn} />
      <ExploreCTA t={tFn} />
    </>
  );
}
