import Link from 'next/link';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <span className="text-primary font-bold text-base">Pomodash</span>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            기능
          </a>
          <a href="#how" className="hover:text-foreground transition-colors">
            사용법
          </a>
        </nav>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          시작하기
        </Link>
      </div>
    </header>
  );
}
