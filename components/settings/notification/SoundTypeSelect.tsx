'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { SOUND_TYPE_LABELS } from '@/lib/constants';
import type { SoundType } from '@/types';

interface Props {
  value: SoundType;
  onChange: (value: SoundType) => void;
}

const DROPDOWN_WIDTH = 128; // w-32
const DROPDOWN_HEIGHT_ESTIMATE = 160; // 옵션 4개 기준 — 위/아래 배치 판단용
const VIEWPORT_MARGIN = 8;

export function SoundTypeSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function handleTriggerClick() {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow >= DROPDOWN_HEIGHT_ESTIMATE + VIEWPORT_MARGIN
        ? rect.bottom + 4
        : Math.max(VIEWPORT_MARGIN, rect.top - DROPDOWN_HEIGHT_ESTIMATE - 4);
    const left = Math.min(
      Math.max(VIEWPORT_MARGIN, rect.right - DROPDOWN_WIDTH),
      window.innerWidth - DROPDOWN_WIDTH - VIEWPORT_MARGIN,
    );
    setCoords({ top, left });
    setOpen(true);
  }

  useClickOutside(triggerRef, dropdownRef, () => setOpen(false), open);

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        id="sound-type"
        onClick={handleTriggerClick}
        className={[
          'flex items-center justify-between gap-1.5 w-24 text-sm bg-muted border rounded-lg px-2.5 py-1.5 text-foreground transition-colors disabled:cursor-not-allowed',
          open ? 'border-primary ring-1 ring-primary' : 'border-border',
        ].join(' ')}
      >
        {SOUND_TYPE_LABELS[value]}
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-70 w-32 bg-card border border-border rounded-xl shadow-2xl py-1"
          >
            {Object.entries(SOUND_TYPE_LABELS).map(([key, label]) => {
              const selected = key === value;
              return (
                <button
                  key={key}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(key as SoundType);
                    setOpen(false);
                  }}
                  className={[
                    'flex items-center justify-between w-full px-3 py-1.5 text-sm text-left transition-colors',
                    selected ? 'text-primary' : 'text-foreground hover:bg-muted',
                  ].join(' ')}
                >
                  {label}
                  {selected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
