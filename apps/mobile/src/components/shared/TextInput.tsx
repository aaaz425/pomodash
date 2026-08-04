import { TextInput as RNTextInput, StyleSheet, type TextInputProps } from 'react-native';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export function TextInput({ style, ...props }: TextInputProps) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <RNTextInput
      placeholderTextColor={withAlpha(theme.mutedForeground, 0.6)}
      style={[
        styles.input,
        { backgroundColor: theme.muted, color: theme.foreground, fontFamily: FONTS.sansRegular },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
});
