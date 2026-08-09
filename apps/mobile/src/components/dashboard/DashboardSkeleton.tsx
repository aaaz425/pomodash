import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/shared/Skeleton';
import { THEME } from '@/constants/timerColors';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

function StatCardSkeleton() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.rowBetween}>
        <Skeleton width={60} height={11} />
        <Skeleton width={16} height={16} borderRadius={8} />
      </View>
      <Skeleton width={70} height={20} />
      <Skeleton width={90} height={11} />
    </View>
  );
}

function ChartCardSkeleton({ height }: { height: number }) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  return (
    <View
      style={[
        styles.card,
        styles.chartCard,
        { height, backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.rowBetween}>
        <Skeleton width={90} height={14} />
        <Skeleton width={60} height={14} />
      </View>
      <Skeleton height="100%" style={styles.chartFill} />
    </View>
  );
}

// 웹 apps/web/components/dashboard/DashboardSkeleton.tsx 대응
export function DashboardSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={60} height={20} />
        <Skeleton width={130} height={13} />
      </View>

      <View style={styles.statGrid}>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </View>

      <ChartCardSkeleton height={200} />
      <ChartCardSkeleton height={180} />
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
  statGrid: {
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  chartCard: {
    gap: 12,
  },
  chartFill: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
