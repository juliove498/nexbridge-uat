"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setLangOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openDropdown = useCallback((id: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveDropdown(id);
  }, []);

  const closeAll = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, []);

  const handleScrollLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setActiveDropdown(null);
    const target = document.querySelector(href);
    if (target) {
      setTimeout(
        () => target.scrollIntoView({ behavior: "smooth", block: "start" }),
        100,
      );
    }
  };

  const langNames: Record<string, { flag: string; name: string }> = {
    en: { flag: "🇺🇸", name: "English" },
    es: { flag: "🇪🇸", name: "Español" },
    it: { flag: "🇮🇹", name: "Italiano" },
    pt: { flag: "🇧🇷", name: "Português" },
    fr: { flag: "🇫🇷", name: "Français" },
  };

  const navLinkClass =
    "no-underline text-text-secondary text-[13px] font-medium py-2 px-3.5 rounded-full transition-all duration-250 relative whitespace-nowrap hover:text-text-primary hover:bg-white/6 max-[1200px]:px-2.5 max-[1200px]:text-[12.5px]";

  const megaDropdownBase =
    "fixed top-20 left-1/2 -translate-x-1/2 bg-[rgba(12,12,12,0.96)] backdrop-blur-[40px] backdrop-saturate-180 border border-white/8 rounded-[20px] z-1001 shadow-[0_24px_80px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden transition-all duration-350 max-lg:hidden!";

  const sectionTitleClass =
    "group/link font-display text-[10px] font-bold tracking-[2.5px] uppercase text-text-tertiary mb-1.5 pl-3 no-underline flex items-center gap-2 transition-colors duration-200 cursor-pointer hover:text-orange";

  const sectionArrowClass =
    "opacity-0 transition-all duration-250 -translate-x-0.5 group-hover/link:opacity-100 group-hover/link:translate-x-0";

  const megaProductItemClass =
    "group/item flex items-center gap-3 py-[9px] px-3 rounded-[10px] no-underline text-text-primary transition-all duration-200 hover:bg-white/4";

  const megaItemIconBase =
    "w-9 h-9 min-w-9 rounded-[9px] bg-white/4 border border-white/8 flex items-center justify-center overflow-hidden transition-all duration-250";

  const megaItemNameClass =
    "font-display text-[13.5px] font-semibold text-text-primary flex items-center gap-2";

  const megaItemDescClass = "text-xs text-text-tertiary leading-[1.3]";

  const megaItemIconImgClass = "w-full h-full object-contain p-[5px]";

  const mobileLinkClass =
    "no-underline text-text-primary font-display text-2xl font-semibold py-3 px-8 rounded-xl transition-all hover:text-orange hover:bg-orange-subtle";

  return (
    <>
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-1000 transition-all duration-500 w-max max-w-[calc(100%-24px)] max-lg:max-w-[calc(100%-32px)]"
        id="navbar"
      >
        <div className="flex items-center gap-2 h-14 pl-5 pr-1.5 rounded-full bg-[rgba(10,10,10,0.7)] backdrop-blur-xl backdrop-saturate-180 border border-white/8 shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)] max-lg:justify-between max-lg:pr-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline text-text-primary mr-2"
          >
            <img
              src="/nexbridge-wordmark-white.svg"
              alt="NexBridge"
              className="h-5.5 w-auto block shrink-0 max-[1200px]:h-5"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5 shrink min-w-0 max-[1200px]:gap-px">
            <a
              href="/issuances"
              className={`${navLinkClass} ${activeDropdown === "products-dropdown" ? "text-text-primary bg-white/6" : ""}`}
              onMouseEnter={() => openDropdown("products-dropdown")}
              onMouseLeave={closeAll}
              onClick={(e) => {
                e.preventDefault();
                activeDropdown === "products-dropdown"
                  ? setActiveDropdown(null)
                  : openDropdown("products-dropdown");
              }}
            >
              {t("nav.products")}{" "}
              <svg
                className={`inline-block w-2.5 h-2.5 ml-0.5 transition-transform duration-300 align-middle ${
                  activeDropdown === "products-dropdown" ? "rotate-180" : ""
                }`}
                viewBox="0 0 10 6"
                fill="none"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <Link href="/ecosystem" className={navLinkClass}>
              {t("nav.ecosystem")}
            </Link>

            <a
              href="#resources"
              className={`${navLinkClass} ${activeDropdown === "resources-dropdown" ? "text-text-primary bg-white/6" : ""}`}
              onMouseEnter={() => openDropdown("resources-dropdown")}
              onMouseLeave={closeAll}
              onClick={(e) => {
                e.preventDefault();
                activeDropdown === "resources-dropdown"
                  ? setActiveDropdown(null)
                  : openDropdown("resources-dropdown");
              }}
            >
              {t("nav.resources")}{" "}
              <svg
                className={`inline-block w-2.5 h-2.5 ml-0.5 transition-transform duration-300 align-middle ${
                  activeDropdown === "resources-dropdown" ? "rotate-180" : ""
                }`}
                viewBox="0 0 10 6"
                fill="none"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <Link href="/about" className={navLinkClass}>
              {t("nav.about")}
            </Link>

            {/* Language Selector */}
            <DropdownMenu open={langOpen} onOpenChange={setLangOpen}>
              <DropdownMenuTrigger
                render={
                  <button
                    className="flex items-center gap-2 py-[7px] px-3 rounded-full bg-transparent border border-white/6 text-text-secondary font-sans text-xs font-medium cursor-pointer transition-all duration-250 tracking-[0.02em] hover:text-text-primary hover:border-white/12 hover:bg-white/4 ml-0.5 shrink-0 max-[1200px]:py-[5px] max-[1200px]:px-2 max-[1200px]:text-[11px]"
                    type="button"
                  />
                }
              >
                <svg
                  className="w-3.5 h-3.5 opacity-50 max-[1200px]:w-3 max-[1200px]:h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418"
                  />
                </svg>
                <span>{locale.toUpperCase()}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-auto bg-[rgba(10,10,10,0.92)] backdrop-blur-[32px] border border-white/8 rounded-xl min-w-40 p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.4)] ring-0"
              >
                {routing.locales.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    className={`gap-2.5 py-2 px-3 rounded-lg text-text-secondary text-[13px] font-medium cursor-pointer transition-all hover:bg-white/6 hover:text-text-primary focus:bg-white/6 focus:text-text-primary ${
                      loc === locale ? "text-orange!" : ""
                    }`}
                    render={
                      <Link
                        href={pathname}
                        locale={loc}
                        onClick={() => setLangOpen(false)}
                      />
                    }
                  >
                    <span className="text-base leading-none">
                      {langNames[loc].flag}
                    </span>{" "}
                    {langNames[loc].name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/explore"
              className="no-underline text-white! bg-linear-to-br from-orange to-orange-light py-2.5 px-5.5 rounded-full font-semibold! ml-1 shadow-[0_0_20px_rgba(232,100,44,0.2)] hover:shadow-[0_0_30px_rgba(232,100,44,0.4)] hover:-translate-y-px transition-all duration-250 whitespace-nowrap text-[13px] max-[1200px]:py-2 max-[1200px]:px-4.5 max-[1200px]:text-xs!"
            >
              {t("nav.launchApp")} &rarr;
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <button className="hidden max-lg:block bg-transparent border-none text-white cursor-pointer p-2" />
              }
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[rgba(5,5,5,0.98)]! backdrop-blur-[20px]! border-white/6! w-full! max-w-full! sm:max-w-full! gap-2! items-center justify-center"
            >
              <Link
                href="/issuances"
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass}
              >
                {t("mobileNav.products")}
              </Link>
              <Link
                href="/ecosystem"
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass}
              >
                {t("mobileNav.ecosystem")}
              </Link>
              <Link
                href="/legal-framework"
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass}
              >
                {t("mobileNav.legalFramework")}
              </Link>
              <Link
                href="/faq"
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass}
              >
                {t("mobileNav.faqs")}
              </Link>
              <Link
                href="/insights"
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass}
              >
                {t("mobileNav.insights")}
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass}
              >
                {t("mobileNav.about")}
              </Link>
              <Link
                href="/explore"
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass}
              >
                {t("mobileNav.launchApp")} &rarr;
              </Link>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Mega Backdrop */}
      <div
        className={`fixed inset-0 z-999 max-lg:hidden! ${activeDropdown ? "block" : "hidden"}`}
        onClick={() => setActiveDropdown(null)}
      />

      {/* Products Mega Dropdown */}
      <div
        className={`${megaDropdownBase} w-180 max-w-[calc(100vw-48px)] ${
          activeDropdown === "products-dropdown"
            ? "opacity-100 visible pointer-events-auto translate-y-0"
            : "opacity-0 invisible pointer-events-none translate-y-2"
        }`}
        onMouseEnter={cancelClose}
        onMouseLeave={closeAll}
      >
        <div className="grid grid-cols-2">
          {/* Cell 1: Issuances */}
          <div className="p-5 border-r border-b border-white/6">
            <Link href="/issuances" className={sectionTitleClass}>
              {t("mega.issuances")}{" "}
              <svg
                className={sectionArrowClass}
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
              >
                <path
                  d="M1 9L9 1M9 1H3M9 1V7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link href="/issuances" className={megaProductItemClass}>
              <div
                className={`${megaItemIconBase} group-hover/item:border-orange/30 group-hover/item:shadow-[0_0_16px_rgba(232,100,44,0.08)]`}
              >
                <img
                  src="/issuance-logos/ustbl.svg"
                  alt="USTBL"
                  className={megaItemIconImgClass}
                />
              </div>
              <div className="flex flex-col gap-px">
                <span className={megaItemNameClass}>
                  {t("mega.items.USTBL.name")}{" "}
                  <span className="text-[9px] font-bold px-1.5 py-px rounded-full uppercase tracking-[0.5px] bg-emerald-500/12 text-emerald-400">
                    {t("mega.tags.live")}
                  </span>
                </span>
                <span className={megaItemDescClass}>
                  {t("mega.items.USTBL.desc")}
                </span>
              </div>
            </Link>
            <Link href="/issuances" className={megaProductItemClass}>
              <div
                className={`${megaItemIconBase} group-hover/item:border-orange/30 group-hover/item:shadow-[0_0_16px_rgba(232,100,44,0.08)]`}
              >
                <img
                  src="/issuance-logos/microstrategy.1530cc8d.svg"
                  alt="nMSTR"
                  className={megaItemIconImgClass}
                />
              </div>
              <div className="flex flex-col gap-px">
                <span className={megaItemNameClass}>
                  {t("mega.items.nMSTR.name")}{" "}
                  <span className="text-[9px] font-bold px-1.5 py-px rounded-full uppercase tracking-[0.5px] bg-white/6 text-text-tertiary">
                    {t("mega.tags.soon")}
                  </span>
                </span>
                <span className={megaItemDescClass}>
                  {t("mega.items.nMSTR.desc")}
                </span>
              </div>
            </Link>
            <Link href="/issuances" className={megaProductItemClass}>
              <div
                className={`${megaItemIconBase} group-hover/item:border-orange/30 group-hover/item:shadow-[0_0_16px_rgba(232,100,44,0.08)]`}
              >
                <img
                  src="/issuance-logos/tesla.043c73d1.svg"
                  alt="nTSLA"
                  className={megaItemIconImgClass}
                />
              </div>
              <div className="flex flex-col gap-px">
                <span className={megaItemNameClass}>
                  {t("mega.items.nTSLA.name")}{" "}
                  <span className="text-[9px] font-bold px-1.5 py-px rounded-full uppercase tracking-[0.5px] bg-white/6 text-text-tertiary">
                    {t("mega.tags.soon")}
                  </span>
                </span>
                <span className={megaItemDescClass}>
                  {t("mega.items.nTSLA.desc")}
                </span>
              </div>
            </Link>
            <Link href="/issuances" className={megaProductItemClass}>
              <div
                className={`${megaItemIconBase} bg-orange-subtle! border-orange/15! text-orange group-hover/item:border-orange/40! group-hover/item:bg-orange/12!`}
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-px">
                <span className="font-display text-[13.5px] font-semibold text-orange flex items-center gap-2">
                  {t("mega.items.viewAll.name")}
                </span>
                <span className={megaItemDescClass}>
                  {t("mega.items.viewAll.desc")}
                </span>
              </div>
            </Link>
          </div>

          {/* Cell 2: Featured */}
          <div className="p-4 bg-linear-to-br from-orange/5 to-orange/[0.01] border-b border-white/6">
            <Link
              href="/issuances"
              className="group/featured flex flex-col h-full rounded-[14px] bg-white/3 border border-white/6 relative overflow-hidden no-underline text-text-primary transition-all duration-300 hover:border-orange/25 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-25 h-25 rounded-full bg-orange/15 blur-2xl -top-5 -right-[15px]" />
                <div className="absolute w-17.5 h-17.5 rounded-full bg-orange-light/10 blur-2xl -bottom-[15px] -left-2.5" />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                    maskImage:
                      "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%)",
                  }}
                />
              </div>
              <div className="relative z-1 py-5 px-4.5 flex flex-col items-center text-center flex-1">
                <div className="text-[9px] font-bold tracking-[2px] uppercase text-orange bg-orange-subtle border border-orange/15 py-[3px] px-2.5 rounded-full mb-3">
                  {t("mega.featured.badge")}
                </div>
                <div className="w-11.5 h-11.5 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center mb-2.5 overflow-hidden">
                  <img
                    src="/issuance-logos/ustbl.svg"
                    alt="USTBL"
                    className="w-full h-full object-contain p-[7px]"
                  />
                </div>
                <div className="font-display text-base font-bold text-text-primary">
                  USTBL
                </div>
                <div className="text-[11px] text-text-tertiary mb-2.5">
                  {t("mega.featured.subtitle")}
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="font-display text-[28px] font-bold text-emerald-400 leading-none">
                    4.3%
                  </span>
                  <span className="text-[13px] font-semibold text-emerald-400 opacity-70">
                    ATM Yield
                  </span>
                </div>
                <span className="inline-flex items-center gap-2 py-[7px] px-4.5 rounded-full bg-linear-to-br from-orange to-orange-light text-white text-xs font-semibold no-underline transition-all duration-300 mt-auto group-hover/featured:shadow-[0_0_20px_rgba(232,100,44,0.3)]">
                  {t("mega.featured.cta")} <span>&rarr;</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Cell 3: Infrastructure */}
          <div className="px-5 pt-4 pb-5 border-r border-white/6">
            <a
              href="#infrastructure"
              className={sectionTitleClass}
              onClick={(e) => handleScrollLink(e, "#infrastructure")}
            >
              {t("mega.infrastructure")}{" "}
              <svg
                className={sectionArrowClass}
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
              >
                <path
                  d="M1 9L9 1M9 1H3M9 1V7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="https://liquid.net"
              target="_blank"
              rel="noopener noreferrer"
              className={megaProductItemClass}
            >
              <div
                className={`${megaItemIconBase} bg-blue-500/10! border-blue-500/20! text-blue-400 group-hover/item:border-blue-500/40! group-hover/item:shadow-[0_0_16px_rgba(59,130,246,0.12)]`}
              >
                <img
                  src="/partners-logos/liquid-logo.049e83b7.png"
                  alt="Liquid Network"
                  className={megaItemIconImgClass}
                  style={{ filter: "brightness(2)" }}
                />
              </div>
              <div className="flex flex-col gap-px">
                <span className={megaItemNameClass}>
                  {t("mega.items.liquidNetwork.name")}
                </span>
                <span className={megaItemDescClass}>
                  {t("mega.items.liquidNetwork.desc")}
                </span>
              </div>
            </a>
            <a
              href="https://blockstream.com/amp"
              target="_blank"
              rel="noopener noreferrer"
              className={megaProductItemClass}
            >
              <div
                className={`${megaItemIconBase} bg-blue-500/10! border-blue-500/20! text-blue-400 group-hover/item:border-blue-500/40! group-hover/item:shadow-[0_0_16px_rgba(59,130,246,0.12)]`}
              >
                <img
                  src="/partners-logos/block-strem-amp-logo.ab6ef48b.svg"
                  alt="Blockstream AMP"
                  className={megaItemIconImgClass}
                />
              </div>
              <div className="flex flex-col gap-px">
                <span className={megaItemNameClass}>
                  {t("mega.items.blockstreamAmp.name")}
                </span>
                <span className={megaItemDescClass}>
                  {t("mega.items.blockstreamAmp.desc")}
                </span>
              </div>
            </a>
          </div>

          {/* Cell 4: Platforms & Markets */}
          <div className="px-5 pt-4 pb-5">
            <a
              href="#platforms"
              className={sectionTitleClass}
              onClick={(e) => handleScrollLink(e, "#platforms")}
            >
              {t("mega.platformsMarkets")}{" "}
              <svg
                className={sectionArrowClass}
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
              >
                <path
                  d="M1 9L9 1M9 1H3M9 1V7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <Link href="/explore" className={megaProductItemClass}>
              <div
                className={`${megaItemIconBase} bg-orange-subtle! border-orange/20! text-orange group-hover/item:shadow-[0_0_16px_rgba(232,100,44,0.12)]`}
              >
                <img
                  src="/nexbridge-icon.png"
                  alt="NexBridge"
                  className={megaItemIconImgClass}
                />
              </div>
              <div className="flex flex-col gap-px">
                <span className={megaItemNameClass}>
                  {t("mega.items.otcDesk.name")}
                </span>
                <span className={megaItemDescClass}>
                  {t("mega.items.otcDesk.desc")}
                </span>
              </div>
            </Link>
            <a
              href="https://nextr.space"
              target="_blank"
              rel="noopener noreferrer"
              className={megaProductItemClass}
            >
              <div
                className={`${megaItemIconBase} bg-purple-500/10! border-purple-500/20! text-purple-400 group-hover/item:border-purple-500/40! group-hover/item:shadow-[0_0_16px_rgba(139,92,246,0.12)]`}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-px">
                <span className={megaItemNameClass}>
                  {t("mega.items.governance.name")}
                </span>
                <span className={megaItemDescClass}>
                  {t("mega.items.governance.desc")}
                </span>
              </div>
            </a>
            <a
              href="https://nexplace.com"
              target="_blank"
              rel="noopener noreferrer"
              className={megaProductItemClass}
            >
              <div
                className={`${megaItemIconBase} bg-emerald-500/10! border-emerald-500/20! text-emerald-400 group-hover/item:border-emerald-500/40! group-hover/item:shadow-[0_0_16px_rgba(16,185,129,0.12)]`}
              >
                <img
                  src="/nexplace-icon-logo.svg"
                  alt="NexPlace"
                  className={megaItemIconImgClass}
                />
              </div>
              <div className="flex flex-col gap-px">
                <span className={megaItemNameClass}>
                  {t("mega.items.exchange.name")}
                </span>
                <span className={megaItemDescClass}>
                  {t("mega.items.exchange.desc")}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Resources Mega Dropdown */}
      <div
        className={`${megaDropdownBase} w-90! max-w-[calc(100vw-48px)] ${
          activeDropdown === "resources-dropdown"
            ? "opacity-100 visible pointer-events-auto translate-y-0"
            : "opacity-0 invisible pointer-events-none translate-y-2"
        }`}
        onMouseEnter={cancelClose}
        onMouseLeave={closeAll}
      >
        <div className="p-3">
          <Link href="/legal-framework" className={megaProductItemClass}>
            <div
              className={`${megaItemIconBase} bg-orange-subtle! border-orange/20! text-orange group-hover/item:shadow-[0_0_16px_rgba(232,100,44,0.12)]`}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-px">
              <span className={megaItemNameClass}>
                {t("resourcesMega.legalFramework")}
              </span>
              <span className={megaItemDescClass}>
                {t("resourcesMega.legalDesc")}
              </span>
            </div>
          </Link>
          <Link href="/faq" className={megaProductItemClass}>
            <div
              className={`${megaItemIconBase} bg-purple-500/10! border-purple-500/20! text-purple-400 group-hover/item:border-purple-500/40! group-hover/item:shadow-[0_0_16px_rgba(139,92,246,0.12)]`}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-px">
              <span className={megaItemNameClass}>
                {t("resourcesMega.faqs")}
              </span>
              <span className={megaItemDescClass}>
                {t("resourcesMega.faqsDesc")}
              </span>
            </div>
          </Link>
          <Link href="/insights" className={megaProductItemClass}>
            <div
              className={`${megaItemIconBase} bg-emerald-500/10! border-emerald-500/20! text-emerald-400 group-hover/item:border-emerald-500/40! group-hover/item:shadow-[0_0_16px_rgba(16,185,129,0.12)]`}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-px">
              <span className={megaItemNameClass}>
                {t("resourcesMega.insights")}
              </span>
              <span className={megaItemDescClass}>
                {t("resourcesMega.insightsDesc")}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
