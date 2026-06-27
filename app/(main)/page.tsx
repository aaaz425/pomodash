import { TimerSection } from '@/components/timer/TimerSection';
import { SessionRecordModal } from '@/components/timer/SessionRecordModal';
import { FocusMode } from '@/components/timer/FocusMode';

export default function HomePage() {
  return (
    <>
      <TimerSection />
      {/* fixed BottomNav를 위한 스페이서 (h-16 본체 + safe-area-inset-bottom의 절반) */}
      <div className="h-16 standalone:h-[calc(4rem+env(safe-area-inset-bottom)*0.5)] shrink-0 sm:hidden" />
      <SessionRecordModal />
      <FocusMode />
    </>
  );
}
