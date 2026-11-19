import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { HowItWorks } from '@/components/checkout/HowItWorks';
import { Icon } from '@/components/ui/Icon';
import { bikeName } from '@/lib/bikes';
import { money } from '@/lib/orders';
import { getUser } from '@/server/auth';
import { getPublicBike } from '@/server/services/bikes';
import { customerForUser } from '@/server/services/customers';
import { getSetting } from '@/server/services/pricing';

export const metadata: Metadata = {
  title: 'Reserve your bike',
  description: 'Reserve your bike online for £99. Choose collection or UK delivery and pay securely.',
  robots: { index: false },
};

export default async function ReservePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bike = await getPublicBike(slug);
  if (!bike) notFound();
  const user = await getUser();
  const deposit = await getSetting<number>('reservation.depositPence', 9900);
  const name = bikeName(bike);
  const here = `/used-bikes/${slug}/reserve`;

  return (
    <section className="sec" style={{ paddingTop: 30 }}>
      <div className="wrap">
        <div className="crumbs" style={{ color: 'var(--mut)' }}>
          <Link href="/">Home</Link>
          <span className="s">/</span>
          <Link href={`/used-bikes/${slug}`}>
            {bike.make} {bike.model}
          </Link>
          <span className="s">/</span>
          <span>Reserve</span>
        </div>
        <h1 className="disp" style={{ fontSize: 64, marginBottom: 22 }}>
          Reserve <span style={{ color: 'var(--red)' }}>your bike</span>
        </h1>
        <div className="csteps">
          <div className="d">
            <b>01</b>Your bike
          </div>
          <div className="n">
            <b>02</b>Details &amp; delivery
          </div>
          <div>
            <b>03</b>Pay deposit
          </div>
          <div>
            <b>04</b>Track your bike
          </div>
        </div>
        <div className="howwrap">
          <HowItWorks />
        </div>

        {bike.status === 'reserved' ? (
          <div className="formcard">
            <h2>This bike has just been reserved</h2>
            <p>Someone has put a deposit down on the {name}. Set a stock alert or call us and we will find you something similar.</p>
            <Link href="/used-bikes" className="btn btn-red mt2">
              See other bikes <Icon name="right" />
            </Link>
          </div>
        ) : !user ? (
          <div className="split">
            <div className="formcard">
              <h2>Sign in to reserve</h2>
              <p>
                You need a GearUp account to reserve. It is where you follow your bike&apos;s PDI, pay the balance and keep your documents. It takes a
                minute.
              </p>
              <div className="inline-btns mt2">
                <Link href={`/login?register=1&next=${encodeURIComponent(here)}`} className="btn btn-red">
                  Create an account <Icon name="right" />
                </Link>
                <Link href={`/login?next=${encodeURIComponent(here)}`} className="btn btn-ink">
                  I already have one
                </Link>
              </div>
            </div>
            <aside className="stick">
              <div className="summary">
                <div className="sb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bike.image} alt="" />
                  <div>
                    <small>
                      {bike.year} · {bike.mileage.toLocaleString('en-GB')} miles
                    </small>
                    <b>
                      {bike.make} {bike.model}
                    </b>
                  </div>
                </div>
                <dl>
                  <dt>Cash price</dt>
                  <dd>{money(bike.price * 100)}</dd>
                  <dt className="tot">Deposit today</dt>
                  <dd>{money(deposit)}</dd>
                </dl>
              </div>
            </aside>
          </div>
        ) : (
          await (async () => {
            const c = await customerForUser(user);
            return (
              <CheckoutForm
                deposit={deposit}
                bike={{
                  slug,
                  name,
                  model: bike.model,
                  image: bike.image,
                  year: bike.year,
                  mileage: bike.mileage,
                  price: bike.price * 100,
                  warranty: bike.badge?.kind === 'warranty' ? `${bike.badge.months} months free` : '30 days included',
                }}
                me={{
                  firstName: c.firstName === 'Website visitor' ? '' : c.firstName,
                  lastName: c.lastName ?? '',
                  email: user.email,
                  phone: c.phone ?? '',
                  address: [c.addressLine1, c.town].filter(Boolean).join(', '),
                  postcode: c.postcode ?? '',
                }}
              />
            );
          })()
        )}
      </div>
    </section>
  );
}
