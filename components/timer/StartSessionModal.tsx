'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useTimerStore, useTaskStore } from '@/store/StoreProvider';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { TaskQuickAddForm } from '@/components/shared/TaskQuickAddForm';
import { TimerSettingsGroup } from '@/components/shared/TimerSettingsGroup';
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

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

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
    setShowNewTaskForm(false);
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

            {activeTasks.length === 0 && !showNewTaskForm && (
              <p className="text-sm text-muted-foreground/60 py-1">등록된 작업이 없습니다</p>
            )}

            {activeTasks.length > 0 && !showNewTaskForm && (
              <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto">
                {activeTasks.map((t) => {
                  const cat = categories.find((c) => c.id === t.categoryId);
                  const isSelected = pendingTaskId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTaskSelect(isSelected ? null : t.id)}
                      className={[
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-left transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:bg-muted',
                      ].join(' ')}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2.5} />
                      ) : (
                        <div className="w-3.5 h-3.5 shrink-0" />
                      )}
                      {cat && <CategoryBadge category={cat} />}
                      <span className="text-sm text-foreground truncate">{t.title}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {showNewTaskForm ? (
              <TaskQuickAddForm
                categories={categories}
                onAdd={handleAddNewTask}
                onCancel={() => setShowNewTaskForm(false)}
              />
            ) : (
              <button
                onClick={() => setShowNewTaskForm(true)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
              >
                <Plus className="w-3.5 h-3.5" />새 작업 만들기
              </button>
            )}
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
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleStart}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              시작
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
