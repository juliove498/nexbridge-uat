import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ScrollReveal from "@/components/ScrollReveal";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("TutorialsPage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      images: ["https://nexbridge.finance/nexbridge-og.png"],
      url: "https://nexbridge.finance/tutorials",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "https://nexbridge.finance/tutorials" },
  };
}

const TUTORIALS = [
  {
    key: "whitelistWallet" as const,
    badgeKey: "gettingStarted" as const,
    videoId: "PdX_Tzcy_6U",
  },
  {
    key: "sendIssuances" as const,
    badgeKey: "transfers" as const,
    videoId: "DrBL0RUenNk",
  },
  {
    key: "importWallet" as const,
    badgeKey: "walletSetup" as const,
    videoId: "GbCF1iBxkuA",
  },
];

export default async function TutorialsPage() {
  const t = await getTranslations("TutorialsPage");

  return (
    <main>
      <ScrollReveal />

      {/* HERO */}
      <section className="relative pt-40 pb-15 md:pt-35 md:pb-12 text-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-white/6 after:to-transparent">
        <div className="container">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-orange-subtle border border-orange/15 rounded-full text-[13px] font-semibold text-orange mb-6 tracking-wide">
              {t("hero.label")}
            </div>
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] sm:text-[1.6rem] font-extrabold leading-tight mb-4">
              {t.rich("hero.title", {
                gradient: (chunks) => (
                  <span className="gradient-text">{chunks}</span>
                ),
                br: () => <br />,
              })}
            </h1>
            <p className="text-[1.05rem] sm:text-[0.95rem] text-text-secondary max-w-160 mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* TUTORIALS */}
      <section className="py-20 md:py-12">
        <div className="container">
          <div className="flex flex-col gap-10 md:gap-8">
            {TUTORIALS.map(({ key, badgeKey, videoId }) => (
              <div
                className="reveal relative overflow-hidden rounded-xl border border-white/6 bg-white/2 transition-all duration-300 hover:bg-white/4 hover:border-white/10 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-orange before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                key={key}
              >
                <div className="relative w-full pt-[56.25%] bg-black">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={t(`tutorials.${key}.title`)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="p-8 md:p-6">
                  <div className="inline-flex items-center gap-2 py-1 px-3 bg-orange-subtle border border-orange/15 rounded-full text-[11px] font-semibold text-orange mb-4 w-fit tracking-wide uppercase">
                    {t(`badges.${badgeKey}`)}
                  </div>
                  <h2 className="font-display text-xl md:text-[1.15rem] font-bold leading-snug mb-3 text-text-primary">
                    {t(`tutorials.${key}.title`)}
                  </h2>
                  <p className="text-[0.95rem] text-text-secondary leading-relaxed mb-6 max-w-180">
                    {t(`tutorials.${key}.desc`)}
                  </p>
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <a
                      href="https://nexbridge.kb.help"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-text-tertiary no-underline text-[13px] font-medium transition-colors hover:text-orange [&_svg]:w-4 [&_svg]:h-4"
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
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                      {t("links.helpCenter")}
                    </a>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-text-tertiary no-underline text-[13px] font-medium transition-colors hover:text-orange [&_svg]:w-4 [&_svg]:h-4"
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
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                      {t("links.contactUs")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="pt-15 pb-25">
        <div className="container">
          <div
            className="reveal relative overflow-hidden rounded-xl border border-white/6 p-12 md:p-9 md:px-6 text-center before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-orange before:to-transparent"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,100,44,0.1), transparent), linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.5) 40%, rgba(5,5,5,0.6) 100%), url("/cta-bg.jpg") center 60%/cover no-repeat',
            }}
          >
            <h2 className="font-display text-2xl font-bold mb-2">
              {t("cta.title")}
            </h2>
            <p className="text-text-secondary text-[0.95rem] max-w-120 mx-auto mb-7 leading-relaxed">
              {t("cta.desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap [&_a]:w-full [&_a]:justify-center sm:[&_a]:w-auto">
              <a
                href="https://nexbridge.kb.help"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-linear-to-br from-orange to-orange-light text-white no-underline rounded-full font-semibold text-[0.95rem] transition-all duration-300 border-0 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,100,44,0.25)]"
              >
                {t("cta.ctaPrimary")}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-white/4 border border-white/6 text-text-primary no-underline rounded-full font-semibold text-[0.95rem] transition-all duration-300 hover:bg-white/8 hover:border-white/12"
              >
                {t("cta.ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
