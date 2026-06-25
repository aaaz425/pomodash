import type { ComponentProps } from 'react';
import { Badge as ShadcnBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = ComponentProps<typeof ShadcnBadge>;

export function Badge({ className, ...props }: Props) {
  return <ShadcnBadge className={cn('h-auto', className)} {...props} />;
}
