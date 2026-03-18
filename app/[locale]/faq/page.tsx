'use client'

import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ScrollReveal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const FAQ_STRUCTURE = [
  {
    categoryKey: 'whoWeAre' as const,
    questions: [
      'whatIsNexbridge',
      'compareToEtfs',
      'howRegulated',
      'whyLiquid',
      'proofOfReserve',
      'whoSafeguards',
      'multichain',
    ] as const,
  },
  {
    categoryKey: 'whatYouCanBuy' as const,
    questions: ['whatIsUstbl', 'whatProducts', 'ustblMoreThanCollateral'] as const,
  },
  {
    categoryKey: 'howCanYouBuy' as const,
    questions: [
      'whoCanAccess',
      'otcOnboarding',
      'subscriptionsRedemptions',
      'whereTokensHeld',
      'feesAndCosts',
    ] as const,
  },
  {
    categoryKey: 'whatsNext' as const,
    questions: ['nearTermFocus', 'longTermVision'] as const,
  },
]

export default function FaqPage() {
  const t = useTranslations('FaqPage')
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  return (
    <main>
      <ScrollReveal />

      {/* HERO */}
      <header className="relative pt-40 pb-20 text-center before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_50%_50%_at_50%_30%,rgba(232,100,44,0.06),transparent)] before:pointer-events-none after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-white/6 after:to-transparent">
        <div className="container">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[2px] uppercase text-orange bg-orange-subtle border border-orange/15 rounded-full px-4 py-1.5 mb-6">
              {t('hero.label')}
            </div>
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[1.15] mb-4">
              {t.rich('hero.title', { gradient: (chunks) => <span className="gradient-text">{chunks}</span>, br: () => <br /> })}
            </h1>
            <p className="text-[17px] text-text-secondary max-w-140 mx-auto leading-[1.7]">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </header>

      {/* FAQ CONTENT */}
      <section className="pb-20">
        <div className="container">
          {FAQ_STRUCTURE.map(({ categoryKey, questions }) => (
            <div
              key={categoryKey}
              className="reveal mb-12 last:mb-0"
              ref={(el) => {
                if (el) categoryRefs.current.set(categoryKey, el)
              }}
            >
              <div className="font-display text-[11px] font-bold tracking-[2.5px] uppercase text-orange pb-3.5 mb-1 border-b border-orange/15">
                {t(`categories.${categoryKey}`)}
              </div>
              <Accordion className="w-full">
                {questions.map((qKey) => (
                  <AccordionItem
                    key={qKey}
                    value={qKey}
                    className="border-b border-white/6 last:border-b-0"
                  >
                    <AccordionTrigger
                      className="w-full bg-transparent border-none flex items-center justify-between py-5 px-0 cursor-pointer text-text-primary font-sans text-[15px] font-medium text-left transition-colors duration-200 gap-4 hover:text-orange **:data-[slot=accordion-trigger-icon]:text-text-tertiary **:data-[slot=accordion-trigger-icon]:shrink-0 **:data-[slot=accordion-trigger-icon]:transition-colors group-aria-expanded/accordion-trigger:**:data-[slot=accordion-trigger-icon]:text-orange rounded-none hover:no-underline"
                    >
                      {t(`questions.${qKey}.q`)}
                    </AccordionTrigger>
                    <AccordionContent className="text-text-secondary text-sm leading-[1.9] pb-6">
                      <p>{t(`questions.${qKey}.a`)}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {/* Help Banner */}
          <div className="reveal flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-16 p-6 sm:p-9 bg-white/2 border border-white/6 rounded-xl relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-orange before:to-transparent sm:text-left text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-subtle border border-orange/15 flex items-center justify-center text-orange shrink-0">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-display text-[1.15rem] font-bold text-text-primary mb-1">
                {t('help.title')}
              </h3>
              <p className="text-[0.9rem] text-text-secondary leading-relaxed">
                {t('help.desc')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-3 w-full sm:w-auto shrink-0">
              <a
                href="https://nexbridge.kb.help"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center sm:justify-start gap-2 px-7 py-3 bg-linear-to-r from-orange to-orange-light text-white no-underline rounded-full font-semibold text-[0.9rem] whitespace-nowrap shrink-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,100,44,0.25)] w-full sm:w-auto [&>span]:transition-transform [&:hover>span]:translate-x-1"
              >
                {t('help.visitHelpCenter')} <span>&rarr;</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center sm:justify-start gap-2 px-6 py-3 bg-white/4 border border-white/6 text-text-secondary no-underline rounded-full font-medium text-[0.9rem] whitespace-nowrap transition-all duration-300 hover:text-text-primary hover:border-white/15 hover:bg-white/6 w-full sm:w-auto"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {t('help.emailUs')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
