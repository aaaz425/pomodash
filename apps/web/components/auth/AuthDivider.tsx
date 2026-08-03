export function AuthDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">또는</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
