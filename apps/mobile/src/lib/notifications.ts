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
}

// 앱이 백그라운드에 있어도 phase 종료를 알리기 위해 시작 시점에 미리 예약해둔다.
export async function scheduleTimerCompleteNotification({
  title,
  body,
  secondsFromNow,
}: ScheduleTimerCompleteNotificationParams): Promise<string | null> {
  const granted = await requestNotificationPermissionAsync();
  if (!granted) return null;
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
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
