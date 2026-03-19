import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import SectionHeader from "@/components/sections/SectionHeader";
import { PRODUCTS } from "@/lib/data/products";

const richText = {
  gradient: (chunks: ReactNode) => (
    <span className="gradient-text">{chunks}</span>
  ),
  br: () => <br />,
};

interface ProductsSectionProps {
  t: (key: string) => string;
  tRich: (key: string, values: Record<string, unknown>) => ReactNode;
}

export default function ProductsSection({ t, tRich }: ProductsSectionProps) {
  return (
    <section
      className="section relative overflow-hidden"
      id="products"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0A0A0A 100%)",
      }}
    >
      <div className="container">
        <div className="flex flex-col items-start md:flex-row md:items-end justify-between mb-16 flex-wrap gap-6 reveal">
          <SectionHeader
            label={t("products.label")}
            title={tRich("products.title", richText)}
            subtitle={t("products.subtitle")}
            centered={false}
          />
          <Link
            href="/issuances"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full text-[15px] font-semibold no-underline transition-all duration-300 cursor-pointer w-full md:w-auto bg-white/4 text-text-primary border border-white/6 backdrop-blur-md hover:bg-white/8 hover:border-white/12 hover:-translate-y-0.5"
          >
            {t("products.viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {PRODUCTS.map((product) => (
            <div
              key={product.key}
              className="product-card bg-bg-card border border-white/6 rounded-lg p-7 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer relative overflow-hidden hover:border-[rgba(232,100,44,0.25)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] reveal"
            >
              <div className="w-12 h-12 rounded-md flex items-center justify-center font-extrabold text-sm mb-5 overflow-hidden bg-white/5 border border-white/6">
                <img
                  src={product.img}
                  alt={product.alt}
                  className="w-full h-full object-contain p-1.5"
                />
              </div>
              <div className="font-display text-xl font-bold mb-1.5">
                {t(`products.cards.${product.key}.name`)}
              </div>
              <div className="text-[13px] text-text-tertiary mb-4">
                {t(`products.cards.${product.key}.underlying`)}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/6">
                <span
                  className={`text-[11px] font-semibold py-1 px-2.5 rounded-full uppercase tracking-[0.5px] ${product.live ? "bg-[rgba(16,185,129,0.1)] text-[#34D399]" : "bg-white/5 text-text-tertiary"}`}
                >
                  {product.live
                    ? `● ${t("products.tags.live")}`
                    : t("products.tags.comingSoon")}
                </span>
                <span className="font-display font-bold text-[#34D399] text-[15px]">
                  {product.yield}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
