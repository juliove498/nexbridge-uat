import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url: "https://nexbridge.finance/contact",
      type: "website",
      images: ["https://nexbridge.finance/nexbridge-og.png"],
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: "https://nexbridge.finance/contact",
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");

  return (
    <main>
      <ScrollReveal />

      {/* HERO */}
      <header className="relative pt-35 pb-16 text-center before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_50%_50%_at_50%_30%,rgba(232,100,44,0.06),transparent)] before:pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.06] after:to-transparent">
        <div className="container">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[2px] uppercase text-orange bg-orange-subtle border border-orange/15 py-1.5 px-4 rounded-full mb-6">
              {t("hero.label")}
            </div>
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[1.15] mb-4">
              {t.rich("hero.title", {
                gradient: (chunks) => (
                  <span className="gradient-text">{chunks}</span>
                ),
                br: () => <br />,
              })}
            </h1>
            <p className="text-[17px] text-text-secondary max-w-140 mx-auto leading-[1.7]">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </header>

      {/* CONTACT FORM */}
      <section className="pt-12 pb-20">
        <div className="container">
          <div className="reveal max-w-180 mx-auto bg-bg-card border border-white/[0.06] rounded-xl p-0 relative overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.3),0_0_80px_rgba(232,100,44,0.03)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-orange before:to-transparent before:z-[2] [&_iframe]:block [&_iframe]:w-full [&_iframe]:border-0 [&_iframe]:rounded-none [&_iframe]:invert-[0.92] [&_iframe]:brightness-95 [&_iframe]:bg-transparent [&_iframe]:m-0 [&_iframe]:p-0 [&_iframe]:[color-scheme:light]">
            <iframe
              sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
              width="100%"
              height="660px"
              style={{ border: 0, overflow: "hidden", overflowX: "auto" }}
              src="https://forms.helpdesk.com?licenseID=1756635526&contactFormID=acb3bfcf-2292-44a5-9392-4d3e5274ba7c"
              title="Contact Form"
            >
              Your browser does not allow embedded content.
            </iframe>
          </div>

          <div className="reveal flex flex-col md:flex-row items-center md:items-stretch justify-center gap-8 flex-wrap max-w-180 mx-auto mt-10">
            <a
              href="mailto:info@nexbridge.io"
              className="flex items-center gap-3 py-3.5 px-6 bg-white/[0.02] border border-white/[0.06] rounded-full no-underline text-text-secondary text-sm font-medium transition-all duration-300 ease-in-out hover:text-text-primary hover:border-orange/25 hover:bg-orange/5 w-full md:w-auto max-w-90 md:max-w-none justify-center"
            >
              <div className="w-9 h-9 rounded-full bg-orange-subtle border border-orange/15 flex items-center justify-center text-orange shrink-0 [&_svg]:w-4.5 [&_svg]:h-4.5">
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
              </div>
              {t("info.email")}
            </a>
            <a
              href="https://t.me/NexBridge_RWA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-3.5 px-6 bg-white/[0.02] border border-white/[0.06] rounded-full no-underline text-text-secondary text-sm font-medium transition-all duration-300 ease-in-out hover:text-text-primary hover:border-orange/25 hover:bg-orange/5 w-full md:w-auto max-w-90 md:max-w-none justify-center"
            >
              <div className="w-9 h-9 rounded-full bg-orange-subtle border border-orange/15 flex items-center justify-center text-orange shrink-0 [&_svg]:w-4.5 [&_svg]:h-4.5">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </div>
              {t("info.telegram")}
            </a>
            <a
              href="https://nexbridge.kb.help"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-3.5 px-6 bg-white/[0.02] border border-white/[0.06] rounded-full no-underline text-text-secondary text-sm font-medium transition-all duration-300 ease-in-out hover:text-text-primary hover:border-orange/25 hover:bg-orange/5 w-full md:w-auto max-w-90 md:max-w-none justify-center"
            >
              <div className="w-9 h-9 rounded-full bg-orange-subtle border border-orange/15 flex items-center justify-center text-orange shrink-0 [&_svg]:w-4.5 [&_svg]:h-4.5">
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
              </div>
              {t("info.helpCenter")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
