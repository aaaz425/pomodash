'use client';

import { useState } from 'react';
import { TextInput } from '@/components/shared/TextInput';
import { INPUT_LIMITS } from '@/lib/constants/limits';

interface Props {
  value: string;
  onChange: (value: string) => void;
  taskTitles: string[];
}

export function SessionTitleInput({ value, onChange, taskTitles }: Props) {
  const [focused, setFocused] = useState(false);

  const query = value.trim().toLowerCase();
  const suggestions = query
    ? taskTitles
        .filter((t) => t.toLowerCase().includes(query) && t.toLowerCase() !== query)
        .slice(0, 5)
    : [];

  return (
    <div className="relative">
      <TextInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={INPUT_LIMITS.TITLE_MAX_LENGTH}
        placeholder="기록 제목 (선택)"
        className="w-full"
      />
      {focused && suggestions.length > 0 && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
          {suggestions.map((title) => (
            <button
              key={title}
              type="button"
              // mousedown에서 포커스 이동을 막아야 blur가 클릭보다 먼저 발동해
              // 드롭다운이 먼저 닫혀버리는 걸 막을 수 있다.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onChange(title)}
              className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors"
            >
              {title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
