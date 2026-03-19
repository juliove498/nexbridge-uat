import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import { getPublishedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

const BADGE_CLASSES: Record<string, string> = {
  update:
    "bg-[rgba(232,100,44,0.2)] text-orange-light border border-[rgba(232,100,44,0.25)]",
  info: "bg-[rgba(59,130,246,0.15)] text-[#60A5FA] border border-[rgba(59,130,246,0.2)]",
  pressRelease:
    "bg-[rgba(139,92,246,0.15)] text-[#A78BFA] border border-[rgba(139,92,246,0.2)]",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("InsightsPage");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url: "https://nexbridge.finance/insights",
      type: "website",
      images: ["https://nexbridge.finance/nexbridge-og.png"],
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "https://nexbridge.finance/insights" },
  };
}

export default async function InsightsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("InsightsPage");
  const articles = await getPublishedArticles(locale);

  return (
    <main>
      <ScrollReveal />

      {/* HERO */}
      <section className="relative pt-35 pb-15 text-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-white/6 after:to-transparent">
        <div className="container">
          <div className="reveal">
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.15] mb-4">
              {t.rich("hero.title", {
                gradient: (chunks) => (
                  <span className="gradient-text">{chunks}</span>
                ),
                br: () => <br />,
              })}
            </h1>
            <p className="text-[1.05rem] text-text-secondary max-w-150 mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className="py-15 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/insights/${article.slug}`}
                className="group reveal flex flex-col relative overflow-hidden bg-bg-card border border-white/6 rounded-lg no-underline text-inherit transition-all duration-[0.4s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-[rgba(232,100,44,0.25)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_0_1px_rgba(232,100,44,0.1),0_0_40px_rgba(232,100,44,0.06)]"
              >
                <div className="relative w-full aspect-video overflow-hidden bg-white/2">
                  <img
                    src={article.hero_image_url}
                    alt={article.hero_image_alt}
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <div
                    className={`absolute top-3.5 left-3.5 inline-flex px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase z-2 backdrop-blur-md [-webkit-backdrop-filter:blur(12px)] ${BADGE_CLASSES[article.badge_type] ?? BADGE_CLASSES.info}`}
                  >
                    {article.badge_label}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-[1.1rem] font-bold leading-snug mb-3 text-text-primary transition-colors duration-300 group-hover:text-orange-light">
                    {article.title}
                  </h3>
                  <p className="text-[0.88rem] text-text-secondary leading-relaxed mb-5 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-2 text-orange font-semibold text-sm transition-[gap] duration-300">
                    {t("readMore")}{" "}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
