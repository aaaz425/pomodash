'use client';

import { useState, type PointerEvent as ReactPointerEvent } from 'react';
import { hexToHsv, hsvToHex, type Hsv } from '@pomodash/shared';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/shared/TextInput';

const HEX_PATTERN = /^#[0-9a-f]{6}$/i;
const SV_SIZE = 220;
const HUE_HEIGHT = 20;

interface Props {
  initialHex: string;
  onCancel: () => void;
  onConfirm: (hex: string) => void;
}

export function ColorPickerModal({ initialHex, onCancel, onConfirm }: Props) {
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(initialHex));
  const [color, setColor] = useState(initialHex);
  const isValidColor = HEX_PATTERN.test(color);

  function applyHsv(next: Partial<Hsv>) {
    const merged = { ...hsv, ...next };
    setHsv(merged);
    setColor(hsvToHex(merged.h, merged.s, merged.v));
  }

  function handleHexChange(text: string) {
    setColor(text);
    if (HEX_PATTERN.test(text)) setHsv(hexToHsv(text));
  }

  function handleSvDrag(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
    applyHsv({ s: x / rect.width, v: 1 - y / rect.height });
  }

  function handleHueDrag(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    applyHsv({ h: (x / rect.width) * 360 });
  }

  const hueColor = hsvToHex(hsv.h, 1, 1);

  return (
    <Modal
      title="색상 입력"
      onClose={onCancel}
      widthClassName="sm:w-[280px]"
      footer={
        <>
          <Button onClick={onCancel} variant="secondary" size="lg" className="px-4">
            취소
          </Button>
          <Button
            onClick={() => isValidColor && onConfirm(color)}
            disabled={!isValidColor}
            variant="default"
            size="lg"
            className="px-4 font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            확인
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3 items-center">
        <div
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            handleSvDrag(e);
          }}
          onPointerMove={(e) => e.buttons === 1 && handleSvDrag(e)}
          className="relative rounded-md overflow-hidden cursor-crosshair select-none"
          style={{ width: SV_SIZE, height: SV_SIZE, backgroundColor: hueColor }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, #fff, rgba(255,255,255,0))',
              pointerEvents: 'none',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0), #000)',
              pointerEvents: 'none',
            }}
          />
          <div
            className="absolute w-4 h-4 rounded-full border-2 border-white"
            style={{
              left: hsv.s * SV_SIZE - 8,
              top: (1 - hsv.v) * SV_SIZE - 8,
              pointerEvents: 'none',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.5)',
            }}
          />
        </div>

        <div
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            handleHueDrag(e);
          }}
          onPointerMove={(e) => e.buttons === 1 && handleHueDrag(e)}
          className="relative rounded-full overflow-hidden cursor-pointer select-none"
          style={{
            width: SV_SIZE,
            height: HUE_HEIGHT,
            background:
              'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
          }}
        >
          <div
            className="absolute rounded-sm border-2 border-white"
            style={{
              top: -2,
              left: (hsv.h / 360) * SV_SIZE - 3,
              width: 6,
              height: HUE_HEIGHT + 4,
              pointerEvents: 'none',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.5)',
            }}
          />
        </div>

        <TextInput
          value={color}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#000000"
          aria-label="색상 hex 코드"
          className="w-full font-mono"
        />
      </div>
    </Modal>
  );
}
