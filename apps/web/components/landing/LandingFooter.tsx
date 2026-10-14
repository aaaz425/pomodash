'use client';

import { useState } from 'react';
import { LegalModal } from '@/components/legal/LegalModal';

export function LandingFooter() {
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between text-xs text-muted-foreground">
        <span>© 2026 PomoRoutine</span>
        <div className="flex gap-5">
          <a href="#features" className="hover:text-foreground transition-colors">
            기능
          </a>
          <a href="#how" className="hover:text-foreground transition-colors">
            사용법
          </a>
          <a href="#achievement" className="hover:text-foreground transition-colors">
            성장 확인
          </a>
          <button
            type="button"
            onClick={() => setLegalDoc('terms')}
            className="hover:text-foreground transition-colors"
          >
            이용약관
          </button>
          <button
            type="button"
            onClick={() => setLegalDoc('privacy')}
            className="hover:text-foreground transition-colors"
          >
            개인정보처리방침
          </button>
        </div>
      </div>

      {legalDoc && <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />}
    </footer>
  );
}
