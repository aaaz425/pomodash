import { StyleSheet, Text, View } from 'react-native';
import { CATEGORY_HEX } from '@/constants/categoryColors';
import { withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import type { Category } from '@/types/tasks';

interface Props {
  category: Category;
}

export function CategoryBadge({ category }: Props) {
  const hex = CATEGORY_HEX[category.color];

  return (
    <View style={[styles.badge, { backgroundColor: withAlpha(hex, 0.15) }]}>
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
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
  },
});
