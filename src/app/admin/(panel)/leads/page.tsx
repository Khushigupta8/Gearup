import type { Metadata } from 'next';
import Link from 'next/link';
import type { Prisma } from '@/generated/prisma/client';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { leadTypes, type LeadTypeKey } from '@/lib/crm';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Leads & enquiries' };

const requestTime = () => Date.now();

const views = [
  ['open', 'Open'],
  ['new', 'New'],
  ['mine', 'Mine'],
  ['due', 'Follow-ups due'],
  ['closed', 'Won / lost'],
  ['all', 'All'],
] as const;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ view?: string; type?: string }> }) {
  const user = await requireStaff();
  const { view = 'open', type } = await searchParams;
  const now = requestTime();

  const where: Prisma.LeadWhereInput = {
    ...(type && type in leadTypes ? { type: type as LeadTypeKey } : {}),
    ...(view === 'open' ? { stage: { notIn: ['won', 'lost'] } } : {}),
    ...(view === 'new' ? { stage: 'new' } : {}),
    ...(view === 'mine' ? { assignedToId: user.id, stage: { notIn: ['won', 'lost'] } } : {}),
    ...(view === 'due' ? { followUpAt: { lte: new Date(now) }, stage: { notIn: ['won', 'lost'] } } : {}),
    ...(view === 'closed' ? { stage: { in: ['won', 'lost'] } } : {}),
  };
  const byType = await db.lead.groupBy({ by: ['type'], where: { stage: { notIn: ['won', 'lost'] } }, _count: true });
  const q = (v: string, t?: string) => `/admin/leads?view=${v}${t ? `&type=${t}` : ''}`;

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Leads & enquiries</h1>
          <p className="adm-muted">Every website form lands here. Open a lead to call, note, assign and set a follow-up.</p>
        </div>
      </header>
      <div className="adm-tabs">
        {views.map(([v, l]) => (
          <Link key={v} href={q(v, type)} className={view === v ? 'on' : undefined}>
            {l}
          </Link>
        ))}
      </div>
      <div className="adm-chips">
        <Link href={q(view)} className={!type ? 'on' : undefined}>
          All types
        </Link>
        {Object.entries(leadTypes).map(([t, l]) => {
          const n = byType.find((b) => b.type === t)?._count ?? 0;
          return (
            <Link key={t} href={q(view, t)} className={type === t ? 'on' : undefined}>
              {l}
              {n > 0 && <i>{n}</i>}
            </Link>
          );
        })}
      </div>
      <LeadsTable where={where} now={now} />
    </>
  );
}
