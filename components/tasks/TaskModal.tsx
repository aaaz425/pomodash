'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTaskStore } from '@/store/StoreProvider';
import { useTimerStore } from '@/store/StoreProvider';
import { Button } from '@/components/ui/button';
import { TaskList } from './TaskList';
import { TaskAddModal } from './TaskAddModal';

export function TaskModal() {
  const isOpen = useTaskStore((s) => s.isModalOpen);
  const closeModal = useTaskStore((s) => s.closeModal);
  const tasks = useTaskStore((s) => s.tasks);
  const currentTaskId = useTimerStore((s) => s.currentTaskId);
  const setCurrentTask = useTimerStore((s) => s.setCurrentTask);
  const updateSettings = useTimerStore((s) => s.updateSettings);

  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // 모달 열릴 때 현재 연결된 작업으로 초기화
  const currentTaskIdRef = useRef(currentTaskId);
  useEffect(() => {
    currentTaskIdRef.current = currentTaskId;
  }, [currentTaskId]);
  useEffect(() => {
    if (isOpen) {
      setPendingTaskId(currentTaskIdRef.current);
      setShowAddModal(false);
    }
  }, [isOpen]);

  // ESC 키: 추가 모달 먼저 닫고, 없으면 작업 관리 모달 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAddModal) setShowAddModal(false);
        else closeModal();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, showAddModal, closeModal]);

  if (!isOpen) return null;

  function handleConfirm() {
    setCurrentTask(pendingTaskId);
    if (pendingTaskId) {
      const task = tasks.find((t) => t.id === pendingTaskId);
      if (task) {
        updateSettings({
          focusMinutes: task.targetFocusMinutes,
          shortBreakMinutes: task.targetBreakMinutes,
          totalCycles: task.targetCycles,
        });
      }
    }
    closeModal();
  }

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* 모달 패널 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="작업 관리"
        className={[
          'fixed z-50 flex flex-col bg-card border border-border shadow-2xl',
          'bottom-0 left-0 right-0 rounded-t-2xl max-h-[80vh]',
          'sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[480px] sm:rounded-2xl sm:max-h-[70vh]',
        ].join(' ')}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">작업 관리</h2>
          <Button onClick={closeModal} aria-label="닫기" variant="ghost" size="icon">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 섹션 레이블 */}
        <div className="px-5 pt-2.5 pb-1 shrink-0">
          <span className="text-[11px] font-medium text-muted-foreground/60">진행 중인 작업</span>
        </div>

        {/* 작업 목록 */}
        <div className="flex-1 min-h-0 overflow-hidden px-2">
          <TaskList selectedTaskId={pendingTaskId} onSelect={setPendingTaskId} />
        </div>

        {/* 구분선 */}
        <div className="h-px bg-border shrink-0" />

        {/* 새 작업 추가 행 */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-primary hover:bg-muted/50 transition-colors w-full text-left shrink-0"
        >
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/15">
            <Plus className="w-3 h-3" />
          </span>
          새 작업 추가
        </button>

        {/* 구분선 */}
        <div className="h-px bg-border shrink-0" />

        {/* 푸터 */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 shrink-0">
          <Button onClick={closeModal} variant="secondary" size="lg" className="px-4">
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            variant="default"
            size="lg"
            className="px-4 font-semibold hover:bg-primary/90"
          >
            선택 완료
          </Button>
        </div>
      </div>

      {/* 새 작업 추가 모달 */}
      {showAddModal && <TaskAddModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}
