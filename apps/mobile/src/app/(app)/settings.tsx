import { useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  ChevronLeft,
  Info,
  SlidersHorizontal,
  User,
  type LucideIcon,
} from 'lucide-react-native';
import { useHydrated, useSettingsStore } from '@/store/StoreProvider';
import { useAuth } from '@/store/AuthProvider';
import { SettingsMenuRow } from '@/components/shared/SettingsMenuRow';
import { SettingsCard } from '@/components/settings/SettingsCard';
import { SettingsRowGroup } from '@/components/settings/SettingsRowGroup';
import { AccountCategoryCard } from '@/components/settings/AccountCategoryCard';
import { PresetsCategoryCard } from '@/components/settings/PresetsCategoryCard';
import { PasswordChangeModal } from '@/components/settings/PasswordChangeModal';
import { DeleteAccountModal } from '@/components/settings/DeleteAccountModal';
import { AboutSection } from '@/components/settings/AboutSection';
import { NotificationSection } from '@/components/settings/NotificationSection';
import { SettingsSkeleton } from '@/components/settings/SettingsSkeleton';
import { TimerDefaultsModal } from '@/components/settings/TimerDefaultsModal';
import { TaskModal } from '@/components/tasks/TaskModal';
import { CategoryModal } from '@/components/settings/CategoryModal';
import { MotivationalModal } from '@/components/settings/MotivationalModal';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

type CategoryKey = 'account' | 'presets' | 'notifications' | 'about';

const CATEGORIES: { key: CategoryKey; label: string; Icon: LucideIcon }[] = [
  { key: 'account', label: '계정', Icon: User },
  { key: 'presets', label: '환경설정', Icon: SlidersHorizontal },
  { key: 'notifications', label: '알림', Icon: Bell },
  { key: 'about', label: '앱 정보', Icon: Info },
];

// 목록 ↔ 디테일 전환은 진짜 라우트가 아니라 같은 화면 안 콘텐츠 교체 — 웹 SettingsView의
// AnimatePresence(fade+x슬라이드, 0.25s easeOut)에 대응해 Animated.Value(opacity+translateX)로
// 구현. Modal.tsx처럼 useNativeDriver: false가 필요한 layout 속성이 없어 여기선 true 사용 가능.
const TRANSITION_DURATION = 250;

export default function SettingsScreen() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const { user } = useAuth();
  const hydrated = useHydrated();

  const browserNotification = useSettingsStore((s) => s.browserNotification);
  const soundAlert = useSettingsStore((s) => s.soundAlert);

  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [renderCategory, setRenderCategory] = useState<CategoryKey | null>(null);
  const [opacity] = useState(() => new Animated.Value(1));
  const [translateX] = useState(() => new Animated.Value(0));

  const [openMenu, setOpenMenu] = useState<'timer' | 'task' | 'category' | 'motivational' | null>(
    null,
  );
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const isKakao = user?.user_metadata?.provider === 'kakao';

  function goTo(next: CategoryKey | null) {
    if (next === activeCategory) return;
    setActiveCategory(next);
    const exitDirection = next === null ? -1 : 1;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: TRANSITION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: exitDirection * -16,
        duration: TRANSITION_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setRenderCategory(next);
      translateX.setValue(exitDirection * 16);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: TRANSITION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: TRANSITION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  if (!hydrated) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <SettingsSkeleton />
        </SafeAreaView>
      </View>
    );
  }

  const activeLabel = CATEGORIES.find((c) => c.key === renderCategory)?.label;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.foreground, fontFamily: FONTS.sansBold }]}>
              설정
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
              ]}
            >
              프로필과 앱 설정을 관리합니다.
            </Text>
          </View>

          <Animated.View style={{ opacity, transform: [{ translateX }] }}>
            {renderCategory === null ? (
              <SettingsRowGroup>
                {CATEGORIES.map(({ key, label, Icon }) => (
                  <SettingsMenuRow
                    key={key}
                    Icon={Icon}
                    label={label}
                    value={
                      key === 'account'
                        ? (user?.email ?? '카카오 계정')
                        : key === 'notifications'
                          ? browserNotification || soundAlert
                            ? '켜짐'
                            : '꺼짐'
                          : ''
                    }
                    onPress={() => goTo(key)}
                  />
                ))}
              </SettingsRowGroup>
            ) : (
              <View style={styles.detail}>
                <Pressable onPress={() => goTo(null)} style={styles.backRow} hitSlop={8}>
                  <ChevronLeft size={16} color={theme.mutedForeground} />
                  <Text
                    style={[
                      styles.backLabel,
                      { color: theme.mutedForeground, fontFamily: FONTS.sansRegular },
                    ]}
                  >
                    {activeLabel}
                  </Text>
                </Pressable>

                {renderCategory === 'account' && (
                  <AccountCategoryCard
                    onPasswordChangePress={() => setShowPasswordChange(true)}
                    onDeleteAccountPress={() => setShowDeleteAccount(true)}
                  />
                )}

                {renderCategory === 'presets' && (
                  <PresetsCategoryCard
                    onOpenTimer={() => setOpenMenu('timer')}
                    onOpenTask={() => setOpenMenu('task')}
                    onOpenCategory={() => setOpenMenu('category')}
                    onOpenMotivational={() => setOpenMenu('motivational')}
                  />
                )}

                {renderCategory === 'notifications' && (
                  <SettingsCard title="알림">
                    <NotificationSection />
                  </SettingsCard>
                )}

                {renderCategory === 'about' && (
                  <SettingsCard title="앱 정보">
                    <AboutSection />
                  </SettingsCard>
                )}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      <TimerDefaultsModal visible={openMenu === 'timer'} onClose={() => setOpenMenu(null)} />
      <TaskModal visible={openMenu === 'task'} onClose={() => setOpenMenu(null)} />
      <CategoryModal visible={openMenu === 'category'} onClose={() => setOpenMenu(null)} />
      <MotivationalModal visible={openMenu === 'motivational'} onClose={() => setOpenMenu(null)} />
      <DeleteAccountModal visible={showDeleteAccount} onClose={() => setShowDeleteAccount(false)} />
      <PasswordChangeModal
        visible={showPasswordChange}
        title={isKakao ? '비밀번호 설정' : '비밀번호 변경'}
        onClose={() => setShowPasswordChange(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 13,
  },
  detail: {
    gap: 16,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  backLabel: {
    fontSize: 14,
  },
});
