import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AuthCard } from '@/components/account/AuthForms';
import { Icon } from '@/components/ui/Icon';
import { getUser } from '@/server/auth';

export const metadata: Metadata = {
  title: 'Sign in · My account',
  description: 'Sign in to your GearUp account to see your reservation, orders and saved bikes.',
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; register?: string }> }) {
  const { next, register } = await searchParams;
  if (await getUser()) redirect(next?.startsWith('/') ? next : '/account');

  return (
    <>
      <section className="phero slim short">
        <div className="slab" aria-hidden="true"></div>
        <div className="wrap">
          <div>
            <div className="crumbs">
              <Link href="/">Home</Link>
              <span className="s">/</span>
              <span>Sign in</span>
            </div>
            <h1 className="disp">
              Sign <em>in</em>
            </h1>
          </div>
        </div>
      </section>

      <section className="sec paper" style={{ paddingTop: 34 }}>
        <div className="wrap">
          <div className="alow">
            <AuthCard next={next} initial={register ? 'register' : 'signin'} />
            <div className="icard dk" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="ic red">
                <Icon name="info" />
              </span>
              <h3>Reserving a bike?</h3>
              <p>
                Create an account when you reserve for £99. Use it to see your reservation, orders and saved bikes in one place.
              </p>
              <Link href="/used-bikes" className="btn btn-red mt2" style={{ alignSelf: 'flex-start' }}>
                Find a bike <Icon name="right" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
