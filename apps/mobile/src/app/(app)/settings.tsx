import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ListChecks, ListTodo, LogOut, Sparkles, Timer } from 'lucide-react-native';
import { useSettingsStore, useTaskStore, useHydrated } from '@/store/StoreProvider';
import { useAuth } from '@/store/AuthProvider';
import { SettingsMenuRow } from '@/components/shared/SettingsMenuRow';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { PasswordChangeSection } from '@/components/settings/PasswordChangeSection';
import { DeleteAccountModal } from '@/components/settings/DeleteAccountModal';
import { SettingsSkeleton } from '@/components/settings/SettingsSkeleton';
import { TimerDefaultsModal } from '@/components/settings/TimerDefaultsModal';
import { TaskModal } from '@/components/tasks/TaskModal';
import { CategoryModal } from '@/components/settings/CategoryModal';
import { MotivationalModal } from '@/components/settings/MotivationalModal';
import { NotificationModal } from '@/components/settings/NotificationModal';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export default function SettingsScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const { user, logout } = useAuth();
  const hydrated = useHydrated();

  const taskCount = useTaskStore((s) => s.tasks.filter((t) => !t.completed).length);
  const categoryCount = useTaskStore((s) => s.categories.length);
  const defaultTimerSettings = useSettingsStore((s) => s.defaultTimerSettings);
  const motivationalCount = useSettingsStore((s) => s.motivationalMessages.length);
  const browserNotification = useSettingsStore((s) => s.browserNotification);
  const soundAlert = useSettingsStore((s) => s.soundAlert);

  const [showTimerDefaults, setShowTimerDefaults] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {!hydrated ? (
          <SettingsSkeleton />
        ) : (
          <>
            {user?.email && (
              <Text
                style={[
                  styles.email,
                  { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                ]}
              >
                {user.email}
              </Text>
            )}

            <View style={styles.profileWrap}>
              <ProfileSection />
            </View>

            <SettingsMenuRow
              Icon={Timer}
              label="타이머 기본값"
              value={`${defaultTimerSettings.focusMinutes}분 / ${defaultTimerSettings.totalCycles}회 / ${defaultTimerSettings.shortBreakMinutes}분`}
              onPress={() => setShowTimerDefaults(true)}
            />
            <SettingsMenuRow
              Icon={ListChecks}
              label="작업 관리"
              value={`${taskCount}개`}
              onPress={() => setShowTasks(true)}
            />
            <SettingsMenuRow
              Icon={ListTodo}
              label="카테고리 관리"
              value={`${categoryCount}개`}
              onPress={() => setShowCategories(true)}
            />
            <SettingsMenuRow
              Icon={Sparkles}
              label="동기부여 메시지"
              value={`${motivationalCount}개`}
              onPress={() => setShowMotivational(true)}
            />
            <SettingsMenuRow
              Icon={Bell}
              label="알림"
              value={browserNotification || soundAlert ? '켜짐' : '꺼짐'}
              onPress={() => setShowNotification(true)}
            />

            <Pressable onPress={logout} style={styles.logoutRow}>
              <LogOut size={16} color={theme.destructive} />
              <Text
                style={[
                  styles.logoutLabel,
                  { color: theme.destructive, fontFamily: FONTS.sansRegular },
                ]}
              >
                로그아웃
              </Text>
            </Pressable>

            <View style={styles.profileWrap}>
              <PasswordChangeSection />
            </View>

            <Pressable onPress={() => setShowDeleteAccount(true)} style={styles.deleteAccountRow}>
              <Text
                style={[
                  styles.deleteAccountLabel,
                  { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                ]}
              >
                회원탈퇴
              </Text>
            </Pressable>
          </>
        )}
      </SafeAreaView>

      <TimerDefaultsModal visible={showTimerDefaults} onClose={() => setShowTimerDefaults(false)} />
      <TaskModal visible={showTasks} onClose={() => setShowTasks(false)} />
      <CategoryModal visible={showCategories} onClose={() => setShowCategories(false)} />
      <MotivationalModal visible={showMotivational} onClose={() => setShowMotivational(false)} />
      <NotificationModal visible={showNotification} onClose={() => setShowNotification(false)} />
      <DeleteAccountModal visible={showDeleteAccount} onClose={() => setShowDeleteAccount(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    paddingTop: 8,
  },
  email: {
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  profileWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  logoutLabel: {
    fontSize: 14,
  },
  deleteAccountRow: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteAccountLabel: {
    fontSize: 12,
  },
});
