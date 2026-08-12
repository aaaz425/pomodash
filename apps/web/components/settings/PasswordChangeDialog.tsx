'use client';

import { Modal } from '@/components/shared/Modal';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

interface Props {
  title: string;
  onClose: () => void;
}

export function PasswordChangeDialog({ title, onClose }: Props) {
  return (
    <Modal title={title} onClose={onClose}>
      <ResetPasswordForm onSuccess={onClose} />
    </Modal>
  );
}
