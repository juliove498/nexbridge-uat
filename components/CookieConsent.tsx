'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'

const STORAGE_KEY = 'nexbridge_cookie_consent'

interface ConsentState {
  necessary: boolean
  functional: boolean
  analytical: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const t = useTranslations('CookieConsent')
  const [show, setShow] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    functional: false,
    analytical: false,
    marketing: false,
  })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return
    const timer = setTimeout(() => setShow(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const saveConsent = (c: ConsentState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c))
    setShow(false)
    setSettingsOpen(false)
    window.dispatchEvent(new CustomEvent('nexbridge:consent-updated', { detail: c }))
  }

  const allowAll = () => saveConsent({ necessary: true, functional: true, analytical: true, marketing: true })
  const allowNecessary = () => saveConsent({ necessary: true, functional: false, analytical: false, marketing: false })
  const confirmSettings = () => saveConsent(consent)

  if (!show) return null

  return (
    <>
      {!settingsOpen && (
        <div className="fixed bottom-6 left-6 right-6 max-w-120 bg-[rgba(10,10,10,0.95)] border border-white/10 rounded-2xl p-6 z-[10000] backdrop-blur-[20px] font-sans text-white">
          <h4 className="text-[15px] font-semibold mb-2">{t('title')}</h4>
          <p className="text-[13px] text-text-secondary leading-relaxed mb-4">
            {t('body')}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={allowNecessary}
              className="bg-white/[0.08] border-white/15 text-white hover:bg-white/[0.12]"
            >
              {t('allowNecessary')}
            </Button>
            <Button
              onClick={allowAll}
              className="bg-orange hover:bg-orange-light text-white"
            >
              {t('allowAll')}
            </Button>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="mt-3 text-xs text-white/50 bg-transparent border-none cursor-pointer underline"
          >
            {t('settingsTitle')}
          </button>
        </div>
      )}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent
          className="bg-[#0a0a0a] border-white/10 text-white max-w-120"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{t('settingsTitle')}</DialogTitle>
            <DialogDescription className="text-[13px] text-white/60 leading-relaxed">
              {t('settingsDesc')}
            </DialogDescription>
          </DialogHeader>
          {(['necessary', 'functional', 'analytical', 'marketing'] as const).map((cat) => (
            <div
              key={cat}
              className="flex justify-between items-start py-4 border-t border-white/[0.08]"
            >
              <div>
                <div className="text-sm font-medium mb-1">{t(`categories.${cat}.name`)}</div>
                <div className="text-xs text-white/50">{t(`categories.${cat}.desc`)}</div>
              </div>
              <Switch
                checked={consent[cat]}
                disabled={cat === 'necessary'}
                onCheckedChange={(checked) => setConsent({ ...consent, [cat]: checked })}
                className="shrink-0 ml-4 data-checked:bg-orange"
              />
            </div>
          ))}
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={confirmSettings}
              className="flex-1 bg-white/[0.08] border-white/15 text-white hover:bg-white/[0.12]"
            >
              {t('confirm')}
            </Button>
            <Button
              onClick={allowAll}
              className="flex-1 bg-orange hover:bg-orange-light text-white"
            >
              {t('settingsAllowAll')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
