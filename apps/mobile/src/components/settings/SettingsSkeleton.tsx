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
      <View style={styles.profileRow}>
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={styles.profileText}>
          <Skeleton width={100} height={16} />
          <Skeleton width={140} height={12} />
        </View>
      </View>

      <MenuRowSkeleton />
      <MenuRowSkeleton />
      <MenuRowSkeleton />
      <MenuRowSkeleton />
      <MenuRowSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
  },
  profileText: {
    gap: 6,
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
