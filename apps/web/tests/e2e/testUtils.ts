// 낙관적 업데이트 + 백그라운드 Supabase 저장 패턴 때문에, 삭제/생성이 실제로 서버에
// 반영되는 시점을 테스트에서 보장할 수 없다. 고정 이름을 재사용하면 이전 테스트(또는
// 이전 실패한 재시도)의 잔여 데이터와 이름이 겹쳐 strict mode violation이 날 수 있으므로,
// 픽스처 이름은 항상 고유하게 생성한다.
export function uniqueName(base: string) {
  return `${base} ${crypto.randomUUID().slice(0, 8)}`;
}
