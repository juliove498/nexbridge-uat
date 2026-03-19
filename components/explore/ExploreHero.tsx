import type { AssetEntry } from "@/lib/data/explore-assets";

interface ExploreHeroProps {
  t: (key: string) => string;
  selectedAsset: AssetEntry;
  registryState: AssetEntry[];
}

export default function ExploreHero({
  t,
  selectedAsset,
  registryState,
}: ExploreHeroProps) {
  return (
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
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-[livePulse_2s_ease-in-out_infinite]" />
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
  );
}
