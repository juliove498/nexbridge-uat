import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function Footer() {
  const t = useTranslations('Footer')

  return (
    <footer className="border-t border-white/[0.06] pt-16 pb-8">
      <div className="max-w-300 mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 xl:grid-cols-[2fr_1fr_1.4fr_1fr_1fr] xl:gap-12 mb-16">
          <div>
            <Link href="/" className="flex items-center gap-2.5 no-underline text-text-primary">
              <img src="/nexbridge-wordmark-white.svg" alt="NexBridge" className="h-5.5 w-auto block shrink-0" />
            </Link>
            <p className="text-text-tertiary text-sm leading-relaxed mt-4 max-w-75">{t('tagline')}</p>
          </div>
          <div>
            <h5 className="font-display text-[13px] font-semibold uppercase tracking-[1.5px] text-text-tertiary mb-5 whitespace-nowrap">{t('productsHeader')}</h5>
            <Link href="/issuances" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.USTBL')}</Link>
            <Link href="/issuances" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.nMSTR')}</Link>
            <Link href="/issuances" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.nSPY')}</Link>
            <Link href="/issuances" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.allProducts')}</Link>
          </div>
          <div>
            <h5 className="font-display text-[13px] font-semibold uppercase tracking-[1.5px] text-text-tertiary mb-5 whitespace-nowrap">{t('platformsHeader')}</h5>
            <a href="https://nextr.space" target="_blank" rel="noopener noreferrer" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.governance')}</a>
            <a href="https://nexbridge.io/en/otc" target="_blank" rel="noopener noreferrer" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.otcDesk')}</a>
            <a href="https://nexplace.com" target="_blank" rel="noopener noreferrer" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.exchange')}</a>
          </div>
          <div>
            <h5 className="font-display text-[13px] font-semibold uppercase tracking-[1.5px] text-text-tertiary mb-5 whitespace-nowrap">{t('resourcesHeader')}</h5>
            <Link href="/legal-framework" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.legalFramework')}</Link>
            <Link href="/faq" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.faqs')}</Link>
            <Link href="/insights" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.insights')}</Link>
            <a href="https://nexbridge.kb.help" target="_blank" rel="noopener noreferrer" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.helpCenter')}</a>
            <Link href="/glossary" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.glossary')}</Link>
          </div>
          <div>
            <h5 className="font-display text-[13px] font-semibold uppercase tracking-[1.5px] text-text-tertiary mb-5 whitespace-nowrap">{t('learnHeader')}</h5>
            <Link href="/glossary" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.glossary')}</Link>
            <Link href="/tutorials" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.tutorials')}</Link>
            <Link href="/about" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.aboutUs')}</Link>
            <Link href="/contact" className="block text-text-secondary no-underline text-sm py-1.5 transition-colors hover:text-orange">{t('links.contact')}</Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-8 border-t border-white/[0.06] text-[13px] text-text-tertiary md:flex-row md:justify-between md:items-center">
          <div className="inline-flex items-center gap-2.5 py-1.5 px-3.5 pl-2.5 bg-white/[0.03] border border-white/[0.06] rounded-full font-display text-xs text-text-tertiary tracking-[0.3px] transition-[border-color] duration-300 hover:border-orange/25">
            <div className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-gradient-to-br from-orange/15 to-orange/5 shrink-0">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" className="w-3 h-3 text-orange"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
            <span className="text-text-tertiary font-medium">{t('leiLabel')}</span>
            <span className="text-text-secondary font-semibold tracking-[0.8px]">{t('leiCode')}</span>
          </div>
          <div className="flex gap-4">
            <a href="https://t.me/NexBridge_RWA" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-text-tertiary transition-all duration-300 flex w-9 h-9 items-center justify-center rounded-full border border-white/[0.06] hover:text-orange hover:border-orange/30 hover:bg-orange-subtle">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
            </a>
            <a href="https://www.linkedin.com/company/nexbridge-rwa/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-text-tertiary transition-all duration-300 flex w-9 h-9 items-center justify-center rounded-full border border-white/[0.06] hover:text-orange hover:border-orange/30 hover:bg-orange-subtle">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            </a>
            <a href="https://www.facebook.com/nexbridge.rwa/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-text-tertiary transition-all duration-300 flex w-9 h-9 items-center justify-center rounded-full border border-white/[0.06] hover:text-orange hover:border-orange/30 hover:bg-orange-subtle">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href="https://x.com/NexBridge_RWA" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-text-tertiary transition-all duration-300 flex w-9 h-9 items-center justify-center rounded-full border border-white/[0.06] hover:text-orange hover:border-orange/30 hover:bg-orange-subtle">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://www.instagram.com/nexbridge_rwa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-text-tertiary transition-all duration-300 flex w-9 h-9 items-center justify-center rounded-full border border-white/[0.06] hover:text-orange hover:border-orange/30 hover:bg-orange-subtle">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
            </a>
            <a href="https://www.youtube.com/@NexBridge_RWA" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-text-tertiary transition-all duration-300 flex w-9 h-9 items-center justify-center rounded-full border border-white/[0.06] hover:text-orange hover:border-orange/30 hover:bg-orange-subtle">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            </a>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-white/[0.06]">
          <p className="text-[11px] leading-relaxed text-white/25">{t('disclaimer.p1')}</p>
          <p className="text-[11px] leading-relaxed text-white/25 mt-3">{t('disclaimer.p2')}</p>
          <p className="text-[11px] leading-relaxed text-white/25 mt-3">{t('disclaimer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
