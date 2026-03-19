import type { ReactNode } from "react";
import SectionHeader from "@/components/sections/SectionHeader";
import { FEATURE_KEYS } from "@/lib/data/features";

const richText = {
  gradient: (chunks: ReactNode) => (
    <span className="gradient-text">{chunks}</span>
  ),
  br: () => <br />,
};

interface FeaturesGridProps {
  t: (key: string) => string;
  tRich: (key: string, values: Record<string, unknown>) => ReactNode;
}

export default function FeaturesGrid({ t, tRich }: FeaturesGridProps) {
  return (
    <section
      className="section relative overflow-hidden"
      id="features"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0A0A0A 100%)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        }}
      />
      <div className="container">
        <SectionHeader
          label={t("features.label")}
          title={tRich("features.title", richText)}
          subtitle={t("features.subtitle")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/4 rounded-xl overflow-hidden mt-16 border border-white/6 reveal">
          {FEATURE_KEYS.map((key, i) => (
            <div
              key={key}
              className="feature-item bg-bg-card py-10 px-8 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden hover:bg-[rgb(15,15,15)]"
            >
              <div className="font-display text-[2.5rem] font-bold bg-[linear-gradient(180deg,rgba(232,100,44,0.2),rgba(232,100,44,0.05))] bg-clip-text text-transparent mb-4 leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h4 className="font-display text-[1.05rem] font-semibold mb-2.5">
                {t(`features.items.${key}.title`)}
              </h4>
              <p className="text-sm text-text-tertiary leading-[1.6]">
                {t(`features.items.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
