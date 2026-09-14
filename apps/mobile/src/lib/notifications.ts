import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissionAsync(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

interface ScheduleTimerCompleteNotificationParams {
  title: string;
  body: string;
  secondsFromNow: number;
  /** 설정의 소리 알림 on/off — 꺼져 있으면 백그라운드 알림도 무음으로 */
  sound: boolean;
}

// 백그라운드/종료 상태에선 JS가 안 돌아 lib/sound.ts 커스텀 합성음을 못 쓰므로 OS 기본 알림음으로 대체
export async function scheduleTimerCompleteNotification({
  title,
  body,
  secondsFromNow,
  sound,
}: ScheduleTimerCompleteNotificationParams): Promise<string | null> {
  const granted = await requestNotificationPermissionAsync();
  if (!granted) return null;
  return Notifications.scheduleNotificationAsync({
    content: { title, body, sound: sound ? 'default' : undefined },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, Math.round(secondsFromNow)),
      repeats: false,
    },
  });
}

export async function cancelScheduledNotification(identifier: string | null): Promise<void> {
  if (!identifier) return;
  await Notifications.cancelScheduledNotificationAsync(identifier);
}
