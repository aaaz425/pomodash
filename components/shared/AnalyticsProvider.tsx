'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/config/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics();
  }, []);
  return <>{children}</>;
}
