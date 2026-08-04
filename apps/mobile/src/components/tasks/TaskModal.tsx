import { Modal } from '@/components/shared/Modal';
import { TaskList } from '@/components/tasks/TaskList';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function TaskModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} title="작업 관리" onClose={onClose}>
      <TaskList mode="manage" />
    </Modal>
  );
}
