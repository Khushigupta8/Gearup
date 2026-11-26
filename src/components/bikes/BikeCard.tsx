import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { bikeName } from '@/lib/bikes';
import { gbp, monthlyPayment } from '@/lib/format';
import type { Bike } from '@/types';
import { SaveButton } from './SaveButton';
import { transmissionLabel } from '@/lib/bike-display';

export function bikeHref(bike: Bike) {
  return `/used-bikes/${bike.slug}`;
}

export function BikeBadge({ bike }: { bike: Bike }) {
  if (bike.status === 'reserved') {
    return (
      <span className="resb">
        <span>Reserved</span>
      </span>
    );
  }
  if (!bike.badge) return null;
  if (bike.badge.kind === 'warranty') {
    return (
      <span className="ribbon">
        {bike.badge.months} months
        <br />
        warranty free
      </span>
    );
  }
  return <span className={bike.badge.red ? 'flag red' : 'flag'}>{bike.badge.text}</span>;
}

/** Shared stock card; `big` adds highlights and `list` uses the catalogue's horizontal layout. */
export function BikeCard({ bike, big = false, list = false }: { bike: Bike; big?: boolean; list?: boolean }) {
  const href = bikeHref(bike);
  const reserved = bike.status === 'reserved';
  const specRows = [
    [String(bike.year), `${bike.mileage.toLocaleString('en-GB')} miles`, `${bike.engineCc} cc`],
    [transmissionLabel(bike.gearbox), bike.colour, bike.fuel].filter((value): value is string => Boolean(value)),
  ];

  return (
    <article className={`bc${big ? ' big' : ''}${list ? ' bc-list' : ''}`}>
      <Link href={href} className={reserved ? 'im res' : 'im'}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bike.image} alt={bikeName(bike)} loading="lazy" />
        <BikeBadge bike={bike} />
      </Link>
      <div className="bd">
        <div className="bike-card-heading">
          <h3>
            <small>{bike.make}</small>
            <Link href={href}>{bike.model}</Link>
          </h3>
          <SaveButton slug={bike.slug} />
        </div>
        <div className="bike-card-specs" role="group" aria-label="Bike specifications">
          {specRows.map((row, index) => row.length > 0 && <ul key={index}>{row.map((spec, i) => <li key={i}>{spec}</li>)}</ul>)}
          {(bike.showroomLocation || bike.deliveryAvailable) && <ul>
            {bike.showroomLocation && <li><Icon name="pin" />{bike.showroomLocation}</li>}
            {bike.deliveryAvailable && <li><Icon name="truck" />Delivery Available</li>}
          </ul>}
        </div>
        {big && bike.highlights && (
          <ul className="hl">
            {bike.highlights.map((highlight) => <li key={highlight}><Icon name="check" />{highlight}</li>)}
          </ul>
        )}
        <div className="bike-card-prices">
          <div className="bike-card-cash">
            {bike.wasPrice && bike.wasPrice > bike.price && <s>{gbp(bike.wasPrice)}</s>}
            <strong>{gbp(bike.price)}</strong>
            <small>Cash Price</small>
          </div>
          <div className="bike-card-monthly" title="Example over 48 months, £0 deposit, 19.9% APR representative. Subject to status and affordability.">
            <strong>{gbp(monthlyPayment(bike.price, 48), 2)}</strong>
            <small>p/m* on finance</small>
          </div>
        </div>
        <div className="bike-card-actions">
          {reserved ? (
            <Link href={href} className="btn btn-ink">View reserved bike <Icon name="right" /></Link>
          ) : (
            <>
              <Link href={`/finance?bike=${encodeURIComponent(bike.slug)}#apply`} className="btn btn-red">Apply for finance</Link>
              <Link href={`${href}/reserve`} className="btn btn-ink">Reserve for £99 <Icon name="right" /></Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
