'use client';

import { useState, useEffect, startTransition } from 'react';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';

function LightPreview() {
  return (
    <div className="w-full h-full bg-white flex">
      <div className="w-4 bg-gray-100 shrink-0 flex flex-col gap-0.5 p-0.5 pt-1">
        <div className="w-full h-1 rounded-sm bg-gray-200" />
        <div className="w-full h-1 rounded-sm bg-gray-200" />
        <div className="w-3/4 h-1 rounded-sm bg-gray-200" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-1">
        <div className="w-7 h-7 rounded-full border-2 border-gray-200" />
        <div className="w-8 h-0.5 rounded bg-gray-200" />
        <div className="w-5 h-0.5 rounded bg-gray-200" />
      </div>
    </div>
  );
}

function DarkPreview() {
  return (
    <div className="w-full h-full bg-[#0f172a] flex">
      <div className="w-4 bg-[#1e293b] shrink-0 flex flex-col gap-0.5 p-0.5 pt-1">
        <div className="w-full h-1 rounded-sm bg-[#334155]" />
        <div className="w-full h-1 rounded-sm bg-[#334155]" />
        <div className="w-3/4 h-1 rounded-sm bg-[#334155]" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-1">
        <div className="w-7 h-7 rounded-full border-2 border-[#334155]" />
        <div className="w-8 h-0.5 rounded bg-[#334155]" />
        <div className="w-5 h-0.5 rounded bg-[#334155]" />
      </div>
    </div>
  );
}

function SystemPreview() {
  const [sysDark, setSysDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    startTransition(() => setSysDark(mq.matches));
    const handler = (e: MediaQueryListEvent) => setSysDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return sysDark ? <DarkPreview /> : <LightPreview />;
}

const OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: 'light', label: '라이트' },
  { mode: 'dark', label: '다크' },
  { mode: 'system', label: '시스템' },
];

export function ThemeSection() {
  const { mode, setTheme } = useTheme();

  return (
    <div className="flex gap-3">
      {OPTIONS.map(({ mode: optMode, label }) => {
        const isSelected = mode === optMode;
        return (
          <button
            key={optMode}
            onClick={() => setTheme(optMode)}
            aria-pressed={isSelected}
            className="flex-1 flex flex-col gap-2"
          >
            <div
              className={`h-16 rounded-lg border-2 overflow-hidden transition-colors ${
                isSelected ? 'border-primary' : 'border-border hover:border-muted-foreground/40'
              }`}
            >
              {optMode === 'light' && <LightPreview />}
              {optMode === 'dark' && <DarkPreview />}
              {optMode === 'system' && <SystemPreview />}
            </div>
            <span
              className={`text-xs text-center transition-colors ${
                isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
