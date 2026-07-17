import { LandingCTA } from '@/components/landing/LandingCTA';

export function LandingCtaSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 flex flex-col items-center text-center gap-6">
        <h2 className="text-3xl font-bold text-foreground">지금 집중을 시작하세요</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          설치 없이, 로그인 없이. 브라우저에서 바로 시작할 수 있습니다.
        </p>
        <LandingCTA />
      </div>
    </section>
  );
}
