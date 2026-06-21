'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTaskStore } from '@/store/StoreProvider';
import type { Category } from '@/types';

const COLOR_PALETTE = [
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-gray-500',
];

interface Props {
  category: Category | null; // null = 새 카테고리
  onClose: () => void;
}

export function CategoryEditModal({ category, onClose }: Props) {
  const addCategory = useTaskStore((s) => s.addCategory);
  const updateCategory = useTaskStore((s) => s.updateCategory);

  const [name, setName] = useState(category?.name ?? '');
  const [color, setColor] = useState(category?.color ?? COLOR_PALETTE[0]);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (category) {
      updateCategory(category.id, { name: trimmed, color });
    } else {
      addCategory({ name: trimmed, color });
    }
    onClose();
  }

  const title = category ? '카테고리 편집' : '카테고리 추가';

  return (
    <>
      <div
        className="fixed inset-0 z-[50] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          'fixed z-[51] flex flex-col bg-card border border-border shadow-2xl',
          'bottom-0 left-0 right-0 rounded-t-2xl',
          'sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[360px] sm:rounded-2xl',
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

        <div className="flex flex-col gap-5 p-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">이름</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="카테고리 이름"
              className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">색상</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={c}
                  aria-pressed={color === c}
                  className={`w-7 h-7 rounded-full ${c} transition-all ${
                    color === c
                      ? 'ring-2 ring-offset-2 ring-offset-card ring-foreground/30 scale-110'
                      : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-muted-foreground bg-muted hover:text-foreground transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    </>
  );
}
