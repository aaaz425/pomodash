// 가입 직후 인증 헤더가 준비되기 전에 조회 요청이 나가 1회성으로 실패하는 타이밍 이슈 방어
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
