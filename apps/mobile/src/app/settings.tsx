import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListChecks, ListTodo } from 'lucide-react-native';
import { useTaskStore } from '@/store/StoreProvider';
import { SettingsMenuRow } from '@/components/shared/SettingsMenuRow';
import { TaskModal } from '@/components/tasks/TaskModal';
import { CategoryModal } from '@/components/settings/CategoryModal';
import { THEME } from '@/constants/timerColors';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export default function SettingsScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const taskCount = useTaskStore((s) => s.tasks.filter((t) => !t.completed).length);
  const categoryCount = useTaskStore((s) => s.categories.length);

  const [showTasks, setShowTasks] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
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
});
