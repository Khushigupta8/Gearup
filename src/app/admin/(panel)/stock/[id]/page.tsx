import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BikeForm, type BikeFormValues } from '@/components/admin/BikeForm';
import { BikeMoneyPanels } from '@/components/admin/BikeMoneyPanels';
import { PhotoManager } from '@/components/admin/PhotoManager';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Edit bike' };

const ymd = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : null);

const statusLabel: Record<string, string> = {
  draft: 'Draft',
  in_preparation: 'In preparation',
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
  archived: 'Archived',
};

export default async function EditBikePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  const { created } = await searchParams;
  const bike = await db.bike.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { sortOrder: 'asc' } },
      history: { orderBy: { sortOrder: 'asc' } },
      acquisition: true,
      costs: { orderBy: { incurredAt: 'asc' } },
      buyer: true,
    },
  });
  if (!bike) notFound();

  const values: BikeFormValues = {
    id: bike.id,
    registration: bike.registration,
    vin: bike.vin,
    make: bike.make,
    model: bike.model,
    variant: bike.variant,
    year: bike.year,
    plate: bike.plate,
    condition: bike.condition,
    mileage: bike.mileage,
    engineCc: bike.engineCc,
    style: bike.style,
    colour: bike.colour,
    licence: bike.licence,
    fuel: bike.fuel,
    gearbox: bike.gearbox,
    owners: bike.owners,
    keys: bike.keys,
    motExpiry: ymd(bike.motExpiry),
    pricePounds: bike.price / 100,
    wasPricePounds: bike.wasPrice ? bike.wasPrice / 100 : null,
    status: bike.status,
    visible: bike.visible,
    featured: bike.featured,
    freeWarrantyMonths: bike.freeWarrantyMonths,
    freeWarrantyValuePounds: bike.freeWarrantyValue ? bike.freeWarrantyValue / 100 : null,
    showWarrantyBadge: bike.showWarrantyBadge,
    showA2Badge: bike.showA2Badge,
    flagText: bike.flagText,
    headline: bike.headline,
    description: bike.description,
    features: bike.features,
    highlights: bike.highlights,
    specText: ((bike.specRows as [string, string][] | null) ?? []).map(([k, v]) => `${k}: ${v}`).join('\n'),
    historyText: bike.history.map((h) => (h.note ? `${h.title} | ${h.note}` : h.title)).join('\n'),
    seoTitle: bike.seoTitle,
    seoDescription: bike.seoDescription,
  };

  const photos = (kind: 'main' | 'detail' | 'receipt') =>
    bike.photos.filter((p) => p.kind === kind).map((p) => ({ id: p.id, url: p.url, caption: p.caption }));
  const onSite = bike.visible && (bike.status === 'available' || bike.status === 'reserved');

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/stock" className="adm-back">
            ← Stock
          </Link>
          <h1>
            {bike.year} {bike.make} {bike.model}
          </h1>
          <p className="adm-muted">
            <span className={`adm-pill s-${bike.status}`}>{statusLabel[bike.status]}</span>{' '}
            {onSite ? (
              <>
                Live on the website ·{' '}
                <a href={`/used-bikes/${bike.slug}`} target="_blank" rel="noopener" className="adm-link">
                  View bike page ↗
                </a>
              </>
            ) : (
              'Not on the website. Set status to Available and tick "Show on website" to publish.'
            )}
          </p>
        </div>
      </header>
      {created && <p className="adm-notice">Bike created. Now add photos below, then set the status to Available when it&apos;s ready to go live.</p>}

      <div className="adm-edit">
        <div className="adm-edit-main">
          <PhotoManager bikeId={bike.id} kind="main" photos={photos('main')} />
          <PhotoManager bikeId={bike.id} kind="detail" photos={photos('detail')} />
          <PhotoManager bikeId={bike.id} kind="receipt" photos={photos('receipt')} />
          <BikeForm mode="edit" values={values} />
        </div>
        <aside className="adm-edit-side">
          <BikeMoneyPanels
            bikeId={bike.id}
            pricePence={bike.price}
            status={bike.status}
            acquisition={
              bike.acquisition
                ? {
                    source: bike.acquisition.source,
                    purchasePrice: bike.acquisition.purchasePrice,
                    purchasedAt: ymd(bike.acquisition.purchasedAt) ?? '',
                    sellerName: bike.acquisition.sellerName,
                    vatType: bike.acquisition.vatType,
                    notes: bike.acquisition.notes,
                  }
                : null
            }
            costs={bike.costs.map((c) => ({ id: c.id, category: c.category, amount: c.amount, note: c.note, incurredAt: ymd(c.incurredAt) ?? '' }))}
            sold={{
              soldPrice: bike.soldPrice,
              soldAt: ymd(bike.soldAt),
              buyer: bike.buyer ? [bike.buyer.firstName, bike.buyer.lastName].filter(Boolean).join(' ') : null,
            }}
          />
        </aside>
      </div>
    </>
  );
}
