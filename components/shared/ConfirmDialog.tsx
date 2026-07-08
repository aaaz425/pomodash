'use client';

import type { ReactNode } from 'react';
import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  tertiaryLabel?: string;
  onTertiary?: () => void;
}

// AlertDialog는 바깥 클릭으로 안 닫히는 게 기본 동작(의도적 — 실수로 안 닫히게).
// ESC는 onOpenChange를 통해 onCancel로 연결한다.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  tertiaryLabel,
  onTertiary,
}: Props) {
  const hasTertiary = Boolean(tertiaryLabel && onTertiary);
  return (
    <AlertDialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <AlertDialogPrimitive.Popup
          aria-label={title}
          className={[
            'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-[90vw] sm:w-[400px] flex flex-col gap-4 p-6 rounded-xl outline-none',
            'bg-card border border-border shadow-2xl',
          ].join(' ')}
        >
          <div className="flex flex-col gap-1.5">
            <AlertDialogPrimitive.Title className="text-base font-semibold text-foreground">
              {title}
            </AlertDialogPrimitive.Title>
            {description && (
              <AlertDialogPrimitive.Description className="text-sm text-muted-foreground">
                {description}
              </AlertDialogPrimitive.Description>
            )}
          </div>

          <div
            className={`flex items-center gap-2 ${hasTertiary ? 'justify-between' : 'justify-end'}`}
          >
            {hasTertiary && (
              <Button onClick={onTertiary} variant="destructive" size="lg" className="px-4">
                {tertiaryLabel}
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Button onClick={onCancel} variant="secondary" size="lg" className="px-4">
                {cancelLabel}
              </Button>
              <Button
                onClick={onConfirm}
                variant="default"
                size="lg"
                className="px-4 font-semibold"
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
