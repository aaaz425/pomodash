import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { INPUT_LIMITS } from '@pomodash/shared';
import { TextInput } from '@/components/shared/TextInput';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  value: string;
  onChange: (value: string) => void;
  taskTitles: string[];
}

export function SessionTitleInput({ value, onChange, taskTitles }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const [focused, setFocused] = useState(false);
  const skipBlurRef = useRef(false);

  const query = value.trim().toLowerCase();
  const suggestions = query
    ? taskTitles
        .filter((t) => t.toLowerCase().includes(query) && t.toLowerCase() !== query)
        .slice(0, 5)
    : [];

  function handleBlur() {
    if (skipBlurRef.current) {
      skipBlurRef.current = false;
      return;
    }
    setFocused(false);
  }

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        maxLength={INPUT_LIMITS.TITLE_MAX_LENGTH}
        placeholder="세션 제목 (선택)"
      />
      {focused && suggestions.length > 0 && (
        <View style={[styles.dropdown, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {suggestions.map((title, index) => (
            <Pressable
              key={title}
              onPressIn={() => {
                skipBlurRef.current = true;
              }}
              onPress={() => {
                onChange(title);
                setFocused(false);
              }}
              style={[
                styles.item,
                index > 0 && { borderTopWidth: 1, borderTopColor: theme.border },
              ]}
            >
              <Text
                style={[
                  styles.itemText,
                  { color: theme.foreground, fontFamily: FONTS.sansRegular },
                ]}
              >
                {title}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  item: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 14,
  },
});
