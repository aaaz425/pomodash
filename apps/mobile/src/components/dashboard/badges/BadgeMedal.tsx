import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Clock,
  Flame,
  Layers,
  Moon,
  Rocket,
  Sparkles,
  Sun,
  Trophy,
  type LucideIcon,
} from 'lucide-react-native';
import type { BadgeDefinition, BadgeIconKey } from '@pomodash/shared';
import { BADGE_TIER_STYLES } from '@/constants/badgeTierStyles';
import { THEME, withAlpha } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

const BADGE_ICONS: Record<BadgeIconKey, LucideIcon> = {
  flame: Flame,
  clock: Clock,
  layers: Layers,
  sparkles: Sparkles,
  moon: Moon,
  sun: Sun,
  trophy: Trophy,
  rocket: Rocket,
};

interface Props {
  badge: BadgeDefinition;
  earned: boolean;
}

export function BadgeMedal({ badge, earned }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const Icon = BADGE_ICONS[badge.icon];
  const tier = BADGE_TIER_STYLES[badge.tier];

  const handlePress = () => {
    Alert.alert(badge.name, earned ? badge.description : `${badge.description} (미획득)`);
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
      accessibilityLabel={`${badge.name}${earned ? '' : ' (미획득)'}`}
    >
      <View
        style={[
          styles.ring,
          { borderColor: earned ? tier.ring : theme.border, backgroundColor: theme.background },
        ]}
      >
        {earned ? (
          <LinearGradient colors={tier.medallionColors} style={styles.medallion}>
            <Icon size={22} color="#FFFFFF" strokeWidth={2.25} />
          </LinearGradient>
        ) : (
          <View style={[styles.medallion, { backgroundColor: theme.muted }]}>
            <Icon size={22} color={withAlpha(theme.mutedForeground, 0.6)} strokeWidth={2.25} />
          </View>
        )}
      </View>

      <View style={styles.ribbonRow}>
        <View style={[styles.ribbon, { borderTopColor: earned ? tier.ribbon : theme.muted }]} />
        <View style={[styles.ribbon, { borderTopColor: earned ? tier.ribbon : theme.muted }]} />
      </View>

      <Text
        numberOfLines={2}
        style={[
          styles.name,
          {
            color: earned ? theme.foreground : withAlpha(theme.mutedForeground, 0.6),
            fontFamily: FONTS.sansMedium,
          },
        ]}
      >
        {badge.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 76,
    alignItems: 'center',
    gap: 2,
  },
  ring: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medallion: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: -4,
  },
  ribbon: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  name: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },
});
