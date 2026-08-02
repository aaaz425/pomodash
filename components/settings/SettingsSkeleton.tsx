import { Skeleton } from '@/components/ui/skeleton';

function SettingCardSkeleton({ contentClassName }: { contentClassName: string }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="px-6 py-4 border-b border-border">
        <Skeleton className="h-4 w-16" />
      </div>
      <div className={`p-6 ${contentClassName}`}>
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

function MenuRowSkeleton() {
  return (
    <div className="flex w-full items-center justify-between gap-3 px-4 py-3.5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 lg:px-0 flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-4 w-48" />
      </header>

      <SettingCardSkeleton contentClassName="h-10" />
      <SettingCardSkeleton contentClassName="h-10" />
      <SettingCardSkeleton contentClassName="h-20" />

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        <MenuRowSkeleton />
        <MenuRowSkeleton />
        <MenuRowSkeleton />
        <MenuRowSkeleton />
        <MenuRowSkeleton />
      </div>
    </div>
  );
}
