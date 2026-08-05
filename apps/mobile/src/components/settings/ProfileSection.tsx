import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { INPUT_LIMITS } from '@pomodash/shared';
import { useSettingsStore } from '@/store/StoreProvider';
import { TextInput } from '@/components/shared/TextInput';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export function ProfileSection() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const nickname = useSettingsStore((s) => s.nickname);
  const setNickname = useSettingsStore((s) => s.setNickname);

  const [draft, setDraft] = useState(nickname);
  const [saved, setSaved] = useState(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(savedTimerRef.current), []);

  function handleSave() {
    void setNickname(draft.trim());
    setSaved(true);
    clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setSaved(false), 1500);
  }

  const disabled = draft.trim() === nickname;

  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        value={draft}
        onChangeText={(t) => {
          setDraft(t);
          setSaved(false);
        }}
        onSubmitEditing={handleSave}
        placeholder="닉네임 입력 (선택)"
        maxLength={INPUT_LIMITS.NICKNAME_MAX_LENGTH}
      />
      <Pressable
        onPress={handleSave}
        disabled={disabled}
        style={[styles.button, { backgroundColor: theme.primary }, disabled && styles.disabled]}
      >
        <Text
          style={[
            styles.buttonText,
            { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
          ]}
        >
          {saved ? '저장됨' : '저장'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 13,
  },
});
