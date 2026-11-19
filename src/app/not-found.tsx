import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { IconSprite } from '@/components/ui/IconSprite';

export default function NotFound() {
  return (
    <>
      <IconSprite />
      <Header />
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
      <Footer />
    </>
  );
}
