import { createTimerStore as createSharedTimerStore } from '@pomodash/shared';

// 이번 브랜치는 로컬 상태만 다룸 — 영속화 포트 없음(작업/세션 저장은 rn-tasks/rn-sync에서 추가)
export const createTimerStore = () => createSharedTimerStore();

export type { TimerStore, TimerStoreApi } from '@pomodash/shared';
