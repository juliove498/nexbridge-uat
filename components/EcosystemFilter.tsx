'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

const LINK_ARROW_SVG = (
  <svg className="absolute top-4 right-4 w-3.5 h-3.5 text-text-tertiary opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TAG_STYLES: Record<string, string> = {
  'tag-infrastructure': 'bg-[rgba(59,130,246,0.12)] text-[#60A5FA]',
  'tag-exchanges': 'bg-[rgba(16,185,129,0.12)] text-[#34D399]',
  'tag-audit': 'bg-[rgba(245,158,11,0.12)] text-[#FBBF24]',
  'tag-custody': 'bg-[rgba(139,92,246,0.12)] text-[#A78BFA]',
  'tag-partners': 'bg-[rgba(236,72,153,0.12)] text-[#F472B6]',
}

type Partner = {
  key: string
  href: string
  category: string
  tagKey: string
  tagClass: string
  logo: React.ReactNode
}

const partners: Partner[] = [
  {
    key: 'liquidNetwork', href: 'https://liquid.net', category: 'infrastructure',
    tagKey: 'infrastructure', tagClass: 'tag-infrastructure',
    logo: <img src="/partners-logos/liquid-logo.049e83b7.png" alt="Liquid Network" style={{ filter: 'brightness(2)' }} />,
  },
  {
    key: 'blockstreamAmp', href: 'https://blockstream.com/amp', category: 'infrastructure',
    tagKey: 'infrastructure', tagClass: 'tag-infrastructure',
    logo: <img src="/partners-logos/block-strem-amp-logo.ab6ef48b.svg" alt="Blockstream AMP" />,
  },
  {
    key: 'blockstream', href: 'https://blockstream.com', category: 'infrastructure',
    tagKey: 'infrastructure', tagClass: 'tag-infrastructure',
    logo: <img src="/partners-logos/blockstream-logo.e3173fc7.svg" alt="Blockstream" />,
  },
  {
    key: 'bitfinex', href: 'https://bitfinex.com', category: 'exchanges',
    tagKey: 'exchange', tagClass: 'tag-exchanges',
    logo: <img src="/partners-logos/bitfinex-logo.380dd922.svg" alt="Bitfinex" />,
  },
  {
    key: 'bitfinexSecurities', href: 'https://bitfinexsecurities.com', category: 'exchanges',
    tagKey: 'exchange', tagClass: 'tag-exchanges',
    logo: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    key: 'coinstore', href: 'https://coinstore.com', category: 'exchanges',
    tagKey: 'exchange', tagClass: 'tag-exchanges',
    logo: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    key: 'xt', href: 'https://xt.com', category: 'exchanges',
    tagKey: 'exchange', tagClass: 'tag-exchanges',
    logo: <img src="/partners-logos/xt_logo.2d6a40fb.svg" alt="XT.com" />,
  },
  {
    key: 'grantThornton', href: 'https://grantthornton.com', category: 'audit',
    tagKey: 'audit', tagClass: 'tag-audit',
    logo: <img src="/partners-logos/thornton-logo.15d4968b.svg" alt="Grant Thornton" />,
  },
  {
    key: 'cnad', href: 'https://cnad.gob.sv', category: 'audit',
    tagKey: 'regulator', tagClass: 'tag-audit',
    logo: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    key: 'particula', href: 'https://particula.io', category: 'audit',
    tagKey: 'rating', tagClass: 'tag-audit',
    logo: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
  {
    key: 'coinfirm', href: 'https://coinfirm.com', category: 'audit',
    tagKey: 'compliance', tagClass: 'tag-audit',
    logo: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
      </svg>
    ),
  },
  {
    key: 'blockstreamGreen', href: 'https://blockstream.com/green', category: 'custody',
    tagKey: 'wallet', tagClass: 'tag-custody',
    logo: (
      <svg width="24" height="24" fill="none" stroke="#34D399" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
    ),
  },
  {
    key: 'sideswap', href: 'https://sideswap.io', category: 'custody',
    tagKey: 'wallet', tagClass: 'tag-custody',
    logo: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    key: 'aqua', href: 'https://aquawallet.io', category: 'custody',
    tagKey: 'wallet', tagClass: 'tag-custody',
    logo: (
      <svg width="24" height="24" fill="none" stroke="#60A5FA" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  {
    key: 'tether', href: 'https://tether.to', category: 'partners',
    tagKey: 'strategicPartner', tagClass: 'tag-partners',
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#50AF95" strokeWidth="1.5" />
        <path d="M13.5 10.7v-.9h3.3V7.5H7.2v2.3h3.3v.9c-2.8.1-4.9.7-4.9 1.4s2.1 1.3 4.9 1.4v5h3v-5c2.8-.1 4.9-.7 4.9-1.4s-2.1-1.3-4.9-1.4zm0 2.3v0c-.1 0-.6 0-1.5 0s-1.2 0-1.5 0v0c-2.5-.1-4.3-.6-4.3-1.1s1.9-1 4.3-1.1v1.8c.3 0 .8 0 1.5 0 .8 0 1.2 0 1.5 0V10.8c2.5.1 4.3.6 4.3 1.1s-1.9 1-4.3 1.1z" fill="#50AF95" />
      </svg>
    ),
  },
  {
    key: 'ishares', href: 'https://ishares.com', category: 'partners',
    tagKey: 'underlyingAsset', tagClass: 'tag-partners',
    logo: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    key: 'liquidFederation', href: 'https://liquid.net', category: 'partners',
    tagKey: 'governance', tagClass: 'tag-partners',
    logo: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.592L9 12l.354 3.89a1.5 1.5 0 001.496 1.36h.002a1.5 1.5 0 001.496-1.608l-.136-2.448m4.288-4.444a3.005 3.005 0 00-.478-1.25m.478 1.25a2.999 2.999 0 01.2.818c.04.306.06.617.06.932a7.5 7.5 0 01-15 0c0-.315.02-.626.06-.932A3 3 0 015.25 7.5m0 0a3 3 0 01-1.5-2.625M5.25 7.5H6" />
      </svg>
    ),
  },
]

const FILTER_CATEGORIES = ['all', 'infrastructure', 'exchanges', 'audit', 'custody', 'partners'] as const

export default function EcosystemFilter() {
  const t = useTranslations('EcosystemPage')
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filteredPartners = activeFilter === 'all'
    ? partners
    : partners.filter((p) => p.category === activeFilter)

  return (
    <>
      {/* FILTER BAR */}
      <section className="pt-10 relative z-2 sm:pt-6">
        <div className="container">
          <div className="reveal flex items-center gap-2 flex-wrap justify-center py-3 px-4 bg-white/2 border border-white/6 rounded-full max-w-200 mx-auto sm:gap-2 sm:py-2.5 sm:px-3 sm:rounded-lg">
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full border border-transparent text-[13px] font-medium whitespace-nowrap transition-all duration-250 ease-in-out sm:px-3.5 sm:py-1.5 sm:text-xs ${
                  activeFilter === cat
                    ? 'bg-linear-to-r from-orange to-orange-light text-white font-semibold shadow-[0_0_20px_rgba(232,100,44,0.2)]'
                    : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/6'
                }`}
                onClick={() => setActiveFilter(cat)}
              >
                {t(`filters.${cat}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER GRID */}
      <section className="py-12 pb-20 sm:py-8 sm:pb-15">
        <div className="container">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPartners.map((partner) => (
              <a
                key={partner.key}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group reveal flex items-start gap-4 p-6 bg-white/2 border border-white/6 rounded-lg text-text-primary transition-all duration-300 hover:bg-white/4 hover:border-orange/25 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(232,100,44,0.08),0_0_0_1px_rgba(232,100,44,0.1)] relative overflow-hidden"
                data-category={partner.category}
              >
                <div className="w-12 h-12 min-w-12 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-orange/20 [&>img]:w-full [&>img]:h-full [&>img]:object-contain [&>img]:p-2 [&>svg]:w-6 [&>svg]:h-6 [&>svg]:opacity-70">
                  {partner.logo}
                </div>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-[15px] font-semibold text-text-primary">{t(`partners.${partner.key}.name`)}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${TAG_STYLES[partner.tagClass]}`}>{t(`tags.${partner.tagKey}`)}</span>
                  </div>
                  <span className="text-[13px] text-text-tertiary leading-normal">{t(`partners.${partner.key}.desc`)}</span>
                </div>
                {LINK_ARROW_SVG}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
