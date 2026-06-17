'use client'

import type { ReactNode } from 'react'

interface Props {
  open: boolean
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

// window.confirm 대신 쓰는 커스텀 확인 다이얼로그.
// 다른 모달(z-40/50) 위에 떠야 하는 경우가 있어 z-index를 더 높게 잡는다.
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onCancel}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className={[
          'fixed z-[61] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-[90vw] sm:w-[400px] flex flex-col gap-4 p-6 rounded-xl',
          'bg-card border border-border shadow-2xl',
        ].join(' ')}
      >
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-muted-foreground bg-muted hover:text-foreground transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  )
}
