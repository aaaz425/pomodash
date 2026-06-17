// 집중 모드에서만 노출되는 하드코딩 동기부여 메시지 목록.
// 사용자가 직접 추가/삭제하는 기능은 MVP 이후 설정(Phase 6)에서 다룬다.
export const MOTIVATIONAL_MESSAGES: string[] = [
  '지금 이 순간에 집중하세요',
  '작은 진전도 진전입니다',
  '완벽보다 완료가 먼저예요',
  '시작이 반입니다, 이미 절반 왔어요',
  '오늘의 집중이 내일의 여유를 만듭니다',
  '잠깐의 몰입이 큰 차이를 만들어요',
  '한 번에 하나씩, 천천히 확실하게',
  '지금 집중한 시간은 사라지지 않아요',
];

export function getRandomMotivationalMessage(): string {
  const index = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
  return MOTIVATIONAL_MESSAGES[index];
}
