'use client';

import { Toaster } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

export function AppToaster() {
  const { isDark } = useTheme();

  return (
    <Toaster
      theme={isDark ? 'dark' : 'light'}
      position="top-center"
      toastOptions={{
        classNames: {
          toast: 'bg-secondary! border-border! text-foreground! shadow-lg!',
        },
      }}
    />
  );
}
