'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  widthClassName?: string;
  backdropZIndexClassName?: string;
  dialogZIndexClassName?: string;
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
}: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 ${backdropZIndexClassName} bg-black/50 backdrop-blur-sm`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          `fixed ${dialogZIndexClassName} flex flex-col bg-card border border-border shadow-2xl`,
          'bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh]',
          'sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl',
          widthClassName,
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-5 overflow-y-auto">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border shrink-0">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
