'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  widthClassName?: string;
  backdropZIndexClassName?: string;
  dialogZIndexClassName?: string;
  backdropClassName?: string;
  maxHeightClassName?: string;
  bodyClassName?: string;
}

// 기본 z-40/41 — ConfirmDialog(z-60)보다 낮다.
// CategoryEditModal처럼 다른 Modal(예: 카테고리 목록 모달) 안에 중첩으로 떠야 하는 경우
// backdropZIndexClassName/dialogZIndexClassName으로 더 높은 티어(z-50/51)를 지정한다.
export function Modal({
  title,
  onClose,
  children,
  footer,
  widthClassName = 'sm:w-[400px]',
  backdropZIndexClassName = 'z-[40]',
  dialogZIndexClassName = 'z-[41]',
  backdropClassName = 'bg-black/50 backdrop-blur-sm',
  maxHeightClassName = 'max-h-[85vh]',
  bodyClassName = 'flex flex-col gap-5 p-5 overflow-y-auto',
}: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 ${backdropZIndexClassName} ${backdropClassName}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          `fixed ${dialogZIndexClassName} flex flex-col bg-card border border-border shadow-2xl`,
          `bottom-0 left-0 right-0 rounded-t-2xl ${maxHeightClassName}`,
          'sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl',
          widthClassName,
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <Button onClick={onClose} aria-label="닫기" variant="ghost" size="icon">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className={bodyClassName}>{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border shrink-0">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
