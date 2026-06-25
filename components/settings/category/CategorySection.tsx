'use client';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useTaskStore } from '@/store/StoreProvider';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { CategoryEditModal } from './CategoryEditModal';
import type { Category } from '@/types';

const MAX_CATEGORIES = 10;

export function CategorySection() {
  const categories = useTaskStore((s) => s.categories);
  const deleteCategory = useTaskStore((s) => s.deleteCategory);
  const isAtLimit = categories.length >= MAX_CATEGORIES;

  const [editTarget, setEditTarget] = useState<Category | 'new' | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  function handleDelete() {
    if (!deleteTargetId) return;
    deleteCategory(deleteTargetId);
    setDeleteTargetId(null);
  }

  return (
    <>
      <div className="flex flex-col">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between py-2.5 px-1 group border-b border-border/50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full shrink-0 ${cat.color}`} />
              <span className="text-sm text-foreground">{cat.name}</span>
            </div>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditTarget(cat)}
                aria-label={`${cat.name} 편집`}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteTargetId(cat.id)}
                aria-label={`${cat.name} 삭제`}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => !isAtLimit && setEditTarget('new')}
          disabled={isAtLimit}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          카테고리 추가
        </button>
        <span
          className={`text-xs ${isAtLimit ? 'text-destructive/70' : 'text-muted-foreground/70'}`}
        >
          {categories.length} / {MAX_CATEGORIES}
        </span>
      </div>

      {editTarget !== null && (
        <CategoryEditModal
          category={editTarget === 'new' ? null : editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      <ConfirmDialog
        open={deleteTargetId !== null}
        title="카테고리 삭제"
        description="삭제한 카테고리는 복구할 수 없습니다. 해당 카테고리를 사용 중인 작업에서는 카테고리가 표시되지 않습니다."
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </>
  );
}
