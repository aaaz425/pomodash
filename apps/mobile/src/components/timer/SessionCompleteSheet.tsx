import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalizeFocusPeriods } from '@pomodash/shared';
import type { FocusRating } from '@pomodash/shared';
import { useTimerStore, useTaskStore } from '@/store/StoreProvider';
import { useCurrentTask } from '@/hooks/useCurrentTask';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { Portal } from '@/components/shared/Portal';
import { FocusRatingPicker } from '@/components/shared/FocusRatingPicker';
import { DistractionTagPicker } from '@/components/shared/DistractionTagPicker';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { SessionCompleteHeader } from './SessionCompleteHeader';
import { SessionTaskSummary } from './SessionTaskSummary';
import { SessionMemoField } from './SessionMemoField';
import { SessionActionButtons } from './SessionActionButtons';

export function SessionCompleteSheet() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const sessionEnded = useTimerStore((s) => s.sessionEnded);
  const dismissSessionRecord = useTimerStore((s) => s.dismissSessionRecord);
  const cycleCount = useTimerStore((s) => s.cycleCount);
  const totalCycles = useTimerStore((s) => s.settings.totalCycles);
  const mode = useTimerStore((s) => s.mode);
  const currentTaskId = useTimerStore((s) => s.currentTaskId);
  const sessionStartedAt = useTimerStore((s) => s.sessionStartedAt);
  const sessionEndedAt = useTimerStore((s) => s.sessionEndedAt);
  const accFocusSeconds = useTimerStore((s) => s.accFocusSeconds);
  const rawFocusPeriods = useTimerStore((s) => s.rawFocusPeriods);

  const { task, category } = useCurrentTask();
  const addSession = useTaskStore((s) => s.addSession);

  const [note, setNote] = useState('');
  const [focusRating, setFocusRating] = useState<FocusRating | null>(null);
  const [distractionTags, setDistractionTags] = useState<string[]>([]);
  const [pendingAction, setPendingAction] = useState<'skip' | 'save' | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!sessionEnded || sessionEndedAt === null) return null;

  const isTaskSession = currentTaskId !== null;
  const now = sessionEndedAt;
  const totalElapsed = sessionStartedAt
    ? Math.floor((now - sessionStartedAt) / 1000)
    : accFocusSeconds;
  const pausedSeconds = Math.max(0, totalElapsed - accFocusSeconds);

  function resetForm() {
    setNote('');
    setFocusRating(null);
    setDistractionTags([]);
    setSelectedTaskId(null);
    setPendingAction(null);
  }

  async function handleSave() {
    if (isSaving) return;
    setIsSaving(true);
    const taskId = isTaskSession ? currentTaskId : selectedTaskId;
    const focusPeriods = normalizeFocusPeriods(
      rawFocusPeriods.map((p) => ({
        start: new Date(p.start).toISOString(),
        end: new Date(p.end).toISOString(),
      })),
    );
    await addSession({
      taskId,
      mode,
      startedAt: new Date(sessionStartedAt ?? now).toISOString(),
      endedAt: new Date(now).toISOString(),
      completedCycles: mode === 'free' ? 0 : cycleCount,
      totalCycles: mode === 'free' ? 0 : totalCycles,
      focusSeconds: accFocusSeconds,
      pausedSeconds,
      focusPeriods,
      note: note.trim() || null,
      focusRating,
      distractionTags,
    });
    dismissSessionRecord();
    resetForm();
    setIsSaving(false);
  }

  function handleSkip() {
    dismissSessionRecord();
    resetForm();
  }

  return (
    <Portal>
      <Modal
        visible={sessionEnded}
        animationType="fade"
        transparent
        onRequestClose={() => setPendingAction('skip')}
      >
        <View style={styles.root}>
          <Pressable style={styles.backdrop} onPress={() => setPendingAction('skip')} />
          <View style={styles.sheetWrap} pointerEvents="box-none">
            <View
              style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <SafeAreaView edges={['bottom']}>
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                >
                  <SessionCompleteHeader />

                  <View style={[styles.divider, { backgroundColor: theme.border }]} />

                  <SessionTaskSummary
                    isTaskSession={isTaskSession}
                    task={task}
                    category={category}
                    selectedTaskId={selectedTaskId}
                    onSelectTask={setSelectedTaskId}
                  />

                  <View style={styles.field}>
                    <Text
                      style={[
                        styles.sectionLabel,
                        { color: theme.mutedForeground, fontFamily: FONTS.sansSemiBold },
                      ]}
                    >
                      이번 세션 집중도는 어땠나요? (선택)
                    </Text>
                    <FocusRatingPicker value={focusRating} onChange={setFocusRating} />
                  </View>

                  <View style={styles.field}>
                    <Text
                      style={[
                        styles.sectionLabel,
                        { color: theme.mutedForeground, fontFamily: FONTS.sansSemiBold },
                      ]}
                    >
                      집중을 방해한 게 있었다면 선택해주세요 (선택)
                    </Text>
                    <DistractionTagPicker value={distractionTags} onChange={setDistractionTags} />
                  </View>

                  <SessionMemoField value={note} onChange={setNote} />

                  <SessionActionButtons
                    onSkip={() => setPendingAction('skip')}
                    onSave={() => setPendingAction('save')}
                  />
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>

          <ConfirmModal
            visible={pendingAction === 'skip'}
            title="기록을 건너뛸까요?"
            description="작성한 메모는 저장되지 않아요"
            confirmLabel="건너뛰기"
            destructive
            onConfirm={handleSkip}
            onCancel={() => setPendingAction(null)}
          />

          <ConfirmModal
            visible={pendingAction === 'save'}
            title="이 기록으로 저장할까요?"
            description={
              (mode === 'free'
                ? '자유 집중 세션'
                : `완료된 사이클 ${cycleCount} / ${totalCycles}`) +
              (!isTaskSession && !selectedTaskId ? ' · 미분류로 저장됩니다' : '')
            }
            confirmLabel="저장"
            onConfirm={handleSave}
            onCancel={() => setPendingAction(null)}
          />
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '85%',
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  divider: {
    height: 1,
  },
  field: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
