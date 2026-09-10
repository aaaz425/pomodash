import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Modal } from '@/components/shared/Modal';
import { TaskList } from '@/components/tasks/TaskList';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  selectedTaskId: string | null;
  onSelect: (taskId: string | null) => void;
  onClose: () => void;
}

export function SessionTaskReassignModal({ selectedTaskId, onSelect, onClose }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const isUnclassified = selectedTaskId === null;

  function handleSelectTask(id: string) {
    onSelect(id);
    onClose();
  }

  function handleSelectUnclassified() {
    onSelect(null);
    onClose();
  }

  return (
    <Modal visible title="작업 변경" onClose={onClose}>
      <Pressable
        onPress={handleSelectUnclassified}
        style={[styles.row, isUnclassified && { backgroundColor: withAlpha(theme.primary, 0.1) }]}
      >
        <View
          style={[
            styles.selectCircle,
            isUnclassified
              ? { backgroundColor: theme.primary }
              : { borderWidth: 2, borderColor: theme.border },
          ]}
        >
          {isUnclassified && <Check size={10} color={theme.primaryForeground} strokeWidth={2.5} />}
        </View>
        <Text
          style={[
            styles.title,
            {
              color: isUnclassified ? theme.primary : theme.foreground,
              fontFamily: isUnclassified ? FONTS.sansSemiBold : FONTS.sansRegular,
            },
          ]}
        >
          미분류
        </Text>
        {isUnclassified && (
          <View style={[styles.currentBadge, { backgroundColor: theme.primary }]}>
            <Text
              style={[
                styles.currentBadgeText,
                { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              선택됨
            </Text>
          </View>
        )}
      </Pressable>

      <TaskList
        mode="select"
        selectedTaskId={selectedTaskId}
        onSelect={handleSelectTask}
        maxHeight={260}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  selectCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 14,
  },
  currentBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  currentBadgeText: {
    fontSize: 10,
  },
});
