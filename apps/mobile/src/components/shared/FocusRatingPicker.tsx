import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FOCUS_RATING_OPTIONS, type FocusRating } from '@pomodash/shared';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  value: FocusRating | null;
  onChange: (value: FocusRating | null) => void;
}

export function FocusRatingPicker({ value, onChange }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={styles.row}>
      {FOCUS_RATING_OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(isSelected ? null : option.value)}
            style={[styles.button, { backgroundColor: isSelected ? theme.primary : theme.muted }]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isSelected
                    ? theme.primaryForeground
                    : withAlpha(theme.mutedForeground, 0.9),
                  fontFamily: FONTS.sansMedium,
                },
              ]}
            >
              {option.label}
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
    gap: 6,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
  },
});
