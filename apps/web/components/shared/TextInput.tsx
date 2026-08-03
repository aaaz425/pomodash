import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Props = ComponentProps<typeof Input>;

export function TextInput({ className, ...props }: Props) {
  return (
    <Input
      className={cn(
        'h-auto rounded-lg border-border bg-muted dark:bg-muted px-3 py-2.5 text-base md:text-base text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-border focus-visible:ring-2 focus-visible:ring-primary/50 disabled:bg-muted dark:disabled:bg-muted disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
}
