'use client';

import { Download, CheckCircle2, Smartphone } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function InstallSection() {
  const { canInstall, isInstalled, triggerInstall } = useInstallPrompt();

  if (isInstalled) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
        <span>이미 앱으로 설치되어 있습니다.</span>
      </div>
    );
  }

  if (canInstall) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          홈 화면에 추가하면 브라우저 없이 바로 실행할 수 있습니다.
        </p>
        <button
          onClick={triggerInstall}
          className="flex items-center gap-2 self-start px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />앱 설치
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 text-sm text-muted-foreground">
      <Smartphone className="w-4 h-4 shrink-0 mt-0.5" />
      <p>
        iOS Safari에서는 하단 공유 버튼 →{' '}
        <span className="text-foreground font-medium">홈 화면에 추가</span>를 눌러 설치할 수
        있습니다.
      </p>
    </div>
  );
}
