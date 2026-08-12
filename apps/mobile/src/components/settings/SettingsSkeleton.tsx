import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/shared/Skeleton';

function MenuRowSkeleton() {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Skeleton width={16} height={16} borderRadius={8} />
        <Skeleton width={80} height={14} />
      </View>
      <View style={styles.right}>
        <Skeleton width={40} height={11} />
        <Skeleton width={16} height={16} borderRadius={4} />
      </View>
    </View>
  );
}

// 웹 apps/web/components/settings/SettingsSkeleton.tsx 대응
export function SettingsSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={60} height={20} />
        <Skeleton width={160} height={13} />
      </View>

      <View style={styles.rowGroup}>
        <MenuRowSkeleton />
        <MenuRowSkeleton />
        <MenuRowSkeleton />
        <MenuRowSkeleton />
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
    gap: 4,
  },
  rowGroup: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
