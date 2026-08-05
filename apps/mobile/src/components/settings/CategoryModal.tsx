import { Modal } from '@/components/shared/Modal';
import { CategorySection } from '@/components/settings/CategorySection';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function CategoryModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} title="카테고리 관리" onClose={onClose} scrollable={false}>
      <CategorySection />
    </Modal>
  );
}
