import { Children } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { THEME } from '@/constants/timerColors';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  children: ReactNode;
}

// RN엔 웹 divide-y 같은 유틸이 없어 첫 행을 제외한 각 행에 borderTop을 직접 준다.
export function SettingsRowGroup({ children }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const rows = Children.toArray(children);

  return (
    <View style={[styles.group, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {rows.map((row, index) => (
        <View
          key={index}
          style={index > 0 ? { borderTopWidth: 1, borderTopColor: theme.border } : undefined}
        >
          {row}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
