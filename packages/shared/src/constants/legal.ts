export type LegalDocType = 'terms' | 'privacy';

export type LegalBlock = { type: 'paragraph'; text: string } | { type: 'list'; items: string[] };

export interface LegalSection {
  title: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
}

const SERVICE_NAME = 'PomoRoutine';

export const LEGAL_DOCUMENTS: Record<LegalDocType, LegalDocument> = {
  terms: {
    title: '이용약관',
    effectiveDate: '2026-08-10',
    intro: `이 약관은 ${SERVICE_NAME}(이하 '서비스') 이용과 관련하여 서비스와 이용자의 권리, 의무 및 책임사항을 정합니다.`,
    sections: [
      {
        title: '1. 목적',
        blocks: [
          {
            type: 'paragraph',
            text: `이 약관은 ${SERVICE_NAME}이 제공하는 포모도로 타이머 및 학습 기록 서비스의 이용 조건과 절차를 규정함을 목적으로 합니다.`,
          },
        ],
      },
      {
        title: '2. 이용계약의 성립',
        blocks: [
          {
            type: 'paragraph',
            text: '이용계약은 이용자가 이메일 또는 카카오 계정으로 회원가입을 완료하고, 서비스가 이를 승낙함으로써 성립합니다.',
          },
        ],
      },
      {
        title: '3. 회원의 의무',
        blocks: [
          {
            type: 'list',
            items: [
              '계정 정보를 본인이 직접 관리하며, 타인에게 공유하지 않습니다',
              '서비스를 부정한 목적으로 이용하거나 정상적인 운영을 방해하지 않습니다',
              '관계 법령 및 이 약관에서 정한 사항을 준수합니다',
            ],
          },
        ],
      },
      {
        title: '4. 서비스의 제공, 변경 및 중단',
        blocks: [
          {
            type: 'paragraph',
            text: `${SERVICE_NAME}은 1인이 개발·운영하는 서비스로, 기능 개선을 위해 사전 고지 없이 서비스 내용을 변경할 수 있습니다. 운영상·기술상 필요에 따라 서비스 제공을 일시 중단하거나 종료할 수 있으며, 서비스 종료 시에는 사전에 공지합니다.`,
          },
        ],
      },
      {
        title: '5. 면책조항',
        blocks: [
          {
            type: 'paragraph',
            text: '서비스는 무료로 제공되며, 천재지변이나 서비스 제공자의 고의·과실 없이 발생한 기록 유실, 서비스 중단 등에 대해서는 책임을 지지 않습니다.',
          },
        ],
      },
      {
        title: '6. 약관의 변경',
        blocks: [
          {
            type: 'paragraph',
            text: '이 약관이 변경되는 경우 변경 사항을 서비스 내 공지 또는 이 페이지를 통해 안내합니다.',
          },
        ],
      },
      {
        title: '7. 문의처',
        blocks: [{ type: 'paragraph', text: '이용약관 관련 문의: ytokogg@gmail.com' }],
      },
    ],
  },
  privacy: {
    title: '개인정보처리방침',
    effectiveDate: '2026-08-07',
    intro: `${SERVICE_NAME}(이하 '서비스')는 이용자의 개인정보를 소중히 다루며, 관련 법령에 따라 아래와 같이 개인정보를 수집·이용합니다.`,
    sections: [
      {
        title: '1. 수집하는 개인정보 항목',
        blocks: [
          {
            type: 'list',
            items: [
              '이메일/비밀번호 회원가입 시: 이메일 주소, 비밀번호(암호화 저장)',
              '카카오 로그인 시: 카카오 계정 이메일 주소',
              '서비스 이용 기록: 작업(Task), 카테고리, 집중 기록(Session), 타이머·알림 등 설정값',
            ],
          },
        ],
      },
      {
        title: '2. 개인정보 수집 및 이용 목적',
        blocks: [
          {
            type: 'list',
            items: [
              '회원 식별 및 로그인 유지',
              '포모도로 타이머, 작업 기록, 대시보드 등 서비스 제공',
              '카카오 간편 로그인을 통한 회원가입·인증',
            ],
          },
        ],
      },
      {
        title: '3. 개인정보의 보유 및 이용 기간',
        blocks: [
          {
            type: 'paragraph',
            text: '회원 탈퇴 시 지체 없이 파기합니다. 관계 법령에 따라 보존이 필요한 경우 해당 법령에서 정한 기간 동안 보관합니다.',
          },
        ],
      },
      {
        title: '4. 개인정보 처리위탁',
        blocks: [
          {
            type: 'paragraph',
            text: '서비스는 안정적인 운영을 위해 아래 업체에 개인정보 처리를 위탁하고 있습니다.',
          },
          {
            type: 'list',
            items: [
              'Supabase, Inc. — 데이터베이스 및 인증 인프라 운영',
              'Vercel Inc. — 웹 호스팅 및 서비스 이용 통계(Vercel Analytics)',
              '카카오 — 카카오 계정을 통한 간편 로그인',
            ],
          },
        ],
      },
      {
        title: '5. 이용자의 권리',
        blocks: [
          {
            type: 'paragraph',
            text: '이용자는 언제든지 설정 메뉴에서 회원 탈퇴를 통해 개인정보 삭제를 요청할 수 있으며, 그 외 개인정보 열람·정정 요청은 아래 문의처로 연락해주세요.',
          },
        ],
      },
      {
        title: '6. 문의처',
        blocks: [{ type: 'paragraph', text: '개인정보 관련 문의: ytokogg@gmail.com' }],
      },
    ],
  },
};
