import { JournalView } from '@/components/journal/JournalView';

export default function JournalPage() {
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-10 pb-24 sm:pb-6 lg:pb-10">
      <h1 className="text-2xl font-bold tracking-tight mb-6">기록</h1>
      <JournalView />
    </main>
  );
}
