'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">문제가 발생했습니다.</p>
      <button onClick={reset} className="text-sm underline">
        다시 시도
      </button>
    </div>
  )
}
