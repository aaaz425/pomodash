'use client';

import { useState } from 'react';
import { useTaskStore } from '@/store/StoreProvider';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/shared/TextInput';
import type { Category } from '@/types';

import { CATEGORY_COLOR_KEYS } from '@/lib/constants/categoryColors';

interface Props {
  category: Category | null; // null = 새 카테고리
  onClose: () => void;
}

export function CategoryEditModal({ category, onClose }: Props) {
  const addCategory = useTaskStore((s) => s.addCategory);
  const updateCategory = useTaskStore((s) => s.updateCategory);

  const [name, setName] = useState(category?.name ?? '');
  const [color, setColor] = useState(category?.color ?? (CATEGORY_COLOR_KEYS[0] as string));

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
    <Modal
      title={title}
      onClose={onClose}
      widthClassName="sm:w-[360px]"
      footer={
        <>
          <Button onClick={onClose} variant="secondary" size="lg" className="px-4">
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            variant="default"
            size="lg"
            className="px-4 font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            저장
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">이름</label>
        <TextInput
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="카테고리 이름"
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted-foreground">색상</label>
        <div className="flex gap-2 flex-wrap">
          {CATEGORY_COLOR_KEYS.map((c) => (
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
    </Modal>
  );
}
