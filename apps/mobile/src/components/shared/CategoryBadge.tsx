import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import type { Category } from '@/types/tasks';

interface Props {
  category: Category;
  style?: ViewStyle;
}

export function CategoryBadge({ category, style }: Props) {
  const hex = category.color;

  return (
    <View style={[styles.badge, { backgroundColor: withAlpha(hex, 0.15) }, style]}>
      <Text style={[styles.text, { color: hex, fontFamily: FONTS.sansSemiBold }]}>
        {category.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
  },
});
