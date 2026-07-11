import type { Metadata } from 'next';
import { JournalView } from '@/components/journal/JournalView';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function JournalPage() {
  return (
    <main
      id="main-content"
      className="flex-1 overflow-y-auto lg:overflow-hidden lg:flex lg:flex-col"
    >
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 lg:flex lg:flex-col lg:flex-1 lg:min-h-0">
        <div className="mb-6 lg:shrink-0">
          <h1 className="text-xl font-bold text-foreground">기록</h1>
          <p className="mt-1 text-sm text-muted-foreground">한 번의 집중도 기억합니다</p>
        </div>
        <JournalView />
      </div>
    </main>
  );
}
