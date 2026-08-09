import { createStore } from 'zustand';
import {
  DEFAULT_TIMER_SETTINGS,
  INPUT_LIMITS,
  MOTIVATIONAL_MESSAGES,
  SOUND_LIMITS,
} from '@pomodash/shared';
import { fetchSettings, saveSettings } from '@/lib/supabase/settings';
import { toast } from '@/lib/toast';
import type { AppSettings, SoundType } from '@/types/settings';

const DEFAULT_SETTINGS: AppSettings = {
  nickname: '',
  browserNotification: false,
  soundAlert: true,
  soundType: 'sine',
  soundVolume: 70,
  soundRepeatCount: 2,
  motivationalMessages: MOTIVATIONAL_MESSAGES,
  defaultTimerSettings: DEFAULT_TIMER_SETTINGS,
};

interface SettingsStore extends AppSettings {
  setNickname: (nickname: string) => Promise<void>;
  setTimerDefaults: (settings: AppSettings['defaultTimerSettings']) => Promise<void>;
  setBrowserNotification: (enabled: boolean) => Promise<void>;
  setSoundAlert: (enabled: boolean) => Promise<void>;
  setSoundType: (type: SoundType) => Promise<void>;
  setSoundVolume: (volume: number) => Promise<void>;
  setSoundRepeatCount: (count: number) => Promise<void>;
  addMessage: (message: string) => Promise<void>;
  updateMessage: (index: number, message: string) => Promise<void>;
  deleteMessage: (index: number) => Promise<void>;
  reorderMessages: (from: number, to: number) => Promise<void>;
  hydrate: () => Promise<void>;
}

function toAppSettings(s: SettingsStore): AppSettings {
  return {
    nickname: s.nickname,
    browserNotification: s.browserNotification,
    soundAlert: s.soundAlert,
    soundType: s.soundType,
    soundVolume: s.soundVolume,
    soundRepeatCount: s.soundRepeatCount,
    motivationalMessages: s.motivationalMessages,
    defaultTimerSettings: s.defaultTimerSettings,
  };
}

export const createSettingsStore = () =>
  createStore<SettingsStore>()((set, get) => {
    // 낙관적으로 먼저 반영하고, 저장 실패하면 이전 값으로 되돌린다
    async function persistChange(
      previous: Partial<SettingsStore>,
      patch: Partial<SettingsStore>,
    ): Promise<void> {
      set(patch);
      const { error } = await saveSettings(toAppSettings(get()));
      if (error) {
        set(previous);
        toast('설정 저장에 실패했어요. 다시 시도해주세요');
      }
    }

    return {
      ...DEFAULT_SETTINGS,

      setNickname: (nickname) => persistChange({ nickname: get().nickname }, { nickname }),

      setTimerDefaults: (defaultTimerSettings) =>
        persistChange(
          { defaultTimerSettings: get().defaultTimerSettings },
          { defaultTimerSettings },
        ),

      setBrowserNotification: (browserNotification) =>
        persistChange({ browserNotification: get().browserNotification }, { browserNotification }),

      setSoundAlert: (soundAlert) =>
        persistChange({ soundAlert: get().soundAlert }, { soundAlert }),

      setSoundType: (soundType) => persistChange({ soundType: get().soundType }, { soundType }),

      setSoundVolume: (soundVolume) =>
        persistChange(
          { soundVolume: get().soundVolume },
          {
            soundVolume: Math.max(
              SOUND_LIMITS.VOLUME_MIN,
              Math.min(SOUND_LIMITS.VOLUME_MAX, Math.round(soundVolume)),
            ),
          },
        ),

      setSoundRepeatCount: (soundRepeatCount) =>
        persistChange(
          { soundRepeatCount: get().soundRepeatCount },
          {
            soundRepeatCount: Math.max(
              SOUND_LIMITS.REPEAT_MIN,
              Math.min(SOUND_LIMITS.REPEAT_MAX, Math.round(soundRepeatCount)),
            ),
          },
        ),

      addMessage: async (message) => {
        const curr = get().motivationalMessages;
        if (curr.length >= INPUT_LIMITS.MESSAGE_COUNT_MAX) return;
        await persistChange(
          { motivationalMessages: curr },
          { motivationalMessages: [...curr, message] },
        );
      },

      updateMessage: async (index, message) => {
        const curr = get().motivationalMessages;
        const trimmed = message.trim();
        if (!trimmed || index < 0 || index >= curr.length) return;
        const motivationalMessages = curr.map((m, i) => (i === index ? trimmed : m));
        await persistChange({ motivationalMessages: curr }, { motivationalMessages });
      },

      deleteMessage: async (index) => {
        const curr = get().motivationalMessages;
        if (curr.length <= INPUT_LIMITS.MESSAGE_COUNT_MIN) return;
        const motivationalMessages = curr.filter((_, i) => i !== index);
        await persistChange({ motivationalMessages: curr }, { motivationalMessages });
      },

      reorderMessages: async (from, to) => {
        const messages = get().motivationalMessages;
        if (from < 0 || from >= messages.length || to < 0 || to >= messages.length) return;
        const next = [...messages];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        await persistChange({ motivationalMessages: messages }, { motivationalMessages: next });
      },

      hydrate: async () => {
        const settings = await fetchSettings();
        if (settings) set(settings);
        else toast('설정을 불러오지 못했어요. 다시 시도해주세요');
      },
    };
  });

export type SettingsStoreApi = ReturnType<typeof createSettingsStore>;
export type { SettingsStore };
