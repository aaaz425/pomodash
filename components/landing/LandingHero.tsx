import { LandingCTA } from '@/components/landing/LandingCTA';

export function LandingHero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 flex flex-col items-center text-center gap-6">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-2xl leading-tight">
        작은 집중이 쌓여
        <br />
        습관이 됩니다
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed break-keep">
        포모도로 타이머로 작업을 계획하고, 집중하고, 기록하세요. 매일의 노력이 쌓여 결과로
        이어집니다.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <LandingCTA />
        <a
          href="#features"
          className="px-6 py-3 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          기능 둘러보기
        </a>
        <a
          href="#how"
          className="px-6 py-3 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          사용법 보기
        </a>
        <a
          href="#achievement"
          className="px-6 py-3 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          나의 성장 확인
        </a>
      </div>
    </section>
  );
}
