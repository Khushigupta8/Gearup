import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { db } from '@/server/db';

const requestTime = () => Date.now();

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const now = requestTime();
  const [byStatus, stockValue, leads, reserved, due] = await Promise.all([
    db.bike.groupBy({ by: ['status'], _count: true }),
    db.bike.aggregate({ where: { status: { in: ['available', 'reserved'] } }, _sum: { price: true } }),
    db.lead.count({ where: { stage: 'new' } }),
    db.order.count({ where: { status: 'reserved' } }),
    db.lead.count({ where: { followUpAt: { lte: new Date(now) }, stage: { notIn: ['won', 'lost'] } } }),
  ]);
  const count = (s: string) => byStatus.find((r) => r.status === s)?._count ?? 0;
  const value = Math.round((stockValue._sum.price ?? 0) / 100);

  const tiles = [
    { label: 'Available', value: count('available'), href: '/admin/stock' },
    { label: 'Reserved', value: count('reserved'), href: '/admin/stock' },
    { label: 'In preparation', value: count('in_preparation'), href: '/admin/stock' },
    { label: 'Sold', value: count('sold'), href: '/admin/stock' },
    { label: 'Stock value (retail)', value: `£${value.toLocaleString('en-GB')}`, href: '/admin/stock' },
    { label: 'New enquiries', value: leads, href: '/admin/leads?view=new' },
    { label: 'Follow-ups due', value: due, href: '/admin/leads?view=due' },
    { label: 'Paid reservations', value: reserved },
  ];

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Dashboard</h1>
          <p className="adm-muted">Stock and sales at a glance.</p>
        </div>
      </header>
      <div className="adm-tiles">
        {tiles.map((t) =>
          t.href ? (
            <Link key={t.label} href={t.href} className="adm-tile">
              <small>{t.label}</small>
              <b>{t.value}</b>
            </Link>
          ) : (
            <div key={t.label} className="adm-tile">
              <small>{t.label}</small>
              <b>{t.value}</b>
            </div>
          ),
        )}
      </div>
      <h2 className="adm-h2">Latest enquiries</h2>
      <LeadsTable where={{ stage: { notIn: ['won', 'lost'] } }} now={now} />
    </>
  );
}
