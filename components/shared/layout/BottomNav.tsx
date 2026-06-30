'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/components/shared/layout/navItems';

export function BottomNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // iOS WebKit이 standalone PWA에서 window.innerHeight를 실제 화면보다 작게
    // 보고하는 버그가 있어 bottom:0 기준으로는 네비바가 화면 끝에 못 붙는 경우가 있다.
    // top은 뷰포트 높이 계산과 무관하게 항상 정확하므로, top 기준으로 직접 위치를 고정한다.
    // 이 버그는 iOS WebKit 전용이라, 다른 플랫폼(Android 등)에서는 screen.height의
    // 의미가 달라 같은 보정이 오히려 네비바를 화면 밖으로 밀어낼 수 있어 iOS에서만 적용한다.
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const update = () => {
      if (!isIOS || !window.matchMedia('(display-mode: standalone)').matches) {
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
