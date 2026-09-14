'use client';

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/StoreProvider';
import { SKELETON_SHOW_DELAY_MS } from '@/lib/constants';

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
