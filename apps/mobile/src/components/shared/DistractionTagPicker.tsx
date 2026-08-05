import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DISTRACTION_TAGS } from '@pomodash/shared';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
}

export function DistractionTagPicker({ value, onChange }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  function toggle(tagId: string) {
    onChange(value.includes(tagId) ? value.filter((id) => id !== tagId) : [...value, tagId]);
  }

  return (
    <View style={styles.row}>
      {DISTRACTION_TAGS.map((tag) => {
        const isSelected = value.includes(tag.id);
        return (
          <Pressable
            key={tag.id}
            onPress={() => toggle(tag.id)}
            style={[
              styles.chip,
              isSelected
                ? { backgroundColor: withAlpha(theme.primary, 0.1), borderColor: theme.primary }
                : { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isSelected ? theme.primary : theme.mutedForeground,
                  fontFamily: FONTS.sansMedium,
                },
              ]}
            >
              {tag.label}
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
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
  },
});
