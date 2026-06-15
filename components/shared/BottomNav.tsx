'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Timer, TrendingUp, NotebookPen } from 'lucide-react'

const LINK_ITEMS = [
  { href: '/', icon: Timer, label: '타이머' },
  { href: '/dashboard', icon: TrendingUp, label: '통계' },
  { href: '/journal', icon: NotebookPen, label: '기록' },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 h-16 sm:hidden flex items-center justify-around bg-card border-t border-border">
      {LINK_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors"
          >
            <Icon className={`w-[22px] h-[22px] ${isActive ? 'text-primary' : 'text-[#64748b]'}`} />
            <span className={`text-[10px] font-medium ${isActive ? 'text-primary font-semibold' : 'text-[#64748b]'}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
