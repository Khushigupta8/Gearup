import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { getBusiness, pageMetadata } from '@/server/services/cms';
import { telHref, waHref } from '@/lib/cms';
import '@/styles/pages/delivery.css';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/delivery', { title: 'Delivery and Collection', description: 'Arrange nationwide motorcycle delivery or collection from GearUp Motorcycles. Contact our team for a delivery quote and available dates.' });
}

export default async function DeliveryPage() {
  const business = await getBusiness();
  return <div className="pg-delivery">
    <section className="phero">
      <div className="slab" aria-hidden="true" />
      <div className="wrap delivery-intro">
        <div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Delivery</span></div>
        <h1 className="disp">Your bike.<br /><em>Delivered.</em></h1>
        <p className="lede">Nationwide delivery or collection from GearUp. Tell us which bike you want and where it needs to go, and we’ll confirm the arrangements with you.</p>
        <div className="ctas"><Link href="/contact#enquiry" className="btn btn-red">Request a delivery quote <Icon name="right" /></Link><a href={telHref(business.phone)} className="btn btn-ghost"><Icon name="phone" />Call Us</a></div>
      </div>
    </section>
    <section className="sec">
      <div className="wrap">
        <div className="delivery-options">
          <article><Icon name="truck" /><h2 className="disp">To your door</h2><p>Choose a bike from our current stock and send us your delivery postcode. Our team will confirm availability, the delivery price and a suitable date before you make arrangements.</p><Link href="/contact#enquiry" className="lnk">Ask about delivery <Icon name="right" /></Link></article>
          <article><Icon name="home" /><h2 className="disp">From our showroom</h2><p>Prefer to collect? Contact us to arrange a convenient handover time and confirm the bike is ready. We’ll let you know what to bring and answer any questions before your visit.</p><Link href="/contact" className="lnk">Arrange collection <Icon name="right" /></Link></article>
        </div>
      </div>
    </section>
    <section className="sec paper">
      <div className="wrap delivery-questions">
        <h2 className="disp">Before we <em>set off</em></h2>
        <div className="faq">
          <details><summary>How much will delivery cost?</summary><p>Send us the bike you are interested in and your postcode. We’ll confirm the price with you before delivery is arranged.</p></details>
          <details><summary>When can my bike be delivered?</summary><p>Contact the team to check the bike’s preparation status and available delivery dates. We’ll agree a date with you.</p></details>
          <details><summary>Can I arrange a part-exchange as well?</summary><p>Let us know about your current bike when you enquire. You can start with our <Link href="/part-exchange">part-exchange form</Link> so the team has its details.</p></details>
        </div>
        <a href={waHref(business.whatsapp)} className="btn btn-wa" target="_blank" rel="noopener"><Icon name="wa" />Ask us on WhatsApp</a>
      </div>
    </section>
  </div>;
}
