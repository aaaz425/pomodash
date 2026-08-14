'use client';

import { useState } from 'react';
import { useTaskStore } from '@/store/StoreProvider';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/shared/TextInput';
import type { Category } from '@/types';

import { CATEGORY_COLOR_KEYS, CATEGORY_COLOR_LABELS } from '@/lib/constants/categoryColors';

interface Props {
  category: Category | null; // null = 새 카테고리
  onClose: () => void;
}

export function CategoryEditModal({ category, onClose }: Props) {
  const addCategory = useTaskStore((s) => s.addCategory);
  const updateCategory = useTaskStore((s) => s.updateCategory);

  const [name, setName] = useState(category?.name ?? '');
  const [color, setColor] = useState(category?.color ?? (CATEGORY_COLOR_KEYS[0] as string));
  // 저장이 비동기(Supabase 왕복)라 이게 없으면 응답 오기 전에 다시 눌러 중복 생성될 수 있음
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed || isSubmitting) return;
    setIsSubmitting(true);
    if (category) {
      await updateCategory(category.id, { name: trimmed, color });
    } else {
      await addCategory({ name: trimmed, color });
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
            disabled={!name.trim() || isSubmitting}
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
        <label htmlFor="category-name" className="text-xs font-medium text-muted-foreground">
          이름
        </label>
        <TextInput
          id="category-name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="카테고리 이름"
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span id="category-color-label" className="text-xs font-medium text-muted-foreground">
          색상
        </span>
        <div className="flex gap-2 flex-wrap" role="group" aria-labelledby="category-color-label">
          {CATEGORY_COLOR_KEYS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={CATEGORY_COLOR_LABELS[c]}
              aria-pressed={color === c}
              className={`w-8 h-8 rounded-full ${c} transition-all ${
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
