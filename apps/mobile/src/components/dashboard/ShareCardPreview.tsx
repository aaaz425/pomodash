import { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import type { ShareCardData, ShareCardPalette } from '@pomodash/shared';
import { FONTS } from '@/constants/fonts';

interface Props {
  data: ShareCardData;
  colors: ShareCardPalette;
}

const STROKE_WIDTH = 12;
// 웹 캔버스의 arc(-π/2, -π/2 + 1.4π) — 2π 중 70% 구간만 그리는 장식용 링(실제 퍼센트 아님)
const ARC_RATIO = 0.7;

export function ShareCardPreview({ data, colors }: Props) {
  const [width, setWidth] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w !== width) setWidth(w);
  };

  const ringSize = width * 0.4;
  const radius = ringSize / 2 - STROKE_WIDTH / 2;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * ARC_RATIO;

  return (
    <View style={styles.square} onLayout={handleLayout}>
      <LinearGradient colors={[colors.bgTop, colors.bgBottom]} style={StyleSheet.absoluteFill} />
      {width > 0 && (
        // 웹 캔버스는 고정 픽셀 레이아웃이라 글로우 중심을 SIZE*0.35에 고정하지만,
        // 모바일은 flex 레이아웃이라 히어로 링이 카드 중앙 부근에 오므로 글로우도 중앙에 맞춘다.
        <Svg width={width} height={width} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="46%" r="65%">
              <Stop offset="0" stopColor={colors.accent} stopOpacity={0.22} />
              <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={width} height={width} fill="url(#glow)" />
        </Svg>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.accent, fontFamily: FONTS.sansBold }]}>
            Pomodash
          </Text>
          <View style={[styles.pill, { backgroundColor: colors.accentSoft }]}>
            <Text
              style={[styles.pillText, { color: colors.accent, fontFamily: FONTS.sansSemiBold }]}
            >
              {data.periodLabel}
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={2}
          style={[styles.headline, { color: colors.accent, fontFamily: FONTS.sansSemiBold }]}
        >
          {data.headline}
        </Text>

        <View style={styles.heroWrap}>
          {width > 0 && (
            <View style={{ width: ringSize, height: ringSize }}>
              <Svg width={ringSize} height={ringSize}>
                <Circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  stroke={colors.accentSoft}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                />
                <Circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={radius}
                  stroke={colors.accent}
                  strokeWidth={STROKE_WIDTH}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${arcLength} ${circumference}`}
                  rotation={-90}
                  origin={`${ringSize / 2}, ${ringSize / 2}`}
                />
              </Svg>
              <View style={[StyleSheet.absoluteFill, styles.heroStat]}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.4}
                  style={[
                    styles.heroValue,
                    { color: colors.textPrimary, fontFamily: FONTS.sansBold },
                  ]}
                >
                  {data.totalFocusLabel}
                </Text>
                <Text
                  style={[
                    styles.heroLabel,
                    { color: colors.textSecondary, fontFamily: FONTS.sansRegular },
                  ]}
                >
                  집중 시간
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text
              style={[styles.statLabel, { color: colors.textMuted, fontFamily: FONTS.sansRegular }]}
            >
              기록 수
            </Text>
            <Text
              style={[
                styles.statValue,
                { color: colors.textPrimary, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              {data.sessionCount}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={styles.statCol}>
            <Text
              style={[styles.statLabel, { color: colors.textMuted, fontFamily: FONTS.sansRegular }]}
            >
              연속 집중일
            </Text>
            <Text
              style={[
                styles.statValue,
                { color: colors.textPrimary, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              {data.streakDays}일
            </Text>
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.textMuted, fontFamily: FONTS.sansRegular }]}>
          {data.generatedAtLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 16,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    fontSize: 11,
  },
  headline: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  heroWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStat: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroValue: {
    fontSize: 26,
    maxWidth: '80%',
  },
  heroLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 8,
  },
  statCol: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
  },
  statValue: {
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: 28,
  },
  footer: {
    fontSize: 10,
    textAlign: 'center',
  },
});
