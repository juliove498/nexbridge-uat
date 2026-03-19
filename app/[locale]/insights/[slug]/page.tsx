import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'

const SLUGS = [
  'ustbl',
  'ustbl-reaches-goal',
  'ustbl-rid-update-2025',
  'pioneering-the-future-of-finance',
  'audit-report',
] as const

type Slug = (typeof SLUGS)[number]

const SLUG_TO_KEY: Record<Slug, string> = {
  ustbl: 'ustbl',
  'ustbl-reaches-goal': 'ustblReachesGoal',
  'ustbl-rid-update-2025': 'ustblRidUpdate2025',
  'pioneering-the-future-of-finance': 'pioneeringFinance',
  'audit-report': 'auditReport',
}

const HERO_IMAGES: Record<Slug, string> = {
  ustbl: '/insights/blog_ustbl_49381b26a5.jpg',
  'ustbl-reaches-goal': '/insights/USTBL_30_M_cbd139108f.jpg',
  'ustbl-rid-update-2025': '/insights/USTBL_UPDATE_1_a31a4af527.jpg',
  'pioneering-the-future-of-finance': '/insights/USTBL_BLOG_4_5594f28c0c.jpg',
  'audit-report': '/insights/USTBL_BLOG_3_9bc66e7887.jpg',
}

const META_DESCRIPTIONS: Record<Slug, string> = {
  ustbl:
    'USTBL by NexBridge: the first regulated tokenized U.S. Treasury Bills on the Liquid Network. 4.3% ATM yield, institutional-grade custody.',
  'ustbl-reaches-goal':
    "NexBridge's USTBL tokenized U.S. Treasury Bills reaches its fundraising goal. A milestone for regulated digital assets.",
  'ustbl-rid-update-2025':
    'Latest USTBL Reference Information Document (RID) update for 2025. Complete transparency on NexBridge\'s tokenized U.S. Treasury Bills.',
  'pioneering-the-future-of-finance':
    'How NexBridge is pioneering the future of finance through regulated digital assets, bridging traditional finance and blockchain infrastructure.',
  'audit-report':
    'Independent audit report for NexBridge\'s USTBL tokenized U.S. Treasury Bills. Transparency and regulatory compliance documentation.',
}

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const key = SLUG_TO_KEY[slug as Slug]
  const t = await getTranslations('InsightArticles')
  const title = t(`${key}.title`)
  const description = META_DESCRIPTIONS[slug as Slug] ?? ''

  return {
    title: `${title} — NexBridge`,
    description,
    openGraph: {
      title: `${title} — NexBridge`,
      description,
      url: `https://nexbridge.finance/insights/${slug}`,
      type: 'website',
      images: ['https://nexbridge.finance/nexbridge-og.png'],
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `https://nexbridge.finance/insights/${slug}` },
  }
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
  )
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
  )
}

/* ---------- Per-article body renderers ---------- */

function UstblBody({ t }: { t: (key: string) => string }) {
  return (
    <>
      <p>{t('ustbl.content.intro')}</p>

      <h3>{t('ustbl.sections.builtOnBitcoin')}</h3>
      <p>{t('ustbl.content.builtOnBitcoinP1')}</p>
      <p>{t('ustbl.content.builtOnBitcoinP2')}</p>

      <h3>{t('ustbl.sections.regulatoryFoundation')}</h3>
      <p>{t('ustbl.content.regulatoryP1')}</p>

      <h3>{t('ustbl.sections.strategicPartnerships')}</h3>
      <p>{t('ustbl.content.partnershipsP1')}</p>

      <h3>{t('ustbl.sections.democratizingAccess')}</h3>
      <p>{t('ustbl.content.democratizingP1')}</p>
    </>
  )
}

function UstblReachesGoalBody({ t }: { t: (key: string) => string }) {
  return (
    <>
      <p>{t('ustblReachesGoal.content.intro')}</p>
      <p>{t('ustblReachesGoal.content.p2')}</p>

      <h3>{t('ustblReachesGoal.sections.liquidEcosystem')}</h3>
      <p>{t('ustblReachesGoal.content.liquidEcosystemP1')}</p>

      <h3>{t('ustblReachesGoal.sections.keyPartners')}</h3>
      <ul>
        <li>
          <strong>Blockstream</strong> &mdash;{' '}
          {t('ustblReachesGoal.content.keyPartnersBlockstream').replace(
            /^Blockstream — /,
            ''
          )}
        </li>
        <li>
          <strong>Bitfinex Securities</strong> &mdash;{' '}
          {t('ustblReachesGoal.content.keyPartnersBitfinex').replace(
            /^Bitfinex Securities — /,
            ''
          )}
        </li>
      </ul>

      <hr className="w-15 h-0.5 bg-linear-to-r from-orange to-orange-light my-12 border-0" />

      <blockquote>
        <p>{t('ustblReachesGoal.content.quoteMichele')}</p>
        <cite>{t('ustblReachesGoal.content.quoteMicheleAttrib')}</cite>
      </blockquote>

      <blockquote>
        <p>{t('ustblReachesGoal.content.quoteNicolas')}</p>
        <cite>{t('ustblReachesGoal.content.quoteNicolasAttrib')}</cite>
      </blockquote>

      <p>{t('ustblReachesGoal.content.closing')}</p>
    </>
  )
}

function UstblRidUpdate2025Body({ t }: { t: (key: string) => string }) {
  return (
    <>
      <p>{t('ustblRidUpdate2025.content.intro')}</p>

      <h3>{t('ustblRidUpdate2025.sections.keyChanges')}</h3>

      <h4>{t('ustblRidUpdate2025.sections.yieldAndIssuer')}</h4>
      <p>{t('ustblRidUpdate2025.content.yieldP1')}</p>

      <h4>{t('ustblRidUpdate2025.sections.decimalExpansion')}</h4>
      <p>{t('ustblRidUpdate2025.content.decimalP1')}</p>
      <p>{t('ustblRidUpdate2025.content.decimalP2')}</p>
      <p>{t('ustblRidUpdate2025.content.decimalP3')}</p>

      <h4>{t('ustblRidUpdate2025.sections.additionalUpdates')}</h4>
      <p>{t('ustblRidUpdate2025.content.additionalP1')}</p>

      <hr className="w-15 h-0.5 bg-linear-to-r from-orange to-orange-light my-12 border-0" />

      <p>
        {t('ustblRidUpdate2025.content.closing').split('nexbridge.io/en/issuances')[0]}
        <a href="https://nexbridge.io/en/issuances" target="_blank" rel="noopener noreferrer">
          nexbridge.io/en/issuances
        </a>
        {' and '}
        <a href="https://ustbl.io" target="_blank" rel="noopener noreferrer">
          ustbl.io
        </a>
        , where an archive of previous versions is also maintained for reference.
      </p>
    </>
  )
}

function PioneeringFinanceBody({ t }: { t: (key: string) => string }) {
  return (
    <>
      <p>{t('pioneeringFinance.content.intro')}</p>

      <h3>{t('pioneeringFinance.sections.technicalFoundation')}</h3>
      <p>{t('pioneeringFinance.content.technicalP1')}</p>
      <p>{t('pioneeringFinance.content.technicalP2')}</p>

      <h3>{t('pioneeringFinance.sections.regulatoryFramework')}</h3>
      <p>{t('pioneeringFinance.content.regulatoryP1')}</p>

      <h3>{t('pioneeringFinance.sections.marketContext')}</h3>
      <p>{t('pioneeringFinance.content.marketP1')}</p>
      <p>{t('pioneeringFinance.content.marketP2')}</p>

      <h3>{t('pioneeringFinance.sections.futurePlans')}</h3>
      <p>{t('pioneeringFinance.content.futureP1')}</p>
    </>
  )
}

function AuditReportBody({ t }: { t: (key: string) => string }) {
  return (
    <>
      <p>{t('auditReport.content.intro')}</p>

      <h3>{t('auditReport.sections.fullReserveBacking')}</h3>
      <p>{t('auditReport.content.fullReserveP1')}</p>

      <h3>{t('auditReport.sections.underlyingAssets')}</h3>
      <p>{t('auditReport.content.underlyingP1')}</p>

      <hr className="w-15 h-0.5 bg-linear-to-r from-orange to-orange-light my-12 border-0" />

      <blockquote>
        <p>{t('auditReport.content.quote')}</p>
        <cite>{t('auditReport.content.quoteAttrib')}</cite>
      </blockquote>

      <p>
        {t('auditReport.content.closing').split('ustbl.io/docs/Audits.pdf')[0]}
        <a href="https://ustbl.io/docs/Audits.pdf" target="_blank" rel="noopener noreferrer">
          ustbl.io/docs/Audits.pdf
        </a>
        , reinforcing NexBridge&apos;s dedication to open and verifiable financial operations.
      </p>
    </>
  )
}

const BODY_RENDERERS: Record<Slug, React.FC<{ t: (key: string) => string }>> = {
  ustbl: UstblBody,
  'ustbl-reaches-goal': UstblReachesGoalBody,
  'ustbl-rid-update-2025': UstblRidUpdate2025Body,
  'pioneering-the-future-of-finance': PioneeringFinanceBody,
  'audit-report': AuditReportBody,
}

/* ---------- Page component ---------- */

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const validSlug = slug as Slug
  const key = SLUG_TO_KEY[validSlug]

  if (!key) {
    const { notFound } = await import('next/navigation')
    notFound()
  }

  const t = await getTranslations('InsightArticles')

  return <ArticleView slug={validSlug} translationKey={key} t={t} />
}

function ArticleView({
  slug,
  translationKey,
  t,
}: {
  slug: Slug
  translationKey: string
  t: Awaited<ReturnType<typeof getTranslations<'InsightArticles'>>>
}) {
  const heroImage = HERO_IMAGES[slug]
  const ArticleBody = BODY_RENDERERS[slug]

  return (
    <main>
      <ScrollReveal />

      {/* HERO */}
      <header className="relative w-full h-85 md:h-105 mt-4 overflow-hidden flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[rgb(5,5,5)] via-[rgba(5,5,5,0.7)] to-[rgba(5,5,5,0.3)]" />
        <div className="relative z-2 max-w-190 mx-auto px-6 pb-8 md:pb-12 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-subtle border border-[rgba(232,100,44,0.2)] rounded-full text-[11px] font-bold tracking-widest uppercase text-orange mb-4">
            {t(`${translationKey}.badge`)}
          </div>
          <h1 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-tight mb-4 text-text-primary">
            {t(`${translationKey}.title`)}
          </h1>
          <div className="inline-flex items-center gap-2 text-sm text-text-secondary [&_svg]:opacity-60">
            <CalendarIcon />
            {t(`${translationKey}.date`)}
          </div>
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
        <ArticleBody t={t} />

        <div className="mt-12">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-text-secondary no-underline text-sm font-medium py-2 transition-colors duration-200 hover:text-orange [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:-translate-x-0.5"
          >
            <BackArrowIcon /> {t('backToInsights')}
          </Link>
        </div>
      </article>
    </main>
  )
}
