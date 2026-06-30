'use client';

import { Modal } from '@/components/shared/Modal';
import { CategorySection } from '@/components/settings/category/CategorySection';

interface Props {
  onClose: () => void;
}

export function CategoryModal({ onClose }: Props) {
  return (
    <Modal title="카테고리 관리" onClose={onClose}>
      <CategorySection />
    </Modal>
  );
}
