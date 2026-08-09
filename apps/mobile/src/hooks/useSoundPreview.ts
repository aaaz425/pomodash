import { useEffect, useState } from 'react';
import type { SoundType } from '@/types/settings';
import { playAlarm, stopAlarm } from '@/lib/sound';

// 웹 apps/web/hooks/useSoundPreview.ts 대응
export function useSoundPreview(type: SoundType, volume: number, repeatCount: number) {
  const [isPlaying, setIsPlaying] = useState(false);

  function toggle() {
    if (isPlaying) {
      stopAlarm();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    void playAlarm({ type, volume, repeatCount, onEnded: () => setIsPlaying(false) });
  }

  function stop() {
    stopAlarm();
    setIsPlaying(false);
  }

  useEffect(() => {
    return () => stopAlarm();
  }, []);

  return { isPlaying, toggle, stop };
}
