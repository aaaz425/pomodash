import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { TextInput } from '@/components/shared/TextInput';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props extends Omit<TextInputProps, 'secureTextEntry' | 'style'> {
  label: string;
}

export function PasswordField({ label, ...inputProps }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansMedium }]}>
        {label}
      </Text>
      <View style={styles.inputWrap}>
        <TextInput secureTextEntry={!visible} style={styles.input} {...inputProps} />
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8} style={styles.toggle}>
          {visible ? (
            <EyeOff size={16} color={theme.mutedForeground} />
          ) : (
            <Eye size={16} color={theme.mutedForeground} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
  },
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    paddingRight: 40,
  },
  toggle: {
    position: 'absolute',
    right: 12,
  },
});
