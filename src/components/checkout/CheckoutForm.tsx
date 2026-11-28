'use client';

/* eslint-disable @next/next/no-img-element -- photos sized by the site CSS */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { beginCheckout } from '@/app/(site)/checkout/actions';
import { Icon } from '@/components/ui/Icon';
import { basket } from '@/lib/basket';
import { monthlyPayment } from '@/lib/format';
import { money } from '@/lib/orders';
import { useBasketQuote } from './useBasketQuote';

export type CheckoutBike = {
  slug: string;
  name: string;
  model: string;
  image: string;
  year: number;
  mileage: number;
  price: number; // pence
  warranty: string | null;
};

type Me = { firstName: string; lastName: string; email: string; phone: string; address: string; postcode: string };

export function CheckoutForm({ bike, me, deposit }: { bike?: CheckoutBike; me: Me; deposit: number }) {
  const pathname = usePathname();
  const [fulfilment, setFulfilment] = useState<'collection' | 'delivery'>(bike ? 'collection' : 'delivery');
  const [balance, setBalance] = useState<'finance' | 'bank_transfer' | 'part_exchange'>('finance');
  const { quote, basket: b, error: quoteError, retry } = useBasketQuote(Boolean(bike), fulfilment);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const kit = quote ? quote.itemsTotal - (quote.discount?.amount ?? 0) : 0;
  const dueToday = (bike ? deposit : 0) + kit + (quote?.postage ?? 0);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
    const res = await beginCheckout({
      bikeSlug: bike?.slug,
      lines: b.lines,
      code: quote?.discount ? b.code : undefined,
      fulfilment,
      firstName: String(f.get('firstName') ?? ''),
      lastName: String(f.get('lastName') ?? ''),
      phone: String(f.get('phone') ?? ''),
      deliveryPostcode: String(f.get('postcode') ?? '') || undefined,
      deliveryAddress: String(f.get('address') ?? '') || undefined,
      balanceMethod: bike ? balance : undefined,
      partExReg: String(f.get('px') ?? '') || undefined,
      terms: f.get('terms') === 'on',
      cancelPath: pathname,
    });
    if ('url' in res) {
      window.location.href = res.url;
      return;
    }
    setError(res.error);
    } catch { setError('Payment could not be started. Please try again.'); }
    finally { setBusy(false); }
  }

  return (
    <div className="split">
      <form className="form" onSubmit={submit}>
        {quoteError && <div className="formcard" role="alert"><p>{quoteError}</p><button type="button" className="btn btn-ink" onClick={retry}>Try again</button></div>}
        <div className="formcard">
          <h2>Your details</h2>
          <p>
            Signed in as <b>{me.email}</b>.
          </p>
          <div className="form mt2">
            <div className="frow">
              <div className="fl">
                <label htmlFor="fn">First name</label>
                <input id="fn" name="firstName" defaultValue={me.firstName} required autoComplete="given-name" />
              </div>
              <div className="fl">
                <label htmlFor="ln">Last name</label>
                <input id="ln" name="lastName" defaultValue={me.lastName} placeholder="Last name" autoComplete="family-name" />
              </div>
            </div>
            <div className="fl">
              <label htmlFor="mb">Mobile</label>
              <input id="mb" name="phone" defaultValue={me.phone} placeholder="07..." required autoComplete="tel" />
              <small>We will text your order updates here.</small>
            </div>
          </div>
        </div>

        <div className="formcard">
          <h2>{bike ? 'How do you want your bike?' : 'Post or collect?'}</h2>
          <div className="radios mt2">
            <label className={`rcard${fulfilment === 'collection' ? ' on' : ''}`}>
              <input type="radio" name="ful" checked={fulfilment === 'collection'} onChange={() => setFulfilment('collection')} />
              <span className="dot"></span>
              <span>
                <b>Collect from showroom</b>
                <small>Free. We will call to book a time.</small>
              </span>
            </label>
            <label className={`rcard${fulfilment === 'delivery' ? ' on' : ''}`}>
              <input type="radio" name="ful" checked={fulfilment === 'delivery'} onChange={() => setFulfilment('delivery')} />
              <span className="dot"></span>
              <span>
                <b>{bike ? 'Deliver to my door' : 'Post it to me'}</b>
                <small>{bike ? 'Nationwide. We confirm the price per mile with you.' : 'Tracked UK postage, free over £75.'}</small>
              </span>
            </label>
          </div>
          {fulfilment === 'delivery' && (
            <div className="mt2">
              <div className="frow">
                <div className="fl">
                  <label htmlFor="pc">{bike ? 'Delivery postcode' : 'Postcode'}</label>
                  <input id="pc" name="postcode" defaultValue={me.postcode} placeholder="e.g. M1 1AA" style={{ textTransform: 'uppercase' }} required autoComplete="postal-code" />
                </div>
                <div className="fl">
                  <label htmlFor="ad">Address</label>
                  <input id="ad" name="address" defaultValue={me.address} placeholder="House number and street, town" required autoComplete="street-address" />
                </div>
              </div>
              {bike && <p className="qout">We will call you with the delivery price (per mile from our showroom) before booking. It is paid with the balance.</p>}
            </div>
          )}
        </div>

        {bike && (
          <div className="formcard">
            <h2>Paying for the rest</h2>
            <p>Choose how you plan to pay the balance. You can change your mind before collection or delivery.</p>
            <div className="radios mt2">
              {(
                [
                  ['finance', 'Finance', `From ${money(Math.round(monthlyPayment(bike.price / 100, 48) * 100))}/month`],
                  ['bank_transfer', 'Bank transfer', 'Before collection or delivery'],
                  ['part_exchange', 'Part-exchange', 'Plus finance or transfer'],
                ] as const
              ).map(([v, t, s]) => (
                <label key={v} className={`rcard${balance === v ? ' on' : ''}`}>
                  <input type="radio" name="pay" checked={balance === v} onChange={() => setBalance(v)} />
                  <span className="dot"></span>
                  <span>
                    <b>{t}</b>
                    <small>{s}</small>
                  </span>
                </label>
              ))}
            </div>
            <div className="fl mt2">
              <label htmlFor="px">Part-exchange registration (optional)</label>
              <div className="plate" style={{ height: 56, border: '2px solid #d8b200' }}>
                <span>
                  <i></i>UK
                </span>
                <input id="px" name="px" placeholder="AB12 CDE" maxLength={8} />
              </div>
            </div>
          </div>
        )}

        <div className="formcard">
          <h2>
            Pay today: {bike ? `${money(deposit)} deposit` : 'your kit'}
            {bike && kit > 0 ? ' + kit' : ''}
          </h2>
          <div className="form mt2">
            <label className="chk">
              <input type="checkbox" name="terms" required />
              <span>
                {bike
                  ? 'I agree to the reservation terms. My deposit comes off the price of the bike and is refundable if the bike fails its pre-sale checks. '
                  : 'I agree to the terms of sale. Unused kit can be returned within 14 days. '}
                See the{' '}
                <Link href="/legal/terms" target="_blank">
                  terms of sale
                </Link>{' '}
                and{' '}
                <Link href="/legal/returns" target="_blank">
                  returns policy
                </Link>
                .
              </span>
            </label>
            {quote?.lines.some((line) => !line.inStock) && <p role="alert">Some items exceed available stock. <Link href="/basket">Update your basket</Link> before paying.</p>}
            {error && (
              <p className="formerr" role="alert">
                {error}
              </p>
            )}
            <button className="btn btn-red" type="submit" disabled={busy || !quote || quote.lines.some((line) => !line.inStock)}>
              <Icon name="lock" />
              {busy ? 'Taking you to secure payment…' : bike ? `Pay ${money(dueToday)} and reserve my bike` : `Pay ${money(dueToday)}`}
            </button>
            <div className="secure">
              <Icon name="lock" />
              Card details are entered on Stripe&apos;s secure page. Paid straight to GearUp.
            </div>
          </div>
        </div>
      </form>

      <aside className="stick">
        <div className="summary">
          {bike ? (
            <div className="sb">
              <img src={bike.image} alt="" />
              <div>
                <small>
                  {bike.year} · {bike.mileage.toLocaleString('en-GB')} miles
                </small>
                <b>{bike.name.replace(/^\d{4} /, '')}</b>
              </div>
            </div>
          ) : (
            <h3 className="disp" style={{ fontSize: 30 }}>
              Order summary
            </h3>
          )}
          <dl>
            {bike && (
              <>
                <dt>Cash price</dt>
                <dd>{money(bike.price)}</dd>
                {bike.warranty && (
                  <>
                    <dt>Warranty</dt>
                    <dd>{bike.warranty}</dd>
                  </>
                )}
                <dt>Reservation deposit</dt>
                <dd>{money(deposit)}</dd>
              </>
            )}
            {quote && quote.lines.length > 0 && (
              <>
                <dt>Kit from your basket ({quote.lines.reduce((n, l) => n + l.qty, 0)})</dt>
                <dd>{money(quote.itemsTotal)}</dd>
              </>
            )}
            {quote?.discount && (
              <>
                <dt>{quote.discount.label}</dt>
                <dd style={{ color: '#ff6b70' }}>−{money(quote.discount.amount)}</dd>
              </>
            )}
            {!bike && (
              <>
                <dt>Postage</dt>
                <dd>{quote?.postage ? money(quote.postage) : 'Free'}</dd>
              </>
            )}
            <dt className="tot">Due today</dt>
            <dd>{quote ? money(dueToday) : '…'}</dd>
          </dl>
          {bike && (
            <p className="note">
              <b style={{ color: '#fff' }}>Balance due on collection or delivery: {money(bike.price - deposit)}</b> less any part-exchange.{' '}
              <Link href="/basket" style={{ textDecoration: 'underline' }}>
                {quote?.lines.length ? 'Edit basket' : 'Add kit'}
              </Link>
              . The bike comes off sale as soon as you pay.
            </p>
          )}
          {!bike && quote && quote.lines.length === 0 && (
            <p className="note">
              Your basket is empty. <Link href="/accessories">Shop kit</Link>
            </p>
          )}
        </div>
        <div className="icard mt1">
          <div className="h4" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Icon name="pin" />
            What happens next
          </div>
          <ul className="clist mt1" style={{ fontSize: 15 }}>
            {bike ? (
              <>
                <li>
                  <Icon name="check" />
                  We confirm by text within the hour
                </li>
                <li>
                  <Icon name="check" />
                  Full PDI and 120-point check before handover
                </li>
                <li>
                  <Icon name="check" />
                  Collect it, or we deliver it nationwide
                </li>
              </>
            ) : (
              <>
                <li>
                  <Icon name="check" />
                  We pack your kit the same or next working day
                </li>
                <li>
                  <Icon name="check" />
                  Tracking number by text when it is posted
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>
      {/* keeps the discount code in sync if the customer removes all kit */}
      {quote && quote.lines.length === 0 && b.code && <ResetCode />}
    </div>
  );
}

function ResetCode() {
  useEffect(() => basket.setCode(undefined), []);
  return null;
}
