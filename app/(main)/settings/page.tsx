import type { Metadata } from 'next';
import { SettingsView } from '@/components/settings/SettingsView';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main id="main-content" className="flex-1 overflow-y-auto">
      <SettingsView userEmail={user?.email ?? null} />
    </main>
  );
}
