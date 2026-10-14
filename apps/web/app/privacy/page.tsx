import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { PrivacyContent } from '@/components/legal/PrivacyContent';

export const metadata: Metadata = {
  title: `개인정보처리방침 — ${siteConfig.name}`,
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-10 text-foreground">
      <h1 className="text-2xl font-bold">개인정보처리방침</h1>
      <PrivacyContent />
    </div>
  );
}
