import type { ReactNode } from "react";
import SectionHeader from "@/components/sections/SectionHeader";
import { STEP_KEYS } from "@/lib/data/features";

const richText = {
  gradient: (chunks: ReactNode) => (
    <span className="gradient-text">{chunks}</span>
  ),
  br: () => <br />,
};

interface HowItWorksProps {
  t: (key: string) => string;
  tRich: (key: string, values: Record<string, unknown>) => ReactNode;
}

export default function HowItWorks({ t, tRich }: HowItWorksProps) {
  return (
    <section className="section" id="how">
      <div className="container">
        <SectionHeader
          label={t("howItWorks.label")}
          title={tRich("howItWorks.title", richText)}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mt-16 relative reveal">
          <div
            className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-px opacity-30"
            style={{
              background:
                "linear-gradient(90deg, transparent, #E8642C, transparent)",
            }}
          />
          {STEP_KEYS.map((key, i) => (
            <div key={key} className="text-center relative group">
              <div className="w-24 h-24 rounded-full bg-bg-card border border-white/6 flex items-center justify-center mx-auto mb-7 font-display text-[2rem] font-bold text-orange relative z-1 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-orange group-hover:shadow-[0_0_40px_rgba(232,100,44,0.3),0_0_80px_rgba(232,100,44,0.1)] group-hover:scale-105">
                {i + 1}
              </div>
              <h4 className="font-display text-[1.2rem] font-bold mb-2.5">
                {t(`howItWorks.steps.${key}.title`)}
              </h4>
              <p className="text-sm text-text-secondary leading-[1.7] max-w-70 mx-auto">
                {t(`howItWorks.steps.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
