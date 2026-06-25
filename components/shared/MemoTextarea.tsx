import { forwardRef, type TextareaHTMLAttributes } from 'react';

const MEMO_MAX_LENGTH = 500;

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'maxLength'>;

export const MemoTextarea = forwardRef<HTMLTextAreaElement, Props>(
  function MemoTextarea(props, ref) {
    return <textarea ref={ref} maxLength={MEMO_MAX_LENGTH} {...props} />;
  },
);
