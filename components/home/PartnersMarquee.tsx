import type { ReactNode } from "react";
import { PARTNER_LOGOS } from "@/lib/data/partners";

const richText = {
  gradient: (chunks: ReactNode) => (
    <span className="gradient-text">{chunks}</span>
  ),
  br: () => <br />,
};

interface PartnersMarqueeProps {
  t: (key: string) => string;
  tRich: (key: string, values: Record<string, unknown>) => ReactNode;
}

export default function PartnersMarquee({ t, tRich }: PartnersMarqueeProps) {
  return (
    <section
      className="relative py-25 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(232,100,44,0.03) 0%, #050505 30%, #050505 70%, rgba(232,100,44,0.02) 100%)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-40"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, #E8642C 50%, transparent 95%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.08) 50%, transparent 95%)",
        }}
      />
      <div className="partners-scanline" />
      <div className="partners-bg-grid" />
      <div className="partners-orb w-75 h-75 bg-orange opacity-[0.06] -top-20 left-[10%]" />
      <div
        className="partners-orb w-50 h-50 bg-[#F4845F] opacity-[0.04] -bottom-15 right-[15%]"
        style={{ animationDelay: "-7s" }}
      />
      <div className="text-center mb-14 relative z-2">
        <div className="section-label justify-center mb-3!">
          {t("partners.label")}
        </div>
        <div className="font-display text-[clamp(1.8rem,3vw,2.4rem)] font-bold text-text-primary tracking-[-0.02em]">
          {tRich("partners.title", richText)}
        </div>
      </div>
      <div className="relative z-2 flex flex-col gap-5">
        <div className="marquee-wrapper overflow-hidden relative pt-2">
          <div className="marquee-track marquee-track-forward flex items-center gap-6 w-max">
            {[0, 1].map((setIndex) =>
              PARTNER_LOGOS.map((logo, i) => (
                <div
                  key={`${setIndex}-${i}`}
                  className="marquee-logo-card group shrink-0 flex items-center justify-center w-40 h-20 py-4 px-6 rounded-lg bg-white/2 border border-white/6 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer relative overflow-hidden hover:bg-white/5 hover:border-[rgba(232,100,44,0.3)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(232,100,44,0.15),0_20px_60px_rgba(0,0,0,0.4)]"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-7 w-auto max-w-30 opacity-35 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] grayscale brightness-[2] group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.08]"
                  />
                  <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 translate-y-1 bg-[rgba(20,20,20,0.95)] border border-[rgba(232,100,44,0.3)] backdrop-blur-md py-1.5 px-3.5 rounded-full text-[11px] font-semibold text-orange-light whitespace-nowrap opacity-0 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] tracking-[0.5px] z-10 group-hover:opacity-100 group-hover:translate-y-0">
                    {logo.name}
                  </span>
                </div>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
