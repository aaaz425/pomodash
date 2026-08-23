import { Text, View } from 'react-native';
import { Modal } from '@/components/shared/Modal';
import { ThemeSection } from '@/components/settings/ThemeSection';
import { ColorThemeSection } from '@/components/settings/ColorThemeSection';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function ThemeModal({ visible, onClose }: Props) {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];

  return (
    <Modal visible={visible} title="테마" onClose={onClose}>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 12, color: theme.mutedForeground, fontFamily: FONTS.sansMedium }}>
          배경
        </Text>
        <ThemeSection />
      </View>
      <View style={{ height: 1, backgroundColor: theme.border }} />
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 12, color: theme.mutedForeground, fontFamily: FONTS.sansMedium }}>
          테마
        </Text>
        <ColorThemeSection />
      </View>
    </Modal>
  );
}
