import { StyleSheet, Text, View } from 'react-native';
import { TaskList } from '@/components/tasks/TaskList';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';
import { SessionProgressBadge } from './SessionProgressBadge';

interface Props {
  selectedTaskId: string | null;
  onSelect: (id: string) => void;
}

export function SessionTaskSelector({ selectedTaskId, onSelect }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansSemiBold }]}>
          어떤 작업을 하셨나요?
        </Text>
        <SessionProgressBadge />
      </View>

      <TaskList
        mode="select"
        selectedTaskId={selectedTaskId}
        onSelect={onSelect}
        maxHeight={180}
        emptyStatePaddingVertical={12}
      />

      <Text
        style={[
          styles.hint,
          { color: withAlpha(theme.mutedForeground, 0.6), fontFamily: FONTS.sansRegular },
        ]}
      >
        선택하지 않으면 미분류로 저장됩니다
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
  },
  hint: {
    fontSize: 11,
  },
});
