'use client';

import { useEffect, useState } from 'react';
import { useHydrated } from '@/store/StoreProvider';
import { SKELETON_SHOW_DELAY_MS } from '@/lib/constants';

// SKELETON_SHOW_DELAY_MS 안에 끝나면 스켈레톤을 건너뛴다 — 빠른 연결에서 한 프레임 반짝이는 것 방지
export function useDelayedHydration() {
  const hydrated = useHydrated();
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    if (hydrated) return; // 이미 끝났으면 타이머 불필요
    const timer = setTimeout(() => setElapsed(true), SKELETON_SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [hydrated]);

  return { hydrated, showSkeleton: !hydrated && elapsed };
}
