'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './navItems';

export function BottomNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // iOS WebKit이 standalone PWA에서 window.innerHeight를 실제 화면보다 작게
    // 보고하는 버그가 있어 bottom:0 기준으로는 네비바가 화면 끝에 못 붙는 경우가 있다.
    // top은 뷰포트 높이 계산과 무관하게 항상 정확하므로, top 기준으로 직접 위치를 고정한다.
    const update = () => {
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        nav.style.top = '';
        nav.style.bottom = '';
        return;
      }
      const screenHeight = window.screen?.height ?? 0;
      if (!screenHeight) return;
      const navHeight = nav.getBoundingClientRect().height;
      nav.style.bottom = 'auto';
      nav.style.top = `${screenHeight - navHeight}px`;
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-card border-t border-border standalone:pb-[calc(env(safe-area-inset-bottom)*0.5)]"
    >
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
