import { Modal } from '@/components/shared/Modal';
import { Portal } from '@/components/shared/Portal';
import { TaskList } from '@/components/tasks/TaskList';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function TaskModalContent({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} title="작업 관리" onClose={onClose} scrollable={false}>
      <TaskList mode="manage" />
    </Modal>
  );
}

export function TaskModal(props: Props) {
  return (
    <Portal>
      <TaskModalContent {...props} />
    </Portal>
  );
}
