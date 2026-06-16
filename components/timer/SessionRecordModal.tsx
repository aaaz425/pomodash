'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useTimerStore } from '@/store/StoreProvider'
import { useCurrentTask } from '@/hooks/useCurrentTask'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { CycleIndicator } from '@/components/timer/CycleIndicator'

export function SessionRecordModal() {
  const sessionEnded = useTimerStore((s) => s.sessionEnded)
  const dismissSessionRecord = useTimerStore((s) => s.dismissSessionRecord)
  const cycleCount = useTimerStore((s) => s.cycleCount)
  const totalCycles = useTimerStore((s) => s.settings.totalCycles)
  const { task, category } = useCurrentTask()

  const [note, setNote] = useState('')

  if (!sessionEnded) return null

  function handleSubmit() {
    dismissSessionRecord()
    setNote('')
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleSubmit}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="세션 기록"
        className={[
          'fixed z-50 bg-card border border-border shadow-2xl overflow-y-auto',
          'bottom-0 left-0 right-0 rounded-t-2xl max-h-[90vh]',
          'sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2',
          'sm:w-[600px] sm:rounded-xl sm:max-h-[85vh]',
        ].join(' ')}
      >
        <div className="flex flex-col gap-7 p-8 sm:p-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-primary/20">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary">
                <Check className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
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
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2 min-w-0">
              <span className="text-lg font-semibold tracking-tight text-foreground truncate">
                {task?.title ?? '작업 없음'}
              </span>
              {category && task && <CategoryBadge category={category} />}
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-[11px] text-muted-foreground">
                완료된 사이클 {cycleCount} / {totalCycles}
              </span>
              <CycleIndicator />
            </div>
          </div>

          {/* Note Section */}
          <div className="flex flex-col gap-2.5">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              placeholder="무엇을 집중해서 했나요? 짧게 메모해두면 나중에 돌아볼 수 있어요."
              className={[
                'w-full h-[120px] resize-none rounded-md border border-border',
                'bg-card px-3.5 py-3 text-sm text-foreground',
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
            <button
              onClick={handleSubmit}
              className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              건너뛰기
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              기록 완료
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
