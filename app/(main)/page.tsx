import { Sidebar } from '@/components/shared/layout/Sidebar';
import { IconSidebar } from '@/components/shared/layout/IconSidebar';
import { TopBar } from '@/components/shared/layout/TopBar';
import { BottomNav } from '@/components/shared/layout/BottomNav';
import { TimerSection } from '@/components/timer/TimerSection';
import { TaskModal } from '@/components/tasks/TaskModal';
import { SessionRecordModal } from '@/components/timer/SessionRecordModal';
import { FocusMode } from '@/components/timer/FocusMode';

export default function HomePage() {
  return (
    <div className="flex flex-col sm:flex-row h-screen overflow-hidden bg-background">
      <div className="sm:hidden">
        <TopBar />
      </div>
      <div className="hidden sm:block lg:hidden">
        <IconSidebar />
      </div>
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <TimerSection />

      {/* fixed BottomNav를 위한 스페이서 */}
      <div className="h-16 shrink-0 sm:hidden" />

      <BottomNav />

      <TaskModal />
      <SessionRecordModal />
      <FocusMode />
    </div>
  );
}
