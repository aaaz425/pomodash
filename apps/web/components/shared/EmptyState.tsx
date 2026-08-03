import { cn } from '@/lib/utils';

interface Props {
  message: string;
  subMessage?: string;
  className?: string;
  messageClassName?: string;
}

export function EmptyState({ message, subMessage, className, messageClassName }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-1.5 text-center', className)}>
      <p className={cn('text-sm text-muted-foreground', messageClassName)}>{message}</p>
      {subMessage && <p className="text-xs text-muted-foreground/60">{subMessage}</p>}
    </div>
  );
}
