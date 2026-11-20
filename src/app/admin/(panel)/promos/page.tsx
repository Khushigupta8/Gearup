import type { Metadata } from 'next';
import { PromoLibrary } from '@/components/admin/PromoLibrary';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Promo library' };

export default async function PromoLibraryPage() {
  const promos = await db.promoAsset.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  const uses = await db.bikePhoto.groupBy({ by: ['url'], where: { url: { in: promos.map((p) => p.url) } }, _count: { _all: true } });
  const useCount = new Map(uses.map((u) => [u.url, u._count._all]));

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Promo library</h1>
          <p className="adm-muted">
            Promotional banners you can add to any bike&apos;s photos (Stock → bike → Main photos → “Add from promo library”). Upload once, reuse on every
            bike. Best size: 1024 × 768 px (4:3), JPG or PNG.
          </p>
        </div>
      </header>
      <PromoLibrary
        promos={promos.map((p) => ({ id: p.id, title: p.title, url: p.url, active: p.active, uses: useCount.get(p.url) ?? 0 }))}
      />
    </>
  );
}
