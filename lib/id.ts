export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // crypto.randomUUID는 secure context(HTTPS/localhost)에서만 지원되므로,
  // LAN IP로 접속하는 개발 환경(http://) 등을 위한 폴백
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
