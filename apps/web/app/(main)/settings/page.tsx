import type { Metadata } from 'next';
import { SettingsView } from '@/components/settings/SettingsView';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <main id="main-content" className="flex-1 overflow-y-auto">
      <SettingsView />
    </main>
  );
}
