'use client'

import { useSyncExternalStore } from 'react'

function applyTheme(dark: boolean) {
  if (typeof window === 'undefined') return
  if (dark) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
}

// 모듈 로드 시 localStorage/시스템 설정으로 초기 테마 적용 (FOUC 방지)
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('theme')
  const dark = stored !== null
    ? stored === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(dark)
}

function subscribe(cb: () => void) {
  const observer = new MutationObserver(cb)
  observer.observe(document.documentElement, { attributeFilter: ['class'] })
  return () => observer.disconnect()
}

export function useTheme() {
  const isDark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains('dark'),
    () => true,
  )

  function toggle() {
    const next = !isDark
    applyTheme(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return { isDark, toggle }
}
