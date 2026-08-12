import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { LegalSection } from '@/components/shared/LegalSection';

export const metadata: Metadata = {
  title: `이용약관 — ${siteConfig.name}`,
};

const EFFECTIVE_DATE = '2026-08-10';

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-10 text-foreground">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">이용약관</h1>
        <p className="text-sm text-muted-foreground">시행일자: {EFFECTIVE_DATE}</p>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        이 약관은 {siteConfig.name}(이하 &apos;서비스&apos;) 이용과 관련하여 서비스와 이용자의 권리,
        의무 및 책임사항을 정합니다.
      </p>

      <LegalSection title="1. 목적">
        <p className="leading-relaxed">
          이 약관은 {siteConfig.name}이 제공하는 포모도로 타이머 및 학습 기록 서비스의 이용 조건과
          절차를 규정함을 목적으로 합니다.
        </p>
      </LegalSection>

      <LegalSection title="2. 이용계약의 성립">
        <p className="leading-relaxed">
          이용계약은 이용자가 이메일 또는 카카오 계정으로 회원가입을 완료하고, 서비스가 이를
          승낙함으로써 성립합니다.
        </p>
      </LegalSection>

      <LegalSection title="3. 회원의 의무">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>계정 정보를 본인이 직접 관리하며, 타인에게 공유하지 않습니다</li>
          <li>서비스를 부정한 목적으로 이용하거나 정상적인 운영을 방해하지 않습니다</li>
          <li>관계 법령 및 이 약관에서 정한 사항을 준수합니다</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. 서비스의 제공, 변경 및 중단">
        <p className="leading-relaxed">
          {siteConfig.name}은 1인이 개발·운영하는 서비스로, 기능 개선을 위해 사전 고지 없이 서비스
          내용을 변경할 수 있습니다. 운영상·기술상 필요에 따라 서비스 제공을 일시 중단하거나 종료할
          수 있으며, 서비스 종료 시에는 사전에 공지합니다.
        </p>
      </LegalSection>

      <LegalSection title="5. 면책조항">
        <p className="leading-relaxed">
          서비스는 무료로 제공되며, 천재지변이나 서비스 제공자의 고의·과실 없이 발생한 기록 유실,
          서비스 중단 등에 대해서는 책임을 지지 않습니다.
        </p>
      </LegalSection>

      <LegalSection title="6. 약관의 변경">
        <p className="leading-relaxed">
          이 약관이 변경되는 경우 변경 사항을 서비스 내 공지 또는 이 페이지를 통해 안내합니다.
        </p>
      </LegalSection>

      <LegalSection title="7. 문의처">
        <p className="leading-relaxed">이용약관 관련 문의: ytokogg@gmail.com</p>
      </LegalSection>
    </div>
  );
}
