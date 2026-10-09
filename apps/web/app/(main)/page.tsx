import { TimerSection } from '@/components/timer/TimerSection';
import { SessionRecordModal } from '@/components/timer/SessionRecordModal';
import { FocusMode } from '@/components/timer/FocusMode';
import { getCurrentUser } from '@/lib/supabase/server';

export default function HomePage() {
  const loggedInPromise = getCurrentUser().then((user) => user !== null);

  return (
    <>
      <main id="main-content" className="flex-1 overflow-y-auto flex flex-col">
        <h1 className="sr-only">타이머</h1>
        <TimerSection />
      </main>
      <SessionRecordModal loggedInPromise={loggedInPromise} />
      <FocusMode />
    </>
  );
}
