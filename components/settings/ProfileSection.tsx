'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import { useSettingsStore } from '@/store/StoreProvider';
import { Button } from '@/components/ui/button';

export function ProfileSection() {
  const nickname = useSettingsStore((s) => s.nickname);
  const setNickname = useSettingsStore((s) => s.setNickname);

  const [draft, setDraft] = useState(nickname);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setNickname(draft.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
        <User className="w-6 h-6 text-primary" />
      </div>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setSaved(false);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="닉네임 입력 (선택)"
          maxLength={20}
          className="flex-1 min-w-0 rounded-lg border border-border bg-muted px-3 py-2 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <Button
          onClick={handleSave}
          disabled={draft.trim() === nickname}
          variant="default"
          size="default"
          className="px-3 shrink-0 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saved ? '저장됨' : '저장'}
        </Button>
      </div>
    </div>
  );
}
