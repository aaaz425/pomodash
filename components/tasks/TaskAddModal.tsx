'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTaskStore, useSettingsStore } from '@/store/StoreProvider';
import { CategoryPills } from '@/components/shared/CategoryPills';
import { TimerSettingsGroup } from '@/components/shared/TimerSettingsGroup';
import { Button } from '@/components/ui/button';

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
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-60 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 폼 카드 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="새 작업 추가"
        className={[
          'fixed z-70 flex flex-col bg-card border border-border shadow-2xl',
          'bottom-0 left-0 right-0 rounded-t-2xl max-h-[80vh]',
          'sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[400px] sm:rounded-2xl',
        ].join(' ')}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">새 작업 추가</h2>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 폼 바디 */}
        <div className="flex flex-col gap-5 p-5 overflow-y-auto flex-1">
          {/* 작업 제목 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">작업 제목</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="예) 알고리즘 문제 풀기"
              className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
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
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border shrink-0">
          <Button onClick={onClose} variant="secondary" size="lg" className="px-4">
            취소
          </Button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:bg-primary/90"
          >
            추가
          </button>
        </div>
      </div>
    </>
  );
}
