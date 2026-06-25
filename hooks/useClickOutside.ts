'use client';

import { useEffect, type RefObject } from 'react';

// SoundTypeSelect · DatePickerInput에서 동일하게 쓰던 "바깥 클릭하면 닫기" 로직 추출.
export function useClickOutside(
  ref1: RefObject<HTMLElement | null>,
  ref2: RefObject<HTMLElement | null>,
  onOutside: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    function handleDown(e: MouseEvent) {
      const target = e.target as Node;
      if (ref1.current?.contains(target) || ref2.current?.contains(target)) return;
      onOutside();
    }
    document.addEventListener('mousedown', handleDown);
    return () => document.removeEventListener('mousedown', handleDown);
  }, [enabled, onOutside, ref1, ref2]);
}
