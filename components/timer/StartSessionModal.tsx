'use client';

import { useState } from 'react';
import { useTimerStore, useTaskStore } from '@/store/StoreProvider';
import { TaskPickerList } from '@/components/timer/TaskPickerList';
import { TimerSettingsGroup } from '@/components/shared/TimerSettingsGroup';
import { Button } from '@/components/ui/button';
import type { TimerSettings } from '@/types';

interface Props {
  onClose: () => void;
}

export function StartSessionModal({ onClose }: Props) {
  const currentTaskId = useTimerStore((s) => s.currentTaskId);
  const storeSettings = useTimerStore((s) => s.settings);
  const setCurrentTask = useTimerStore((s) => s.setCurrentTask);
  const updateSettings = useTimerStore((s) => s.updateSettings);
  const start = useTimerStore((s) => s.start);

  const tasks = useTaskStore((s) => s.tasks);
  const categories = useTaskStore((s) => s.categories);
  const addTask = useTaskStore((s) => s.addTask);

  const [pendingTaskId, setPendingTaskId] = useState<string | null>(currentTaskId);
  const [pendingSettings, setPendingSettings] = useState<TimerSettings>({ ...storeSettings });

  const activeTasks = tasks.filter((t) => !t.completed);

  function handleTaskSelect(taskId: string | null) {
    setPendingTaskId(taskId);
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setPendingSettings({
          focusMinutes: task.targetFocusMinutes,
          shortBreakMinutes: task.targetBreakMinutes,
          totalCycles: task.targetCycles,
        });
      }
    }
  }

  function handleAddNewTask(title: string, categoryId: string) {
    const newId = addTask({ title, categoryId });
    handleTaskSelect(newId);
  }

  function handleStart() {
    setCurrentTask(pendingTaskId);
    updateSettings(pendingSettings);
    start();
    onClose();
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="세션 시작"
        className={[
          'fixed z-50 bg-card border border-border shadow-2xl overflow-y-auto',
          'bottom-0 left-0 right-0 rounded-t-2xl max-h-[90vh]',
          'sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2',
          'sm:w-[480px] sm:rounded-xl sm:max-h-[85vh]',
        ].join(' ')}
      >
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          {/* 작업 선택 */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-foreground">어떤 작업을 할까요?</span>

            <TaskPickerList
              activeTasks={activeTasks}
              categories={categories}
              selectedTaskId={pendingTaskId}
              onSelect={handleTaskSelect}
              onAddTask={handleAddNewTask}
              emptyMessageClassName="text-sm text-muted-foreground/60 py-1"
            />
          </div>

          <div className="h-px bg-border" />

          {/* 이번 세션 설정 */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-foreground">이번 세션 설정</span>
            <TimerSettingsGroup
              focusMinutes={pendingSettings.focusMinutes}
              onFocusMinutesChange={(v) => setPendingSettings((s) => ({ ...s, focusMinutes: v }))}
              totalCycles={pendingSettings.totalCycles}
              onTotalCyclesChange={(v) => setPendingSettings((s) => ({ ...s, totalCycles: v }))}
              shortBreakMinutes={pendingSettings.shortBreakMinutes}
              onShortBreakMinutesChange={(v) =>
                setPendingSettings((s) => ({ ...s, shortBreakMinutes: v }))
              }
              cyclesLabel="사이클"
            />
            <p className="text-[11px] text-muted-foreground/60">
              이번 세션에서만 적용됩니다 · 작업 기본값은 변경되지 않아요
            </p>
          </div>

          {/* 액션 */}
          <div className="flex items-center justify-end gap-2">
            <Button onClick={onClose} variant="ghost" size="lg" className="px-4 py-2.5">
              취소
            </Button>
            <Button
              onClick={handleStart}
              variant="default"
              size="lg"
              className="px-6 py-2.5 font-semibold hover:bg-primary/90"
            >
              시작
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
