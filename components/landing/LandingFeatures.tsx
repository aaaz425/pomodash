import { BookOpen, BarChart2, Flame } from 'lucide-react';

export function LandingFeatures() {
  return (
    <section id="features" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">기능</span>
          <h2 className="text-3xl font-bold text-foreground">필요한 것만, 딱 맞게</h2>
          <p className="text-muted-foreground text-sm max-w-md">
            단순한 타이머를 넘어, 집중의 흐름을 기록하고 분석합니다.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3 p-6 rounded-xl border border-border bg-card">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">카테고리별 집중 분석</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              공부, 업무, 운동 등 카테고리별로 집중 시간을 분류하고 대시보드에서 한눈에 확인하세요.
            </p>
          </div>
          <div className="flex flex-col gap-3 p-6 rounded-xl border border-border bg-card">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">세션 회고 메모</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              집중이 끝날 때마다 짧게 기록을 남기세요. 작은 회고가 성장의 흔적이 됩니다.
            </p>
          </div>
          <div className="flex flex-col gap-3 p-6 rounded-xl border border-border bg-card">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">연속 기록 스트릭</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              매일 쌓이는 연속 집중일 기록. 끊기지 않는 습관이 실력이 됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
