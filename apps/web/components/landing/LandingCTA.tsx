import Link from 'next/link';

export function LandingCTA() {
  return (
    <Link
      href="/login"
      className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
    >
      지금 시작하기
    </Link>
  );
}
