'use client';

import { useRef, useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/ui/button';
import { SHARE_CARD_SIZE } from '@/lib/constants/shareCard';
import {
  canShareFiles,
  downloadCanvasAsPng,
  drawShareCard,
  shareCanvasAsPng,
} from '@/lib/shareCardCanvas';
import type { ShareCardData } from '@/types';

interface Props {
  data: ShareCardData;
  onClose: () => void;
}

export function ShareCardModal({ data, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isBusy, setIsBusy] = useState(false);
  const shareSupported = canShareFiles();
  const filename = `pomodash-share-${data.generatedAtLabel.replaceAll('.', '')}.png`;

  // Modal(Dialog)의 Popup 콘텐츠는 마운트 시점보다 한 틱 늦게 DOM에 붙을 수 있어
  // useEffect([data])로는 canvasRef.current가 아직 null인 상태에서 실행될 수 있다.
  // 콜백 ref로 실제 DOM 부착 시점에 맞춰 그린다 — React Compiler가 data 의존성 기준으로
  // 이 함수(와 JSX ref prop)를 자동 메모이즈해 data 변경 시에만 재호출되도록 보장한다.
  const setCanvasRef = (node: HTMLCanvasElement | null) => {
    canvasRef.current = node;
    const ctx = node?.getContext('2d');
    if (ctx) void drawShareCard(ctx, data);
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsBusy(true);
    try {
      await downloadCanvasAsPng(canvasRef.current, filename);
    } finally {
      setIsBusy(false);
    }
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    setIsBusy(true);
    try {
      await shareCanvasAsPng(canvasRef.current, filename, '오늘의 집중 기록 — Pomodash');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Modal
      title="공유 카드"
      onClose={onClose}
      widthClassName="sm:w-[480px]"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isBusy}>
            닫기
          </Button>
          {shareSupported && (
            <Button variant="outline" onClick={handleShare} disabled={isBusy}>
              공유
            </Button>
          )}
          <Button onClick={handleDownload} disabled={isBusy}>
            다운로드
          </Button>
        </>
      }
    >
      <canvas
        ref={setCanvasRef}
        width={SHARE_CARD_SIZE}
        height={SHARE_CARD_SIZE}
        role="img"
        aria-label="오늘의 집중 기록 공유 카드"
        className="w-full h-auto rounded-lg"
      />
    </Modal>
  );
}
