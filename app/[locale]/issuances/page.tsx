"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import ScrollReveal from "@/components/ScrollReveal";

const UPCOMING_CARDS = [
  {
    key: "nMSTR" as const,
    logo: "/issuance-logos/microstrategy.1530cc8d.svg",
    alt: "nMSTR",
  },
  {
    key: "nTSLA" as const,
    logo: "/issuance-logos/tesla.043c73d1.svg",
    alt: "nTSLA",
  },
  {
    key: "nNSDQ" as const,
    logo: "/issuance-logos/invesco.cb5db553.svg",
    alt: "nNSDQ",
  },
  { key: "USYLD" as const, logo: "/issuance-logos/usyld.svg", alt: "USYLD" },
];

const EQUITIES = [
  {
    ticker: "nAAPL",
    name: "Apple",
    logo: "/issuance-logos/apple.3ad88a52.svg",
  },
  {
    ticker: "nADBE",
    name: "Adobe",
    logo: "/issuance-logos/adobe.b80aff1d.svg",
  },
  { ticker: "nAMD", name: "AMD", logo: "/issuance-logos/amd.1c6f2b7b.svg" },
  {
    ticker: "nAMZN",
    name: "Amazon",
    logo: "/issuance-logos/amazon.2c56f1bd.svg",
  },
  {
    ticker: "nBRKB",
    name: "Berkshire Hathaway",
    logo: "/issuance-logos/berkshire-hathaway.1b72b181.svg",
  },
  {
    ticker: "nCRM",
    name: "Salesforce",
    logo: "/issuance-logos/salesforce.fc98a73e.svg",
  },
  {
    ticker: "nGOOG",
    name: "Alphabet",
    logo: "/issuance-logos/alphabet.d14fd52f.svg",
  },
  {
    ticker: "nHD",
    name: "Home Depot",
    logo: "/issuance-logos/home-deput.5e1ae305.svg",
  },
  {
    ticker: "nJNJ",
    name: "Johnson & Johnson",
    logo: "/issuance-logos/johnson-johnson.d80d4d02.svg",
  },
  {
    ticker: "nMA",
    name: "Mastercard",
    logo: "/issuance-logos/mastercard.da611feb.svg",
  },
  { ticker: "nMETA", name: "Meta", logo: "/issuance-logos/meta.0f668911.svg" },
  {
    ticker: "nMSFT",
    name: "Microsoft",
    logo: "/issuance-logos/microsoft.2dff5972.svg",
  },
  {
    ticker: "nNFLX",
    name: "Netflix",
    logo: "/issuance-logos/netflix.cf67946d.svg",
  },
  {
    ticker: "nNVDA",
    name: "NVIDIA",
    logo: "/issuance-logos/nvidia.df7eed26.svg",
  },
  {
    ticker: "nPG",
    name: "Procter & Gamble",
    logo: "/issuance-logos/proctor-gamble.a46dd365.svg",
  },
  { ticker: "nVISA", name: "Visa", logo: "/issuance-logos/visa.ce9e2802.svg" },
  {
    ticker: "nWMT",
    name: "Walmart",
    logo: "/issuance-logos/walmart.87408de8.svg",
  },
  {
    ticker: "nXOM",
    name: "Exxon Mobil",
    logo: "/issuance-logos/exxon-mobile.d1f47e81.svg",
  },
];

const TRADING_VENUES = [
  {
    label: "Bitfinex · USTBL/USDT",
    href: "https://trading.bitfinex.com/t/USTBL:UST",
  },
  {
    label: "Bitfinex · USTBL/USD",
    href: "https://trading.bitfinex.com/t/USTBL:USD",
  },
  {
    label: "Coinstore · USTBL/USDT",
    href: "https://www.coinstore.com/spot/USTBLUSDT",
  },
  {
    label: "Coinstore · BTC/USTBL",
    href: "https://www.coinstore.com/spot/BTCUSTBL",
  },
  { label: "XT · USTBL/USDT", href: "https://www.xt.com/en/trade/ustbl_usdt" },
];

function BarChartIcon({
  color,
  bg,
  border,
}: {
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className="flex size-11 shrink-0 items-center justify-center rounded-md [&_svg]:size-5.5"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color,
        borderRadius: "var(--radius-md)",
      }}
    >
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    </div>
  );
}

function PieChartIcon() {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-orange/20 bg-orange-subtle text-orange [&_svg]:size-5.5">
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
        />
      </svg>
    </div>
  );
}

export default function IssuancesPage() {
  const t = useTranslations("IssuancesPage");
  const [circulating, setCirculating] = useState("30,607,332");
  const [nav, setNav] = useState("$31,990,726");

  useEffect(() => {
    fetch("/api/ticker/USTBL")
      .then((res) => res.json())
      .then((data) => {
        const circ = parseFloat(data.circulating);
        const navVal = parseFloat(data.nav);
        if (!isNaN(circ))
          setCirculating(
            circ.toLocaleString("en-US", { maximumFractionDigits: 0 }),
          );
        if (!isNaN(navVal))
          setNav(
            "$" + navVal.toLocaleString("en-US", { maximumFractionDigits: 0 }),
          );
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <ScrollReveal />

      {/* PAGE HERO */}
      <section className="relative overflow-hidden pt-35 pb-15 text-center md:pt-45 md:pb-25">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="page-hero-mesh-blob" />
          <div className="page-hero-mesh-blob" />
        </div>
        <div className="page-hero-grid" />
        <div className="container">
          <div className="relative z-[2] mx-auto max-w-190">
            <div
              className="section-label flex justify-center"
              style={{ animation: "fadeUp 0.8s ease both" }}
            >
              {t("hero.label")}
            </div>
            <h1 className="mb-6 font-display text-[clamp(2rem,8vw,3rem)] font-bold leading-[1.08] tracking-tight [animation:fadeUp_0.8s_ease_0.1s_both] md:text-[clamp(2.8rem,6vw,4.5rem)]">
              {t.rich("hero.title", {
                gradient: (chunks) => (
                  <span className="gradient-text">{chunks}</span>
                ),
                br: () => <br />,
              })}
            </h1>
            <p className="mx-auto max-w-160 text-[1.15rem] leading-[1.7] text-text-secondary [animation:fadeUp_0.8s_ease_0.2s_both]">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 1: ACTIVE ISSUANCE — USTBL */}
      <section className="section pt-10">
        <div className="container">
          <div className="section-label reveal">
            {t("flagship.activeLabel")}
          </div>
          <h2 className="section-title reveal mb-10">{t("flagship.title")}</h2>

          <div className="reveal relative overflow-hidden rounded-xl border border-white/[0.06] bg-bg-card p-12 transition-all duration-400 hover:border-orange/20 md:p-9 lg:p-12">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-25 size-100 rounded-full bg-orange/10 blur-[100px]" />
              <div className="absolute -bottom-20 -left-16 size-62.5 rounded-full bg-emerald-500/5 blur-[100px]" />
            </div>

            <div className="relative z-10 mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <div className="flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-2.5">
                  <img
                    src="/issuance-logos/ustbl.svg"
                    alt="USTBL"
                    className="size-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-display text-[2rem] font-bold tracking-tight">
                    USTBL
                  </div>
                  <div className="mt-0.5 text-base text-text-secondary">
                    U.S. Treasury Bills
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400">
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />{" "}
                      {t("flagship.badges.live")}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 font-display text-[11px] font-semibold tracking-wide text-text-tertiary">
                      CNAD: AD-00004
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 font-display text-[11px] font-semibold tracking-wide text-text-tertiary">
                  {t("flagship.badges.fixedIncome")}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 font-display text-[11px] font-semibold tracking-wide text-text-tertiary">
                  {t("flagship.badges.elasticSupply")}
                </span>
              </div>
            </div>

            <div className="relative z-10 mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-md border border-white/[0.06] bg-white/[0.03] px-6 py-5 transition-all duration-300 hover:border-orange/20 hover:bg-white/[0.05]">
                <div className="mb-1.5 text-xs font-medium text-text-tertiary">
                  {t("flagship.stats.lastPrice")}
                </div>
                <div className="font-display text-2xl font-bold tracking-tight text-emerald-400">
                  $1.045
                </div>
              </div>
              <div className="rounded-md border border-white/[0.06] bg-white/[0.03] px-6 py-5 transition-all duration-300 hover:border-orange/20 hover:bg-white/[0.05]">
                <div className="mb-1.5 text-xs font-medium text-text-tertiary">
                  {t("flagship.stats.circulatingSupply")}
                </div>
                <div className="font-display text-2xl font-bold tracking-tight">
                  {circulating}
                </div>
              </div>
              <div className="rounded-md border border-white/[0.06] bg-white/[0.03] px-6 py-5 transition-all duration-300 hover:border-orange/20 hover:bg-white/[0.05]">
                <div className="mb-1.5 text-xs font-medium text-text-tertiary">
                  {t("flagship.stats.netAssetValue")}
                </div>
                <div className="font-display text-2xl font-bold tracking-tight">
                  {nav}
                </div>
              </div>
            </div>

            <div className="relative z-10 mb-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 lg:gap-10">
              <div>
                <h4 className="mb-4 font-display text-[11px] font-bold uppercase tracking-[2px] text-text-tertiary">
                  {t("flagship.details.underlyingAsset")}
                </h4>
                <div className="space-y-0">
                  <div className="flex items-center justify-between border-b border-white/[0.06] py-2.5 text-sm last:border-b-0">
                    <span className="text-text-secondary">
                      {t("flagship.details.primary")}
                    </span>
                    <span className="font-medium text-text-primary">
                      {t("flagship.details.primaryValue")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.06] py-2.5 text-sm last:border-b-0">
                    <span className="text-text-secondary">
                      {t("flagship.details.isin")}
                    </span>
                    <span className="font-medium text-text-primary">
                      IE00BGSF1X88
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.06] py-2.5 text-sm last:border-b-0">
                    <span className="text-text-secondary">
                      {t("flagship.details.liquidity")}
                    </span>
                    <span className="font-medium text-text-primary">
                      {t("flagship.details.liquidityValue")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.06] py-2.5 text-sm last:border-b-0">
                    <span className="text-text-secondary">
                      {t("flagship.details.tradingCurrencies")}
                    </span>
                    <span className="font-medium text-text-primary">
                      USDT, USDC, USD
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-4 font-display text-[11px] font-bold uppercase tracking-[2px] text-text-tertiary">
                  {t("flagship.tradingVenues")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {TRADING_VENUES.map((venue) => (
                    <a
                      key={venue.href}
                      href={venue.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.04] px-3.5 py-1.5 text-[13px] font-medium text-text-secondary transition-all duration-200 hover:border-orange hover:bg-orange/10 hover:text-orange"
                    >
                      {venue.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-2.5">
              <a
                href="https://ustbl.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-text-secondary transition-all duration-300 hover:border-orange/30 hover:bg-orange/10 hover:text-orange-light [&_svg]:size-3.5 [&_svg]:shrink-0"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
                ustbl.io
              </a>
              <a
                href="https://ustbl.io/RID/rid.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-text-secondary transition-all duration-300 hover:border-orange/30 hover:bg-orange/10 hover:text-orange-light [&_svg]:size-3.5 [&_svg]:shrink-0"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                {t("flagship.links.publicTermsheet")}
              </a>
              <a
                href="https://ustbl.io/docs/Audits.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-text-secondary transition-all duration-300 hover:border-orange/30 hover:bg-orange/10 hover:text-orange-light [&_svg]:size-3.5 [&_svg]:shrink-0"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                {t("flagship.links.latestAudit")}
              </a>
              <a
                href="https://ustbl.io/docs/USTBL%20-%20Market%20Participants%20(AD%20-%20AP)%20v03122025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-text-secondary transition-all duration-300 hover:border-orange/30 hover:bg-orange/10 hover:text-orange-light [&_svg]:size-3.5 [&_svg]:shrink-0"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
                {t("flagship.links.marketParticipants")}
              </a>
              <a
                href="https://ustbl.io/docs/Rating%20Report%20-%20Particula.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-text-secondary transition-all duration-300 hover:border-orange/30 hover:bg-orange/10 hover:text-orange-light [&_svg]:size-3.5 [&_svg]:shrink-0"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
                {t("flagship.links.particulaRating")}
              </a>
              <a
                href="https://api.nexbridge.io/v1/ticker/USTBL"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-text-secondary transition-all duration-300 hover:border-orange/30 hover:bg-orange/10 hover:text-orange-light [&_svg]:size-3.5 [&_svg]:shrink-0"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                  />
                </svg>
                {t("flagship.links.apiEndpoint")}
              </a>
            </div>

            <div className="relative z-10 mt-10 flex flex-col gap-3 sm:flex-row sm:gap-3">
              <Link
                href="/explore"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-none bg-gradient-to-br from-orange to-orange-light px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_0_0_var(--orange-glow),0_4px_20px_rgba(232,100,44,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_var(--orange-glow),0_8px_32px_rgba(232,100,44,0.4)] [&_.btn-arrow]:transition-transform [&_.btn-arrow]:duration-300 [&:hover_.btn-arrow]:translate-x-0.5 sm:w-auto"
              >
                {t("flagship.cta.trade")}{" "}
                <span className="btn-arrow">&rarr;</span>
              </Link>
              <a
                href="https://ustbl.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-8 py-3.5 text-[15px] font-semibold text-text-primary backdrop-blur-[12px] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:bg-white/[0.08] sm:w-auto"
              >
                {t("flagship.cta.learnMore")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: UPCOMING LAUNCHES */}
      <section className="section">
        <div className="container">
          <div className="section-label reveal">{t("upcoming.label")}</div>
          <h2 className="section-title reveal mb-3">{t("upcoming.title")}</h2>
          <p className="section-subtitle reveal mb-12">
            {t("upcoming.subtitle")}
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {UPCOMING_CARDS.map((card) => (
              <div
                key={card.key}
                className="reveal relative z-10 cursor-default overflow-hidden rounded-lg border border-white/[0.06] bg-bg-card p-8 text-center transition-all duration-400 hover:-translate-y-1 hover:border-orange/20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)] before:absolute before:inset-0 before:rounded-lg before:bg-[radial-gradient(circle_at_50%_0%,rgba(232,100,44,0.06),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
              >
                <div className="relative z-10 mx-auto mb-4 flex size-14 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/[0.04] p-2">
                  <img
                    src={card.logo}
                    alt={card.alt}
                    className="size-full object-contain"
                  />
                </div>
                <div className="relative z-10 mb-1 font-display text-xl font-bold">
                  {t(`upcoming.cards.${card.key}.ticker`)}
                </div>
                <div className="relative z-10 mb-4 text-[13px] text-text-tertiary">
                  {t(`upcoming.cards.${card.key}.name`)}
                </div>
                <span className="relative z-10 inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-text-tertiary">
                  {t("upcoming.comingSoon")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent [mask-image:linear-gradient(90deg,transparent_5%,black_50%,transparent_95%)]" />

      {/* SECTION 3: EQUITIES */}
      <section className="section">
        <div className="container">
          <div className="section-label reveal">{t("equities.label")}</div>
          <h2 className="section-title reveal mb-3">{t("equities.title")}</h2>
          <p className="section-subtitle reveal mb-12">
            {t("equities.subtitle")}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
            {EQUITIES.map((eq) => (
              <div
                key={eq.ticker}
                className="reveal flex cursor-default items-center gap-3 rounded-md border border-white/[0.06] bg-bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange/20 hover:bg-bg-card-hover"
              >
                <div className="flex size-10 min-w-10 items-center justify-center overflow-hidden rounded-sm border border-white/10 bg-white/[0.04] p-1.5">
                  <img
                    src={eq.logo}
                    alt={eq.name}
                    className="size-full object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-display text-sm font-bold">
                    {eq.ticker}
                  </span>
                  <span className="truncate text-xs text-text-tertiary">
                    {eq.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent [mask-image:linear-gradient(90deg,transparent_5%,black_50%,transparent_95%)]" />

      {/* SECTION 4: INDEXES & AA SERIES */}
      <section className="section">
        <div className="container">
          <div className="section-label reveal">{t("indexesAA.label")}</div>
          <h2 className="section-title reveal mb-12">{t("indexesAA.title")}</h2>

          {/* Indexes */}
          <h3 className="reveal mb-5 font-display text-[11px] font-bold uppercase tracking-[2px] text-text-tertiary">
            {t("indexesAA.indexesSubtitle")}
          </h3>
          <div className="reveal mb-12 grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
            <div className="flex items-start gap-4 rounded-lg border border-white/[0.06] bg-bg-card p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange/20 hover:bg-bg-card-hover">
              <BarChartIcon
                color="#60A5FA"
                bg="rgba(59,130,246,0.1)"
                border="rgba(59,130,246,0.2)"
              />
              <div className="flex flex-col gap-1">
                <span className="font-display text-[15px] font-bold">
                  {t("indexesAA.indexes.nASIA.ticker")}
                </span>
                <span className="text-[13px] leading-snug text-text-tertiary">
                  {t("indexesAA.indexes.nASIA.name")}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-white/[0.06] bg-bg-card p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange/20 hover:bg-bg-card-hover">
              <BarChartIcon
                color="#A78BFA"
                bg="rgba(139,92,246,0.1)"
                border="rgba(139,92,246,0.2)"
              />
              <div className="flex flex-col gap-1">
                <span className="font-display text-[15px] font-bold">
                  {t("indexesAA.indexes.nEMEQ.ticker")}
                </span>
                <span className="text-[13px] leading-snug text-text-tertiary">
                  {t("indexesAA.indexes.nEMEQ.name")}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border border-white/[0.06] bg-bg-card p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange/20 hover:bg-bg-card-hover">
              <BarChartIcon
                color="#34D399"
                bg="rgba(16,185,129,0.1)"
                border="rgba(16,185,129,0.2)"
              />
              <div className="flex flex-col gap-1">
                <span className="font-display text-[15px] font-bold">
                  {t("indexesAA.indexes.nSPY.ticker")}
                </span>
                <span className="text-[13px] leading-snug text-text-tertiary">
                  {t("indexesAA.indexes.nSPY.name")}
                </span>
              </div>
            </div>
          </div>

          {/* AA Series */}
          <h3 className="reveal mb-5 font-display text-[11px] font-bold uppercase tracking-[2px] text-text-tertiary">
            {t("indexesAA.aaSubtitle")}
          </h3>
          <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
            <div className="flex items-start gap-4 rounded-lg border border-white/[0.06] bg-bg-card p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange/20 hover:bg-bg-card-hover">
              <PieChartIcon />
              <div className="flex flex-col gap-1">
                <span className="font-display text-[15px] font-bold">
                  {t("indexesAA.aa.USGRW.ticker")}
                </span>
                <span className="text-[13px] leading-snug text-text-tertiary">
                  {t("indexesAA.aa.USGRW.name")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent [mask-image:linear-gradient(90deg,transparent_5%,black_50%,transparent_95%)]" />

      {/* SECTION 5: CTA */}
      <section className="section">
        <div className="container">
          <div
            className="reveal relative overflow-hidden rounded-xl border border-white/[0.06] p-16 text-center md:p-10 lg:p-16"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,100,44,0.1), transparent), linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.5) 40%, rgba(5,5,5,0.6) 100%), url('/cta-bg.jpg') center 60% / cover no-repeat",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,100,44,0.08), transparent)",
              }}
            />
            <h2 className="relative mb-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
              {t("cta.title")}
            </h2>
            <p className="relative mx-auto mb-8 max-w-140 text-[1.05rem] leading-[1.7] text-text-secondary">
              {t("cta.desc")}
            </p>
            <Link
              href="/contact"
              className="relative inline-flex items-center gap-2 rounded-full border-none bg-gradient-to-br from-orange to-orange-light px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_0_0_var(--orange-glow),0_4px_20px_rgba(232,100,44,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_var(--orange-glow),0_8px_32px_rgba(232,100,44,0.4)] [&_.btn-arrow]:transition-transform [&_.btn-arrow]:duration-300 [&:hover_.btn-arrow]:translate-x-0.5"
            >
              {t("cta.button")} <span className="btn-arrow">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
