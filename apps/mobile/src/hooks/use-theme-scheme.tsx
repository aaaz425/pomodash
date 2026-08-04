import { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type Scheme = 'light' | 'dark';

// FocusMode는 웹처럼 시스템 설정과 무관하게 항상 dark를 강제해야 하므로,
// 컴포넌트가 useColorScheme()을 직접 부르는 대신 이 override를 거치게 한다.
const ThemeSchemeOverrideContext = createContext<Scheme | null>(null);

export function ThemeSchemeOverride({ scheme, children }: { scheme: Scheme; children: ReactNode }) {
  return (
    <ThemeSchemeOverrideContext.Provider value={scheme}>
      {children}
    </ThemeSchemeOverrideContext.Provider>
  );
}

export function useThemeScheme(): Scheme {
  const override = useContext(ThemeSchemeOverrideContext);
  const system = useColorScheme();
  return override ?? (system === 'dark' ? 'dark' : 'light');
}
