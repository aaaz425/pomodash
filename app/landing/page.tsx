import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, BarChart2, Flame, CheckCircle, Timer, ListChecks } from 'lucide-react';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <span className="text-primary font-bold text-base">Pomodash</span>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              기능
            </a>
            <a href="#how" className="hover:text-foreground transition-colors">
              사용법
            </a>
          </nav>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* Hero */}
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
              <span className="text-3xl font-mono font-bold tabular-nums text-foreground">
                25:00
              </span>
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

      {/* Features */}
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
                공부, 업무, 운동 등 카테고리별로 집중 시간을 분류하고 대시보드에서 한눈에
                확인하세요.
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

      {/* How It Works */}
      <section id="how" className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col items-center text-center gap-3 mb-12">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              사용법
            </span>
            <h2 className="text-3xl font-bold text-foreground">3단계로 시작하는 집중</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
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
            ].map(({ step, icon: Icon, title, desc }) => (
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

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl font-bold text-foreground">지금 집중을 시작하세요</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            설치 없이, 로그인 없이. 브라우저에서 바로 시작할 수 있습니다.
          </p>
          <LandingCTA />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 Pomodash</span>
          <div className="flex gap-5">
            <a href="#features" className="hover:text-foreground transition-colors">
              기능
            </a>
            <a href="#how" className="hover:text-foreground transition-colors">
              사용법
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
