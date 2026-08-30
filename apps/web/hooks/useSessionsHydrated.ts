'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/StoreProvider';
import { SKELETON_SHOW_DELAY_MS } from '@/lib/constants';

// useDelayedHydration과 동일한 지연-스켈레톤 패턴을 sessionsHydrated에 적용
export function useSessionsHydrated() {
  const sessionsHydrated = useTaskStore((s) => s.sessionsHydrated);
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    if (sessionsHydrated) return;
    const timer = setTimeout(() => setElapsed(true), SKELETON_SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [sessionsHydrated]);

  return { sessionsHydrated, showSkeleton: !sessionsHydrated && elapsed };
}
