import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/sections/SectionHeader";

const richText = {
  gradient: (chunks: ReactNode) => (
    <span className="gradient-text">{chunks}</span>
  ),
  br: () => <br />,
};

interface PlatformsSectionProps {
  t: (key: string) => string;
  tRich: (key: string, values: Record<string, unknown>) => ReactNode;
}

export default function PlatformsSection({ t, tRich }: PlatformsSectionProps) {
  return (
    <section
      className="section relative overflow-hidden bg-bg-dark"
      id="platforms"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 20% 50%, rgba(232,100,44,0.05), transparent), radial-gradient(ellipse 40% 40% at 80% 30%, rgba(244,132,95,0.04), transparent)",
        }}
      />
      <div className="container">
        <SectionHeader
          label={t("platforms.label")}
          title={tRich("platforms.title", richText)}
          subtitle={t("platforms.subtitle")}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-16 reveal">
          {/* OTC — Featured (full width) */}
          <Link
            href="/explore"
            className="eco-card eco-card--featured group relative bg-[linear-gradient(135deg,rgba(232,100,44,0.04),rgba(white,0.02))] border border-white/6 rounded-xl py-12 px-10 no-underline text-text-primary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col lg:flex-row items-center gap-12 min-h-70 col-span-full hover:border-[rgba(232,100,44,0.2)] hover:-translate-y-1.5 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(232,100,44,0.08)]"
          >
            <div className="flex-1 flex flex-col">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[2px] uppercase text-orange mb-4 py-[5px] px-3 bg-orange-subtle border border-[rgba(232,100,44,0.15)] rounded-full w-fit">
                {t("platforms.otc.badge")}
              </div>
              <h3 className="font-display text-[2rem] font-bold mb-3">
                {t("platforms.otc.title")}
              </h3>
              <p className="text-[15px] text-text-secondary leading-[1.7] flex-1">
                {t("platforms.otc.desc")}
              </p>
              <span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-orange transition-[gap] duration-300 group-hover:gap-3.5">
                {t("platforms.otc.cta")}{" "}
                <span className="transition-transform duration-300">→</span>
              </span>
            </div>
            <div
              className="eco-card-visual flex-none w-full h-40 lg:flex-[0_0_320px] lg:w-auto lg:h-50 rounded-lg border border-white/6 flex items-center justify-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(to top, rgba(5,5,5,0.5) 0%, rgba(5,5,5,0.15) 100%), url('/eco-otc.jpg') center/cover no-repeat",
              }}
            >
              <img
                src="/nexbridge-icon-white.png"
                alt="NexBridge"
                className="relative w-16 h-16 object-contain opacity-60 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-opacity duration-400 z-2 group-hover:opacity-90"
              />
            </div>
          </Link>

          {/* Governance */}
          <a
            href="https://nextr.space"
            target="_blank"
            rel="noopener noreferrer"
            className="eco-card group relative border border-white/6 rounded-xl py-12 px-10 no-underline text-text-primary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col hover:border-[rgba(232,100,44,0.2)] hover:-translate-y-1.5 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(232,100,44,0.08)]"
            style={{
              background:
                "linear-gradient(to top, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.65) 40%, rgba(5,5,5,0.5) 100%), url('/eco-gov.jpg') center/cover no-repeat",
            }}
          >
            <img
              src="/nextr-icon.png"
              alt="NexTR"
              className="absolute top-5 right-5 w-9 h-9 object-contain opacity-40 transition-opacity duration-400 z-2 rounded-lg group-hover:opacity-70"
            />
            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[2px] uppercase text-orange mb-4 py-[5px] px-3 bg-orange-subtle border border-[rgba(232,100,44,0.15)] rounded-full w-fit">
              {t("platforms.governance.badge")}
            </div>
            <h3 className="font-display text-[1.6rem] font-bold mb-3">
              {t("platforms.governance.title")}
            </h3>
            <p className="text-[15px] text-text-secondary leading-[1.7] flex-1">
              {t("platforms.governance.desc")}
            </p>
            <span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-orange transition-[gap] duration-300 group-hover:gap-3.5">
              {t("platforms.governance.cta")}{" "}
              <span className="transition-transform duration-300">→</span>
            </span>
          </a>

          {/* Exchange */}
          <a
            href="https://nexplace.com"
            target="_blank"
            rel="noopener noreferrer"
            className="eco-card group relative border border-white/6 rounded-xl py-12 px-10 no-underline text-text-primary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col hover:border-[rgba(232,100,44,0.2)] hover:-translate-y-1.5 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(232,100,44,0.08)]"
            style={{
              background:
                "linear-gradient(to top, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.65) 40%, rgba(5,5,5,0.5) 100%), url('/eco-exchange.jpg') center/cover no-repeat",
            }}
          >
            <img
              src="/nexplace-icon-logo.svg"
              alt="NexPlace"
              className="absolute top-5 right-5 w-9 h-9 object-contain opacity-40 transition-opacity duration-400 z-2 rounded-lg group-hover:opacity-70"
            />
            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[2px] uppercase text-orange mb-4 py-[5px] px-3 bg-orange-subtle border border-[rgba(232,100,44,0.15)] rounded-full w-fit">
              {t("platforms.exchange.badge")}
            </div>
            <h3 className="font-display text-[1.6rem] font-bold mb-3">
              {t("platforms.exchange.title")}
            </h3>
            <p className="text-[15px] text-text-secondary leading-[1.7] flex-1">
              {t("platforms.exchange.desc")}
            </p>
            <span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-orange transition-[gap] duration-300 group-hover:gap-3.5">
              {t("platforms.exchange.cta")}{" "}
              <span className="transition-transform duration-300">→</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
