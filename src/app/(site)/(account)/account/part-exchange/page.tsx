import type { Metadata } from 'next';
import Link from 'next/link';
import { AccountPage } from '@/components/account/AccountPage';
import { Icon } from '@/components/ui/Icon';
import { leadStages } from '@/lib/crm';
import { getAccount } from '@/server/account';
import { db } from '@/server/db';

export const metadata: Metadata = {
  title: 'Part-exchange · My account',
  description: 'Add your current bike to your order and take its value off your balance.',
  robots: { index: false },
};

export default async function AccountPartExchangePage() {
  const { customer } = await getAccount();
  const valuations = await db.lead.findMany({
    where: { customerId: customer.id, type: { in: ['part_exchange', 'sell_bike'] } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AccountPage crumb="Part-exchange" title="Part-" em="exchange">
      <div className="apanel">
        <div className="ph">
          <h3>Part-exchange</h3>
        </div>
        {valuations.length > 0 && (
          <table className="olist" style={{ marginBottom: 18 }}>
            <thead>
              <tr>
                <th>Bike</th>
                <th className="hm">Sent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {valuations.map((v) => {
                const data = (v.data as Record<string, string> | null) ?? {};
                const reg = Object.entries(data).find(([k]) => /registration|reg/i.test(k))?.[1];
                return (
                  <tr key={v.id}>
                    <td>
                      <b>{reg?.toUpperCase() ?? 'Your bike'}</b>
                    </td>
                    <td className="hm">{v.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                    <td>
                      <span className="pill">{v.stage === 'new' ? 'Valuing' : leadStages[v.stage]}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <p className="muted">Add your current bike to your order. We value it and take it off your balance.</p>
        <Link href="/part-exchange#details" className="btn btn-red mt2">
          Value my bike <Icon name="right" />
        </Link>
      </div>
    </AccountPage>
  );
}
