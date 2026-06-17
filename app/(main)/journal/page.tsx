import { JournalView } from '@/components/journal/JournalView';

export default function JournalPage() {
  return (
    <main className="flex-1 overflow-y-auto lg:overflow-hidden lg:flex lg:flex-col">
      <div className="p-4 sm:p-6 lg:p-10 pb-24 sm:pb-6 lg:pb-10 lg:flex lg:flex-col lg:flex-1 lg:min-h-0">
        <h1 className="text-2xl font-bold tracking-tight mb-6 lg:shrink-0">기록</h1>
        <JournalView />
      </div>
    </main>
  );
}
