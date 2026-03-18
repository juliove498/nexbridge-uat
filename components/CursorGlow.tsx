'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    let cursorX = 0, cursorY = 0, glowX = 0, glowY = 0
    let animId: number

    const onMouseMove = (e: MouseEvent) => {
      cursorX = e.clientX
      cursorY = e.clientY
    }

    const animate = () => {
      glowX += (cursorX - glowX) * 0.08
      glowY += (cursorY - glowY) * 0.08
      glow.style.left = glowX + 'px'
      glow.style.top = glowY + 'px'
      animId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    animId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return <div className="cursor-glow" id="cursorGlow" ref={glowRef} />
}
