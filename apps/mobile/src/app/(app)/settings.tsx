import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListChecks, ListTodo, LogOut } from 'lucide-react-native';
import { useTaskStore } from '@/store/StoreProvider';
import { useAuth } from '@/store/AuthProvider';
import { SettingsMenuRow } from '@/components/shared/SettingsMenuRow';
import { TaskModal } from '@/components/tasks/TaskModal';
import { CategoryModal } from '@/components/settings/CategoryModal';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export default function SettingsScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const { user, logout } = useAuth();

  const taskCount = useTaskStore((s) => s.tasks.filter((t) => !t.completed).length);
  const categoryCount = useTaskStore((s) => s.categories.length);

  const [showTasks, setShowTasks] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {user?.email && (
          <Text
            style={[styles.email, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}
          >
            {user.email}
          </Text>
        )}

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
      </SafeAreaView>

      <TaskModal visible={showTasks} onClose={() => setShowTasks(false)} />
      <CategoryModal visible={showCategories} onClose={() => setShowCategories(false)} />
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
});
