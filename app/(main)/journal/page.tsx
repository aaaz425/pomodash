import type { Metadata } from 'next';
import { JournalView } from '@/components/journal/JournalView';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function JournalPage() {
  return (
    <main id="main-content" className="flex-1 overflow-y-auto">
      <JournalView />
    </main>
  );
}
