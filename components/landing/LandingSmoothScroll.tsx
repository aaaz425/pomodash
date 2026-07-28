'use client';

import { ReactLenis } from 'lenis/react';
import { startTransition, useEffect, useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function LandingSmoothScroll({ children }: Props) {
  const [enabled, setEnabled] = useState(false);

  // 서버 렌더와 항상 일치하도록 false로 시작하고, 마운트 후에만 접근성 설정을 확인한다.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    startTransition(() => setEnabled(!prefersReducedMotion));
  }, []);

  if (!enabled) return <>{children}</>;

  return <ReactLenis root>{children}</ReactLenis>;
}
