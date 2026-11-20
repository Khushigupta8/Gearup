import type { Metadata } from 'next';
import Link from 'next/link';
import { FaqManager } from '@/components/admin/CmsForms';
import { faqSections } from '@/lib/cms';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Website · FAQs' };

export default async function WebsiteFaqsPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const { section: wanted } = await searchParams;
  const section = faqSections.find((s) => s.key === wanted) ?? faqSections[0];
  const [faqs, counts] = await Promise.all([
    db.faq.findMany({ where: { section: section.key }, orderBy: { sortOrder: 'asc' } }),
    db.faq.groupBy({ by: ['section'], _count: { _all: true } }),
  ]);
  const count = (k: string) => counts.find((c) => c.section === k)?._count._all ?? 0;
  return (
    <div className="adm-split">
      <nav className="adm-card adm-sidelist" aria-label="FAQ sections">
        {faqSections.map((s) => (
          <Link key={s.key} href={`/admin/website/faqs?section=${s.key}`} className={s.key === section.key ? 'on' : undefined}>
            {s.label}
            <span className="adm-count">{count(s.key)}</span>
          </Link>
        ))}
      </nav>
      <div>
        <p className="adm-muted" style={{ margin: '0 0 12px' }}>
          Shown on{' '}
          <a href={section.page} target="_blank" rel="noopener" className="adm-link">
            {section.page} ↗
          </a>
        </p>
        <FaqManager key={section.key} section={section.key} faqs={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer, active: f.active }))} />
      </div>
    </div>
  );
}
