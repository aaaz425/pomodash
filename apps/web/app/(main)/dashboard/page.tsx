import type { Metadata } from 'next';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { GuestGate } from '@/components/shared/GuestGate';
import { getCurrentUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  const loggedInPromise = getCurrentUser().then((user) => user !== null);

  return (
    <main id="main-content" className="flex-1 overflow-y-auto">
      <GuestGate loggedInPromise={loggedInPromise} title="로그인하면 통계를 확인할 수 있어요">
        <DashboardView />
      </GuestGate>
    </main>
  );
}
