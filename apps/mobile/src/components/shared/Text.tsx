import { Text as RNText, type TextProps } from 'react-native';
import { MAX_FONT_SIZE_MULTIPLIER } from '@/constants/fonts';

export function Text({ maxFontSizeMultiplier = MAX_FONT_SIZE_MULTIPLIER, ...props }: TextProps) {
  return <RNText maxFontSizeMultiplier={maxFontSizeMultiplier} {...props} />;
}
