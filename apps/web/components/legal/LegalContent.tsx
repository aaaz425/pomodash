import { LEGAL_DOCUMENTS, type LegalDocType } from '@pomoroutine/shared';
import { LegalSection } from '@/components/shared/LegalSection';

interface Props {
  doc: LegalDocType;
}

export function LegalContent({ doc }: Props) {
  const { effectiveDate, intro, sections } = LEGAL_DOCUMENTS[doc];

  return (
    <>
      <p className="text-sm text-muted-foreground">시행일자: {effectiveDate}</p>

      <p className="text-sm text-muted-foreground leading-relaxed">{intro}</p>

      {sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          {section.blocks.map((block, i) =>
            block.type === 'paragraph' ? (
              <p key={i} className="leading-relaxed">
                {block.text}
              </p>
            ) : (
              <ul key={i} className="list-disc pl-5 flex flex-col gap-1">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          )}
        </LegalSection>
      ))}
    </>
  );
}
