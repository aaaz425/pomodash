'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Square } from 'lucide-react'
import { useTimerStore } from '@/store/StoreProvider'
import { useCurrentTask } from '@/hooks/useCurrentTask'
import { getRandomMotivationalMessage } from '@/lib/motivationalMessages'
import { CategoryBadge } from '@/components/shared/CategoryBadge'
import { TimerRing } from '@/components/timer/TimerRing'
import { CycleIndicator } from '@/components/timer/CycleIndicator'

export function FocusMode() {
  const isFocusMode = useTimerStore((s) => s.isFocusMode)
  const isRunning = useTimerStore((s) => s.startedAt !== null)
  const cycleCount = useTimerStore((s) => s.cycleCount)
  const start = useTimerStore((s) => s.start)
  const pause = useTimerStore((s) => s.pause)
  const endSession = useTimerStore((s) => s.endSession)
  const exitFocusMode = useTimerStore((s) => s.exitFocusMode)
  const { task, category } = useCurrentTask()

  // 진입할 때만 새 메시지를 골라 고정 — 매 렌더마다 재추첨되지 않도록
  const [message] = useState(getRandomMotivationalMessage)

  useEffect(() => {
    if (!isFocusMode) return

    function handleKeydown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return

      if (e.code === 'Space') {
        e.preventDefault()
        if (isRunning) pause()
        else start()
      } else if (e.key === 'Escape') {
        exitFocusMode()
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isFocusMode, isRunning, pause, start, exitFocusMode])

  return (
    <AnimatePresence>
      {isFocusMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="dark fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background px-4"
        >
          {/* Exit Button */}
          <button
            onClick={exitFocusMode}
            aria-label="집중 모드 나가기"
            className="absolute top-6 right-6 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            나가기
          </button>

          {/* Task Section */}
          <div className="relative flex flex-col items-center gap-2">
            <span className="text-sm text-muted-foreground/60">{cycleCount + 1}번째 집중 세션</span>
            {task ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-foreground">{task.title}</span>
                {category && <CategoryBadge category={category} />}
              </div>
            ) : (
              <span className="text-xl font-semibold text-muted-foreground/50">작업 없음</span>
            )}
          </div>

          {/* 동기부여 메시지 */}
          <p className="relative text-sm text-muted-foreground/80 text-center max-w-xs">{message}</p>

          {/* 타이머 링 */}
          <div className="relative">
            <TimerRing />
          </div>

          {/* 사이클 */}
          <div className="relative">
            <CycleIndicator />
          </div>

          {/* 컨트롤 */}
          <div className="relative flex items-center gap-3">
            <button
              onClick={isRunning ? pause : start}
              className="px-7 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-colors hover:bg-primary/90 active:bg-primary/80"
            >
              {isRunning ? '일시정지' : '시작'}
            </button>
            <button
              onClick={endSession}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Square className="w-3.5 h-3.5" />
              세션종료
            </button>
          </div>

          {/* 키보드 힌트 */}
          <p className="absolute bottom-6 text-xs text-muted-foreground/30">
            Space · 일시정지   |   Esc · 나가기
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
