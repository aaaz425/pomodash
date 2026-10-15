import { useState } from 'react';
import { StyleSheet } from 'react-native';
import type { LegalDocType } from '@pomoroutine/shared';
import { Text } from '@/components/shared/Text';
import { LegalModal } from '@/components/legal/LegalModal';
import { THEME } from '@/constants/timerColors';
import { FONTS } from '@/constants/fonts';
import { useThemeScheme } from '@/hooks/use-theme-scheme';

export function AuthConsentNotice() {
  const scheme = useThemeScheme();
  const theme = THEME[scheme];
  const [legalDoc, setLegalDoc] = useState<LegalDocType | null>(null);

  return (
    <>
      <Text style={[styles.text, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }]}>
        가입 시{' '}
        <Text style={styles.link} onPress={() => setLegalDoc('terms')}>
          이용약관
        </Text>{' '}
        및{' '}
        <Text style={styles.link} onPress={() => setLegalDoc('privacy')}>
          개인정보처리방침
        </Text>
        에 동의하는 것으로 간주됩니다
      </Text>
      <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },
});
