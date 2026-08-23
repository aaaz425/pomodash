'use client';

import { Modal } from '@/components/shared/Modal';
import { ThemeSection } from '@/components/settings/ThemeSection';
import { ColorThemeSection } from '@/components/settings/ColorThemeSection';

interface Props {
  onClose: () => void;
}

export function ThemeModal({ onClose }: Props) {
  return (
    <Modal title="테마" onClose={onClose}>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">배경</span>
        <ThemeSection />
      </div>
      <div className="h-px bg-border" />
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">테마</span>
        <ColorThemeSection />
      </div>
    </Modal>
  );
}
