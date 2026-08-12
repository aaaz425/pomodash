import { StyleSheet, View } from 'react-native';
import { ListChecks, ListTodo, Sparkles, Timer } from 'lucide-react-native';
import { useSettingsStore, useTaskStore } from '@/store/StoreProvider';
import { SettingsMenuRow } from '@/components/shared/SettingsMenuRow';
import { SettingsCard } from '@/components/settings/SettingsCard';
import { SettingsRowGroup } from '@/components/settings/SettingsRowGroup';
import { ThemeSection } from '@/components/settings/ThemeSection';

interface Props {
  onOpenTimer: () => void;
  onOpenTask: () => void;
  onOpenCategory: () => void;
  onOpenMotivational: () => void;
}

export function PresetsCategoryCard({
  onOpenTimer,
  onOpenTask,
  onOpenCategory,
  onOpenMotivational,
}: Props) {
  const taskCount = useTaskStore((s) => s.tasks.filter((t) => !t.completed).length);
  const categoryCount = useTaskStore((s) => s.categories.length);
  const defaultTimerSettings = useSettingsStore((s) => s.defaultTimerSettings);
  const motivationalCount = useSettingsStore((s) => s.motivationalMessages.length);

  return (
    <View style={styles.container}>
      <SettingsCard title="테마">
        <ThemeSection />
      </SettingsCard>
      <SettingsRowGroup>
        <SettingsMenuRow
          Icon={Timer}
          label="타이머 기본값"
          value={`${defaultTimerSettings.focusMinutes}분 / ${defaultTimerSettings.totalCycles}회 / ${defaultTimerSettings.shortBreakMinutes}분`}
          onPress={onOpenTimer}
        />
        <SettingsMenuRow
          Icon={ListChecks}
          label="작업 관리"
          value={`${taskCount}개`}
          onPress={onOpenTask}
        />
        <SettingsMenuRow
          Icon={ListTodo}
          label="카테고리 관리"
          value={`${categoryCount}개`}
          onPress={onOpenCategory}
        />
        <SettingsMenuRow
          Icon={Sparkles}
          label="동기부여 메시지"
          value={`${motivationalCount}개`}
          onPress={onOpenMotivational}
        />
      </SettingsRowGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
