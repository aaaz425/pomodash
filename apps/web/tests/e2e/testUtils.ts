// 고정 이름을 재사용하면 이전 테스트(또는 재시도)의 잔여 데이터와 겹쳐 strict mode violation이 날 수 있음
export function uniqueName(base: string) {
  return `${base} ${crypto.randomUUID().slice(0, 8)}`;
}
