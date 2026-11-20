import { getFaqs } from '@/server/services/cms';
import { inline } from './RichText';

/** FAQ accordion for one CMS section (edited in Admin → Website → FAQs). */
export async function FaqList({ section, openFirst = false, className = 'faq' }: { section: string; openFirst?: boolean; className?: string }) {
  const faqs = await getFaqs(section);
  if (!faqs.length) return null;
  return (
    <div className={className}>
      {faqs.map((f, i) => (
        <details key={f.id} open={openFirst && i === 0}>
          <summary>{f.question}</summary>
          <p>{inline(f.answer)}</p>
        </details>
      ))}
    </div>
  );
}
