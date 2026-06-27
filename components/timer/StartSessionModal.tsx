'use client';

import { useState } from 'react';
import { useTimerStore, useTaskStore } from '@/store/StoreProvider';
import { TaskList } from '@/components/tasks/TaskList';
import { TimerSettingsGroup } from '@/components/shared/TimerSettingsGroup';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/shared/Modal';
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

  const [pendingTaskId, setPendingTaskId] = useState<string | null>(currentTaskId);
  const [pendingSettings, setPendingSettings] = useState<TimerSettings>({ ...storeSettings });

  function handleTaskSelect(taskId: string) {
    setPendingTaskId(taskId);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setPendingSettings({
        focusMinutes: task.targetFocusMinutes,
        shortBreakMinutes: task.targetBreakMinutes,
        totalCycles: task.targetCycles,
      });
    }
  }

  function handleStart() {
    setCurrentTask(pendingTaskId);
    updateSettings(pendingSettings);
    start();
    onClose();
  }

  return (
    <Modal
      title="세션 시작"
      onClose={onClose}
      widthClassName="sm:w-[480px]"
      maxHeightClassName="max-h-[90vh]"
      footer={
        <>
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
        </>
      }
    >
      {/* 작업 선택 */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-foreground">어떤 작업을 할까요?</span>

        <TaskList
          mode="select"
          selectedTaskId={pendingTaskId}
          onSelect={handleTaskSelect}
          listClassName="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto"
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
    </Modal>
  );
}
