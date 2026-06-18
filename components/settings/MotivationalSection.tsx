'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useSettingsStore } from '@/store/StoreProvider';

export function MotivationalSection() {
  const messages = useSettingsStore((s) => s.motivationalMessages);
  const addMessage = useSettingsStore((s) => s.addMessage);
  const deleteMessage = useSettingsStore((s) => s.deleteMessage);

  const [input, setInput] = useState('');

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage(trimmed);
    setInput('');
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2.5 px-1 group border-b border-border/50 last:border-0"
          >
            <span className="text-sm text-foreground flex-1 pr-2">{msg}</span>
            <button
              onClick={() => deleteMessage(i)}
              disabled={messages.length <= 1}
              aria-label="메시지 삭제"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-20 transition-all shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="새 동기부여 메시지 입력"
          className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      <p className="text-xs text-muted-foreground/70">최소 1개는 유지해야 합니다.</p>
    </div>
  );
}
