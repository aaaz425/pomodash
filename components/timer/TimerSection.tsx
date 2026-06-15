'use client'

import { ListChecks } from 'lucide-react'
import { useTimerStore, useTaskStore } from '@/store/StoreProvider'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { TimerRing } from '@/components/timer/TimerRing'
import { CycleIndicator } from '@/components/timer/CycleIndicator'
import { TimerControls } from '@/components/timer/TimerControls'

export function TimerSection() {
  const openModal = useTaskStore((s) => s.openModal)
  const currentTaskId = useTimerStore((s) => s.currentTaskId)
  const settings = useTimerStore((s) => s.settings)
  const tasks = useTaskStore((s) => s.tasks)
  const categories = useTaskStore((s) => s.categories)

  const task = tasks.find((t) => t.id === currentTaskId) ?? null
  const category = task ? (categories.find((c) => c.id === task.categoryId) ?? null) : null

  return (
    <section className="flex flex-col items-center justify-center gap-6 flex-1 py-8 sm:py-0 px-4">
      {/* 작업 관리 */}
      <button
        onClick={openModal}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-sm font-semibold transition-colors bg-violet-500/10 border-violet-500 text-violet-400 hover:bg-violet-500/20"
      >
        <ListChecks className="w-3.5 h-3.5" />
        작업 관리
      </button>

      {/* 현재 작업 */}
      <div className="flex items-center gap-2 h-5 text-sm text-muted-foreground">
        {task ? (
          <>
            {category && <CategoryBadge category={category} />}
            <span>{task.title}</span>
          </>
        ) : (
          <span className="text-muted-foreground/50">작업 없음</span>
        )}
      </div>

      {/* 타이머 링 */}
      <TimerRing />

      {/* 사이클 */}
      <CycleIndicator />

      {/* 세션 설정 카드 */}
      <div className="flex items-center rounded-lg border border-border bg-card divide-x divide-border">
        {[
          { value: `${settings.focusMinutes}분`, label: '집중' },
          { value: `${settings.shortBreakMinutes}분`, label: '휴식' },
          { value: `${settings.totalCycles}회`, label: '사이클' },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center gap-0.5 px-4 py-2.5">
            <span className="text-sm font-semibold text-foreground">{value}</span>
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* 컨트롤 */}
      <TimerControls />
    </section>
  )
}
