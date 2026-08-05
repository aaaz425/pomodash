import type { SoundType } from '@pomodash/shared';

// 웹 apps/web/lib/constants/ux.ts의 SOUND_TYPE_LABELS와 동일
export const SOUND_TYPE_LABELS: Record<SoundType, string> = {
  sine: '기본',
  chime: '차임',
  bell: '벨',
  digital: '디지털',
};
