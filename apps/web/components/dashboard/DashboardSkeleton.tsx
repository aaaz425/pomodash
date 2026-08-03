import { Skeleton } from '@/components/ui/skeleton';

function StatCardSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-1.5 p-5 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

function ChartCardSkeleton({ minHeightClassName }: { minHeightClassName: string }) {
  return (
    <div
      className={`flex flex-col gap-3 p-5 rounded-lg border border-border bg-card ${minHeightClassName}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="flex-1 w-full" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 lg:p-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-64 rounded-lg" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCardSkeleton minHeightClassName="min-h-[200px]" />
        <ChartCardSkeleton minHeightClassName="min-h-[200px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCardSkeleton minHeightClassName="min-h-[180px]" />
        <ChartCardSkeleton minHeightClassName="min-h-[180px]" />
      </div>

      <div className="flex flex-col gap-4 p-5 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
