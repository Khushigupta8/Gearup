import type { Metadata } from 'next';
import { StockRow, type StockRowData } from '@/components/admin/StockRow';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Stock' };

const DAY = 86_400_000;

/** Whole days since a date (server-side, per request). */
function daysSince(date: Date): number {
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / DAY));
}

export default async function StockPage() {
  const rows = await db.bike.findMany({
    where: { status: { not: 'archived' } },
    orderBy: [{ status: 'asc' }, { publishedAt: 'desc' }],
    include: { photos: { select: { kind: true, url: true, sortOrder: true }, orderBy: { sortOrder: 'asc' } } },
  });

  const bikes: StockRowData[] = rows.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: `${b.year} ${b.make} ${b.model}`,
    registration: b.registration,
    image: b.photos.find((p) => p.kind === 'main')?.url ?? null,
    pricePounds: Math.round(b.price / 100),
    status: b.status,
    visible: b.visible,
    mileage: b.mileage,
    daysInStock: daysSince(b.createdAt),
    photoCounts: {
      main: b.photos.filter((p) => p.kind === 'main').length,
      detail: b.photos.filter((p) => p.kind === 'detail').length,
      receipt: b.photos.filter((p) => p.kind === 'receipt').length,
    },
  }));

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Stock</h1>
          <p className="adm-muted">
            {bikes.length} bikes. Change a price or status and press Save: the website updates straight away.
          </p>
        </div>
        <span className="adm-btn adm-btn-red is-disabled" title="Add-bike wizard arrives in M1">
          + Add bike
        </span>
      </header>
      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Bike</th>
              <th className="adm-num" title="Main / detailed / receipt photos">
                Photos
              </th>
              <th className="adm-num">In stock</th>
              <th>Price</th>
              <th>Status</th>
              <th className="adm-center">On site</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((b) => (
              <StockRow key={b.id} bike={b} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
