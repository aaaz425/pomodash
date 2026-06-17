'use client';

import { useState } from 'react';
import { CategoryPills } from '@/components/shared/CategoryPills';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
  onAdd: (title: string, categoryId: string) => void;
  onCancel: () => void;
}

export function TaskQuickAddForm({ categories, onAdd, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');

  function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, categoryId);
  }

  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-lg border border-border bg-muted/50">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        placeholder="작업 제목"
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/50"
      />
      <CategoryPills categories={categories} selectedId={categoryId} onChange={setCategoryId} />
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg text-sm text-muted-foreground bg-muted hover:text-foreground transition-colors"
        >
          취소
        </button>
        <button
          onClick={handleAdd}
          disabled={!title.trim()}
          className="flex-1 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          추가
        </button>
      </div>
    </div>
  );
}
