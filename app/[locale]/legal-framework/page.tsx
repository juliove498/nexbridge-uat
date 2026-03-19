import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("LegalFrameworkPage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      images: ["https://nexbridge.finance/nexbridge-og.png"],
      url: "https://nexbridge.finance/legal-framework",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "https://nexbridge.finance/legal-framework" },
  };
}

export default async function LegalFrameworkPage() {
  const t = await getTranslations("LegalFrameworkPage");

  return (
    <main>
      <ScrollReveal />

      {/* HERO */}
      <section className="relative pt-35 pb-15 text-center before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_50%_50%_at_50%_30%,rgba(232,100,44,0.06),transparent)] before:pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.06] after:to-transparent">
        <div className="container">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-orange-subtle border border-orange/15 rounded-full text-[13px] font-semibold text-orange mb-6 tracking-[0.5px]">
              &#9878;&#65039; {t("hero.label")}
            </div>
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.15] mb-4">
              {t.rich("hero.title", {
                gradient: (chunks) => (
                  <span className="gradient-text">{chunks}</span>
                ),
                br: () => <br />,
              })}
            </h1>
            <p className="text-[1.05rem] text-text-secondary max-w-160 mx-auto leading-[1.7]">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Regulatory Process */}
        <section className="section">
          <div className="reveal mb-12">
            <h2 className="font-display text-[1.6rem] font-bold mb-2">
              {t("regulatoryProcess.title")}
            </h2>
            <p className="text-text-secondary text-[15px]">
              {t("regulatoryProcess.subtitle")}
            </p>
          </div>
          <div className="reveal grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(
              ["certified", "registered", "audited", "supervised"] as const
            ).map((key, i) => (
              <div
                key={key}
                className="group relative overflow-hidden bg-white/[0.02] border border-white/[0.06] rounded-xl py-9 px-6 text-center transition-all duration-300 hover:border-orange/20 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-gradient-to-r after:from-orange after:to-orange-light after:opacity-0 after:transition-opacity duration-300 group-hover:after:opacity-100"
              >
                <div className="font-display text-4xl font-bold bg-gradient-to-br from-orange to-orange-light bg-clip-text text-transparent mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="font-display text-lg font-bold mb-2.5">
                  {t(`regulatoryProcess.steps.${key}.title`)}
                </h4>
                <p className="text-sm text-text-tertiary leading-relaxed">
                  {t(`regulatoryProcess.steps.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Regulatory Authorizations */}
        <section className="section">
          <div className="reveal mb-12">
            <h2 className="font-display text-[1.6rem] font-bold mb-2">
              {t("authorizations.title")}
            </h2>
            <p className="text-text-secondary text-[15px]">
              {t("authorizations.subtitle")}
            </p>
          </div>
          <div className="reveal grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(["issuer", "dasp", "vasp", "lei"] as const).map((key) => (
              <div
                key={key}
                className="bg-white/[0.02] border border-white/[0.06] rounded-lg py-7 px-5 text-center transition-all duration-300 hover:border-orange/20 hover:-translate-y-0.5"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-text-tertiary mb-2.5">
                  {t(`authorizations.cards.${key}.label`)}
                </div>
                <div
                  className={`font-display text-[22px] font-bold text-orange mb-1.5 ${key === "lei" ? "text-[13px] break-all" : ""}`}
                >
                  {t(`authorizations.cards.${key}.value`)}
                </div>
                <div className="text-[13px] text-text-tertiary">
                  {t(`authorizations.cards.${key}.source`)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Regulatory Bodies */}
        <section className="section">
          <div className="reveal mb-12">
            <h2 className="font-display text-[1.6rem] font-bold mb-2">
              {t("regulatoryBodies.title")}
            </h2>
            <p className="text-text-secondary text-[15px]">
              {t("regulatoryBodies.subtitle")}
            </p>
          </div>
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["cnad", "cnv", "lei"] as const).map((key) => (
              <div
                key={key}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl py-9 px-7 transition-all duration-300 hover:border-white/10 hover:-translate-y-0.5"
              >
                <h4 className="font-display text-base font-bold mb-3.5 text-text-primary leading-snug">
                  {t(`regulatoryBodies.${key}.title`)}
                </h4>
                <p className="text-sm text-text-secondary leading-[1.8]">
                  {t(`regulatoryBodies.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance Features */}
        <section className="section">
          <div className="reveal mb-12">
            <h2 className="font-display text-[1.6rem] font-bold mb-2">
              {t("compliance.title")}
            </h2>
            <p className="text-text-secondary text-[15px]">
              {t("compliance.subtitle")}
            </p>
          </div>
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-4 items-start bg-white/[0.02] border border-white/[0.06] rounded-lg py-7 px-6 transition-all duration-300 hover:border-orange/20 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <div className="w-11 h-11 min-w-11 rounded-xl bg-orange-subtle border border-orange/15 flex items-center justify-center text-orange">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-display text-[15px] font-bold mb-1.5 text-text-primary">
                  {t("compliance.features.kycAml.title")}
                </h4>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {t("compliance.features.kycAml.desc")}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white/[0.02] border border-white/[0.06] rounded-lg py-7 px-6 transition-all duration-300 hover:border-orange/20 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <div className="w-11 h-11 min-w-11 rounded-xl bg-orange-subtle border border-orange/15 flex items-center justify-center text-orange">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-display text-[15px] font-bold mb-1.5 text-text-primary">
                  {t("compliance.features.proofOfReserves.title")}
                </h4>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {t("compliance.features.proofOfReserves.desc")}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white/[0.02] border border-white/[0.06] rounded-lg py-7 px-6 transition-all duration-300 hover:border-orange/20 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <div className="w-11 h-11 min-w-11 rounded-xl bg-orange-subtle border border-orange/15 flex items-center justify-center text-orange">
                <svg
                  width="22"
                  height="22"
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
              </div>
              <div>
                <h4 className="font-display text-[15px] font-bold mb-1.5 text-text-primary">
                  {t("compliance.features.investorProtection.title")}
                </h4>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {t("compliance.features.investorProtection.desc")}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white/[0.02] border border-white/[0.06] rounded-lg py-7 px-6 transition-all duration-300 hover:border-orange/20 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <div className="w-11 h-11 min-w-11 rounded-xl bg-orange-subtle border border-orange/15 flex items-center justify-center text-orange">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-display text-[15px] font-bold mb-1.5 text-text-primary">
                  {t("compliance.features.dailyNav.title")}
                </h4>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {t("compliance.features.dailyNav.desc")}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white/[0.02] border border-white/[0.06] rounded-lg py-7 px-6 transition-all duration-300 hover:border-orange/20 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <div className="w-11 h-11 min-w-11 rounded-xl bg-orange-subtle border border-orange/15 flex items-center justify-center text-orange">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-display text-[15px] font-bold mb-1.5 text-text-primary">
                  {t("compliance.features.transparentReporting.title")}
                </h4>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {t("compliance.features.transparentReporting.desc")}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white/[0.02] border border-white/[0.06] rounded-lg py-7 px-6 transition-all duration-300 hover:border-orange/20 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
              <div className="w-11 h-11 min-w-11 rounded-xl bg-orange-subtle border border-orange/15 flex items-center justify-center text-orange">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-display text-[15px] font-bold mb-1.5 text-text-primary">
                  {t("compliance.features.serialIssuer.title")}
                </h4>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  {t("compliance.features.serialIssuer.desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Looking Ahead */}
        <section className="section">
          <div className="reveal relative overflow-hidden text-center py-10 px-6 sm:py-15 sm:px-10 max-w-200 mx-auto bg-white/[0.02] border border-white/[0.06] rounded-xl before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(232,100,44,0.04),transparent)] before:pointer-events-none">
            <h3 className="font-display text-[1.4rem] font-bold mb-4 relative">
              {t("lookingAhead.title")}
            </h3>
            <p className="text-[15px] text-text-secondary leading-[1.8] max-w-150 mx-auto relative">
              {t("lookingAhead.desc")}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
