'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'

export default function PasswordGate() {
  const t = useTranslations('PasswordGate')
  const [visible, setVisible] = useState(true)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const k = 'nb_access'
    const h = 'e35b0e04f0dd2e8a1fbbd8bfa5c1fc71'
    if (localStorage.getItem(k) === h) {
      setVisible(false)
      return
    }
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = inputRef.current
      if (!input) return
      if (input.value === 'NB-0110') {
        localStorage.setItem('nb_access', 'e35b0e04f0dd2e8a1fbbd8bfa5c1fc71')
        setVisible(false)
      } else {
        setError(true)
        input.value = ''
        setTimeout(() => setError(false), 2000)
      }
    }
  }

  if (!visible) return null

  return (
    <div
      id="pw-gate"
      className="fixed inset-0 z-[99999] bg-bg-dark flex items-center justify-center font-sans"
    >
      <div className="text-center max-w-90 p-8">
        <img
          src="/nexbridge-wordmark-white.svg"
          alt="NexBridge"
          className="h-7 mb-8"
        />
        <p className="text-text-secondary text-sm mb-5">
          {t('prompt')}
        </p>
        <input
          ref={inputRef}
          type="password"
          placeholder={t('placeholder')}
          autoComplete="off"
          onKeyDown={handleKeyDown}
          className={`w-full py-3 px-4 bg-white/[0.06] border rounded-xl text-white text-sm outline-none text-center tracking-[2px] ${
            error ? 'border-red-400' : 'border-white/15'
          }`}
        />
        {error && (
          <p className="text-red-400 text-xs mt-2">
            {t('error')}
          </p>
        )}
      </div>
    </div>
  )
}
