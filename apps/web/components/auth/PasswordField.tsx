'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TextInput } from '@/components/shared/TextInput';

interface Props {
  id: string;
  name: string;
  label: string;
  autoComplete: 'current-password' | 'new-password';
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
}

export function PasswordField({
  id,
  name,
  label,
  autoComplete,
  required,
  minLength,
  disabled,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <TextInput
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          disabled={disabled}
          className="w-full pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer disabled:cursor-not-allowed"
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
