import { Modal } from '@/components/shared/Modal';
import { Portal } from '@/components/shared/Portal';
import { CategorySection } from '@/components/settings/CategorySection';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function CategoryModalContent({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} title="카테고리 관리" onClose={onClose} scrollable={false}>
      <CategorySection />
    </Modal>
  );
}

export function CategoryModal(props: Props) {
  return (
    <Portal>
      <CategoryModalContent {...props} />
    </Portal>
  );
}
