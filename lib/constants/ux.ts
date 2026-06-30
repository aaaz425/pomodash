export const MESSAGE_ROTATE_INTERVAL_MS = 5000;

export const SOUND_SEQUENCE_INTERVAL = 1.9;

import type { SoundType } from '@/types/models';

export const SOUND_TYPE_LABELS: Record<SoundType, string> = {
  sine: '기본',
  chime: '차임',
  bell: '벨',
  digital: '디지털',
};
