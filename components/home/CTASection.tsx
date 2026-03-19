import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

const richText = {
  gradient: (chunks: ReactNode) => (
    <span className="gradient-text">{chunks}</span>
  ),
  br: () => <br />,
};

interface CTASectionProps {
  t: (key: string) => string;
  tRich: (key: string, values: Record<string, unknown>) => ReactNode;
}

export default function CTASection({ t, tRich }: CTASectionProps) {
  return (
    <section
      className="py-35 text-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,100,44,0.1), transparent), linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.5) 40%, rgba(5,5,5,0.6) 100%), url('/cta-bg.jpg') center 60%/cover no-repeat",
      }}
    >
      <div className="hidden" />
      <div className="container relative z-1">
        <div className="reveal">
          <div className="section-label justify-center">{t("cta.label")}</div>
          <h2 className="section-title max-w-175 mx-auto">
            {tRich("cta.title", richText)}
          </h2>
          <p className="section-subtitle max-w-120 mx-auto mb-10">
            {t("cta.subtitle")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/explore"
              className="group inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-[15px] font-semibold no-underline transition-all duration-300 cursor-pointer border-none w-full md:w-auto bg-linear-to-br from-orange to-orange-light text-white shadow-[0_0_0_0_rgba(232,100,44,0.3),0_4px_20px_rgba(232,100,44,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(232,100,44,0.3),0_8px_32px_rgba(232,100,44,0.4)]"
            >
              {t("cta.ctaPrimary")}
              <span className="transition-transform duration-300 group-hover:translate-x-[3px]">
                →
              </span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-[15px] font-semibold no-underline transition-all duration-300 cursor-pointer w-full md:w-auto bg-white/4 text-text-primary border border-white/6 backdrop-blur-md hover:bg-white/8 hover:border-white/12 hover:-translate-y-0.5"
            >
              {t("cta.ctaSecondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
