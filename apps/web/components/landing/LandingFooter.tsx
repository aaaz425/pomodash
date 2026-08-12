import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between text-xs text-muted-foreground">
        <span>© 2026 Pomodash</span>
        <div className="flex gap-5">
          <a href="#features" className="hover:text-foreground transition-colors">
            기능
          </a>
          <a href="#how" className="hover:text-foreground transition-colors">
            사용법
          </a>
          <a href="#achievement" className="hover:text-foreground transition-colors">
            성장 확인
          </a>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
}
