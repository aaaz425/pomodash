import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function TextInput({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        'rounded-lg border border-border bg-muted px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50',
        className,
      )}
      {...props}
    />
  );
}
