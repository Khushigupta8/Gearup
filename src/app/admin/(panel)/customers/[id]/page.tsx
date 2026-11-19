import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CustomerForm } from '@/components/admin/CrmForms';
import { LeadsTable } from '@/components/admin/LeadsTable';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Customer' };

const requestTime = () => Date.now();

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await db.customer.findUnique({
    where: { id },
    include: { soldBikes: { select: { id: true, year: true, make: true, model: true, soldPrice: true, soldAt: true } }, user: { select: { email: true } } },
  });
  if (!c) notFound();

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/customers" className="adm-back">
            ← Customers
          </Link>
          <h1>{[c.firstName, c.lastName].filter(Boolean).join(' ')}</h1>
          <p className="adm-muted">
            Customer since {c.createdAt.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            {c.source ? ` · first came from ${c.source}` : ''}
            {c.user ? ' · has a website account' : ''}
          </p>
        </div>
      </header>
      <div className="adm-edit">
        <div className="adm-edit-main">
          <section>
            <h2 className="adm-h2">Enquiries</h2>
            <LeadsTable where={{ customerId: c.id }} now={requestTime()} emptyText="No enquiries from this customer." />
          </section>
          {c.soldBikes.length > 0 && (
            <section className="adm-card adm-sec">
              <h2>Bikes bought</h2>
              <ul className="adm-list">
                {c.soldBikes.map((b) => (
                  <li key={b.id}>
                    <Link href={`/admin/stock/${b.id}`} className="adm-link">
                      {b.year} {b.make} {b.model}
                    </Link>{' '}
                    · £{((b.soldPrice ?? 0) / 100).toLocaleString('en-GB')}
                    {b.soldAt && ` · ${b.soldAt.toLocaleDateString('en-GB')}`}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <aside className="adm-edit-side">
          <CustomerForm
            c={{
              id: c.id,
              firstName: c.firstName,
              lastName: c.lastName,
              email: c.email,
              phone: c.phone,
              addressLine1: c.addressLine1,
              town: c.town,
              postcode: c.postcode,
              notes: c.notes,
              marketingConsent: c.marketingConsent,
            }}
          />
        </aside>
      </div>
    </>
  );
}
