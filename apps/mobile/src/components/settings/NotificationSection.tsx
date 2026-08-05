import { StyleSheet, Switch, Text, View } from 'react-native';
import { Bell, Volume2 } from 'lucide-react-native';
import { SOUND_LIMITS, type SoundType } from '@pomodash/shared';
import { useSettingsStore } from '@/store/StoreProvider';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { StepperInput } from '@/components/shared/StepperInput';
import { SOUND_TYPE_LABELS } from '@/constants/soundTypes';
import { requestNotificationPermissionAsync } from '@/lib/notifications';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

const SOUND_TYPE_OPTIONS: { value: SoundType; label: string }[] = (
  Object.keys(SOUND_TYPE_LABELS) as SoundType[]
).map((value) => ({ value, label: SOUND_TYPE_LABELS[value] }));

export function NotificationSection() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const browserNotification = useSettingsStore((s) => s.browserNotification);
  const soundAlert = useSettingsStore((s) => s.soundAlert);
  const soundType = useSettingsStore((s) => s.soundType);
  const soundVolume = useSettingsStore((s) => s.soundVolume);
  const soundRepeatCount = useSettingsStore((s) => s.soundRepeatCount);
  const setBrowserNotification = useSettingsStore((s) => s.setBrowserNotification);
  const setSoundAlert = useSettingsStore((s) => s.setSoundAlert);
  const setSoundType = useSettingsStore((s) => s.setSoundType);
  const setSoundVolume = useSettingsStore((s) => s.setSoundVolume);
  const setSoundRepeatCount = useSettingsStore((s) => s.setSoundRepeatCount);

  async function handlePushNotificationChange(enabled: boolean) {
    if (enabled) {
      const granted = await requestNotificationPermissionAsync();
      if (!granted) return;
    }
    void setBrowserNotification(enabled);
  }

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <View style={styles.toggleLeft}>
          <Bell size={16} color={theme.mutedForeground} />
          <View>
            <Text
              style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansRegular }]}
            >
              푸시 알림
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              타이머 종료 시 알림 표시
            </Text>
          </View>
        </View>
        <Switch
          value={browserNotification}
          onValueChange={(v) => void handlePushNotificationChange(v)}
          trackColor={{ true: theme.primary }}
          style={styles.switch}
        />
      </View>

      <View style={styles.toggleRow}>
        <View style={styles.toggleLeft}>
          <Volume2 size={16} color={theme.mutedForeground} />
          <View>
            <Text
              style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansRegular }]}
            >
              소리 알림
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              타이머 종료 시 소리 재생
            </Text>
          </View>
        </View>
        <Switch
          value={soundAlert}
          onValueChange={(v) => void setSoundAlert(v)}
          trackColor={{ true: theme.primary }}
          style={styles.switch}
        />
      </View>

      <View
        style={[styles.fieldset, { backgroundColor: theme.muted }, !soundAlert && styles.disabled]}
        pointerEvents={soundAlert ? 'auto' : 'none'}
      >
        <View style={styles.fieldRow}>
          <Text
            style={[styles.fieldLabel, { color: theme.foreground, fontFamily: FONTS.sansRegular }]}
          >
            소리 종류
          </Text>
          <View style={styles.segmentedWrap}>
            <SegmentedControl
              options={SOUND_TYPE_OPTIONS}
              value={soundType}
              onChange={setSoundType}
            />
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text
            style={[styles.fieldLabel, { color: theme.foreground, fontFamily: FONTS.sansRegular }]}
          >
            음량
          </Text>
          <StepperInput
            value={soundVolume}
            onChange={(v) => void setSoundVolume(v)}
            min={SOUND_LIMITS.VOLUME_MIN}
            max={SOUND_LIMITS.VOLUME_MAX}
            step={5}
            unit="%"
            disabled={!soundAlert}
          />
        </View>

        <View style={styles.fieldRow}>
          <Text
            style={[styles.fieldLabel, { color: theme.foreground, fontFamily: FONTS.sansRegular }]}
          >
            반복 횟수
          </Text>
          <StepperInput
            value={soundRepeatCount}
            onChange={(v) => void setSoundRepeatCount(v)}
            min={SOUND_LIMITS.REPEAT_MIN}
            max={SOUND_LIMITS.REPEAT_MAX}
            unit="회"
            disabled={!soundAlert}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  switch: {
    transform: [{ scale: 0.8 }],
  },
  title: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  fieldset: {
    gap: 14,
    padding: 14,
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.4,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  fieldLabel: {
    fontSize: 13,
  },
  segmentedWrap: {
    flex: 1,
  },
});
