import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeToggle, NewCodeForm } from '@/components/admin/ProductForm';
import { money } from '@/lib/orders';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Discount codes' };

export default async function CodesPage() {
  const codes = await db.discountCode.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/accessories" className="adm-back">
            ← Accessories
          </Link>
          <h1>Discount codes</h1>
          <p className="adm-muted">Customers type these in the basket. Codes take money off kit (accessories).</p>
        </div>
      </header>
      <div className="adm-edit">
        <div className="adm-edit-main">
          <div className="adm-card adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Ends</th>
                  <th className="adm-num">Used</th>
                  <th className="adm-center">Active</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <b>{c.code}</b>
                    </td>
                    <td>{c.percentOff ? `${c.percentOff}% off kit` : `${money(c.amountOff ?? 0)} off`}</td>
                    <td>{c.endsAt ? c.endsAt.toLocaleDateString('en-GB') : 'No end date'}</td>
                    <td className="adm-num">
                      {c.timesUsed}
                      {c.maxUses ? ` / ${c.maxUses}` : ''}
                    </td>
                    <td className="adm-center">
                      <CodeToggle id={c.id} active={c.active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="adm-edit-side">
          <NewCodeForm />
        </aside>
      </div>
    </>
  );
}
