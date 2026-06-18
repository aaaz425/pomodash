'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Timer, TrendingUp, NotebookPen, UserRound } from 'lucide-react';

const LINK_ITEMS = [
  { href: '/', icon: Timer, label: '타이머' },
  { href: '/dashboard', icon: TrendingUp, label: '통계' },
  { href: '/journal', icon: NotebookPen, label: '기록' },
  { href: '/settings', icon: UserRound, label: '설정' },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-card border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="h-16 flex items-center justify-around">
        {LINK_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors"
            >
              <Icon
                className={`w-[22px] h-[22px] ${isActive ? 'text-primary' : 'text-[#64748b]'}`}
              />
              <span
                className={`text-[10px] font-medium ${isActive ? 'text-primary font-semibold' : 'text-[#64748b]'}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
