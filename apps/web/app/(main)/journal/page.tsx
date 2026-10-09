import type { Metadata } from 'next';
import { JournalView } from '@/components/journal/JournalView';
import { GuestGate } from '@/components/shared/GuestGate';
import { getCurrentUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function JournalPage() {
  const loggedInPromise = getCurrentUser().then((user) => user !== null);

  return (
    <main id="main-content" className="flex-1 overflow-y-auto">
      <GuestGate loggedInPromise={loggedInPromise} title="로그인하면 기록을 확인할 수 있어요">
        <JournalView />
      </GuestGate>
    </main>
  );
}
