import { JournalView } from '@/components/journal/JournalView';

export default function JournalPage() {
  return (
    <main className="flex-1 overflow-y-auto lg:overflow-hidden lg:flex lg:flex-col">
      <div className="p-4 sm:p-6 lg:p-10 pb-24 sm:pb-6 lg:pb-10 lg:flex lg:flex-col lg:flex-1 lg:min-h-0">
        <div className="flex items-baseline gap-3 mb-6 lg:shrink-0">
          <h1 className="text-2xl font-bold tracking-tight">기록</h1>
          <span className="text-sm text-muted-foreground">한 번의 집중도 기억합니다</span>
        </div>
        <JournalView />
      </div>
    </main>
  );
}
