import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { NAV_ITEMS, BOTTOM_NAV_HEIGHT } from '@/constants/navItems';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

// 웹 apps/web/components/shared/layout/BottomNav.tsx 대응 —
// flat bg-card + 상단 보더만, 네이티브 블러/반투명 없음(expo-router의 unstable-native-tabs 대신
// 일반 Tabs의 tabBar prop으로 완전히 커스텀 렌더링)
export function BottomNav({ state, navigation, insets }: BottomTabBarProps) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: BOTTOM_NAV_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {NAV_ITEMS.map((item) => {
        const routeIndex = state.routes.findIndex((r) => r.name === item.name);
        const active = routeIndex === state.index;
        const Icon = item.icon;
        const color = active ? theme.primary : theme.mutedForeground;

        return (
          <Pressable
            key={item.name}
            style={styles.item}
            onPress={() => navigation.navigate(item.name)}
          >
            <Icon size={22} color={color} strokeWidth={2} />
            <Text
              style={[
                styles.label,
                { color, fontFamily: active ? FONTS.sansSemiBold : FONTS.sansMedium },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
  },
});
