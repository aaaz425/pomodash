import { Pressable, StyleSheet, Text, View } from 'react-native';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  onSkip: () => void;
  onSave: () => void;
}

export function SessionActionButtons({ onSkip, onSave }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={styles.actions}>
      <Pressable onPress={onSkip} style={[styles.actionButton, { backgroundColor: theme.muted }]}>
        <Text
          style={[styles.actionText, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}
        >
          건너뛰기
        </Text>
      </Pressable>
      <Pressable onPress={onSave} style={[styles.actionButton, { backgroundColor: theme.primary }]}>
        <Text
          style={[
            styles.actionText,
            { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
          ]}
        >
          기록 완료
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 14,
  },
});
