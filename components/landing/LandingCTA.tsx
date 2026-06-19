'use client';

import Link from 'next/link';
import { useState } from 'react';

export function LandingCTA() {
  const [hasData] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const tasks = localStorage.getItem('pomodash:tasks');
      const sessions = localStorage.getItem('pomodash:sessions');
      const hasTasks = tasks ? JSON.parse(tasks).length > 0 : false;
      const hasSessions = sessions ? JSON.parse(sessions).length > 0 : false;
      return hasTasks || hasSessions;
    } catch {
      return false;
    }
  });

  return (
    <Link
      href="/"
      className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
    >
      {hasData ? '이어서 집중하기' : '지금 시작하기'}
    </Link>
  );
}
