import Link from 'next/link';
import { Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function TopBar() {
  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-5 bg-card border-b border-border">
      <span className="text-primary text-base font-bold">Pomodash</span>
      <div className="flex items-center gap-1">
        <ThemeToggle className="flex items-center justify-center w-9 h-9 rounded-lg text-[#64748b] hover:bg-muted hover:text-foreground transition-colors" />
        <Link
          href="/settings"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-[#64748b] hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
