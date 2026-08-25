import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { useSettingsStore, useTaskStore, useTimerStore } from '@/store/StoreProvider';
import { Modal } from '@/components/shared/Modal';
import { TextInput } from '@/components/shared/TextInput';
import { CategoryPills } from '@/components/shared/CategoryPills';
import { TimerSettingsGroup } from '@/components/shared/TimerSettingsGroup';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import type { Task } from '@/types/tasks';

const AMBER = '#F59E0B';

interface Props {
  task: Task | null; // null = 새 작업
  onClose: () => void;
  onCreated?: (id: string) => void;
}

export function TaskFormModal({ task, onClose, onCreated }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const categories = useTaskStore((s) => s.categories);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const defaultTimerSettings = useSettingsStore((s) => s.defaultTimerSettings);

  const currentTaskId = useTimerStore((s) => s.currentTaskId);
  const isRunning = useTimerStore((s) => s.startedAt !== null);
  const applyActiveTaskTimeUpdate = useTimerStore((s) => s.applyActiveTaskTimeUpdate);

  const isActiveTask = task !== null && task.id === currentTaskId;
  const timeFieldsDisabled = isActiveTask && isRunning;

  const [title, setTitle] = useState(task?.title ?? '');
  const [categoryId, setCategoryId] = useState(task?.categoryId ?? categories[0]?.id ?? '');
  const [targetFocusMinutes, setTargetFocusMinutes] = useState(
    task?.targetFocusMinutes ?? defaultTimerSettings.focusMinutes,
  );
  const [targetCycles, setTargetCycles] = useState(
    task?.targetCycles ?? defaultTimerSettings.totalCycles,
  );
  const [targetBreakMinutes, setTargetBreakMinutes] = useState(
    task?.targetBreakMinutes ?? defaultTimerSettings.shortBreakMinutes,
  );
  // 새 작업은 기본값만 빠르게 채우도록 접어두고, 기존 작업 수정은 이미 의미 있는 값이라 펼쳐서 보여줌
  const [showTimeSettings, setShowTimeSettings] = useState(task !== null);
  // 저장이 비동기(Supabase 왕복)라 이게 없으면 응답 오기 전에 다시 눌러 중복 생성될 수 있음
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed || isSubmitting) return;
    setIsSubmitting(true);

    if (task === null) {
      const newId = await addTask({
        title: trimmed,
        categoryId,
        targetFocusMinutes,
        targetCycles,
        targetBreakMinutes,
      });
      if (newId) onCreated?.(newId);
    } else {
      await updateTask(task.id, {
        title: trimmed,
        categoryId,
        targetFocusMinutes,
        targetCycles,
        targetBreakMinutes,
      });
      if (isActiveTask && !isRunning) {
        applyActiveTaskTimeUpdate({
          focusMinutes: targetFocusMinutes,
          shortBreakMinutes: targetBreakMinutes,
          totalCycles: targetCycles,
        });
      }
    }
    onClose();
  }

  return (
    <Modal
      visible
      title={task ? '작업 수정' : '새 작업 추가'}
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
            onPress={handleSubmit}
            disabled={!title.trim() || isSubmitting}
            style={[
              styles.footerButton,
              { backgroundColor: theme.primary },
              (!title.trim() || isSubmitting) && styles.disabled,
            ]}
          >
            <Text
              style={[
                styles.footerButtonText,
                { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              {task ? '저장' : '추가'}
            </Text>
          </Pressable>
        </>
      }
    >
      <View style={styles.field}>
        <Text
          style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansMedium }]}
        >
          작업 제목
        </Text>
        <TextInput
          autoFocus
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleSubmit}
          placeholder="예) 알고리즘 문제 풀기"
        />
      </View>

      <View style={styles.field}>
        <Text
          style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansMedium }]}
        >
          카테고리
        </Text>
        <CategoryPills categories={categories} selectedId={categoryId} onChange={setCategoryId} />
      </View>

      <View style={[styles.field, { gap: 0 }]}>
        <Pressable onPress={() => setShowTimeSettings((v) => !v)} style={styles.collapseToggle}>
          {showTimeSettings ? (
            <ChevronDown size={14} color={theme.mutedForeground} />
          ) : (
            <ChevronRight size={14} color={theme.mutedForeground} />
          )}
          <Text
            style={[styles.label, { color: theme.mutedForeground, fontFamily: FONTS.sansMedium }]}
          >
            목표 시간
          </Text>
        </Pressable>

        {showTimeSettings && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={styles.timeSettings}
          >
            <TimerSettingsGroup
              focusMinutes={targetFocusMinutes}
              onFocusMinutesChange={setTargetFocusMinutes}
              totalCycles={targetCycles}
              onTotalCyclesChange={setTargetCycles}
              shortBreakMinutes={targetBreakMinutes}
              onShortBreakMinutesChange={setTargetBreakMinutes}
              disabled={timeFieldsDisabled}
            />
            {isActiveTask && (
              <Text
                style={[
                  styles.warning,
                  { color: withAlpha(AMBER, 0.9), fontFamily: FONTS.sansRegular },
                ]}
              >
                {isRunning
                  ? '타이머를 일시정지하면 시간을 수정할 수 있어요'
                  : '이 변경은 지금 진행 중인 타이머에도 바로 적용돼요'}
              </Text>
            )}
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  timeSettings: {
    gap: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 12,
  },
  collapseToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  warning: {
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
  disabled: {
    opacity: 0.4,
  },
});
