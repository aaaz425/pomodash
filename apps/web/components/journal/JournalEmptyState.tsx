import Link from 'next/link';

export function JournalEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="text-5xl">📋</span>
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-foreground">아직 기록된 세션이 없어요</p>
        <p className="text-sm text-muted-foreground">
          타이머를 시작해 첫 번째 집중 세션을 만들어보세요
        </p>
      </div>
      <Link
        href="/"
        className="mt-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        타이머로 이동
      </Link>
    </div>
  );
}
