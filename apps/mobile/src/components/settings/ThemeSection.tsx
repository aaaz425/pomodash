import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeMode, useThemeScheme, type ThemeMode } from '@/hooks/use-theme-scheme';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';

const OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: 'light', label: '라이트' },
  { mode: 'dark', label: '다크' },
  { mode: 'system', label: '시스템' },
];

// 웹 ThemeSection의 미니어처 프리뷰까지는 아직 안 만들고 라벨 버튼 3개로 단순화 —
// UI 다듬는 건 다음 패스에서.
export function ThemeSection() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const { mode, setMode } = useThemeMode();

  return (
    <View style={styles.row}>
      {OPTIONS.map(({ mode: optMode, label }) => {
        const isSelected = mode === optMode;
        return (
          <Pressable
            key={optMode}
            onPress={() => setMode(optMode)}
            style={[
              styles.option,
              { borderColor: isSelected ? theme.primary : theme.border },
              isSelected && { backgroundColor: theme.card },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isSelected ? theme.foreground : theme.mutedForeground,
                  fontFamily: isSelected ? FONTS.sansSemiBold : FONTS.sansRegular,
                },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
  },
});
