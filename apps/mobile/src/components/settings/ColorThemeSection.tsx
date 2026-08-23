import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLOR_THEME_KEYS, COLOR_THEMES } from '@pomodash/shared';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useColorTheme, useThemeScheme } from '@/hooks/use-theme-scheme';

export function ColorThemeSection() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const { colorTheme, setColorTheme } = useColorTheme();

  return (
    <View style={styles.row}>
      {COLOR_THEME_KEYS.map((key) => {
        const themeDef = COLOR_THEMES[key];
        const swatchColor = themeDef.accent[scheme].color;
        const selected = colorTheme === key;
        return (
          <Pressable key={key} onPress={() => setColorTheme(key)} style={styles.item}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: swatchColor },
                selected && [styles.swatchSelected, { borderColor: theme.foreground }],
              ]}
            />
            <Text
              style={[
                styles.label,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              {themeDef.label}
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
    gap: 16,
  },
  item: {
    alignItems: 'center',
    gap: 6,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  swatchSelected: {
    borderWidth: 2,
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 11,
  },
});
