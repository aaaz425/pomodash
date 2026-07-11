import { TimerSection } from '@/components/timer/TimerSection';
import { SessionRecordModal } from '@/components/timer/SessionRecordModal';
import { FocusMode } from '@/components/timer/FocusMode';

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1 overflow-y-auto flex flex-col">
        <TimerSection />
      </main>
      <SessionRecordModal />
      <FocusMode />
    </>
  );
}
