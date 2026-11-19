import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { getUser } from '@/server/auth';
import { customerForUser } from '@/server/services/customers';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

/** Kit-only checkout (bike reservations go through the bike's reserve page). */
export default async function CheckoutPage() {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent('/checkout')}`);
  const c = await customerForUser(user);
  return (
    <section className="sec" style={{ paddingTop: 30 }}>
      <div className="wrap">
        <div className="crumbs" style={{ color: 'var(--mut)' }}>
          <Link href="/">Home</Link>
          <span className="s">/</span>
          <Link href="/basket">Basket</Link>
          <span className="s">/</span>
          <span>Checkout</span>
        </div>
        <h1 className="disp" style={{ fontSize: 64, marginBottom: 22 }}>
          Check<span style={{ color: 'var(--red)' }}>out</span>
        </h1>
        <CheckoutForm
          deposit={0}
          me={{
            firstName: c.firstName === 'Website visitor' ? '' : c.firstName,
            lastName: c.lastName ?? '',
            email: user.email,
            phone: c.phone ?? '',
            address: [c.addressLine1, c.town].filter(Boolean).join(', '),
            postcode: c.postcode ?? '',
          }}
        />
      </div>
    </section>
  );
}
