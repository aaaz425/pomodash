export function TopBar() {
  return (
    <header className="shrink-0 flex items-center px-5 h-[calc(3.5rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] bg-card border-b border-border">
      <span className="text-primary text-base font-bold">Pomodash</span>
    </header>
  );
}
