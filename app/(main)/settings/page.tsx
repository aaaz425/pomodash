import type { Metadata } from 'next';
import { SettingsView } from '@/components/settings/SettingsView';
import { getCurrentUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <main id="main-content" className="flex-1 overflow-y-auto">
      <SettingsView userEmail={user?.email ?? null} />
    </main>
  );
}
