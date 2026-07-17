import { ListChecks, Timer, CheckCircle } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: ListChecks,
    title: '작업을 선택하세요',
    desc: '오늘 해야 할 작업을 추가하고 카테고리를 지정하세요. 목표가 명확할수록 집중이 쉬워집니다.',
  },
  {
    step: '02',
    icon: Timer,
    title: '타이머를 시작하세요',
    desc: '25분 집중, 5분 휴식. 사이클이 완료되면 자동으로 알림이 울립니다.',
  },
  {
    step: '03',
    icon: CheckCircle,
    title: '기록을 확인하세요',
    desc: '대시보드에서 오늘의 집중 시간, 스트릭, 카테고리별 현황을 확인하세요.',
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how" className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">사용법</span>
          <h2 className="text-3xl font-bold text-foreground">3단계로 시작하는 집중</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary/20 font-mono">{step}</span>
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
