import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Scheme = 'light' | 'dark';
export type ThemeMode = 'light' | 'dark' | 'system';

// 웹 STORAGE_KEYS.theme와 이름만 맞춤(예외적으로 접두사 없음) — 스토리지 자체는 별개(AsyncStorage)
const THEME_STORAGE_KEY = 'theme';

// FocusMode는 웹처럼 시스템/사용자 설정과 무관하게 항상 dark를 강제해야 하므로,
// 컴포넌트가 useColorScheme()을 직접 부르는 대신 이 override를 거치게 한다.
const ThemeSchemeOverrideContext = createContext<Scheme | null>(null);

export function ThemeSchemeOverride({ scheme, children }: { scheme: Scheme; children: ReactNode }) {
  return (
    <ThemeSchemeOverrideContext.Provider value={scheme}>
      {children}
    </ThemeSchemeOverrideContext.Provider>
  );
}

interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setModeState(stored);
      }
    });
  }, []);

  function setMode(next: ThemeMode) {
    setModeState(next);
    void AsyncStorage.setItem(THEME_STORAGE_KEY, next);
  }

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>{children}</ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}

export function useThemeScheme(): Scheme {
  const override = useContext(ThemeSchemeOverrideContext);
  const system = useColorScheme();
  const modeCtx = useContext(ThemeModeContext);
  const mode = modeCtx?.mode ?? 'system';
  const resolved = mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
  return override ?? resolved;
}
