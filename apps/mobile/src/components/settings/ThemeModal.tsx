import { View } from 'react-native';
import { Text } from '@/components/shared/Text';
import { Modal } from '@/components/shared/Modal';
import { Portal } from '@/components/shared/Portal';
import { ThemeSection } from '@/components/settings/ThemeSection';
import { ColorThemeSection } from '@/components/settings/ColorThemeSection';
import { FONTS } from '@/constants/fonts';
import { useThemeTokens } from '@/hooks/use-theme-scheme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function ThemeModalContent({ visible, onClose }: Props) {
  const theme = useThemeTokens();

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

export function ThemeModal(props: Props) {
  return (
    <Portal>
      <ThemeModalContent {...props} />
    </Portal>
  );
}
