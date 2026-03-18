'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const LETTER_TERMS: Record<string, string[]> = {
  A: ['aml'],
  B: ['bestExecution'],
  C: ['collateral', 'cnad', 'custodian'],
  D: ['dasp'],
  K: ['kyc'],
  L: ['liquidNetwork'],
  N: ['nav'],
  O: ['otcDesk'],
  P: ['por'],
  R: ['redemption', 'rid'],
  S: ['selfCustody', 'serialIssuer'],
  T: ['tPlusOne', 'tokenization', 'transfer'],
  W: ['wysiwyg', 'whitelistedWallet'],
}

const ACTIVE_LETTERS = new Set(Object.keys(LETTER_TERMS))

export default function GlossaryPage() {
  const t = useTranslations('GlossaryPage')

  useEffect(() => {
    const letterSections = document.querySelectorAll('[id^="letter-"]')
    const alphaLinks = document.querySelectorAll('[data-alpha-nav] a:not([data-disabled])')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            alphaLinks.forEach((link) => {
              link.toggleAttribute('data-active', link.getAttribute('href') === '#' + id)
            })
          }
        })
      },
      { threshold: 0.3, rootMargin: '-100px 0px -60% 0px' }
    )

    letterSections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <ScrollReveal />

      {/* HERO */}
      <section className="relative pt-35 pb-15 text-center after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.06] after:to-transparent">
        <div className="container">
          <div className="reveal">
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.15] mb-4">
              {t.rich('hero.title', { gradient: (chunks) => <span className="gradient-text">{chunks}</span>, br: () => <br /> })}
            </h1>
            <p className="text-[1.05rem] text-text-secondary max-w-150 mx-auto leading-[1.6]">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* GLOSSARY */}
      <section className="pt-15 pb-25">
        <div className="max-w-215 mx-auto px-6">
          {/* Alphabet Jump Nav */}
          <div data-alpha-nav className="flex flex-wrap justify-center gap-2 mb-12 reveal">
            {ALPHABET.map((letter) =>
              ACTIVE_LETTERS.has(letter) ? (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-md bg-bg-card border border-white/[0.06] text-text-secondary font-display text-[13px] md:text-sm font-semibold no-underline transition-all duration-250 ease-in-out hover:bg-orange-subtle hover:border-orange/30 hover:text-orange hover:shadow-[0_0_20px_rgba(232,100,44,0.1)] data-[active]:bg-orange-subtle data-[active]:border-orange/30 data-[active]:text-orange data-[active]:shadow-[0_0_20px_rgba(232,100,44,0.1)]"
                >
                  {letter}
                </a>
              ) : (
                <a key={letter} data-disabled className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-md bg-bg-card border border-white/[0.06] text-text-secondary font-display text-[13px] md:text-sm font-semibold no-underline opacity-25 pointer-events-none cursor-default">
                  {letter}
                </a>
              )
            )}
          </div>

          {/* Letter Sections */}
          {ALPHABET.filter((letter) => ACTIVE_LETTERS.has(letter)).map((letter) => (
            <div key={letter} className="mb-12 reveal" id={`letter-${letter}`}>
              <div className="sticky top-20 z-10 py-3 mb-4 border-b border-white/[0.06] bg-bg-dark">
                <span className="font-display text-[1.6rem] md:text-3xl font-extrabold gradient-text">{letter}</span>
              </div>
              {LETTER_TERMS[letter].map((termKey) => (
                <div
                  key={termKey}
                  className="p-4 px-4.5 md:p-5 md:px-6 bg-bg-card border border-white/[0.06] rounded-md mb-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-orange/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_0_0_1px_rgba(232,100,44,0.06)] hover:-translate-y-0.5"
                >
                  <div className="font-display text-base font-bold text-text-primary mb-1.5 flex items-center gap-2">
                    {t(`terms.${termKey}.term`)}
                    {t.has(`terms.${termKey}.abbr`) && (
                      <span className="text-[11px] font-bold py-0.5 px-2 rounded-full bg-orange-subtle border border-orange/15 text-orange tracking-wide uppercase">
                        {t(`terms.${termKey}.abbr`)}
                      </span>
                    )}
                  </div>
                  <p className="text-[0.9rem] text-text-secondary leading-[1.7]">{t(`terms.${termKey}.definition`)}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
