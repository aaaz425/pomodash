'use client';

import { createStore } from 'zustand';
import {
  type TimerSettings,
  type AppSettings,
  AppSettingsSchema,
  DEFAULT_TIMER_SETTINGS,
  STORAGE_KEYS,
} from '@/types';
import { MOTIVATIONAL_MESSAGES } from '@/lib/motivationalMessages';

const DEFAULT_SETTINGS: AppSettings = {
  browserNotification: false,
  soundAlert: true,
  motivationalMessages: MOTIVATIONAL_MESSAGES,
  defaultTimerSettings: DEFAULT_TIMER_SETTINGS,
};

interface SettingsStore {
  browserNotification: boolean;
  soundAlert: boolean;
  motivationalMessages: string[];
  defaultTimerSettings: TimerSettings;

  setTimerDefaults: (settings: TimerSettings) => void;
  setBrowserNotification: (enabled: boolean) => void;
  setSoundAlert: (enabled: boolean) => void;
  addMessage: (message: string) => void;
  deleteMessage: (index: number) => void;
  hydrate: () => void;
}

function toAppSettings(s: SettingsStore): AppSettings {
  return {
    browserNotification: s.browserNotification,
    soundAlert: s.soundAlert,
    motivationalMessages: s.motivationalMessages,
    defaultTimerSettings: s.defaultTimerSettings,
  };
}

function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return DEFAULT_SETTINGS;
    return AppSettingsSchema.parse(JSON.parse(raw));
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(data: AppSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(data));
}

export const createSettingsStore = () =>
  createStore<SettingsStore>()((set, get) => ({
    ...DEFAULT_SETTINGS,

    setTimerDefaults: (defaultTimerSettings) => {
      set({ defaultTimerSettings });
      saveSettings(toAppSettings(get()));
    },

    setBrowserNotification: (browserNotification) => {
      set({ browserNotification });
      saveSettings(toAppSettings(get()));
    },

    setSoundAlert: (soundAlert) => {
      set({ soundAlert });
      saveSettings(toAppSettings(get()));
    },

    addMessage: (message) => {
      const motivationalMessages = [...get().motivationalMessages, message];
      set({ motivationalMessages });
      saveSettings(toAppSettings(get()));
    },

    deleteMessage: (index) => {
      const curr = get().motivationalMessages;
      if (curr.length <= 1) return;
      const motivationalMessages = curr.filter((_, i) => i !== index);
      set({ motivationalMessages });
      saveSettings(toAppSettings(get()));
    },

    hydrate: () => set(loadSettings()),
  }));

export type SettingsStoreApi = ReturnType<typeof createSettingsStore>;
export type { SettingsStore };
