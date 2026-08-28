import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { hexToHsv, hsvToHex, type Hsv } from '@pomodash/shared';
import { Modal } from '@/components/shared/Modal';
import { TextInput } from '@/components/shared/TextInput';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

const HEX_PATTERN = /^#[0-9a-f]{6}$/i;
const SV_SIZE = 220;
const HUE_HEIGHT = 20;

interface Props {
  visible: boolean;
  initialHex: string;
  onCancel: () => void;
  onConfirm: (hex: string) => void;
}

export function ColorPickerModal({ visible, initialHex, onCancel, onConfirm }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(initialHex));
  const [color, setColor] = useState(initialHex);
  const isValidColor = HEX_PATTERN.test(color);

  function applyHsv(next: Partial<Hsv>) {
    const merged = { ...hsv, ...next };
    setHsv(merged);
    setColor(hsvToHex(merged.h, merged.s, merged.v));
  }

  function handleHexChange(text: string) {
    setColor(text);
    if (HEX_PATTERN.test(text)) setHsv(hexToHsv(text));
  }

  function updateFromSvTouch(x: number, y: number) {
    const s = Math.min(Math.max(x / SV_SIZE, 0), 1);
    const v = 1 - Math.min(Math.max(y / SV_SIZE, 0), 1);
    applyHsv({ s, v });
  }

  function updateFromHueTouch(x: number) {
    const h = Math.min(Math.max(x / SV_SIZE, 0), 1) * 360;
    applyHsv({ h });
  }

  const svPan = Gesture.Pan()
    .minDistance(0)
    .runOnJS(true)
    .onBegin((e) => updateFromSvTouch(e.x, e.y))
    .onUpdate((e) => updateFromSvTouch(e.x, e.y));

  const huePan = Gesture.Pan()
    .minDistance(0)
    .runOnJS(true)
    .onBegin((e) => updateFromHueTouch(e.x))
    .onUpdate((e) => updateFromHueTouch(e.x));

  const hueColor = hsvToHex(hsv.h, 1, 1);

  return (
    <Modal
      visible={visible}
      title="색상 입력"
      onClose={onCancel}
      footer={
        <>
          <Pressable
            onPress={onCancel}
            style={[styles.footerButton, { backgroundColor: theme.muted }]}
          >
            <Text
              style={[
                styles.footerButtonText,
                { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              취소
            </Text>
          </Pressable>
          <Pressable
            onPress={() => isValidColor && onConfirm(color)}
            disabled={!isValidColor}
            style={[
              styles.footerButton,
              { backgroundColor: theme.primary },
              !isValidColor && styles.disabled,
            ]}
          >
            <Text
              style={[
                styles.footerButtonText,
                { color: theme.primaryForeground, fontFamily: FONTS.sansSemiBold },
              ]}
            >
              확인
            </Text>
          </Pressable>
        </>
      }
    >
      <View style={styles.field}>
        <GestureDetector gesture={svPan}>
          <View
            style={[
              styles.svSquare,
              { width: SV_SIZE, height: SV_SIZE, backgroundColor: hueColor },
            ]}
          >
            <LinearGradient
              colors={['#ffffff', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0)', '#000000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View
              pointerEvents="none"
              style={[
                styles.svThumb,
                { left: hsv.s * SV_SIZE - 8, top: (1 - hsv.v) * SV_SIZE - 8 },
              ]}
            />
          </View>
        </GestureDetector>

        <GestureDetector gesture={huePan}>
          <View style={[styles.hueTrack, { width: SV_SIZE, height: HUE_HEIGHT }]}>
            <LinearGradient
              colors={['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View
              pointerEvents="none"
              style={[styles.hueThumb, { left: (hsv.h / 360) * SV_SIZE - 3 }]}
            />
          </View>
        </GestureDetector>

        <TextInput
          value={color}
          onChangeText={handleHexChange}
          placeholder="#000000"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 12,
    alignItems: 'center',
  },
  svSquare: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  svThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
  hueTrack: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  hueThumb: {
    position: 'absolute',
    top: -2,
    width: 6,
    height: HUE_HEIGHT + 4,
    borderRadius: 3,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
    borderColor: '#fff',
  },
  footerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  footerButtonText: {
    fontSize: 14,
  },
  disabled: {
    opacity: 0.4,
  },
});
