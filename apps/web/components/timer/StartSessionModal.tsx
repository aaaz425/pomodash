'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTimerStore, useTaskStore } from '@/store/StoreProvider';
import { TaskList } from '@/components/tasks/TaskList';
import { TimerSettingsGroup } from '@/components/shared/TimerSettingsGroup';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/shared/Modal';
import type { TimerMode, TimerSettings } from '@/types';

interface Props {
  onClose: () => void;
}

const MODE_OPTIONS: { value: TimerMode; label: string }[] = [
  { value: 'pomodoro', label: '포모도로' },
  { value: 'free', label: '자유' },
];

export function StartSessionModal({ onClose }: Props) {
  const currentTaskId = useTimerStore((s) => s.currentTaskId);
  const storeSettings = useTimerStore((s) => s.settings);
  const storeMode = useTimerStore((s) => s.mode);
  const setCurrentTask = useTimerStore((s) => s.setCurrentTask);
  const updateSettings = useTimerStore((s) => s.updateSettings);
  const setMode = useTimerStore((s) => s.setMode);
  const start = useTimerStore((s) => s.start);

  const tasks = useTaskStore((s) => s.tasks);

  const [pendingTaskId, setPendingTaskId] = useState<string | null>(currentTaskId);
  const [pendingSettings, setPendingSettings] = useState<TimerSettings>({ ...storeSettings });
  const [pendingMode, setPendingMode] = useState<TimerMode>(storeMode);

  function handleTaskSelect(taskId: string) {
    if (taskId === pendingTaskId) {
      setPendingTaskId(null);
      return;
    }
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
    setMode(pendingMode);
    start();
    onClose();
  }

  return (
    <Modal
      title="타이머 시작"
      onClose={onClose}
      widthClassName="sm:w-[480px]"
      maxHeightClassName="max-h-[90vh]"
      bodyClassName="flex flex-col p-5 overflow-y-auto min-h-0"
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
        <span className="text-sm font-semibold text-foreground">작업 선택</span>

        <TaskList
          mode="select"
          selectedTaskId={pendingTaskId}
          onSelect={handleTaskSelect}
          listClassName="flex flex-col gap-1.5 max-h-[144px] overflow-y-auto"
        />
      </div>

      <div className="h-px bg-border mt-5" />

      {/* 타이머 방식 */}
      <div className="flex flex-col gap-3 mt-5">
        <span className="text-sm font-semibold text-foreground">타이머 방식</span>
        <SegmentedControl
          options={MODE_OPTIONS}
          value={pendingMode}
          onChange={setPendingMode}
          fullWidth
        />
      </div>

      {/* 이번 타이머 설정 */}
      <AnimatePresence initial={false}>
        {pendingMode === 'pomodoro' && (
          <motion.div
            key="pomodoro-settings"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5 pt-5">
              <div className="h-px bg-border" />
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-foreground">이번 타이머 설정</span>
                <TimerSettingsGroup
                  focusMinutes={pendingSettings.focusMinutes}
                  onFocusMinutesChange={(v) =>
                    setPendingSettings((s) => ({ ...s, focusMinutes: v }))
                  }
                  totalCycles={pendingSettings.totalCycles}
                  onTotalCyclesChange={(v) => setPendingSettings((s) => ({ ...s, totalCycles: v }))}
                  shortBreakMinutes={pendingSettings.shortBreakMinutes}
                  onShortBreakMinutesChange={(v) =>
                    setPendingSettings((s) => ({ ...s, shortBreakMinutes: v }))
                  }
                  cyclesLabel="사이클"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
