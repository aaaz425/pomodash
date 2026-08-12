'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { DISTRACTION_TAGS } from '@/lib/constants';
import { INPUT_LIMITS } from '@/lib/constants/limits';
import { TextInput } from '@/components/shared/TextInput';

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

const chipClassName = 'px-2.5 py-1 rounded-full text-xs font-medium transition-colors border';

export function DistractionTagPicker({ value, onChange }: Props) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  function toggle(tagId: string) {
    onChange(value.includes(tagId) ? value.filter((id) => id !== tagId) : [...value, tagId]);
  }

  function removeCustom(text: string) {
    onChange(value.filter((v) => v !== text));
  }

  function handleAdd() {
    const trimmed = draft.trim();
    if (trimmed) {
      // 프리셋 라벨과 같은 텍스트를 입력하면 커스텀으로 따로 추가하지 않고 해당 프리셋을
      // 선택 처리한다 — 똑같이 생긴 칩이 중복되는 것을 막기 위함.
      const matchedPreset = DISTRACTION_TAGS.find(
        (tag) => tag.label.toLowerCase() === trimmed.toLowerCase(),
      );
      if (matchedPreset) {
        if (!value.includes(matchedPreset.id)) onChange([...value, matchedPreset.id]);
      } else if (!value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
        onChange([...value, trimmed]);
      }
    }
    // 빈 채로 블러/엔터해도 입력창은 닫혀야 한다 — 그냥 두면 트리거 칩으로 안 돌아옴.
    setDraft('');
    setAdding(false);
  }

  function handleCancel() {
    setDraft('');
    setAdding(false);
  }

  const customTags = value.filter((v) => !DISTRACTION_TAGS.some((tag) => tag.id === v));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {DISTRACTION_TAGS.map((tag) => {
        const isSelected = value.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className={[
              chipClassName,
              isSelected
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-border text-muted-foreground hover:bg-border/50',
            ].join(' ')}
          >
            {tag.label}
          </button>
        );
      })}

      {customTags.map((text) => (
        <button
          key={text}
          type="button"
          onClick={() => removeCustom(text)}
          className={[chipClassName, 'bg-primary/10 border-primary text-primary'].join(' ')}
        >
          {text}
        </button>
      ))}

      {adding ? (
        <div className="flex items-center gap-1">
          <TextInput
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleAdd}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') handleCancel();
            }}
            maxLength={INPUT_LIMITS.DISTRACTION_TAG_MAX_LENGTH}
            placeholder="직접입력"
            className="w-24 h-auto px-2.5 py-1 text-xs rounded-full"
          />
          <button
            type="button"
            // mousedown에서 포커스 이동을 막아야 blur(=handleAdd)가 먼저 발동해
            // 취소하려던 입력이 그대로 추가되는 걸 막을 수 있다.
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleCancel}
            aria-label="직접입력 취소"
            className="flex items-center justify-center w-6 h-6 rounded-full text-muted-foreground hover:bg-muted transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className={[
            chipClassName,
            'flex items-center gap-1 border-dashed border-border text-muted-foreground hover:bg-border/50',
          ].join(' ')}
        >
          <Plus className="w-3 h-3" />
          직접입력
        </button>
      )}
    </div>
  );
}
