export type TimerPhase = 'focus' | 'short-break';

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class (e.g. 'bg-blue-500')
}

export interface Task {
  id: string;
  title: string;
  categoryId: string;
  targetFocusMinutes: number; // 사이클당 집중 시간 (분)
  targetCycles: number; // 목표 사이클 수 (회)
  targetBreakMinutes: number; // 사이클 간 휴식 시간 (분)
  completed: boolean;
  createdAt: string; // ISO 8601
}

export interface FocusPeriod {
  start: string; // ISO 8601
  end: string; // ISO 8601
}

export interface Session {
  id: string;
  taskId: string | null;
  startedAt: string; // ISO 8601 — 세션 최초 시작 시각 (시간대 분석용)
  endedAt: string; // ISO 8601 — 세션 종료 시각 (경과 시간 ≠ 집중 시간)
  completedCycles: number;
  totalCycles: number;
  focusSeconds: number; // 집계용 — endedAt - startedAt 사용 금지
  pausedSeconds: number;
  focusPeriods: FocusPeriod[]; // 타임라인 블록용 실제 집중 구간
  note: string | null;
}

// 향후 per-phase 세분화 집계용으로 예약, 현재 미사용
export interface TimerRecord {
  id: string;
  taskId: string | null;
  phase: TimerPhase;
  startedAt: string;
  endedAt: string;
  focusSeconds: number;
  pausedSeconds: number;
}

export interface TimerSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  totalCycles: number; // 세션당 총 사이클 수 (이전 cyclesBeforeLongBreak)
}

export type SoundType = 'sine' | 'chime' | 'bell' | 'digital';

export const SOUND_TYPE_LABELS: Record<SoundType, string> = {
  sine: '기본',
  chime: '차임',
  bell: '벨',
  digital: '디지털',
};

export interface AppSettings {
  nickname: string;
  browserNotification: boolean;
  soundAlert: boolean;
  soundType: SoundType;
  soundVolume: number; // 0-100
  soundRepeatCount: number; // 1-5
  motivationalMessages: string[];
  defaultTimerSettings: TimerSettings;
}
