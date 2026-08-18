import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TimerMode, TimerSettings } from '@pomodash/shared';
import { useTimerStore, useTaskStore } from '@/store/StoreProvider';
import { Modal } from '@/components/shared/Modal';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { TimerSettingsGroup } from '@/components/shared/TimerSettingsGroup';
import { TaskList } from '@/components/tasks/TaskList';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const MODE_OPTIONS: { value: TimerMode; label: string }[] = [
  { value: 'pomodoro', label: '포모도로' },
  { value: 'free', label: '자유' },
];

export function StartSessionSheet({ visible, onClose }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const currentTaskId = useTimerStore((s) => s.currentTaskId);
  const storeSettings = useTimerStore((s) => s.settings);
  const storeMode = useTimerStore((s) => s.mode);
  const setCurrentTask = useTimerStore((s) => s.setCurrentTask);
  const updateSettings = useTimerStore((s) => s.updateSettings);
  const setMode = useTimerStore((s) => s.setMode);
  const start = useTimerStore((s) => s.start);

  const tasks = useTaskStore((s) => s.tasks);

  const [pendingTaskId, setPendingTaskId] = useState<string | null>(currentTaskId);
  const [pendingSettings, setPendingSettings] = useState<TimerSettings>({ ...storeSettings });
  const [pendingMode, setPendingMode] = useState<TimerMode>(storeMode);

  function handleTaskSelect(taskId: string) {
    setPendingTaskId(taskId);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setPendingSettings({
        focusMinutes: task.targetFocusMinutes,
        shortBreakMinutes: task.targetBreakMinutes,
        totalCycles: task.targetCycles,
      });
    }
  }

  function handleStart() {
    setCurrentTask(pendingTaskId);
    updateSettings(pendingSettings);
    setMode(pendingMode);
    start();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      title="타이머 시작"
      onClose={onClose}
      footer={
        <>
          <Pressable
            onPress={onClose}
            style={[styles.footerButton, { backgroundColor: theme.muted }]}
          >
            <Text
              style={[
                styles.footerButtonText,
                { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              취소
            </Text>
          </Pressable>
          <Pressable
            onPress={handleStart}
            style={[styles.footerButton, { backgroundColor: theme.primary }]}
          >
            <Text
              style={[
                styles.footerButtonText,
                { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              시작
            </Text>
          </Pressable>
        </>
      }
    >
      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}
        >
          어떤 작업을 할까요?
        </Text>
        <TaskList
          mode="select"
          selectedTaskId={pendingTaskId}
          onSelect={handleTaskSelect}
          maxHeight={180}
        />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.section}>
        <Text
          style={[styles.sectionTitle, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}
        >
          타이머 방식
        </Text>
        <SegmentedControl options={MODE_OPTIONS} value={pendingMode} onChange={setPendingMode} />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {pendingMode === 'pomodoro' ? (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
            ]}
          >
            이번 타이머 설정
          </Text>
          <TimerSettingsGroup
            focusMinutes={pendingSettings.focusMinutes}
            onFocusMinutesChange={(v) => setPendingSettings((s) => ({ ...s, focusMinutes: v }))}
            totalCycles={pendingSettings.totalCycles}
            onTotalCyclesChange={(v) => setPendingSettings((s) => ({ ...s, totalCycles: v }))}
            shortBreakMinutes={pendingSettings.shortBreakMinutes}
            onShortBreakMinutesChange={(v) =>
              setPendingSettings((s) => ({ ...s, shortBreakMinutes: v }))
            }
            cyclesLabel="사이클"
          />
          <Text
            style={[
              styles.hint,
              { color: withAlpha(theme.mutedForeground, 0.6), fontFamily: FONTS.sansRegular },
            ]}
          >
            이번에만 적용됩니다 · 작업 기본값은 변경되지 않아요
          </Text>
        </View>
      ) : (
        <View style={styles.sectionSmall}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
            ]}
          >
            자유 집중
          </Text>
          <Text
            style={[
              styles.hint,
              { color: withAlpha(theme.mutedForeground, 0.6), fontFamily: FONTS.sansRegular },
            ]}
          >
            고정된 사이클 없이 자유롭게 집중 시간을 기록해요. 준비되면 타이머 종료 버튼으로
            마무리하세요.
          </Text>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionSmall: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
  },
  divider: {
    height: 1,
  },
  hint: {
    fontSize: 11,
  },
  footerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  footerButtonText: {
    fontSize: 14,
  },
});
