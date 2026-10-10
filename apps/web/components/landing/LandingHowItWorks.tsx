const STEPS = [
  {
    step: '01',
    title: '작업을 선택하세요',
    desc: '오늘 해야 할 작업을 추가하고 카테고리를 지정하세요\n목표가 명확할수록 집중이 쉬워집니다',
  },
  {
    step: '02',
    title: '타이머를 시작하세요',
    desc: '집중/휴식 시간과 사이클 수를 원하는 대로 설정하세요\n사이클이 완료되면 자동으로 알림이 울립니다',
  },
  {
    step: '03',
    title: '기록을 남기세요',
    desc: '회고 메모를 남기고 집중도와 방해 요소를 기록하세요',
  },
  {
    step: '04',
    title: '통계를 확인하세요',
    desc: '대시보드에서 오늘의 집중 시간, 스트릭, 카테고리별 현황을 확인하세요',
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
        <div className="max-w-2xl mx-auto flex flex-col gap-10">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-6 items-start">
              <span className="text-5xl font-bold text-primary/15 leading-none tabular-nums shrink-0">
                {step}
              </span>
              <div className="text-left pt-1">
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed break-keep whitespace-pre-line mt-1.5">
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
