import type { Metadata } from 'next';
import Link from 'next/link';
import { AccountPage } from '@/components/account/AccountPage';
import { BikeCard } from '@/components/bikes/BikeCard';
import { Icon } from '@/components/ui/Icon';
import { getAccount } from '@/server/account';
import { db } from '@/server/db';
import { getPublicBikes } from '@/server/services/bikes';

export const metadata: Metadata = { title: 'Saved bikes · My account', robots: { index: false } };

export default async function SavedPage() {
  const { customer } = await getAccount();
  const [saved, all] = await Promise.all([
    db.savedBike.findMany({ where: { customerId: customer.id }, orderBy: { createdAt: 'desc' }, include: { bike: { select: { slug: true } } } }),
    getPublicBikes(),
  ]);
  const bikes = saved.map((s) => all.find((b) => b.slug === s.bike.slug)).filter((b) => b !== undefined);

  return (
    <AccountPage crumb="Saved bikes" title="Saved" em="bikes">
      <div className="apanel">
        <div className="ph">
          <h3>Saved bikes</h3>
          <Link href="/used-bikes" className="lnk" style={{ fontSize: 14 }}>
            Browse all stock <Icon name="right" />
          </Link>
        </div>
        {bikes.length === 0 ? (
          <p className="muted">Tap the heart on any bike to save it here. Saved bikes that sell are removed automatically.</p>
        ) : (
          <div className="savedgrid">
            {bikes.map((b) => (
              <BikeCard key={b.slug} bike={b} />
            ))}
          </div>
        )}
      </div>
    </AccountPage>
  );
}
