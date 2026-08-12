// 가입 직후 세션이 갓 만들어진 순간, 인증 헤더가 완전히 준비되기 전에 조회 요청이 나가서
// 1회성으로 실패하는 타이밍 이슈를 방어한다. 실패 시(null 반환) 짧게 쉬었다가 재시도.
export async function withRetry<T>(
  fn: () => Promise<T | null>,
  retries = 2,
  delayMs = 700,
): Promise<T | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const result = await fn();
    if (result !== null) return result;
    if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return null;
}
