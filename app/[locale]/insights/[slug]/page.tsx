import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug, locale);
  if (!article) return {};

  const title = `${article.title} — NexBridge`;
  const description = article.excerpt ?? "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://nexbridge.finance/insights/${slug}`,
      type: "website",
      images: ["https://nexbridge.finance/nexbridge-og.png"],
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: `https://nexbridge.finance/insights/${slug}` },
  };
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  );
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug, locale);

  if (!article) notFound();

  const sanitizedBody = sanitizeHtml(article.body_html ?? "", {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "h4", "cite"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "loading"],
      a: ["href", "target", "rel"],
    },
  });

  return (
    <main>
      <ScrollReveal />

      {/* HERO */}
      <header className="relative w-full h-85 md:h-105 mt-4 overflow-hidden flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${article.hero_image_url}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[rgb(5,5,5)] via-[rgba(5,5,5,0.7)] to-[rgba(5,5,5,0.3)]" />
        <div className="relative z-2 max-w-190 mx-auto px-6 pb-8 md:pb-12 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-subtle border border-[rgba(232,100,44,0.2)] rounded-full text-[11px] font-bold tracking-widest uppercase text-orange mb-4">
            {article.badge_label}
          </div>
          <h1 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-tight mb-4 text-text-primary">
            {article.title}
          </h1>
          {article.date_label && (
            <div className="inline-flex items-center gap-2 text-sm text-text-secondary [&_svg]:opacity-60">
              <CalendarIcon />
              {article.date_label}
            </div>
          )}
        </div>
      </header>

      {/* ARTICLE BODY */}
      <article
        className="reveal max-w-180 mx-auto py-8 px-6 pb-15 md:py-12 md:px-6 md:pb-20
          [&_p]:text-base [&_p]:text-text-secondary [&_p]:leading-[1.85] [&_p]:mb-6
          [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mt-12 [&_h2]:mb-4
          [&_h3]:font-display [&_h3]:text-[1.35rem] [&_h3]:font-bold [&_h3]:text-text-primary [&_h3]:mt-10 [&_h3]:mb-4
          [&_h4]:font-display [&_h4]:text-[1.1rem] [&_h4]:font-semibold [&_h4]:text-orange-light [&_h4]:mt-7 [&_h4]:mb-3
          [&_blockquote]:border-l-4 [&_blockquote]:border-l-orange [&_blockquote]:py-4 [&_blockquote]:px-6 [&_blockquote]:my-8 [&_blockquote]:bg-[rgba(232,100,44,0.04)] [&_blockquote]:rounded-r-md
          [&_blockquote_p]:text-text-primary [&_blockquote_p]:italic [&_blockquote_p]:mb-2 [&_blockquote_p:last-child]:mb-0
          [&_blockquote_cite]:text-[13px] [&_blockquote_cite]:text-text-tertiary [&_blockquote_cite]:not-italic
          [&_ul]:list-none [&_ul]:p-0 [&_ul]:mb-6
          [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:text-[15px] [&_ul_li]:text-text-secondary [&_ul_li]:leading-relaxed [&_ul_li]:mb-2
          [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:top-2.5 [&_ul_li]:before:w-1.5 [&_ul_li]:before:h-1.5 [&_ul_li]:before:rounded-full [&_ul_li]:before:bg-orange
          [&_a]:text-orange [&_a]:no-underline [&_a]:border-b [&_a]:border-[rgba(232,100,44,0.3)] [&_a]:transition-colors [&_a:hover]:border-orange"
      >
        <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />

        <div className="mt-12">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-text-secondary no-underline text-sm font-medium py-2 transition-colors duration-200 hover:text-orange [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:-translate-x-0.5"
          >
            <BackArrowIcon /> Back to Insights
          </Link>
        </div>
      </article>
    </main>
  );
}
