import type { Metadata } from 'next';
import Link from 'next/link';
import { timeAgo } from '@/lib/crm';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Customers' };

const requestTime = () => Date.now();

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const now = requestTime();
  const term = q.trim();
  const customers = await db.customer.findMany({
    where: term
      ? {
          OR: [
            { firstName: { contains: term, mode: 'insensitive' } },
            { lastName: { contains: term, mode: 'insensitive' } },
            { email: { contains: term, mode: 'insensitive' } },
            { phone: { contains: term.replace(/\s/g, '') } },
            { postcode: { contains: term, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { updatedAt: 'desc' },
    take: 200,
    include: { _count: { select: { leads: true, orders: true, soldBikes: true } }, leads: { orderBy: { createdAt: 'desc' }, take: 1, select: { createdAt: true } } },
  });

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Customers</h1>
          <p className="adm-muted">Everyone who has enquired, bought or sold a bike. Found by email or phone, so repeat enquiries join up.</p>
        </div>
        <form className="adm-inline" action="/admin/customers">
          <input name="q" defaultValue={q} placeholder="Name, email, phone or postcode" aria-label="Search customers" style={{ width: 280 }} />
          <button className="adm-btn adm-btn-sm">Search</button>
        </form>
      </header>
      {customers.length === 0 ? (
        <p className="adm-empty">{term ? `No customers match "${term}".` : 'No customers yet. They are created automatically from website forms and bike sales.'}</p>
      ) : (
        <div className="adm-card adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Postcode</th>
                <th className="adm-num">Enquiries</th>
                <th className="adm-num">Bought</th>
                <th>Last contact</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/admin/customers/${c.id}`} className="adm-rowlink">
                      <b>{[c.firstName, c.lastName].filter(Boolean).join(' ')}</b>
                    </Link>
                  </td>
                  <td>
                    {c.email}
                    {c.email && c.phone && <br />}
                    {c.phone}
                  </td>
                  <td>{c.postcode}</td>
                  <td className="adm-num">{c._count.leads}</td>
                  <td className="adm-num">{c._count.soldBikes}</td>
                  <td className="adm-nowrap">{timeAgo(c.leads[0]?.createdAt ?? c.updatedAt, now)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
