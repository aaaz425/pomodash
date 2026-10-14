'use client';

import { useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Badge } from '@/components/shared/Badge';
import { LegalModal } from '@/components/legal/LegalModal';

export function AboutSection() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? '—';
  const [legalDoc, setLegalDoc] = useState<'privacy' | 'terms' | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{siteConfig.name}</span>
        <Badge className="font-normal text-muted-foreground bg-muted">v{version}</Badge>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{siteConfig.description}</p>

      <Link
        href="/landing"
        className="text-sm text-primary hover:underline underline-offset-2 w-fit"
      >
        앱 소개 보기 →
      </Link>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setLegalDoc('terms')}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          이용약관
        </button>
        <button
          type="button"
          onClick={() => setLegalDoc('privacy')}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          개인정보처리방침
        </button>
      </div>

      {legalDoc && <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />}
    </div>
  );
}
