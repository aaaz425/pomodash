import Link from 'next/link';
import type { ReactNode } from 'react';

interface Props {
  title?: string;
  children: ReactNode;
}

export function AuthShell({ title, children }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <Link href="/landing" className="self-center text-primary font-bold text-lg">
          Pomodash
        </Link>
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-6">
          {title && <h1 className="text-xl font-bold text-foreground text-center">{title}</h1>}
          {children}
        </div>
      </div>
    </div>
  );
}
