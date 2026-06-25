'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useTimerStore, useTaskStore, useHydrated } from '@/store/StoreProvider';
import { useCurrentTask } from '@/hooks/useCurrentTask';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { CycleIndicator } from '@/components/timer/CycleIndicator';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { SessionTaskSelector } from '@/components/timer/SessionTaskSelector';
import { Button } from '@/components/ui/button';
import { normalizeFocusPeriods } from '@/lib/focusPeriods';

export function SessionRecordModal() {
  const hydrated = useHydrated();
  const sessionEnded = useTimerStore((s) => s.sessionEnded);
  const dismissSessionRecord = useTimerStore((s) => s.dismissSessionRecord);
  const cycleCount = useTimerStore((s) => s.cycleCount);
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);
  const currentTaskId = useTimerStore((s) => s.currentTaskId);
  const sessionStartedAt = useTimerStore((s) => s.sessionStartedAt);
  const sessionEndedAt = useTimerStore((s) => s.sessionEndedAt);
  const accFocusSeconds = useTimerStore((s) => s.accFocusSeconds);

  const rawFocusPeriods = useTimerStore((s) => s.rawFocusPeriods);

  const { task, category } = useCurrentTask();
  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);
  const addSession = useTaskStore((s) => s.addSession);
  const addTask = useTaskStore((s) => s.addTask);

  const activeTasks = tasks.filter((t) => !t.completed);

  const [note, setNote] = useState('');
  const [pendingAction, setPendingAction] = useState<'skip' | 'save' | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  if (!hydrated || !sessionEnded || sessionEndedAt === null) return null;

  const isTaskSession = currentTaskId !== null;
  const now = sessionEndedAt;
  const totalElapsed = sessionStartedAt
    ? Math.floor((now - sessionStartedAt) / 1000)
    : accFocusSeconds;
  const pausedSeconds = Math.max(0, totalElapsed - accFocusSeconds);

  function handleSave() {
    const taskId = isTaskSession ? currentTaskId : selectedTaskId;
    const focusPeriods = normalizeFocusPeriods(
      rawFocusPeriods.map((p) => ({
        start: new Date(p.start).toISOString(),
        end: new Date(p.end).toISOString(),
      })),
    );
    addSession({
      taskId,
      startedAt: new Date(sessionStartedAt ?? now).toISOString(),
      endedAt: new Date(now).toISOString(),
      completedCycles: cycleCount,
      totalCycles,
      focusSeconds: accFocusSeconds,
      pausedSeconds,
      focusPeriods,
      note: note.trim() || null,
    });
    dismissSessionRecord();
    setNote('');
    setSelectedTaskId(null);
    setPendingAction(null);
  }

  function handleSkip() {
    dismissSessionRecord();
    setNote('');
    setSelectedTaskId(null);
    setPendingAction(null);
  }

  function handleAddNewTask(title: string, categoryId: string) {
    const newId = addTask({ title, categoryId });
    setSelectedTaskId(newId);
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={() => setPendingAction('skip')}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="세션 기록"
        className={[
          'fixed z-50 bg-card border border-border shadow-2xl overflow-y-auto',
          'bottom-0 left-0 right-0 rounded-t-2xl max-h-[82vh]',
          'sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2',
          'sm:w-[600px] sm:rounded-xl sm:max-h-[85vh]',
        ].join(' ')}
      >
        <div className="flex flex-col gap-5 p-5 sm:gap-7 sm:p-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full bg-primary/20">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary">
                <Check
                  className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground"
                  strokeWidth={2.5}
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <h2 className="text-[26px] font-bold tracking-tight text-foreground">집중 완료!</h2>
              <p className="text-sm text-muted-foreground">오늘도 집중 세션을 완료했어요</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Session Summary */}
          {isTaskSession ? (
            /* Case A: 작업 있는 세션 — 작업 정보 표시 */
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2 min-w-0">
                <span className="text-lg font-semibold tracking-tight text-foreground truncate">
                  {task?.title ?? '작업 없음'}
                </span>
                {category && task && <CategoryBadge category={category} className="self-start" />}
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[11px] text-muted-foreground">
                  완료된 사이클 {cycleCount} / {totalCycles}
                </span>
                <CycleIndicator />
              </div>
            </div>
          ) : (
            /* Case B: 작업 없는 세션 — 작업 귀속 UI */
            <SessionTaskSelector
              activeTasks={activeTasks}
              categories={categories}
              selectedTaskId={selectedTaskId}
              cycleCount={cycleCount}
              totalCycles={totalCycles}
              onSelect={setSelectedTaskId}
              onAddTask={handleAddNewTask}
            />
          )}

          {/* Note Section */}
          <div className="flex flex-col gap-2.5">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              placeholder="무엇을 집중해서 했나요? 짧게 메모해두면 나중에 돌아볼 수 있어요."
              className={[
                'w-full h-[90px] sm:h-[120px] resize-none rounded-md border border-border',
                'bg-card px-3.5 py-3 text-base text-foreground',
                'placeholder:text-muted-foreground/50',
                'focus:outline-none focus:ring-2 focus:ring-ring/50',
              ].join(' ')}
            />
            <div className="flex justify-end">
              <span className="text-[11px] text-muted-foreground/60">{note.length} / 500</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={() => setPendingAction('skip')}
              variant="ghost"
              size="lg"
              className="px-4 py-2.5"
            >
              건너뛰기
            </Button>
            <button
              onClick={() => setPendingAction('save')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              기록 완료
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={pendingAction === 'skip'}
        title="기록을 건너뛸까요?"
        description="작성한 메모는 저장되지 않아요"
        confirmLabel="건너뛰기"
        onConfirm={handleSkip}
        onCancel={() => setPendingAction(null)}
      />

      <ConfirmDialog
        open={pendingAction === 'save'}
        title="이 기록으로 저장할까요?"
        description={
          !isTaskSession && !selectedTaskId
            ? `완료된 사이클 ${cycleCount} / ${totalCycles} · 미분류로 저장됩니다`
            : `완료된 사이클 ${cycleCount} / ${totalCycles}`
        }
        confirmLabel="저장"
        onConfirm={handleSave}
        onCancel={() => setPendingAction(null)}
      />
    </>
  );
}
