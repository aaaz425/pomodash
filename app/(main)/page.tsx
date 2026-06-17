import { TimerSection } from '@/components/timer/TimerSection';
import { TaskModal } from '@/components/tasks/TaskModal';
import { SessionRecordModal } from '@/components/timer/SessionRecordModal';
import { FocusMode } from '@/components/timer/FocusMode';

export default function HomePage() {
  return (
    <>
      <TimerSection />
      {/* fixed BottomNav를 위한 스페이서 */}
      <div className="h-16 shrink-0 sm:hidden" />
      <TaskModal />
      <SessionRecordModal />
      <FocusMode />
    </>
  );
}
