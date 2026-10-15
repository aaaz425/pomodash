import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { LegalContent } from '@/components/legal/LegalContent';

export const metadata: Metadata = {
  title: `이용약관 — ${siteConfig.name}`,
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-10 text-foreground">
      <h1 className="text-2xl font-bold">이용약관</h1>
      <LegalContent doc="terms" />
    </div>
  );
}
