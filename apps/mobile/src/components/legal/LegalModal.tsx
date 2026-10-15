import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LEGAL_DOCUMENTS, type LegalDocType } from '@pomoroutine/shared';
import { Text } from '@/components/shared/Text';
import { Modal } from '@/components/shared/Modal';
import { Portal } from '@/components/shared/Portal';
import { FONTS } from '@/constants/fonts';
import { useThemeTokens } from '@/hooks/use-theme-scheme';

interface Props {
  doc: LegalDocType | null;
  onClose: () => void;
}

function LegalModalContent({ doc, onClose }: Props) {
  const theme = useThemeTokens();
  // 닫힘 애니메이션 동안 doc이 null이어도 직전 문서를 계속 보여줘야 함
  const [shownDoc, setShownDoc] = useState<LegalDocType>(doc ?? 'terms');
  if (doc && doc !== shownDoc) setShownDoc(doc);
  const document = LEGAL_DOCUMENTS[shownDoc];
  const bodyStyle = [styles.body, { color: theme.mutedForeground, fontFamily: FONTS.sansRegular }];

  return (
    <Modal visible={doc !== null} title={document.title} onClose={onClose}>
      <Text style={bodyStyle}>시행일자: {document.effectiveDate}</Text>
      <Text style={bodyStyle}>{document.intro}</Text>

      {document.sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.foreground, fontFamily: FONTS.sansSemiBold },
            ]}
          >
            {section.title}
          </Text>
          {section.blocks.map((block, i) =>
            block.type === 'paragraph' ? (
              <Text key={i} style={bodyStyle}>
                {block.text}
              </Text>
            ) : (
              <View key={i} style={styles.list}>
                {block.items.map((item) => (
                  <View key={item} style={styles.listItem}>
                    <Text style={bodyStyle}>•</Text>
                    <Text style={[bodyStyle, styles.listText]}>{item}</Text>
                  </View>
                ))}
              </View>
            ),
          )}
        </View>
      ))}
    </Modal>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 14,
    lineHeight: 23,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
  },
  list: {
    gap: 4,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
  },
  listText: {
    flex: 1,
  },
});

export function LegalModal(props: Props) {
  return (
    <Portal>
      <LegalModalContent {...props} />
    </Portal>
  );
}
