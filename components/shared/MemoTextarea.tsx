import { forwardRef, type ComponentProps } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const MEMO_MAX_LENGTH = 500;

type Props = Omit<ComponentProps<typeof Textarea>, 'maxLength'>;

export const MemoTextarea = forwardRef<HTMLTextAreaElement, Props>(function MemoTextarea(
  { className, ...props },
  ref,
) {
  return (
    <Textarea
      ref={ref}
      maxLength={MEMO_MAX_LENGTH}
      className={cn('field-sizing-fixed md:text-base', className)}
      {...props}
    />
  );
});
