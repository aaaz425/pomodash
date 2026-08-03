import { ListChecks, Timer, BookOpen, BarChart2 } from 'lucide-react';

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
    desc: '집중/휴식 시간과 사이클 수를 원하는 대로 설정하세요. 사이클이 완료되면 자동으로 알림이 울립니다.',
  },
  {
    step: '03',
    icon: BookOpen,
    title: '세션을 기록하세요',
    desc: '회고 메모를 남기고 집중도와 방해 요소를 기록하세요.',
  },
  {
    step: '04',
    icon: BarChart2,
    title: '통계를 확인하세요',
    desc: '대시보드에서 오늘의 집중 시간, 스트릭, 카테고리별 현황을 확인하세요.',
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how" className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">사용법</span>
          <h2 className="text-3xl font-bold text-foreground">4단계로 완성하는 집중</h2>
        </div>
        <div className="max-w-xl mx-auto flex flex-col">
          {STEPS.map(({ step, icon: Icon, title, desc }, i) => (
            <div key={step} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                {i < STEPS.length - 1 && <div className="w-px flex-1 bg-border my-2" />}
              </div>
              <div className={`text-left ${i < STEPS.length - 1 ? 'pb-10' : ''}`}>
                <span className="text-xs font-mono text-primary/60">{step}</span>
                <h3 className="font-semibold text-foreground mt-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed break-keep mt-1.5">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
