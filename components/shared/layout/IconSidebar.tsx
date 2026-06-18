'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Timer, TrendingUp, NotebookPen, UserRound } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', icon: Timer },
  { href: '/dashboard', icon: TrendingUp },
  { href: '/journal', icon: NotebookPen },
  { href: '/settings', icon: UserRound },
] as const;

export function IconSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 shrink-0 h-full flex flex-col justify-start items-center py-4 bg-card border-r border-border">
      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 mb-1">
        <Zap className="w-5 h-5 text-primary" />
      </div>
      <div className="w-8 h-px bg-border mb-1" />
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon }) => {
          const isActive = pathname === href;
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
          );
        })}
      </nav>
    </aside>
  );
}
