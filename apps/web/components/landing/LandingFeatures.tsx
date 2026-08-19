import { Focus, BookOpen, BarChart2 } from 'lucide-react';
import Image from 'next/image';

const FEATURES = [
  {
    icon: Focus,
    title: '집중 모드로 몰입',
    desc: '필요한 것만 남기고 나머지는 사라집니다. 타이머와 지금 할 일에만 온전히 집중하세요.',
    src: '/landing/focus-mode.png',
    alt: '집중 모드 화면',
    width: 2560,
    height: 1600,
  },
  {
    icon: BookOpen,
    title: '집중 회고 메모',
    desc: '집중이 끝날 때마다 짧게 기록을 남기세요. 작은 회고가 성장의 흔적이 됩니다.',
    src: '/landing/journal.png',
    alt: '기록 화면',
    width: 2560,
    height: 1600,
  },
  {
    icon: BarChart2,
    title: '한눈에 보는 집중 통계',
    desc: '카테고리별 집중 시간부터 연속 기록까지, 대시보드에서 나의 흐름을 확인하세요.',
    src: '/landing/dashboard.png',
    alt: '통계 대시보드 화면',
    width: 2560,
    height: 1395,
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">기능</span>
          <h2 className="text-3xl font-bold text-foreground">몰입하고, 기록하고, 분석하세요</h2>
          <p className="text-muted-foreground text-sm max-w-md break-keep">
            단순한 타이머를 넘어, 집중의 흐름을 기록하고 분석합니다.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc, src, alt, width, height }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed break-keep">{desc}</p>
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-auto rounded-xl border border-border mt-2"
                sizes="(min-width: 640px) 33vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
