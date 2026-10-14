'use client';

import { Modal } from '@/components/shared/Modal';
import { PrivacyContent } from '@/components/legal/PrivacyContent';
import { TermsContent } from '@/components/legal/TermsContent';

interface Props {
  doc: 'privacy' | 'terms';
  onClose: () => void;
}

export function LegalModal({ doc, onClose }: Props) {
  return (
    <Modal
      title={doc === 'privacy' ? '개인정보처리방침' : '이용약관'}
      onClose={onClose}
      widthClassName="sm:w-[480px]"
    >
      {doc === 'privacy' ? <PrivacyContent /> : <TermsContent />}
    </Modal>
  );
}
