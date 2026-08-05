import { StyleSheet, Text, View } from 'react-native';
import { formatDuration } from '@pomodash/shared';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Session } from '@/types/sessions';

interface Props {
  session: Session;
}

export function SessionStatsRow({ session }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={styles.container}>
      <View style={[styles.col, { borderRightColor: theme.border }]}>
        <Text
          style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansMedium }]}
        >
          집중 시간
        </Text>
        <Text style={[styles.value, { color: theme.foreground, fontFamily: FONTS.sansBold }]}>
          {formatDuration(session.focusSeconds)}
        </Text>
      </View>
      <View style={styles.col}>
        <Text
          style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansMedium }]}
        >
          {session.mode === 'free' ? '방식' : '사이클'}
        </Text>
        <Text style={[styles.value, { color: theme.foreground, fontFamily: FONTS.sansBold }]}>
          {session.mode === 'free'
            ? '자유 집중'
            : `${session.completedCycles} / ${session.totalCycles}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 12,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    fontSize: 16,
  },
});
