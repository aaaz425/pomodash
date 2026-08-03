// 오픈 리다이렉트 방지 — 같은 오리진의 경로만 허용.
// 두 번째 문자가 '/' 또는 '\'면 브라우저가 스킴 상대 경로(//evil.com, /\evil.com)로 해석할 수 있어 함께 차단.
export function isValidRedirectTarget(value: unknown): value is string {
  if (typeof value !== 'string' || value[0] !== '/') return false;
  return value[1] !== '/' && value[1] !== '\\';
}
