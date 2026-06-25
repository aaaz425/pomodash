'use client';

import { useState } from 'react';
import { useTaskStore, useSettingsStore } from '@/store/StoreProvider';
import { CategoryPills } from '@/components/shared/CategoryPills';
import { TimerSettingsGroup } from '@/components/shared/TimerSettingsGroup';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/shared/Modal';
import { TextInput } from '@/components/shared/TextInput';

interface Props {
  onClose: () => void;
}

export function TaskAddModal({ onClose }: Props) {
  const categories = useTaskStore((s) => s.categories);
  const addTask = useTaskStore((s) => s.addTask);
  const defaultTimerSettings = useSettingsStore((s) => s.defaultTimerSettings);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [targetFocusMinutes, setTargetFocusMinutes] = useState(defaultTimerSettings.focusMinutes);
  const [targetCycles, setTargetCycles] = useState(defaultTimerSettings.totalCycles);
  const [targetBreakMinutes, setTargetBreakMinutes] = useState(
    defaultTimerSettings.shortBreakMinutes,
  );

  function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    addTask({ title: trimmed, categoryId, targetFocusMinutes, targetCycles, targetBreakMinutes });
    onClose();
  }

  return (
    <Modal
      title="새 작업 추가"
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
            추가
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

      {/* 목표 시간 */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted-foreground">목표 시간</label>
        <TimerSettingsGroup
          focusMinutes={targetFocusMinutes}
          onFocusMinutesChange={setTargetFocusMinutes}
          totalCycles={targetCycles}
          onTotalCyclesChange={setTargetCycles}
          shortBreakMinutes={targetBreakMinutes}
          onShortBreakMinutesChange={setTargetBreakMinutes}
        />
        <p className="text-xs text-muted-foreground/60 pt-0.5">
          총 집중 {targetFocusMinutes * targetCycles}분
          {targetBreakMinutes > 0 &&
            ` + 휴식 ${targetBreakMinutes * Math.max(0, targetCycles - 1)}분`}
        </p>
      </div>
    </Modal>
  );
}
