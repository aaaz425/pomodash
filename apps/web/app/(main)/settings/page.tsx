import type { Metadata } from 'next';
import { SettingsView } from '@/components/settings/SettingsView';
import { getCurrentUser } from '@/lib/supabase/server';
import type { SettingsUser } from '@/types';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// non-async 유지 — await하면 loading.tsx가 없는 이 라우트가 suspend되어
// PageTransition 애니메이션이 끊긴다. fetch는 await 없이 시작만 해서 넘긴다.
export default function SettingsPage() {
  const userPromise: Promise<SettingsUser | null> = getCurrentUser().then((u) =>
    u
      ? {
          email: u.email ?? null,
          provider: (u.user_metadata?.provider as string | undefined) ?? null,
        }
      : null,
  );

  return (
    <main id="main-content" className="flex-1 overflow-y-auto">
      <SettingsView userPromise={userPromise} />
    </main>
  );
}
