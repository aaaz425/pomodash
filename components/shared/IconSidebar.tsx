'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Timer, TrendingUp, NotebookPen, Settings } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

const NAV_ITEMS = [
  { href: '/', icon: Timer },
  { href: '/dashboard', icon: TrendingUp },
  { href: '/journal', icon: NotebookPen },
] as const

export function IconSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-16 shrink-0 h-full flex flex-col justify-between items-center py-4 bg-card border-r border-border">
      {/* Top: Logo + Nav */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 mb-1">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div className="w-8 h-px bg-border mb-1" />
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'w-10 h-10 flex items-center justify-center rounded-lg transition-colors',
                  isActive ? 'bg-primary/10' : 'hover:bg-muted',
                ].join(' ')}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-[#64748b]'}`} />
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom: Theme + Settings */}
      <div className="flex flex-col items-center gap-0.5 pt-2 border-t border-border w-full">
        <ThemeToggle className="w-10 h-10 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-muted hover:text-foreground transition-colors" />
        <Link
          href="/settings"
          className="w-10 h-10 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </aside>
  )
}
