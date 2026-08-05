import { supabase } from '@/lib/supabase/client';
import { AppSettingsSchema, type AppSettings } from '@/types/settings';

interface SettingsRow {
  nickname: string;
  browser_notification: boolean;
  sound_alert: boolean;
  sound_type: string;
  sound_volume: number;
  sound_repeat_count: number;
  motivational_messages: string[];
  default_focus_minutes: number;
  default_short_break_minutes: number;
  default_total_cycles: number;
}

export function toAppSettings(row: SettingsRow): AppSettings | null {
  const parsed = AppSettingsSchema.safeParse({
    nickname: row.nickname,
    browserNotification: row.browser_notification,
    soundAlert: row.sound_alert,
    soundType: row.sound_type,
    soundVolume: row.sound_volume,
    soundRepeatCount: row.sound_repeat_count,
    motivationalMessages: row.motivational_messages,
    defaultTimerSettings: {
      focusMinutes: row.default_focus_minutes,
      shortBreakMinutes: row.default_short_break_minutes,
      totalCycles: row.default_total_cycles,
    },
  });
  return parsed.success ? parsed.data : null;
}

function toRow(settings: AppSettings) {
  return {
    nickname: settings.nickname,
    browser_notification: settings.browserNotification,
    sound_alert: settings.soundAlert,
    sound_type: settings.soundType,
    sound_volume: settings.soundVolume,
    sound_repeat_count: settings.soundRepeatCount,
    motivational_messages: settings.motivationalMessages,
    default_focus_minutes: settings.defaultTimerSettings.focusMinutes,
    default_short_break_minutes: settings.defaultTimerSettings.shortBreakMinutes,
    default_total_cycles: settings.defaultTimerSettings.totalCycles,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchSettings(): Promise<AppSettings | null> {
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error || !data) return null;
  return toAppSettings(data);
}

export async function saveSettings(settings: AppSettings): Promise<{ error: boolean }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: true };

  const { error } = await supabase.from('settings').update(toRow(settings)).eq('user_id', user.id);

  return { error: error !== null };
}
