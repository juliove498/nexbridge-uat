import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'

const BADGE_CLASSES: Record<string, string> = {
  update:
    'bg-[rgba(232,100,44,0.2)] text-orange-light border border-[rgba(232,100,44,0.25)]',
  info: 'bg-[rgba(59,130,246,0.15)] text-[#60A5FA] border border-[rgba(59,130,246,0.2)]',
  pressRelease:
    'bg-[rgba(139,92,246,0.15)] text-[#A78BFA] border border-[rgba(139,92,246,0.2)]',
}

const ARTICLES = [
  {
    key: 'ustblRidUpdate' as const,
    href: '/insights/ustbl-rid-update-2025',
    image: '/insights/USTBL_UPDATE_1_a31a4af527.jpg',
    alt: 'USTBL RID Update - September 2025',
    badgeKey: 'update' as const,
  },
  {
    key: 'auditReport' as const,
    href: '/insights/audit-report',
    image: '/insights/USTBL_BLOG_3_9bc66e7887.jpg',
    alt: 'NexBridge and Grant Thornton Collaboration',
    badgeKey: 'info' as const,
  },
  {
    key: 'pioneeringFinance' as const,
    href: '/insights/pioneering-the-future-of-finance',
    image: '/insights/USTBL_BLOG_4_5594f28c0c.jpg',
    alt: 'NexBridge Launches USTBL',
    badgeKey: 'info' as const,
  },
  {
    key: 'ustblReachesGoal' as const,
    href: '/insights/ustbl-reaches-goal',
    image: '/insights/USTBL_30_M_cbd139108f.jpg',
    alt: 'USTBL Reaches $30 Million Soft Cap',
    badgeKey: 'pressRelease' as const,
  },
  {
    key: 'ustblLaunch' as const,
    href: '/insights/ustbl',
    image: '/insights/blog_ustbl_49381b26a5.jpg',
    alt: 'First Regulated Public Offering of Tokenized U.S. Treasury Bills',
    badgeKey: 'info' as const,
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('InsightsPage')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: 'https://nexbridge.finance/insights',
      type: 'website',
      images: ['https://nexbridge.finance/nexbridge-og.png'],
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: 'https://nexbridge.finance/insights' },
  }
}

export default function InsightsPage() {
  const t = useTranslations('InsightsPage')

  return (
    <main>
      <ScrollReveal />

      {/* HERO */}
      <section className="relative pt-35 pb-15 text-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-white/6 after:to-transparent">
        <div className="container">
          <div className="reveal">
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.15] mb-4">
              {t.rich('hero.title', { gradient: (chunks) => <span className="gradient-text">{chunks}</span>, br: () => <br /> })}
            </h1>
            <p className="text-[1.05rem] text-text-secondary max-w-150 mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className="py-15 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
            {ARTICLES.map((article) => (
              <Link
                key={article.key}
                href={article.href}
                className="group reveal flex flex-col relative overflow-hidden bg-bg-card border border-white/6 rounded-lg no-underline text-inherit transition-all duration-[0.4s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-[rgba(232,100,44,0.25)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_0_1px_rgba(232,100,44,0.1),0_0_40px_rgba(232,100,44,0.06)]"
              >
                <div className="relative w-full aspect-video overflow-hidden bg-white/2">
                  <img
                    src={article.image}
                    alt={article.alt}
                    className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <div
                    className={`absolute top-3.5 left-3.5 inline-flex px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase z-2 backdrop-blur-md [-webkit-backdrop-filter:blur(12px)] ${BADGE_CLASSES[article.badgeKey] ?? BADGE_CLASSES.info}`}
                  >
                    {t(`badges.${article.badgeKey}`)}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-[1.1rem] font-bold leading-snug mb-3 text-text-primary transition-colors duration-300 group-hover:text-orange-light">
                    {t(`articles.${article.key}.title`)}
                  </h3>
                  <p className="text-[0.88rem] text-text-secondary leading-relaxed mb-5 flex-1">
                    {t(`articles.${article.key}.excerpt`)}
                  </p>
                  <div className="inline-flex items-center gap-2 text-orange font-semibold text-sm transition-[gap] duration-300">
                    {t('readMore')}{' '}
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
  )
}
