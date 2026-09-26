'use client';

import { useEffect } from 'react';

// 탭이 hidden되면 브라우저가 wake lock을 자동 해제하므로 visible 복귀 시 재요청 필요
export function useWakeLock(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;

    async function acquire() {
      try {
        sentinel = await navigator.wakeLock.request('screen');
      } catch {
        // 배터리 세이버 등 정책으로 거부될 수 있음 — 조용히 무시
      }
    }

    acquire();

    function handleVisibility() {
      if (document.visibilityState === 'visible' && !sentinel) acquire();
    }

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      sentinel?.release();
    };
  }, [enabled]);
}
