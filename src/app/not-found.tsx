import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { IconSprite } from '@/components/ui/IconSprite';
import { defaultBusiness } from '@/lib/cms';

export default function NotFound() {
  return (
    <>
      <IconSprite />
      {/* The global error page must also render when the database is unavailable. */}
      <Header business={defaultBusiness} />
      <main>
        <section className="sec">
          <div className="wrap">
            <h1>Page not found</h1>
            <p>
              The page you were looking for has moved or no longer exists. <Link href="/used-bikes">Browse our motorbikes</Link> or{' '}
              <Link href="/contact">get in touch</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer business={defaultBusiness} />
    </>
  );
}
