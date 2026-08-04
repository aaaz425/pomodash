import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { DEFAULT_TIMER_SETTINGS } from '@pomodash/shared';
import { useTaskStore, useTimerStore } from '@/store/StoreProvider';
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

  const currentTaskId = useTimerStore((s) => s.currentTaskId);
  const isRunning = useTimerStore((s) => s.startedAt !== null);
  const applyActiveTaskTimeUpdate = useTimerStore((s) => s.applyActiveTaskTimeUpdate);

  const isActiveTask = task !== null && task.id === currentTaskId;
  const timeFieldsDisabled = isActiveTask && isRunning;

  const [title, setTitle] = useState(task?.title ?? '');
  const [categoryId, setCategoryId] = useState(task?.categoryId ?? categories[0]?.id ?? '');
  const [targetFocusMinutes, setTargetFocusMinutes] = useState(
    task?.targetFocusMinutes ?? DEFAULT_TIMER_SETTINGS.focusMinutes,
  );
  const [targetCycles, setTargetCycles] = useState(
    task?.targetCycles ?? DEFAULT_TIMER_SETTINGS.totalCycles,
  );
  const [targetBreakMinutes, setTargetBreakMinutes] = useState(
    task?.targetBreakMinutes ?? DEFAULT_TIMER_SETTINGS.shortBreakMinutes,
  );
  // 새 작업은 기본값만 빠르게 채우도록 접어두고, 기존 작업 수정은 이미 의미 있는 값이라 펼쳐서 보여줌
  const [showTimeSettings, setShowTimeSettings] = useState(task !== null);

  function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) return;

    if (task === null) {
      const newId = addTask({
        title: trimmed,
        categoryId,
        targetFocusMinutes,
        targetCycles,
        targetBreakMinutes,
      });
      onCreated?.(newId);
    } else {
      updateTask(task.id, {
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
            disabled={!title.trim()}
            style={[
              styles.footerButton,
              { backgroundColor: theme.primary },
              !title.trim() && styles.disabled,
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

      <View style={styles.field}>
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
          <>
            <TimerSettingsGroup
              focusMinutes={targetFocusMinutes}
              onFocusMinutesChange={setTargetFocusMinutes}
              totalCycles={targetCycles}
              onTotalCyclesChange={setTargetCycles}
              shortBreakMinutes={targetBreakMinutes}
              onShortBreakMinutesChange={setTargetBreakMinutes}
              disabled={timeFieldsDisabled}
            />
            <Text
              style={[
                styles.summary,
                { color: withAlpha(theme.mutedForeground, 0.6), fontFamily: FONTS.sansRegular },
              ]}
            >
              총 집중 {targetFocusMinutes * targetCycles}분
              {targetBreakMinutes > 0 &&
                ` + 휴식 ${targetBreakMinutes * Math.max(0, targetCycles - 1)}분`}
            </Text>
            {isActiveTask && (
              <Text
                style={[
                  styles.warning,
                  { color: withAlpha(AMBER, 0.9), fontFamily: FONTS.sansRegular },
                ]}
              >
                {isRunning
                  ? '타이머를 일시정지하면 시간을 수정할 수 있어요'
                  : '이 변경은 지금 진행 중인 세션에도 바로 적용돼요'}
              </Text>
            )}
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
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
  summary: {
    fontSize: 12,
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
