'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Square, Play, Pause } from 'lucide-react';
import { useTimerStore, useSettingsStore } from '@/store/StoreProvider';
import { useTimer } from '@/hooks/useTimer';
import { useCurrentTask } from '@/hooks/useCurrentTask';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { TimerRing } from '@/components/timer/TimerRing';
import { CycleIndicator } from '@/components/timer/CycleIndicator';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';

const MESSAGE_ROTATE_INTERVAL_MS = 5000;

export function FocusMode() {
  const isFocusMode = useTimerStore((s) => s.isFocusMode);
  const isRunning = useTimerStore((s) => s.startedAt !== null);
  const settings = useTimerStore((s) => s.settings);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const endSession = useTimerStore((s) => s.endSession);
  const exitFocusMode = useTimerStore((s) => s.exitFocusMode);
  const { displaySeconds, phase, cycleCount } = useTimer();
  const { task, category } = useCurrentTask();

  const messages = useSettingsStore((s) => s.motivationalMessages);
  const [message, setMessage] = useState(
    () => messages[Math.floor(Math.random() * messages.length)] ?? '',
  );
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  useEffect(() => {
    if (!isFocusMode || messages.length === 0) return;

    const interval = setInterval(() => {
      setMessage((prev) => {
        if (messages.length === 1) return messages[0];
        let next = prev;
        while (next === prev) {
          next = messages[Math.floor(Math.random() * messages.length)];
        }
        return next;
      });
    }, MESSAGE_ROTATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isFocusMode, messages]);

  const elapsedMinutes =
    cycleCount * settings.focusMinutes +
    (phase === 'focus'
      ? Math.max(0, Math.floor((settings.focusMinutes * 60 - displaySeconds) / 60))
      : 0);

  useEffect(() => {
    if (!isFocusMode) return;

    function handleKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      if (showEndConfirm) {
        if (e.key === 'Escape') setShowEndConfirm(false);
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) pause();
        else start();
      } else if (e.key === 'Escape') {
        exitFocusMode();
      }
    }

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [isFocusMode, isRunning, pause, start, exitFocusMode, showEndConfirm]);

  return (
    <AnimatePresence>
      {isFocusMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="dark fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background px-4"
        >
          {/* Exit Button */}
          <button
            onClick={exitFocusMode}
            aria-label="집중 모드 나가기"
            className="absolute top-6 right-6 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            나가기
          </button>

          {/* Task Section */}
          <div className="relative flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground/60">{cycleCount + 1}번째 집중 세션</span>
            {task ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-foreground">{task.title}</span>
                {category && <CategoryBadge category={category} />}
              </div>
            ) : (
              <span className="text-xl font-semibold text-muted-foreground/50">작업 없음</span>
            )}
          </div>

          {/* 동기부여 메시지 */}
          <AnimatePresence mode="wait">
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-sm text-muted-foreground/80 text-center max-w-xs"
            >
              {message}
            </motion.p>
          </AnimatePresence>

          {/* 타이머 링 */}
          <div className="relative">
            <TimerRing />
          </div>

          {/* 사이클 */}
          <div className="relative">
            <CycleIndicator />
          </div>

          {/* 컨트롤 */}
          <div className="relative flex items-center gap-3">
            <button
              onClick={isRunning ? pause : start}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-colors hover:bg-primary/90 active:bg-primary/80"
            >
              {isRunning ? (
                <Pause className="w-3.5 h-3.5" fill="currentColor" />
              ) : (
                <Play className="w-3.5 h-3.5" fill="currentColor" />
              )}
              {isRunning ? '일시정지' : '시작'}
            </button>
            <Button
              onClick={() => setShowEndConfirm(true)}
              variant="outline"
              size="lg"
              className="gap-1.5 px-4 py-2.5 text-muted-foreground"
            >
              <Square className="w-3.5 h-3.5" fill="currentColor" />
              세션종료
            </Button>
          </div>

          {/* 키보드 힌트 — 데스크탑 전용 */}
          <p className="absolute bottom-6 text-xs text-muted-foreground/30 hidden sm:block">
            Space · 일시정지 | Esc · 나가기
          </p>

          <ConfirmDialog
            open={showEndConfirm}
            title="세션을 종료할까요?"
            description={
              <>
                지금까지 {elapsedMinutes}분 · {cycleCount}/{settings.totalCycles}사이클 진행했어요.
              </>
            }
            confirmLabel="세션 종료"
            onConfirm={() => {
              endSession();
              setShowEndConfirm(false);
            }}
            onCancel={() => setShowEndConfirm(false)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
