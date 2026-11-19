import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const [byStatus, stockValue, leads, reserved] = await Promise.all([
    db.bike.groupBy({ by: ['status'], _count: true }),
    db.bike.aggregate({ where: { status: { in: ['available', 'reserved'] } }, _sum: { price: true } }),
    db.lead.count({ where: { stage: 'new' } }),
    db.order.count({ where: { status: 'reserved' } }),
  ]);
  const count = (s: string) => byStatus.find((r) => r.status === s)?._count ?? 0;
  const value = Math.round((stockValue._sum.price ?? 0) / 100);

  const tiles = [
    { label: 'Available', value: count('available'), href: '/admin/stock' },
    { label: 'Reserved', value: count('reserved'), href: '/admin/stock' },
    { label: 'In preparation', value: count('in_preparation'), href: '/admin/stock' },
    { label: 'Sold', value: count('sold'), href: '/admin/stock' },
    { label: 'Stock value (retail)', value: `£${value.toLocaleString('en-GB')}`, href: '/admin/stock' },
    { label: 'New enquiries', value: leads },
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
    </>
  );
}
