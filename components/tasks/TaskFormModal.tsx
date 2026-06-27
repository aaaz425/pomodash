'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useTaskStore, useSettingsStore, useTimerStore } from '@/store/StoreProvider';
import { CategoryPills } from '@/components/shared/CategoryPills';
import { TimerSettingsGroup } from '@/components/shared/TimerSettingsGroup';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/shared/Modal';
import { TextInput } from '@/components/shared/TextInput';
import type { Task } from '@/types';

interface Props {
  task: Task | null; // null = 새 작업
  onClose: () => void;
  onCreated?: (id: string) => void; // 새 작업 생성 시에만 호출 (선택 모드에서 자동 선택용)
}

export function TaskFormModal({ task, onClose, onCreated }: Props) {
  const categories = useTaskStore((s) => s.categories);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const defaultTimerSettings = useSettingsStore((s) => s.defaultTimerSettings);

  const currentTaskId = useTimerStore((s) => s.currentTaskId);
  const isRunning = useTimerStore((s) => s.startedAt !== null);
  const applyActiveTaskTimeUpdate = useTimerStore((s) => s.applyActiveTaskTimeUpdate);

  const isActiveTask = task !== null && task.id === currentTaskId;
  const timeFieldsDisabled = isActiveTask && isRunning;

  const [title, setTitle] = useState(task?.title ?? '');
  const [categoryId, setCategoryId] = useState(task?.categoryId ?? categories[0]?.id ?? '');
  const [targetFocusMinutes, setTargetFocusMinutes] = useState(
    task?.targetFocusMinutes ?? defaultTimerSettings.focusMinutes,
  );
  const [targetCycles, setTargetCycles] = useState(
    task?.targetCycles ?? defaultTimerSettings.totalCycles,
  );
  const [targetBreakMinutes, setTargetBreakMinutes] = useState(
    task?.targetBreakMinutes ?? defaultTimerSettings.shortBreakMinutes,
  );
  // 새 작업은 기본값만 빠르게 채우도록 접어두고, 기존 작업 수정은 이미 의미 있는 값이라 펼쳐서 보여줌
  const [showTimeSettings, setShowTimeSettings] = useState(task !== null);

  function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) return;

    if (task === null) {
      const newId = addTask({
        title: trimmed,
        categoryId,
        targetFocusMinutes,
        targetCycles,
        targetBreakMinutes,
      });
      onCreated?.(newId);
    } else {
      updateTask(task.id, {
        title: trimmed,
        categoryId,
        targetFocusMinutes,
        targetCycles,
        targetBreakMinutes,
      });
      if (isActiveTask && !isRunning) {
        applyActiveTaskTimeUpdate({
          focusMinutes: targetFocusMinutes,
          shortBreakMinutes: targetBreakMinutes,
          totalCycles: targetCycles,
        });
      }
    }
    onClose();
  }

  return (
    <Modal
      title={task ? '작업 수정' : '새 작업 추가'}
      onClose={onClose}
      backdropClassName="bg-black/55 backdrop-blur-sm"
      maxHeightClassName="max-h-[80vh]"
      footer={
        <>
          <Button onClick={onClose} variant="secondary" size="lg" className="px-4">
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim()}
            variant="default"
            size="lg"
            className="px-4 font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {task ? '저장' : '추가'}
          </Button>
        </>
      }
    >
      {/* 작업 제목 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">작업 제목</label>
        <TextInput
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="예) 알고리즘 문제 풀기"
          className="w-full"
        />
      </div>

      {/* 카테고리 */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted-foreground">카테고리</label>
        <CategoryPills
          variant="rich"
          categories={categories}
          selectedId={categoryId}
          onChange={setCategoryId}
        />
      </div>

      {/* 목표 시간 — 접이식 */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setShowTimeSettings((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors self-start"
        >
          {showTimeSettings ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
          목표 시간
        </button>

        {showTimeSettings && (
          <>
            <TimerSettingsGroup
              focusMinutes={targetFocusMinutes}
              onFocusMinutesChange={setTargetFocusMinutes}
              totalCycles={targetCycles}
              onTotalCyclesChange={setTargetCycles}
              shortBreakMinutes={targetBreakMinutes}
              onShortBreakMinutesChange={setTargetBreakMinutes}
              disabled={timeFieldsDisabled}
            />
            <p className="text-xs text-muted-foreground/60 pt-0.5">
              총 집중 {targetFocusMinutes * targetCycles}분
              {targetBreakMinutes > 0 &&
                ` + 휴식 ${targetBreakMinutes * Math.max(0, targetCycles - 1)}분`}
            </p>
            {isActiveTask && (
              <p className="text-[11px] text-amber-500/90 pt-0.5">
                {isRunning
                  ? '타이머를 일시정지하면 시간을 수정할 수 있어요'
                  : '이 변경은 지금 진행 중인 세션에도 바로 적용돼요'}
              </p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
