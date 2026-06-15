import { Plus } from 'lucide-react'
import { Sidebar } from '@/components/shared/Sidebar'
import { TimerRing } from '@/components/timer/TimerRing'
import { SessionBadge } from '@/components/timer/SessionBadge'
import { CycleIndicator } from '@/components/timer/CycleIndicator'
import { TimerControls } from '@/components/timer/TimerControls'

export default function HomePage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      {/* Timer Column */}
      <section className="flex flex-col items-center justify-center gap-7 w-[600px] shrink-0">
        {/* Badge + Cycle Row */}
        <div className="flex items-center gap-3">
          <SessionBadge />
          <CycleIndicator />
        </div>

        {/* Timer Display */}
        <TimerRing size={240} />

        {/* Controls */}
        <TimerControls />
      </section>

      {/* Task Column */}
      <section className="flex-1 flex flex-col border-l border-border bg-card px-8 py-10 gap-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">오늘의 작업</h2>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm font-medium transition-colors hover:bg-muted hover:text-foreground">
            <Plus className="w-4 h-4" />
            새 작업
          </button>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">아직 작업이 없어요</p>
          <p className="text-xs text-[#475569]">작업을 추가하고 집중 타이머를 시작해보세요</p>
        </div>

        {/* Add Task */}
        <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-border text-[#64748b] text-sm transition-colors hover:bg-muted">
          <Plus className="w-[15px] h-[15px]" />
          작업 추가하기
        </button>
      </section>
    </div>
  )
}
