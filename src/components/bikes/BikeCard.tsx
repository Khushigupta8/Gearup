import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { bikeName } from '@/data/bikes';
import { gbp, monthlyPayment } from '@/lib/format';
import type { Bike } from '@/types';

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

/** Stock card used on the home page, the listing and "similar bikes". `big` adds highlights and two buttons. */
export function BikeCard({ bike, big = false }: { bike: Bike; big?: boolean }) {
  const href = bikeHref(bike);
  const reserved = bike.status === 'reserved';

  return (
    <article className={big ? 'bc big' : 'bc'}>
      <Link href={href} className={reserved ? 'im res' : 'im'}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bike.image} alt={bikeName(bike)} loading="lazy" />
        <BikeBadge bike={bike} />
        <span className="pricechip">
          {bike.wasPrice && <s>{gbp(bike.wasPrice)}</s>}
          <b>{gbp(bike.price)}</b>
          <span>{gbp(Math.round(monthlyPayment(bike.price, 48)))}/mo</span>
        </span>
      </Link>
      <div className="bd">
        <h3>
          <small>{bike.make}</small>
          <Link href={href}>{bike.model}</Link>
        </h3>
        <div className="sp">
          <span>
            <Icon name="cal" />
            {bike.year}
          </span>
          <span>
            <Icon name="gauge" />
            {bike.mileage.toLocaleString('en-GB')} miles
          </span>
          <span>
            <Icon name="engine" />
            {bike.engineCc}cc
          </span>
        </div>
        {big ? (
          <>
            {bike.highlights && (
              <ul className="hl">
                {bike.highlights.map((h) => (
                  <li key={h}>
                    <Icon name="check" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="two">
              <Link href={`${href}/reserve`} className="btn btn-red">
                Reserve for £99
              </Link>
              <Link href={href} className="btn btn-ink">
                View bike
              </Link>
            </div>
          </>
        ) : (
          <div className="ft">
            {reserved ? (
              <Link href={href} className="lnk">
                Notify me if it returns <Icon name="right" />
              </Link>
            ) : (
              <Link href={`${href}/reserve`} className="lnk">
                Reserve for £99 <Icon name="right" />
              </Link>
            )}
            <span className="heart">
              <Icon name="heart" />
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
