'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Timer, TrendingUp, NotebookPen, UserRound } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', icon: Timer, label: '타이머' },
  { href: '/dashboard', icon: TrendingUp, label: '통계' },
  { href: '/journal', icon: NotebookPen, label: '기록' },
  { href: '/settings', icon: UserRound, label: '설정' },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 h-full flex flex-col justify-start bg-card border-r border-border">
      <div className="h-16 flex items-center px-5 border-b border-border">
        <span className="text-primary text-base font-bold">Pomodash</span>
      </div>

      <nav className="flex flex-col gap-0.5 px-2.5 py-3">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-2.5 h-10 px-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              ].join(' ')}
            >
              <Icon
                className={[
                  'w-[18px] h-[18px] shrink-0',
                  isActive ? 'text-primary' : 'text-[#64748b]',
                ].join(' ')}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
