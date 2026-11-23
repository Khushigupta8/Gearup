import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { gbp } from '@/lib/format';
import { db } from '@/server/db';

const requestTime = () => Date.now();

export const metadata: Metadata = { title: 'Dashboard' };

const statusLabel: Record<string, string> = {
  draft: 'Draft',
  in_preparation: 'In prep',
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
  archived: 'Archived',
};

/** Dealer dashboard: stock position, sales and enquiries at a glance, then the work to do. */
export default async function DashboardPage() {
  const now = requestTime();
  const monthStart = new Date(now);
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [byStatus, stockValue, newLeads, reserved, due, soldMonth, latest] = await Promise.all([
    db.bike.groupBy({ by: ['status'], _count: true }),
    db.bike.aggregate({ where: { status: { in: ['available', 'reserved'] } }, _sum: { price: true } }),
    db.lead.count({ where: { stage: 'new' } }),
    db.order.count({ where: { status: 'reserved' } }),
    db.lead.count({ where: { followUpAt: { lte: new Date(now) }, stage: { notIn: ['won', 'lost'] } } }),
    db.bike.count({ where: { status: 'sold', soldAt: { gte: monthStart } } }),
    db.bike.findMany({
      where: { status: { in: ['available', 'reserved', 'in_preparation'] } },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, year: true, make: true, model: true, registration: true, price: true, status: true, createdAt: true, photos: { where: { kind: 'main' }, orderBy: { sortOrder: 'asc' }, take: 1, select: { url: true } } },
    }),
  ]);
  const count = (s: string) => byStatus.find((r) => r.status === s)?._count ?? 0;
  const value = Math.round((stockValue._sum.price ?? 0) / 100);
  const today = new Date(now).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const days = (d: Date) => Math.max(0, Math.floor((now - d.getTime()) / 86400000));

  const stock: [string, string | number, string][] = [
    ['For sale', count('available'), '/admin/stock'],
    ['Reserved', count('reserved'), '/admin/stock'],
    ['In preparation', count('in_preparation'), '/admin/stock'],
    ['Stock value', gbp(value), '/admin/stock'],
  ];
  const sales: [string, number, string, boolean][] = [
    ['New enquiries', newLeads, '/admin/leads?view=new', newLeads > 0],
    ['Follow-ups due', due, '/admin/leads?view=due', due > 0],
    ['Paid reservations', reserved, '/admin/sales', false],
    ['Sold this month', soldMonth, '/admin/stock', false],
  ];

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Dashboard</h1>
          <p className="adm-muted">{today}</p>
        </div>
        <div className="adm-head-acts">
          <Link href="/admin/leads" className="adm-btn adm-btn-line">
            Enquiries
          </Link>
          <Link href="/admin/stock/new" className="adm-btn adm-btn-red">
            Add bike
          </Link>
        </div>
      </header>

      <div className="adm-statrow">
        <section className="adm-panel">
          <h2 className="adm-panel-h">Stock</h2>
          <div className="adm-stats">
            {stock.map(([label, v, href]) => (
              <Link key={label} href={href}>
                <small>{label}</small>
                <b>{v}</b>
              </Link>
            ))}
          </div>
        </section>
        <section className="adm-panel">
          <h2 className="adm-panel-h">Sales &amp; enquiries</h2>
          <div className="adm-stats">
            {sales.map(([label, v, href, alert]) => (
              <Link key={label} href={href} className={alert ? 'alert' : undefined}>
                <small>{label}</small>
                <b>{v}</b>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="adm-dashgrid">
        <section className="adm-panel">
          <div className="adm-panel-h">
            <h2>Latest enquiries</h2>
            <Link href="/admin/leads" className="adm-link">
              All enquiries
            </Link>
          </div>
          <LeadsTable where={{ stage: { notIn: ['won', 'lost'] } }} now={now} limit={8} bare emptyText="No open enquiries. Website form submissions appear here." />
        </section>

        <section className="adm-panel">
          <div className="adm-panel-h">
            <h2>Recently added stock</h2>
            <Link href="/admin/stock" className="adm-link">
              All stock
            </Link>
          </div>
          <ul className="adm-recent">
            {latest.map((b) => (
              <li key={b.id}>
                <Link href={`/admin/stock/${b.id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {b.photos[0] ? <img src={b.photos[0].url} alt="" /> : <span className="adm-noimg" />}
                  <span className="adm-recent-main">
                    <b>
                      {b.year} {b.make} {b.model}
                    </b>
                    <small>
                      {b.registration ?? 'No reg'} · {statusLabel[b.status]} · {days(b.createdAt)}d in stock
                    </small>
                  </span>
                  <span className="adm-recent-price">{gbp(b.price / 100)}</span>
                </Link>
              </li>
            ))}
            {!latest.length && <li className="adm-muted">No bikes in stock yet.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
