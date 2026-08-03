import { Trophy, Share2 } from 'lucide-react';
import Image from 'next/image';

const HIGHLIGHTS = [
  {
    icon: Trophy,
    title: '뱃지를 모으세요',
    desc: '스트릭, 누적 시간, 다양성까지. 꾸준함이 쌓일수록 새로운 뱃지가 열립니다.',
    src: '/landing/badge.png',
    alt: '뱃지 컬렉션 화면',
    width: 960,
    height: 1132,
  },
  {
    icon: Share2,
    title: '집중 기록을 공유하세요',
    desc: '집중 요약을 카드로 만들어 다운로드하거나 공유할 수 있어요.',
    src: '/landing/share-card.png',
    alt: '공유 카드 화면',
    width: 960,
    height: 1197,
  },
];

export function LandingHighlights() {
  return (
    <section id="achievement" className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            성장 확인
          </span>
          <h2 className="text-3xl font-bold text-foreground">성장을 눈으로 확인하세요</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc, src, alt, width, height }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
            >
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
                className="h-80 w-auto max-w-full self-center rounded-xl border border-border mt-2"
                sizes="320px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
