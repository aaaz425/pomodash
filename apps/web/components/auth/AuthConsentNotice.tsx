import Link from 'next/link';

export function AuthConsentNotice() {
  return (
    <p className="text-xs text-muted-foreground text-center leading-relaxed">
      가입 시{' '}
      <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
        이용약관
      </Link>{' '}
      및{' '}
      <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
        개인정보처리방침
      </Link>
      에 동의하는 것으로 간주됩니다
    </p>
  );
}
