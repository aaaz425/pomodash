'use client'

import { useState } from 'react'
import { Maximize2 } from 'lucide-react'
import { useTimerStore } from '@/store/StoreProvider'
import { useTimer } from '@/hooks/useTimer'
import { useCurrentTask } from '@/hooks/useCurrentTask'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

export function TimerControls() {
  const isRunning = useTimerStore((s) => s.startedAt !== null)
  const sessionStarted = useTimerStore((s) => s.sessionStarted)
  const settings = useTimerStore((s) => s.settings)
  const start = useTimerStore((s) => s.start)
  const pause = useTimerStore((s) => s.pause)
  const endSession = useTimerStore((s) => s.endSession)
  const enterFocusMode = useTimerStore((s) => s.enterFocusMode)
  const { displaySeconds, phase, cycleCount } = useTimer()
  const { task } = useCurrentTask()

  const [showStartConfirm, setShowStartConfirm] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [wasRunning, setWasRunning] = useState(false)

  function handleStartClick() {
    if (isRunning) {
      pause()
      return
    }
    if (!sessionStarted) {
      setShowStartConfirm(true)
      return
    }
    start()
  }

  const elapsedMinutes =
    cycleCount * settings.focusMinutes +
    (phase === 'focus' ? Math.max(0, Math.floor((settings.focusMinutes * 60 - displaySeconds) / 60)) : 0)

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={!isRunning}
        onClick={enterFocusMode}
        aria-label="집중 모드"
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-muted disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        집중
      </button>

      <button
        onClick={handleStartClick}
        className="px-7 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-colors hover:bg-primary/90 active:bg-primary/80"
      >
        {isRunning ? '일시정지' : '시작'}
      </button>

      <button
        onClick={() => {
          const running = isRunning
          if (running) pause()
          setWasRunning(running)
          setShowEndConfirm(true)
        }}
        className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        세션 종료
      </button>

      <ConfirmDialog
        open={showStartConfirm}
        title="세션을 시작할까요?"
        description={
          <>
            {task?.title ?? '작업 없음'} · 집중 {settings.focusMinutes}분 × {settings.totalCycles}사이클
            (휴식 {settings.shortBreakMinutes}분)
          </>
        }
        confirmLabel="시작"
        onConfirm={() => {
          start()
          setShowStartConfirm(false)
        }}
        onCancel={() => setShowStartConfirm(false)}
      />

      <ConfirmDialog
        open={showEndConfirm}
        title="세션을 종료할까요?"
        description={
          <>
            지금까지 {elapsedMinutes}분 · {cycleCount}/{settings.totalCycles}사이클 진행했어요.
          </>
        }
        confirmLabel="세션 종료"
        onConfirm={() => {
          endSession()
          setShowEndConfirm(false)
        }}
        onCancel={() => {
          if (wasRunning) start()
          setShowEndConfirm(false)
        }}
      />
    </div>
  )
}
