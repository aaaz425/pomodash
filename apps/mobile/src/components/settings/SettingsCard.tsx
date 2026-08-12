import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  title: string;
  children: ReactNode;
}

export function SettingsCard({ title, children }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}>
          {title}
        </Text>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 13,
  },
  body: {
    padding: 16,
    gap: 12,
  },
});
