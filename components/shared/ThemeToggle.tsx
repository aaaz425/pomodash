'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel }: Props) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={className}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px] shrink-0 text-[#64748b]" />
      ) : (
        <Moon className="w-[18px] h-[18px] shrink-0 text-[#64748b]" />
      )}
      {showLabel && <span>{isDark ? '라이트 모드' : '다크 모드'}</span>}
    </button>
  );
}
