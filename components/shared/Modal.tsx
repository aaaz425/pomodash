'use client';

import type { ReactNode } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  widthClassName?: string;
  backdropClassName?: string;
  maxHeightClassName?: string;
  bodyClassName?: string;
}

// Base UI Dialog는 portal로 렌더링되고 z-50 + DOM 순서로 자동 스태킹되므로
// 기존의 수동 z-index 티어 props(backdropZIndexClassName 등)는 더 이상 필요 없다.
export function Modal({
  title,
  onClose,
  children,
  footer,
  widthClassName = 'sm:w-[400px]',
  backdropClassName = 'bg-black/50 backdrop-blur-sm',
  maxHeightClassName = 'max-h-[85vh]',
  bodyClassName = 'flex flex-col gap-5 p-5 overflow-y-auto',
}: Props) {
  return (
    <DialogPrimitive.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className={`fixed inset-0 z-50 ${backdropClassName}`} />
        <DialogPrimitive.Popup
          aria-label={title}
          className={[
            'fixed z-50 flex flex-col bg-card border border-border shadow-2xl outline-none',
            `bottom-0 left-0 right-0 rounded-t-2xl ${maxHeightClassName}`,
            'sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl',
            widthClassName,
          ].join(' ')}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
            <DialogPrimitive.Title className="text-base font-semibold text-foreground">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="닫기"
              render={<Button variant="ghost" size="icon" />}
            >
              <X className="w-4 h-4" />
            </DialogPrimitive.Close>
          </div>

          <div className={bodyClassName}>{children}</div>

          {footer && (
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border shrink-0">
              {footer}
            </div>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
