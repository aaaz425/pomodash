export function PageSpinner() {
  return (
    <div className="flex flex-1 items-center justify-center" role="status" aria-label="로딩 중">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  );
}
