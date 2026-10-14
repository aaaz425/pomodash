'use client';

import { useState } from 'react';
import { LegalModal } from '@/components/legal/LegalModal';

export function AuthConsentNotice() {
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | null>(null);

  return (
    <p className="text-xs text-muted-foreground text-center leading-relaxed">
      가입 시{' '}
      <button
        type="button"
        onClick={() => setLegalDoc('terms')}
        className="underline underline-offset-2 hover:text-foreground"
      >
        이용약관
      </button>{' '}
      및{' '}
      <button
        type="button"
        onClick={() => setLegalDoc('privacy')}
        className="underline underline-offset-2 hover:text-foreground"
      >
        개인정보처리방침
      </button>
      에 동의하는 것으로 간주됩니다
      {legalDoc && <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />}
    </p>
  );
}
