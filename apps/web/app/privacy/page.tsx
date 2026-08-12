import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { LegalSection } from '@/components/shared/LegalSection';

export const metadata: Metadata = {
  title: `개인정보처리방침 — ${siteConfig.name}`,
};

const EFFECTIVE_DATE = '2026-08-07';

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-10 text-foreground">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">개인정보처리방침</h1>
        <p className="text-sm text-muted-foreground">시행일자: {EFFECTIVE_DATE}</p>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {siteConfig.name}(이하 &apos;서비스&apos;)는 이용자의 개인정보를 소중히 다루며, 관련 법령에
        따라 아래와 같이 개인정보를 수집·이용합니다.
      </p>

      <LegalSection title="1. 수집하는 개인정보 항목">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>이메일/비밀번호 회원가입 시: 이메일 주소, 비밀번호(암호화 저장)</li>
          <li>카카오 로그인 시: 카카오 계정 이메일 주소</li>
          <li>
            서비스 이용 기록: 작업(Task), 카테고리, 집중 세션(Session) 기록, 타이머·알림 등 설정값
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. 개인정보 수집 및 이용 목적">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>회원 식별 및 로그인 유지</li>
          <li>포모도로 타이머, 작업 기록, 대시보드 등 서비스 제공</li>
          <li>카카오 간편 로그인을 통한 회원가입·인증</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. 개인정보의 보유 및 이용 기간">
        <p className="leading-relaxed">
          회원 탈퇴 시 지체 없이 파기합니다. 관계 법령에 따라 보존이 필요한 경우 해당 법령에서 정한
          기간 동안 보관합니다.
        </p>
      </LegalSection>

      <LegalSection title="4. 개인정보 처리위탁">
        <p className="leading-relaxed">
          서비스는 안정적인 운영을 위해 아래 업체에 개인정보 처리를 위탁하고 있습니다.
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Supabase, Inc. — 데이터베이스 및 인증 인프라 운영</li>
          <li>Vercel Inc. — 웹 호스팅 및 서비스 이용 통계(Vercel Analytics)</li>
          <li>카카오 — 카카오 계정을 통한 간편 로그인</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. 이용자의 권리">
        <p className="leading-relaxed">
          이용자는 언제든지 설정 메뉴에서 회원 탈퇴를 통해 개인정보 삭제를 요청할 수 있으며, 그 외
          개인정보 열람·정정 요청은 아래 문의처로 연락해주세요.
        </p>
      </LegalSection>

      <LegalSection title="6. 문의처">
        <p className="leading-relaxed">개인정보 관련 문의: ytokogg@gmail.com</p>
      </LegalSection>
    </div>
  );
}
