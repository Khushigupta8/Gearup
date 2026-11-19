import type { Metadata } from 'next';
import Link from 'next/link';
import { BasketView } from '@/components/checkout/BasketView';
import { HowItWorks } from '@/components/checkout/HowItWorks';
import { Icon, type IconName } from '@/components/ui/Icon';

export const metadata: Metadata = {
  title: 'Your Basket',
  description: 'Your GearUp basket: bike reservation deposit and accessories in one checkout.',
  robots: { index: false },
};

const ship: [IconName, string, string, boolean][] = [
  ['truck', 'UK delivery', 'Tracked postage to any UK address, with the tracking number sent by text. £4.99, or free over £75.', true],
  ['home', 'Collect for free', 'Choose showroom collection at checkout. We will text you as soon as it is ready to pick up.', false],
  ['left', 'Easy returns', 'Changed your mind? Send unused kit back in its original packaging within 14 days for a refund.', false],
  ['users', 'Sizing help', 'Not sure on helmet or boot size? Pop in for a fitting, or WhatsApp us your measurements first.', false],
];

export default function BasketPage() {
  return (
    <section className="sec" style={{ paddingTop: 30 }}>
      <div className="wrap">
        <div className="crumbs" style={{ color: 'var(--mut)' }}>
          <Link href="/">Home</Link>
          <span className="s">/</span>
          <span>Basket</span>
        </div>
        <h1 className="disp" style={{ fontSize: 64, marginBottom: 22 }}>
          Your <span style={{ color: 'var(--red)' }}>basket</span>
        </h1>
        <BasketView>
          <div className="formcard bk-sec bk-ship">
            <div className="sh">
              <div>
                <span className="tag">Delivery &amp; returns</span>
                <h2 className="disp">
                  Post it <em>or collect it</em>
                </h2>
                <p>Order online and we post it out. Or collect from the showroom, and try it on before you go.</p>
              </div>
            </div>
            <div className="shipcards">
              {ship.map(([icon, title, text, red]) => (
                <div key={title} className="icard">
                  <div className={red ? 'ic red' : 'ic'}>
                    <Icon name={icon} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <div className="notice mt2">
              <Icon name="info" />
              <span>Buying a bike from us? We can send your kit out on the same van as your bike, so it all arrives together.</span>
            </div>
          </div>
          <div className="formcard bk-sec">
            <h2>Before you pay</h2>
            <HowItWorks history={false} />
          </div>
        </BasketView>
      </div>
    </section>
  );
}
