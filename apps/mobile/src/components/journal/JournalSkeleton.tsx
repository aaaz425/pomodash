import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/shared/Skeleton';
import { THEME } from '@/constants/timerColors';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

function SessionRowSkeleton() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.rowBetween}>
        <Skeleton width={140} height={14} />
        <Skeleton width={60} height={11} />
      </View>
      <View style={styles.rowBetween}>
        <Skeleton width={48} height={18} borderRadius={6} />
        <Skeleton width={40} height={11} />
      </View>
    </View>
  );
}

// 웹 apps/web/components/journal/JournalSkeleton.tsx 대응
export function JournalSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={48} height={20} />
        <Skeleton width={150} height={13} />
      </View>

      <View style={styles.sessionList}>
        <Skeleton width={80} height={11} />
        <SessionRowSkeleton />
        <SessionRowSkeleton />
        <SessionRowSkeleton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  header: {
    gap: 8,
  },
  sessionList: {
    gap: 8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
