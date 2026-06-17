import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <span className="text-7xl font-bold text-primary">404</span>
        <h1 className="text-xl font-semibold text-foreground">페이지를 찾을 수 없어요</h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          요청하신 페이지가 없거나 이동되었어요.
        </p>
      </div>
      <Link
        href="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        <Home className="w-4 h-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
