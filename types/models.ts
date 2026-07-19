export type TimerPhase = 'focus' | 'short-break';

export type TimerMode = 'pomodoro' | 'free';

export type FocusRating = 1 | 2 | 3;

export interface Category {
  id: string;
  name: string;
  color: string; // e.g. 'bg-blue-500'
}

export interface Task {
  id: string;
  title: string;
  categoryId: string;
  targetFocusMinutes: number; // 분
  targetCycles: number; // 회
  targetBreakMinutes: number; // 분
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
  mode: TimerMode; // 'free'는 completedCycles/totalCycles가 0 — 저널/모달에서 "N/M 사이클" 대신 별도 표시 필요
  startedAt: string; // ISO 8601, 시간대 분석용
  endedAt: string; // ISO 8601, 경과 시간 ≠ 집중 시간
  completedCycles: number;
  totalCycles: number;
  focusSeconds: number; // endedAt - startedAt 금지
  pausedSeconds: number;
  focusPeriods: FocusPeriod[]; // 타임라인용 실제 구간
  note: string | null;
  focusRating: FocusRating | null; // 3단계 자가 평점, 옵션
  distractionTags: string[]; // DISTRACTION_TAGS의 id 배열, 옵션
}

// per-phase 집계용 예약 타입, 미사용
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
  totalCycles: number; // 이전 이름: cyclesBeforeLongBreak
}

export type SoundType = 'sine' | 'chime' | 'bell' | 'digital';

export type TabType = 'today' | 'week' | 'month' | 'all';

export type JournalTab = 'list' | 'timeline' | 'calendar';

export interface DayActivity {
  date: string; // YYYY-MM-DD
  focusMinutes: number;
}

export interface FocusTrendItem {
  label: string;
  [key: string]: number | string;
}

export interface FocusTrendMeta {
  data: FocusTrendItem[];
  categories: Array<{ name: string; color: string }>;
}

export interface CategoryFocusItem {
  name: string;
  minutes: number;
  percent: number;
  color: string;
}

export interface SessionGroup {
  dateKey: string;
  displayLabel: string;
  totalFocusSeconds: number;
  sessions: Session[];
}

export interface TimelineBlock {
  sessionId: string;
  taskId: string | null;
  top: number; // 0-100, 하루 대비 시작 위치(%)
  height: number; // 0-100, 하루 대비 길이(%) — 가독성을 위한 최소값 보장
  startLabel: string; // "09:12"
  endLabel: string;
}

export interface DistractionFrequency {
  tagId: string;
  count: number;
}

export interface FocusRatingTrend {
  recentAvg: number | null; // 평점 입력된 세션이 하나도 없으면 null
  previousAvg: number | null;
  sampleSize: number; // recentAvg 계산에 쓰인 세션 수 — 신뢰도 판단용
}

export interface CategoryRatingItem {
  categoryId: string;
  categoryName: string;
  avgRating: number;
  sampleSize: number;
}

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
