import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import ScrollReveal from '@/components/ScrollReveal'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'AboutPage' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: 'https://nexbridge.finance/about',
      type: 'website',
      images: ['https://nexbridge.finance/nexbridge-og.png'],
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: 'https://nexbridge.finance/about',
    },
  }
}

const TIMELINE_KEYS = ['founded', 'purpose', 'ustblLaunch', 'whatsNext'] as const

const LICENSE_KEYS = ['issuer', 'dasp', 'vasp', 'lei'] as const

const richText = {
  gradient: (chunks: React.ReactNode) => <span className="gradient-text">{chunks}</span>,
  br: () => <br />,
}

export default function AboutPage() {
  const t = useTranslations('AboutPage')

  return (
    <main>
      <ScrollReveal />

      {/* HERO */}
      <section className="relative pt-35 pb-15 text-center">
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
          }}
        />
        <div className="container">
          <div className="reveal">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange/15 bg-orange-subtle px-4 py-1.5 font-semibold tracking-[0.5px] text-orange text-[13px]">
              {t('hero.label')}
            </div>
            <h1
              className="font-display mb-4 font-extrabold leading-[1.15]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
            >
              {t.rich('hero.title', richText)}
            </h1>
            <p className="mx-auto max-w-150 text-[1.05rem] leading-[1.7] text-text-secondary">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20">
        <div className="container">
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="reveal relative overflow-hidden rounded-xl border border-white/6 bg-white/2 p-7 md:p-10">
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: 'linear-gradient(90deg, transparent, var(--orange), transparent)',
                }}
              />
              <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-orange/15 bg-orange-subtle text-orange">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
              </div>
              <h3 className="font-display mb-3 text-[1.2rem] font-bold">{t('mission.title')}</h3>
              <p className="text-[0.95rem] leading-[1.7] text-text-secondary">{t('mission.desc')}</p>
            </div>
            <div className="reveal relative overflow-hidden rounded-xl border border-white/6 bg-white/2 p-7 md:p-10">
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: 'linear-gradient(90deg, transparent, #60A5FA, transparent)',
                }}
              />
              <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-blue-400/15 bg-blue-400/10 text-blue-400">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-display mb-3 text-[1.2rem] font-bold">{t('vision.title')}</h3>
              <p className="text-[0.95rem] leading-[1.7] text-text-secondary">{t('vision.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="border-t border-white/6 py-20">
        <div className="container">
          <h2 className="reveal font-display mb-12 text-center text-[1.3rem] font-bold">
            {t.rich('story.title', richText)}
          </h2>
          <div className="relative mx-auto max-w-175">
            <div
              className="absolute left-6 top-0 bottom-0 w-0.5"
              style={{
                background: 'linear-gradient(180deg, var(--orange), rgba(232,100,44,0.1))',
              }}
            />
            {TIMELINE_KEYS.map((key) => (
              <div key={key} className="reveal relative mb-12 flex gap-8">
                <div className="ml-[19px] mt-1.5 h-3 w-3 shrink-0 rounded-full border-[3px] border-bg-dark bg-orange shadow-[0_0_0_2px_var(--orange)]" />
                <div>
                  <h4 className="font-display mb-2 text-base font-bold text-text-primary">
                    {t(`story.timeline.${key}.title` as never)}
                  </h4>
                  <p className="text-[0.9rem] leading-[1.7] text-text-secondary">
                    {t(`story.timeline.${key}.desc` as never)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LICENSES */}
      <section className="border-t border-white/6 py-20">
        <div className="container">
          <div className="reveal mb-12 text-center">
            <h2
              className="font-display mb-3 font-extrabold"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
            >
              {t.rich('licenses.title', richText)}
            </h2>
            <p className="mx-auto max-w-125 text-[0.95rem] text-text-secondary">
              {t('licenses.subtitle')}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {LICENSE_KEYS.map((key) => (
              <div key={key} className="reveal rounded-lg border border-white/6 bg-white/2 px-5 py-7 text-center">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.5px] text-text-tertiary">
                  {t(`licenses.cards.${key}.label` as never)}
                </div>
                <div
                  className="font-display mb-1 font-bold text-orange text-[1.1rem]"
                  style={key === 'lei' ? { fontSize: '0.75rem' } : undefined}
                >
                  {t(`licenses.cards.${key}.value` as never)}
                </div>
                <div className="text-xs text-text-tertiary">
                  {t(`licenses.cards.${key}.source` as never)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
