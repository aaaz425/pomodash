import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { normalizeFocusPeriods } from '@pomodash/shared';
import type { FocusRating } from '@pomodash/shared';
import { useTimerStore, useTaskStore } from '@/store/StoreProvider';
import { useCurrentTask } from '@/hooks/useCurrentTask';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { ConfirmModal } from '@/components/shared/ConfirmModal';
import { TextInput } from '@/components/shared/TextInput';
import { FocusRatingPicker } from '@/components/shared/FocusRatingPicker';
import { DistractionTagPicker } from '@/components/shared/DistractionTagPicker';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { SessionProgressBadge } from './SessionProgressBadge';
import { SessionTaskSelector } from './SessionTaskSelector';

const NOTE_MAX_LENGTH = 500;

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
    <>
      <Modal
        visible={sessionEnded}
        animationType="fade"
        transparent
        onRequestClose={() => setPendingAction('skip')}
      >
        <Pressable style={styles.backdrop} onPress={() => setPendingAction('skip')}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <SafeAreaView edges={['bottom']}>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.header}>
                  <View
                    style={[styles.iconOuter, { backgroundColor: withAlpha(theme.primary, 0.2) }]}
                  >
                    <View style={[styles.iconInner, { backgroundColor: theme.primary }]}>
                      <Check size={20} color={theme.primaryForeground} strokeWidth={2.5} />
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.headline,
                      { color: theme.foreground, fontFamily: FONTS.sansBold },
                    ]}
                  >
                    집중 완료!
                  </Text>
                  <Text
                    style={[
                      styles.subtext,
                      { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                    ]}
                  >
                    오늘도 집중 세션을 완료했어요
                  </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                {isTaskSession ? (
                  <View style={styles.taskRow}>
                    <View style={styles.taskInfo}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.taskTitle,
                          { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
                        ]}
                      >
                        {task?.title ?? '작업 없음'}
                      </Text>
                      {category && task && (
                        <CategoryBadge category={category} style={styles.taskCategoryBadge} />
                      )}
                    </View>
                    <SessionProgressBadge />
                  </View>
                ) : (
                  <SessionTaskSelector
                    selectedTaskId={selectedTaskId}
                    onSelect={setSelectedTaskId}
                  />
                )}

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

                <View style={styles.field}>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    maxLength={NOTE_MAX_LENGTH}
                    value={note}
                    onChangeText={setNote}
                    placeholder="무엇을 집중해서 했나요? 짧게 메모해두면 나중에 돌아볼 수 있어요."
                    style={styles.memoInput}
                  />
                  <Text
                    style={[
                      styles.counter,
                      {
                        color: withAlpha(theme.mutedForeground, 0.6),
                        fontFamily: FONTS.sansRegular,
                      },
                    ]}
                  >
                    {note.length} / {NOTE_MAX_LENGTH}
                  </Text>
                </View>

                <View style={styles.actions}>
                  <Pressable
                    onPress={() => setPendingAction('skip')}
                    style={[styles.actionButton, { backgroundColor: theme.muted }]}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
                      ]}
                    >
                      건너뛰기
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setPendingAction('save')}
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
                      ]}
                    >
                      기록 완료
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            </SafeAreaView>
          </Pressable>

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
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  header: {
    alignItems: 'center',
    gap: 12,
  },
  iconOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: 26,
  },
  subtext: {
    fontSize: 14,
    marginTop: -4,
  },
  divider: {
    height: 1,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  taskInfo: {
    flex: 1,
    gap: 8,
  },
  taskTitle: {
    fontSize: 18,
  },
  taskCategoryBadge: {
    alignSelf: 'flex-start',
  },
  field: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  memoInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 11,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 14,
  },
});
