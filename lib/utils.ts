import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 1시간 이상이면 H:MM:SS, 아니면 MM:SS — 자유 모드처럼 상한 없이 누적되는 타이머 표시용
export function formatClock(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // crypto.randomUUID는 secure context(HTTPS/localhost)에서만 지원되므로,
  // LAN IP로 접속하는 개발 환경(http://) 등을 위한 폴백
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
