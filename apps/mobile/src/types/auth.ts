import { z } from 'zod';
import { AUTH_LIMITS } from '@pomodash/shared';

export interface AuthActionResult {
  error?: string;
  pendingConfirmation?: true;
}

export const LoginCredentialsSchema = z.object({
  email: z.string().email({ message: '올바른 이메일 형식이 아니에요' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요' }),
});

export const SignupCredentialsSchema = z
  .object({
    email: z.string().email({ message: '올바른 이메일 형식이 아니에요' }),
    password: z
      .string()
      .min(AUTH_LIMITS.PASSWORD_MIN_LENGTH, { message: '비밀번호는 8자 이상이어야 해요' }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않아요',
    path: ['passwordConfirm'],
  });
