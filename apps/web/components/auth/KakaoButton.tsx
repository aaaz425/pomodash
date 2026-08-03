import Image from 'next/image';
import { loginWithKakao } from '@/lib/supabase/actions';

interface Props {
  redirectTo?: string;
}

export function KakaoButton({ redirectTo }: Props) {
  return (
    <form action={loginWithKakao}>
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
      <button type="submit" className="w-full">
        <Image
          src="/kakao/kakao_login_large_wide.png"
          alt="카카오 로그인"
          width={600}
          height={90}
          className="w-full h-auto"
        />
      </button>
    </form>
  );
}
