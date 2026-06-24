'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { SOUND_TYPE_LABELS, type SoundType } from '@/types';

interface Props {
  value: SoundType;
  onChange: (value: SoundType) => void;
}

export function SoundTypeSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleDown(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handleDown);
    return () => document.removeEventListener('mousedown', handleDown);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        id="sound-type"
        onClick={() => setOpen((p) => !p)}
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

      {open && (
        <div
          ref={dropdownRef}
          role="listbox"
          className="absolute z-50 top-full right-0 mt-1 w-28 bg-card border border-border rounded-lg shadow-2xl py-1"
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
        </div>
      )}
    </div>
  );
}
