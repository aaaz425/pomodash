import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  disabled?: boolean;
}

export function StepperInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  disabled = false,
}: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const [raw, setRaw] = useState('');
  const [editing, setEditing] = useState(false);

  function commit() {
    const n = parseInt(raw, 10);
    if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
    setEditing(false);
  }

  return (
    <View style={styles.row}>
      <View style={[styles.group, { borderColor: theme.border, backgroundColor: theme.muted }]}>
        <Pressable
          disabled={disabled}
          onPress={() => onChange(Math.max(min, value - step))}
          style={[
            styles.button,
            { borderRightWidth: 1, borderRightColor: theme.border },
            disabled && styles.disabled,
          ]}
        >
          <Minus size={12} color={theme.mutedForeground} />
        </Pressable>
        <TextInput
          inputMode="numeric"
          editable={!disabled}
          value={editing ? raw : String(value)}
          onFocus={() => {
            setRaw(String(value));
            setEditing(true);
          }}
          onChangeText={(t) => setRaw(t.replace(/\D/g, ''))}
          onBlur={commit}
          onSubmitEditing={commit}
          style={[styles.input, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}
        />
        <Pressable
          disabled={disabled}
          onPress={() => onChange(Math.min(max, value + step))}
          style={[
            styles.button,
            { borderLeftWidth: 1, borderLeftColor: theme.border },
            disabled && styles.disabled,
          ]}
        >
          <Plus size={12} color={theme.mutedForeground} />
        </Pressable>
      </View>
      <Text style={[styles.unit, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}>
        {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  button: {
    width: 32,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  input: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 8,
  },
  unit: {
    fontSize: 14,
    width: 16,
  },
});
