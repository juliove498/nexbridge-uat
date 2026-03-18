import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import { HomeEffects, UstblNavValue } from "@/components/home/HomeInteractive";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url: "https://nexbridge.finance/",
      type: "website",
      images: ["https://nexbridge.finance/nexbridge-og.png"],
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: "https://nexbridge.finance/",
    },
  };
}

const PARTNER_LOGOS = [
  {
    src: "/partners-logos/gleif-logo.a39e8315.svg",
    alt: "GLEIF",
    name: "GLEIF",
  },
  {
    src: "/partners-logos/thornton-logo.15d4968b.svg",
    alt: "Grant Thornton",
    name: "Grant Thornton",
  },
  {
    src: "/partners-logos/blockstream-logo.e3173fc7.svg",
    alt: "Blockstream",
    name: "Blockstream",
  },
  {
    src: "/partners-logos/bitfinex-logo.380dd922.svg",
    alt: "Bitfinex",
    name: "Bitfinex",
  },
  {
    src: "/partners-logos/liquid-logo.049e83b7.png",
    alt: "Liquid Network",
    name: "Liquid Network",
  },
  {
    src: "/partners-logos/asafintech-logo.c33d157a.svg",
    alt: "ASA Fintech",
    name: "ASA Fintech",
  },
  {
    src: "/partners-logos/capital-union-logo.c0c382ee.svg",
    alt: "Capital Union",
    name: "Capital Union",
  },
  {
    src: "/partners-logos/fulgur-logo.8c294af8.svg",
    alt: "Fulgur",
    name: "Fulgur",
  },
  {
    src: "/partners-logos/xt_logo.2d6a40fb.svg",
    alt: "XT Markets",
    name: "XT Markets",
  },
  {
    src: "/partners-logos/tokenization-experts.59865f70.svg",
    alt: "Tokenization Experts",
    name: "Tokenization Experts",
  },
  {
    src: "/partners-logos/nexplace-logo-white.a93fb876.svg",
    alt: "NexPlace",
    name: "NexPlace",
  },
  { src: "/partners-logos/capital-logo.webp", alt: "Capital", name: "Capital" },
  {
    src: "/partners-logos/block-strem-amp-logo.ab6ef48b.svg",
    alt: "Blockstream AMP",
    name: "Blockstream AMP",
  },
];

const PRODUCTS = [
  {
    key: "USTBL",
    img: "/issuance-logos/ustbl.svg",
    alt: "USTBL",
    yield: "4.3% ATM Yield",
    live: true,
  },
  {
    key: "nMSTR",
    img: "/issuance-logos/microstrategy.1530cc8d.svg",
    alt: "MicroStrategy",
    yield: "—",
    live: false,
  },
  {
    key: "nTSLA",
    img: "/issuance-logos/tesla.043c73d1.svg",
    alt: "Tesla",
    yield: "—",
    live: false,
  },
  {
    key: "nSPY",
    img: "/issuance-logos/invesco.cb5db553.svg",
    alt: "SPDR S&P 500",
    yield: "—",
    live: false,
  },
  {
    key: "nNVDA",
    img: "/issuance-logos/nvidia.df7eed26.svg",
    alt: "NVIDIA",
    yield: "—",
    live: false,
  },
  {
    key: "USYLD",
    img: "/issuance-logos/usyld.svg",
    alt: "USYLD",
    yield: "—",
    live: false,
  },
  {
    key: "USGRW",
    img: "/issuance-logos/berkshire-hathaway.1b72b181.svg",
    alt: "BlackRock",
    yield: "—",
    live: false,
  },
  {
    key: "nNSDQ",
    img: "/issuance-logos/invesco.cb5db553.svg",
    alt: "Invesco QQQ",
    yield: "—",
    live: false,
  },
];

const FEATURE_KEYS = [
  "backed",
  "audits",
  "regulated",
  "termsheets",
  "bitcoin",
  "settlement",
  "programmable",
  "global",
] as const;

const STEP_KEYS = ["choose", "subscribe", "manage"] as const;

const richText = {
  gradient: (chunks: React.ReactNode) => (
    <span className="gradient-text">{chunks}</span>
  ),
  br: () => <br />,
};

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <>
      <ScrollReveal />
      <HomeEffects />

      {/* HERO */}
      <section
        className="hero min-h-screen flex items-center relative pt-18 overflow-hidden"
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
        <div className="container flex items-center justify-between w-full">
          <div className="relative z-2 max-w-200">
            <div
              className="inline-flex items-center gap-2 bg-[rgba(232,100,44,0.06)] border border-[rgba(232,100,44,0.15)] rounded-full py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-orange-light mb-8 opacity-0 -translate-x-[30px] backdrop-blur-md"
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

      {/* PARTNERS */}
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
            {t.rich("partners.title", richText)}
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

      {/* PRODUCTS */}
      <section
        className="section relative overflow-hidden"
        id="products"
        style={{
          background: "linear-gradient(180deg, #050505 0%, #0A0A0A 100%)",
        }}
      >
        <div className="container">
          <div className="flex flex-col items-start md:flex-row md:items-end justify-between mb-16 flex-wrap gap-6 reveal">
            <div>
              <div className="section-label">{t("products.label")}</div>
              <h2 className="section-title">
                {t.rich("products.title", richText)}
              </h2>
              <p className="section-subtitle">{t("products.subtitle")}</p>
            </div>
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
                  {t(`products.cards.${product.key}.name` as never)}
                </div>
                <div className="text-[13px] text-text-tertiary mb-4">
                  {t(`products.cards.${product.key}.underlying` as never)}
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

      {/* PLATFORMS & MARKETS */}
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
          <div className="reveal text-center max-w-160 mx-auto">
            <div className="section-label justify-center">
              {t("platforms.label")}
            </div>
            <h2 className="section-title">
              {t.rich("platforms.title", richText)}
            </h2>
            <p className="section-subtitle mx-auto">
              {t("platforms.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-16 reveal">
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

      {/* INFRASTRUCTURE */}
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
          <div className="reveal text-center max-w-160 mx-auto">
            <div className="section-label justify-center">
              {t("infrastructure.label")}
            </div>
            <h2 className="section-title">
              {t.rich("infrastructure.title", richText)}
            </h2>
            <p className="section-subtitle mx-auto">
              {t("infrastructure.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-16 reveal">
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
                {(t.raw("infrastructure.liquid.badges") as string[]).map(
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
                {(t.raw("infrastructure.amp.badges") as string[]).map(
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
                {t("infrastructure.amp.cta")} <span>→</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
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
          <div className="reveal text-center max-w-160 mx-auto">
            <div className="section-label justify-center">
              {t("features.label")}
            </div>
            <h2 className="section-title">
              {t.rich("features.title", richText)}
            </h2>
            <p className="section-subtitle mx-auto">{t("features.subtitle")}</p>
          </div>
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
                  {t(`features.items.${key}.title` as never)}
                </h4>
                <p className="text-sm text-text-tertiary leading-[1.6]">
                  {t(`features.items.${key}.desc` as never)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="container">
          <div className="reveal text-center max-w-160 mx-auto">
            <div className="section-label justify-center">
              {t("howItWorks.label")}
            </div>
            <h2 className="section-title">
              {t.rich("howItWorks.title", richText)}
            </h2>
          </div>
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
                  {t(`howItWorks.steps.${key}.title` as never)}
                </h4>
                <p className="text-sm text-text-secondary leading-[1.7] max-w-70 mx-auto">
                  {t(`howItWorks.steps.${key}.desc` as never)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
              {t.rich("cta.title", richText)}
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
    </>
  );
}
