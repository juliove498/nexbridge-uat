import { PIPELINE_EQUITIES, PIPELINE_INDEXES } from "@/lib/data/explore-assets";

interface PipelineSectionProps {
  t: (key: string) => string;
}

function PipelineCard({
  logo,
  ticker,
  company,
}: {
  logo: string | null;
  ticker: string;
  company: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-4 px-2.5 rounded-md bg-white/1.5 border border-white/4 transition-all duration-250 text-center hover:bg-white/4 hover:border-white/12 hover:-translate-y-0.5">
      <div
        className="w-9 h-9 rounded-[9px] bg-white/4 border border-white/6 flex items-center justify-center overflow-hidden"
        style={
          !logo
            ? {
                background: "rgba(232,100,44,0.06)",
                borderColor: "rgba(232,100,44,0.12)",
              }
            : undefined
        }
      >
        {logo ? (
          <img
            src={logo}
            alt={company}
            className="w-full h-full object-contain p-[5px]"
          />
        ) : (
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            style={{ color: "var(--orange)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        )}
      </div>
      <div className="font-display text-xs font-bold text-text-primary">
        {ticker}
      </div>
      <div className="text-[10px] text-text-tertiary leading-[1.3]">
        {company}
      </div>
    </div>
  );
}

const gridCls =
  "grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(110px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 sm:gap-2.5";
const labelCls =
  "font-display text-xs font-bold tracking-[2px] uppercase text-text-tertiary mb-3 flex items-center gap-2 before:content-[''] before:w-4 before:h-px before:bg-text-tertiary";

export default function PipelineSection({ t }: PipelineSectionProps) {
  return (
    <section className="pt-14">
      <div className="container">
        <div className="font-display text-[10px] font-bold tracking-[2.5px] uppercase text-text-tertiary mb-4 reveal">
          {t("pipeline.label")}
        </div>
        <div className="flex flex-col gap-8">
          <div className="reveal">
            <div className={labelCls}>{t("pipeline.equities")}</div>
            <div className={gridCls}>
              {PIPELINE_EQUITIES.map((item) => (
                <PipelineCard key={item.ticker} {...item} />
              ))}
            </div>
          </div>
          <div className="reveal">
            <div className={labelCls}>{t("pipeline.indexes")}</div>
            <div className={gridCls}>
              {PIPELINE_INDEXES.map((item) => (
                <PipelineCard key={item.ticker} {...item} />
              ))}
            </div>
          </div>
          <div className="reveal">
            <div className={labelCls}>{t("pipeline.aaSeries")}</div>
            <div className={gridCls}>
              <PipelineCard
                logo="/issuance-logos/usyld.svg"
                ticker="USYLD"
                company="U.S. Yield Token"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
