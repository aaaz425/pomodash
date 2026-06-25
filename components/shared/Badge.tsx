import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

export function Badge({ className, ...props }: Props) {
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs', className)}
      {...props}
    />
  );
}
