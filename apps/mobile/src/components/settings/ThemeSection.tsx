import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/shared/Text';
import { useThemeMode, type ThemeMode, useThemeTokens } from '@/hooks/use-theme-scheme';
import { FONTS } from '@/constants/fonts';

const PREVIEW_COLORS = {
  light: { background: '#ffffff', sidebar: '#f3f4f6', line: '#e5e7eb' },
  dark: { background: '#0f172a', sidebar: '#1e293b', line: '#334155' },
} as const;

function ModePreview({ variant }: { variant: 'light' | 'dark' }) {
  const colors = PREVIEW_COLORS[variant];

  return (
    <View style={[styles.preview, { backgroundColor: colors.background }]}>
      <View style={[styles.sidebar, { backgroundColor: colors.sidebar }]}>
        <View style={[styles.sidebarLine, { backgroundColor: colors.line }]} />
        <View style={[styles.sidebarLine, { backgroundColor: colors.line }]} />
        <View
          style={[styles.sidebarLine, styles.sidebarLineShort, { backgroundColor: colors.line }]}
        />
      </View>
      <View style={styles.main}>
        <View style={[styles.ring, { borderColor: colors.line }]} />
        <View style={[styles.textLine, { width: 32, backgroundColor: colors.line }]} />
        <View style={[styles.textLine, { width: 20, backgroundColor: colors.line }]} />
      </View>
    </View>
  );
}

function SystemPreview() {
  const [width, setWidth] = useState(0);

  return (
    <View style={styles.fill} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <ModePreview variant="light" />
      <View style={[styles.darkHalf, { left: width / 2 }]}>
        <View style={[styles.darkHalfInner, { left: -width / 2, width }]}>
          <ModePreview variant="dark" />
        </View>
      </View>
    </View>
  );
}

const OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: 'light', label: '라이트' },
  { mode: 'dark', label: '다크' },
  { mode: 'system', label: '시스템' },
];

export function ThemeSection() {
  const theme = useThemeTokens();
  const { mode, setMode } = useThemeMode();

  return (
    <View style={styles.row}>
      {OPTIONS.map(({ mode: optMode, label }) => {
        const isSelected = mode === optMode;
        return (
          <Pressable
            key={optMode}
            onPress={() => setMode(optMode)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={styles.option}
          >
            <View
              style={[
                styles.frame,
                {
                  borderColor: isSelected ? theme.primary : theme.border,
                },
              ]}
            >
              {optMode === 'system' ? <SystemPreview /> : <ModePreview variant={optMode} />}
            </View>
            <Text
              style={[
                styles.label,
                {
                  color: isSelected ? theme.foreground : theme.mutedForeground,
                  fontFamily: isSelected ? FONTS.sansMedium : FONTS.sansRegular,
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
    gap: 12,
  },
  option: {
    flex: 1,
    gap: 8,
  },
  frame: {
    height: 64,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
  preview: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 16,
    gap: 2,
    padding: 2,
    paddingTop: 4,
  },
  sidebarLine: {
    height: 4,
    borderRadius: 2,
  },
  sidebarLineShort: {
    width: '75%',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ring: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  textLine: {
    height: 2,
    borderRadius: 1,
  },
  darkHalf: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  darkHalfInner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
});
