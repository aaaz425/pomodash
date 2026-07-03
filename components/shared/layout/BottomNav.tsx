'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/components/shared/layout/navItems';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0 z-30 sm:hidden bg-card border-t border-border standalone:pb-[env(safe-area-inset-bottom)]">
      <div className="h-16 flex items-center justify-around">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors"
            >
              <Icon
                className={`w-[22px] h-[22px] ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              />
              <span
                className={`text-[10px] font-medium ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
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
