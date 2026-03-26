"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HomeEffects, UstblNavValue } from "@/components/home/HomeInteractive";

const richText = {
  gradient: (chunks: React.ReactNode) => (
    <span className="gradient-text">{chunks}</span>
  ),
  br: () => <br />,
};

export default function HeroSection() {
  const t = useTranslations("HomePage");

  return (
    <>
      <HomeEffects />
      <section
        className="hero min-h-screen md:h-screen md:min-h-212 flex items-center relative pt-18 overflow-hidden"
        style={{
          background:
            "linear-gradient(to right, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.88) 30%, rgba(5,5,5,0.65) 60%, rgba(5,5,5,0.45) 100%), url('/hero-bg.jpg') center/cover no-repeat",
        }}
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="hero-mesh-blob" />
          <div className="hero-mesh-blob" />
          <div className="hero-mesh-blob" />
        </div>
        <div className="hero-grid" />
        <div className="container relative flex items-center justify-between w-full -top-22 sm:top-0">
          <div className="relative z-2 max-w-200">
            {/* Mobile: plain text line, no pill */}
            <div
              className="md:hidden flex items-start gap-2.5 text-[12px] font-medium text-orange-light mb-6 opacity-0 -translate-x-[30px] leading-[1.5] pl-4"
              style={{
                animation:
                  "heroBadgeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards",
              }}
            >
              <span
                className="mt-[5px] shrink-0 w-1.5 h-1.5 bg-gray-600  sm:bg-orange rounded-full shadow-[0_0_10px_rgba(232,100,44,0.4)]"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              />
              <span className="text-text-tertiary">{t("hero.badge")}</span>
            </div>
            {/* Desktop: pill badge */}
            <div
              className="hidden md:inline-flex items-center gap-2 bg-[rgba(232,100,44,0.06)] border border-[rgba(232,100,44,0.15)] rounded-full py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-orange-light mb-8 opacity-0 -translate-x-[30px] backdrop-blur-md"
              style={{
                animation:
                  "heroBadgeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards",
              }}
            >
              <span
                className="w-2 h-2 bg-orange rounded-full shadow-[0_0_12px_rgba(232,100,44,0.3)]"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              />
              {t("hero.badge")}
            </div>
            <h1
              className="font-display text-[clamp(2.4rem,8vw,3.5rem)] md:text-[clamp(3.2rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.04em] mb-7 opacity-0 translate-y-[30px]"
              style={{
                animation:
                  "heroContentIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards",
              }}
            >
              {t.rich("hero.title", richText)}
            </h1>
            <p
              className="text-[1.2rem] text-text-secondary leading-[1.7] max-w-130 mb-12 opacity-0 translate-y-5"
              style={{
                animation:
                  "heroContentIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards",
              }}
            >
              {t("hero.subtitle")}
            </p>
            <div
              className="flex flex-col md:flex-row gap-4 flex-wrap opacity-0 translate-y-5"
              style={{
                animation:
                  "heroContentIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards",
              }}
            >
              <Link
                href="/explore"
                className="group inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-[15px] font-semibold no-underline transition-all duration-300 cursor-pointer border-none w-full md:w-auto bg-linear-to-br from-orange to-orange-light text-white shadow-[0_0_0_0_rgba(232,100,44,0.3),0_4px_20px_rgba(232,100,44,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(232,100,44,0.3),0_8px_32px_rgba(232,100,44,0.4)]"
              >
                {t("hero.ctaPrimary")}
                <span className="transition-transform duration-300 group-hover:translate-x-[3px]">
                  →
                </span>
              </Link>
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-[15px] font-semibold no-underline transition-all duration-300 cursor-pointer w-full md:w-auto bg-white/4 text-text-primary border border-white/6 backdrop-blur-md hover:bg-white/8 hover:border-white/12 hover:-translate-y-0.5"
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>
          </div>
          <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-4 z-2">
            <div
              className="hero-stat-card bg-white/3 backdrop-blur-[20px] border border-white/6 rounded-lg p-6 min-w-55 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden opacity-0 translate-x-10 hover:border-[rgba(232,100,44,0.3)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(232,100,44,0.08)]"
              style={{
                animation:
                  "heroStatIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards",
              }}
            >
              <div className="font-display text-[2rem] font-bold mb-1 gradient-text">
                <UstblNavValue />
              </div>
              <div className="text-[13px] text-text-tertiary font-medium">
                {t("hero.stats.navLabel")}
              </div>
            </div>
            <div
              className="hero-stat-card bg-white/3 backdrop-blur-[20px] border border-white/6 rounded-lg p-6 min-w-55 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden opacity-0 translate-x-10 hover:border-[rgba(232,100,44,0.3)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(232,100,44,0.08)]"
              style={{
                animation:
                  "heroStatIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.65s forwards",
              }}
            >
              <div className="font-display text-[2rem] font-bold mb-1">28</div>
              <div className="text-[13px] text-text-tertiary font-medium">
                {t("hero.stats.pipelineLabel")}
              </div>
            </div>
            <div
              className="hero-stat-card bg-white/3 backdrop-blur-[20px] border border-white/6 rounded-lg p-6 min-w-55 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden opacity-0 translate-x-10 hover:border-[rgba(232,100,44,0.3)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(232,100,44,0.08)]"
              style={{
                animation:
                  "heroStatIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards",
              }}
            >
              <div className="font-display text-[2rem] font-bold mb-1">
                ~4.3%
              </div>
              <div className="text-[13px] text-text-tertiary font-medium">
                {t("hero.stats.yieldLabel")}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
