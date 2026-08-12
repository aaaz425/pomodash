import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { useAuth } from '@/store/AuthProvider';
import { SettingsCard } from '@/components/settings/SettingsCard';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  onPasswordChangePress: () => void;
  onDeleteAccountPress: () => void;
}

export function AccountCategoryCard({ onPasswordChangePress, onDeleteAccountPress }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const { user, logout } = useAuth();
  const isKakao = user?.user_metadata?.provider === 'kakao';

  return (
    <SettingsCard title="계정">
      <ProfileSection />

      <View style={[styles.lower, { borderTopColor: theme.border }]}>
        <View style={styles.topRow}>
          <Text style={[styles.email, { color: theme.foreground, fontFamily: FONTS.sansRegular }]}>
            {user?.email ?? '카카오 계정'}
          </Text>
          <Pressable onPress={logout} style={styles.logoutRow}>
            <LogOut size={14} color={theme.destructive} />
            <Text
              style={[
                styles.logoutLabel,
                { color: theme.destructive, fontFamily: FONTS.sansRegular },
              ]}
            >
              로그아웃
            </Text>
          </Pressable>
        </View>

        <View style={styles.actionsRow}>
          <Pressable onPress={onPasswordChangePress}>
            <Text
              style={[
                styles.actionLabel,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              {isKakao ? '비밀번호 설정' : '비밀번호 변경'}
            </Text>
          </Pressable>
          <Pressable onPress={onDeleteAccountPress}>
            <Text
              style={[
                styles.actionLabel,
                { color: theme.destructive, fontFamily: FONTS.sansRegular },
              ]}
            >
              회원탈퇴
            </Text>
          </Pressable>
        </View>
      </View>
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  lower: {
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  email: {
    fontSize: 14,
    flexShrink: 1,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoutLabel: {
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionLabel: {
    fontSize: 12,
  },
});
