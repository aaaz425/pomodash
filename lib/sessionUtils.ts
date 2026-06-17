import type { Session } from '@/types';

export interface SessionGroup {
  dateKey: string;
  displayLabel: string;
  totalFocusSeconds: number;
  sessions: Session[];
}

function toLocalDateKey(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDisplayLabel(dateKey: string, todayKey: string, yesterdayKey: string): string {
  if (dateKey === todayKey) return '오늘';
  if (dateKey === yesterdayKey) return '어제';
  const d = new Date(dateKey);
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

export function groupSessionsByDate(sessions: Session[], ref?: Date): SessionGroup[] {
  if (sessions.length === 0) return [];

  const now = ref ?? new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayKey = toDateKey(now);
  const yesterdayKey = toDateKey(yesterday);

  const map = new Map<string, Session[]>();
  for (const session of sessions) {
    const key = toLocalDateKey(session.startedAt);
    const group = map.get(key);
    if (group) {
      group.push(session);
    } else {
      map.set(key, [session]);
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, groupSessions]) => ({
      dateKey,
      displayLabel: formatDisplayLabel(dateKey, todayKey, yesterdayKey),
      totalFocusSeconds: groupSessions.reduce((sum, s) => sum + s.focusSeconds, 0),
      sessions: [...groupSessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    }));
}

export function getSessionOrdinalTitle(startedAt: string, chronologicalIndex: number): string {
  const d = new Date(startedAt);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${m}월 ${day}일 ${chronologicalIndex + 1}번째 세션`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}초`;
  const mins = Math.floor(seconds / 60);
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hours === 0) return `${mins}분`;
  if (remMins === 0) return `${hours}시간`;
  return `${hours}시간 ${remMins}분`;
}

export function formatTimeRange(startedAt: string, endedAt: string): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  return `${fmt(startedAt)} — ${fmt(endedAt)}`;
}

export function formatFullDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
