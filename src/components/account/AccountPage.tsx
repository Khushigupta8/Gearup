import Link from 'next/link';
import { Suspense, type ReactNode } from 'react';
import { AccountNav } from '@/components/layout/AccountNav';
import { customerNumber, getAccount } from '@/server/account';
import { AccountSignOut } from './AccountSignOut';
import { ClearBasket } from './ClearBasket';

/** Hero + side menu frame shared by every /account page. */
export async function AccountPage({ crumb, title, em, children }: { crumb: string; title: string; em: string; children: ReactNode }) {
  const { customer, savedCount } = await getAccount();
  return (
    <>
      <Suspense>
        <ClearBasket />
      </Suspense>
      <section className="phero slim short">
        <div className="slab" aria-hidden="true"></div>
        <div className="wrap">
          <div>
            <div className="crumbs">
              <Link href="/">Home</Link>
              <span className="s">/</span>
              <Link href="/account">My account</Link>
              <span className="s">/</span>
              <span>{crumb}</span>
            </div>
            <h1 className="disp">
              {title} <em>{em}</em>
            </h1>
          </div>
          <div className="hi">
            <span>
              Signed in as <b>{customer.firstName}</b>
            </span>
            <span>
              Not you?{' '}
              <AccountSignOut style={{ color: '#fff', textDecoration: 'underline', textUnderlineOffset: 3 }}>Log out</AccountSignOut>
            </span>
          </div>
        </div>
      </section>
      <section className="sec paper" style={{ paddingTop: 34 }}>
        <div className="wrap acct">
          <AccountNav name={customer.firstName} customerNo={customerNumber(customer.id)} savedCount={savedCount} />
          <div className="apage">{children}</div>
        </div>
      </section>
    </>
  );
}
