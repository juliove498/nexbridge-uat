import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import EcosystemFilter from '@/components/EcosystemFilter'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'EcosystemPage' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: 'https://nexbridge.finance/ecosystem',
      type: 'website',
      images: ['https://nexbridge.finance/nexbridge-og.png'],
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: 'https://nexbridge.finance/ecosystem',
    },
  }
}

export default async function EcosystemPage() {
  const t = await getTranslations('EcosystemPage')

  return (
    <main>
      <ScrollReveal />

      {/* HERO */}
      <section className="relative pt-40 pb-15 text-center sm:pt-35 sm:pb-12 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-white/6 after:to-transparent">
        <div className="container">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-subtle border border-orange/15 rounded-full text-[13px] font-semibold text-orange tracking-wide mb-6">{t('hero.label')}</div>
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.15] mb-4 sm:text-[1.6rem]">
              {t.rich('hero.title', { gradient: (chunks) => <span className="gradient-text">{chunks}</span>, br: () => <br /> })}
            </h1>
            <p className="text-[1.05rem] text-text-secondary max-w-160 mx-auto leading-[1.7] sm:text-[0.95rem]">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* FILTER BAR + PARTNER GRID (client component) */}
      <EcosystemFilter />

      {/* CTA BANNER */}
      <section className="pb-25">
        <div className="container">
          <div className="reveal relative overflow-hidden rounded-xl border border-white/6 px-12 py-12 text-center sm:px-6 sm:py-9 before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-orange before:to-transparent"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(232,100,44,0.1), transparent), linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.5) 40%, rgba(5,5,5,0.6) 100%), url("/cta-bg.jpg") center 60%/cover no-repeat',
            }}
          >
            <h2 className="font-display text-2xl font-bold mb-2">{t('cta.title')}</h2>
            <p className="text-text-secondary text-[0.95rem] max-w-130 mx-auto mb-7 leading-[1.6]">{t('cta.desc')}</p>
            <div className="flex gap-3 justify-center flex-wrap sm:flex-col sm:[&>a]:w-full sm:[&>a]:justify-center">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-linear-to-r from-orange to-orange-light text-white rounded-full font-semibold text-[0.95rem] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,100,44,0.25)]">{t('cta.ctaPrimary')}</Link>
              <a href="https://nexbridge.kb.help" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/4 border border-white/6 text-text-primary rounded-full font-semibold text-[0.95rem] transition-all duration-300 hover:bg-white/8 hover:border-white/12">
                {t('cta.ctaSecondary')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
