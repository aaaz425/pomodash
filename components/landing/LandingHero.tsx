import { LandingCTA } from '@/components/landing/LandingCTA';

export function LandingHero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 flex flex-col items-center text-center gap-6">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
        로그인 없이 바로 시작
      </span>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-2xl leading-tight">
        집중하면
        <br />
        결과가 따라온다
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
        포모도로 타이머로 작업을 계획하고, 집중하고, 기록하세요. 매일의 노력이 쌓여 결과로
        이어집니다.
      </p>
      <div className="flex items-center gap-3">
        <LandingCTA />
        <a
          href="#how"
          className="px-6 py-3 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          어떻게 작동하나요?
        </a>
      </div>

      {/* Timer mockup */}
      <div className="mt-8 w-full max-w-sm rounded-2xl border border-border bg-card p-8 flex flex-col items-center gap-5 shadow-lg">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
            <circle
              cx="72"
              cy="72"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            <circle
              cx="72"
              cy="72"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="376.99"
              strokeDashoffset="94.25"
              className="text-primary transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-3xl font-mono font-bold tabular-nums text-foreground">25:00</span>
            <span className="text-xs text-muted-foreground">집중</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">1 / 4 사이클</span>
        </div>
        <div className="flex gap-2 w-full">
          <div className="flex-1 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">▶ 시작</span>
          </div>
        </div>
      </div>
    </section>
  );
}
