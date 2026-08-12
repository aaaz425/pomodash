import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export function LegalSection({ title, children }: Props) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="text-sm text-muted-foreground">{children}</div>
    </section>
  );
}
