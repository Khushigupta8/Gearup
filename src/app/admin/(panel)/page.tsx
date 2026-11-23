import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { Icon, type IconName } from '@/components/ui/Icon';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';

const requestTime = () => Date.now();

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const now = requestTime();
  const user = await requireStaff();
  const [byStatus, stockValue, leads, reserved, due] = await Promise.all([
    db.bike.groupBy({ by: ['status'], _count: true }),
    db.bike.aggregate({ where: { status: { in: ['available', 'reserved'] } }, _sum: { price: true } }),
    db.lead.count({ where: { stage: 'new' } }),
    db.order.count({ where: { status: 'reserved' } }),
    db.lead.count({ where: { followUpAt: { lte: new Date(now) }, stage: { notIn: ['won', 'lost'] } } }),
  ]);
  const count = (s: string) => byStatus.find((r) => r.status === s)?._count ?? 0;
  const value = Math.round((stockValue._sum.price ?? 0) / 100);

  const tiles: { label: string; value: string | number; href: string; icon: IconName; tone: string }[] = [
    { label: 'Available', value: count('available'), href: '/admin/stock', icon: 'moto', tone: 'green' },
    { label: 'Reserved', value: count('reserved'), href: '/admin/stock', icon: 'lock', tone: 'amber' },
    { label: 'In preparation', value: count('in_preparation'), href: '/admin/stock', icon: 'wrench', tone: 'blue' },
    { label: 'Sold', value: count('sold'), href: '/admin/stock', icon: 'check', tone: 'grey' },
    { label: 'Stock value (retail)', value: `£${value.toLocaleString('en-GB')}`, href: '/admin/stock', icon: 'tag', tone: 'ink' },
    { label: 'New enquiries', value: leads, href: '/admin/leads?view=new', icon: 'mail', tone: 'red' },
    { label: 'Follow-ups due', value: due, href: '/admin/leads?view=due', icon: 'clock', tone: due ? 'red' : 'grey' },
    { label: 'Paid reservations', value: reserved, href: '/admin/sales', icon: 'card', tone: 'green' },
  ];
  const hour = new Date(now).getUTCHours(); // UK time is close enough for a greeting
  const hello = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>
            {hello}, {user.name.split(' ')[0]}
          </h1>
          <p className="adm-muted">Here&apos;s your stock and sales at a glance.</p>
        </div>
        <div className="adm-head-acts">
          <Link href="/admin/leads" className="adm-btn adm-btn-line">
            View enquiries
          </Link>
          <Link href="/admin/stock/new" className="adm-btn adm-btn-red">
            <Icon name="plus" /> Add bike
          </Link>
        </div>
      </header>
      <div className="adm-tiles">
        {tiles.map((t) =>
          t.href ? (
            <Link key={t.label} href={t.href} className={`adm-tile tone-${t.tone}`}>
              <span className="adm-tile-ic">
                <Icon name={t.icon} />
              </span>
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
