import type { ReactNode } from "react";
import SectionHeader from "@/components/sections/SectionHeader";

const richText = {
  gradient: (chunks: ReactNode) => (
    <span className="gradient-text">{chunks}</span>
  ),
  br: () => <br />,
};

interface InfrastructureSectionProps {
  t: (key: string) => string;
  tRich: (key: string, values: Record<string, unknown>) => ReactNode;
  tRaw: (key: string) => unknown;
}

export default function InfrastructureSection({
  t,
  tRich,
  tRaw,
}: InfrastructureSectionProps) {
  return (
    <section
      className="section relative overflow-hidden bg-bg-dark"
      id="infrastructure"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 30% 50%, rgba(59,130,246,0.05), transparent), radial-gradient(ellipse 40% 40% at 70% 50%, rgba(59,130,246,0.03), transparent)",
        }}
      />
      <div className="container">
        <SectionHeader
          label={t("infrastructure.label")}
          title={tRich("infrastructure.title", richText)}
          subtitle={t("infrastructure.subtitle")}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-16 reveal">
          {/* Liquid Network */}
          <a
            href="https://liquid.net"
            target="_blank"
            rel="noopener noreferrer"
            className="relative bg-white/2 border border-white/6 rounded-xl py-10 px-9 no-underline text-text-primary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-linear-to-r before:from-[#3B82F6] before:to-[#60A5FA] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:border-[rgba(59,130,246,0.25)] hover:-translate-y-1.5 hover:shadow-[0_30px_80px_rgba(0,0,0,0.4),0_0_60px_rgba(59,130,246,0.06)]"
          >
            <div className="w-14 h-14 rounded-[14px] bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.15)] flex items-center justify-center mb-6 overflow-hidden">
              <img
                src="/partners-logos/liquid-logo.049e83b7.png"
                alt="Liquid Network"
                className="w-full h-full object-contain p-2 brightness-[1.8]"
              />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3">
              {t("infrastructure.liquid.title")}
            </h3>
            <p className="text-[15px] text-text-secondary leading-[1.7] mb-5 flex-1">
              {t("infrastructure.liquid.desc")}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {(tRaw("infrastructure.liquid.badges") as string[]).map(
                (badge) => (
                  <span
                    key={badge}
                    className="text-[11px] font-semibold py-1 px-3 rounded-full bg-[rgba(59,130,246,0.08)] text-[#60A5FA] border border-[rgba(59,130,246,0.15)] tracking-[0.3px]"
                  >
                    {badge}
                  </span>
                ),
              )}
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange">
              {t("infrastructure.liquid.cta")} <span>→</span>
            </span>
          </a>

          {/* Blockstream AMP */}
          <a
            href="https://blockstream.com/amp"
            target="_blank"
            rel="noopener noreferrer"
            className="relative bg-white/2 border border-white/6 rounded-xl py-10 px-9 no-underline text-text-primary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-linear-to-r before:from-[#3B82F6] before:to-[#60A5FA] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:border-[rgba(59,130,246,0.25)] hover:-translate-y-1.5 hover:shadow-[0_30px_80px_rgba(0,0,0,0.4),0_0_60px_rgba(59,130,246,0.06)]"
          >
            <div className="w-14 h-14 rounded-[14px] bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.15)] flex items-center justify-center mb-6 overflow-hidden">
              <img
                src="/partners-logos/block-strem-amp-logo.ab6ef48b.svg"
                alt="Blockstream AMP"
                className="w-full h-full object-contain p-2 brightness-[1.8]"
              />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3">
              {t("infrastructure.amp.title")}
            </h3>
            <p className="text-[15px] text-text-secondary leading-[1.7] mb-5 flex-1">
              {t("infrastructure.amp.desc")}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {(tRaw("infrastructure.amp.badges") as string[]).map((badge) => (
                <span
                  key={badge}
                  className="text-[11px] font-semibold py-1 px-3 rounded-full bg-[rgba(59,130,246,0.08)] text-[#60A5FA] border border-[rgba(59,130,246,0.15)] tracking-[0.3px]"
                >
                  {badge}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange">
              {t("infrastructure.amp.cta")} <span>→</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
