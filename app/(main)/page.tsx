import { Plus } from 'lucide-react'
import { Sidebar } from '@/components/shared/Sidebar'
import { IconSidebar } from '@/components/shared/IconSidebar'
import { TopBar } from '@/components/shared/TopBar'
import { BottomNav } from '@/components/shared/BottomNav'
import { TimerRing } from '@/components/timer/TimerRing'
import { SessionBadge } from '@/components/timer/SessionBadge'
import { CycleIndicator } from '@/components/timer/CycleIndicator'
import { TimerControls } from '@/components/timer/TimerControls'

export default function HomePage() {
  return (
    <div className="flex flex-col sm:flex-row h-screen overflow-hidden bg-background">

      {/* Mobile: 상단 바 (< 640px) */}
      <div className="sm:hidden">
        <TopBar />
      </div>

      {/* Tablet: 아이콘 사이드바 (640px – 1024px) */}
      <div className="hidden sm:block lg:hidden">
        <IconSidebar />
      </div>

      {/* Desktop: 풀 사이드바 (≥ 1024px) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">

        {/* 타이머 컬럼 */}
        <section className="flex flex-col justify-center gap-7 flex-1 sm:flex-none sm:w-[calc(100vw-64px)] lg:w-[600px] shrink-0 py-8 sm:py-0 px-4 sm:px-0">
          <div className="flex items-center gap-3 mx-auto">
            <SessionBadge />
            <CycleIndicator />
          </div>

          <div className="mx-auto">
            <TimerRing />
          </div>

          <TimerControls />
        </section>

        {/* 태스크 컬럼 — 데스크탑 전용 */}
        <section className="hidden lg:flex flex-1 flex-col border-l border-border bg-card px-8 py-10 gap-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">오늘의 작업</h2>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm font-medium transition-colors hover:bg-muted hover:text-foreground">
              <Plus className="w-4 h-4" />
              새 작업
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">아직 작업이 없어요</p>
            <p className="text-xs text-muted-foreground/60">작업을 추가하고 집중 타이머를 시작해보세요</p>
          </div>

          <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-border text-muted-foreground text-sm transition-colors hover:bg-muted">
            <Plus className="w-[15px] h-[15px]" />
            작업 추가하기
          </button>
        </section>
      </div>

      {/* Mobile: 하단 네비게이션 (< 640px) */}
      <div className="sm:hidden">
        <BottomNav />
      </div>
    </div>
  )
}
