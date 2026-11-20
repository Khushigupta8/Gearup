import type { Metadata } from 'next';
import { pageMetadata } from '@/server/services/cms';
import { FaqList } from '@/components/cms/FaqList';
import Link from 'next/link';
import { FaqSearch } from '@/components/info/FaqSearch';
import { Icon } from '@/components/ui/Icon';
import { getFaqs } from '@/server/services/cms';
import '@/styles/pages/faq.css';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/faq', {
  title: 'Help and FAQs',
  description: 'Answers on reserving a bike, finance, part-exchange, delivery, your account, warranty, the workshop and accessories orders.',
});
}

export default async function FaqPage() {
  const groups = ['buying', 'finance', 'px', 'delivery', 'account', 'warranty', 'workshop', 'accessories'] as const;
  const counts = Object.fromEntries(await Promise.all(groups.map(async (g) => [g, (await getFaqs(`faq-${g}`)).length] as const))) as Record<(typeof groups)[number], number>;
  return (
    <div className="pg-faq" style={{ display: 'contents' }}>


<section className="phero">
<div className="slab" aria-hidden="true"></div>
<div className="wrap" style={{ alignItems: 'center' }}>
<div>
<div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Help and FAQs</span></div>
<h1 className="disp">Questions <em>answered</em></h1>
<p className="lede">Buying, finance, delivery, warranty and the workshop. Straight answers, no small print games.</p>
<FaqSearch />
<div className="fpop"><span>Popular:</span><a href="#buying">Reserving for £99</a><a href="#delivery">Delivery</a><a href="#warranty">Warranty</a></div>
</div>
<div className="fcats">
<a href="#buying"><Icon name="card" />Buying</a>
<a href="#finance"><Icon name="tag" />Finance</a>
<a href="#px"><Icon name="key" />Part-exchange</a>
<a href="#delivery"><Icon name="truck" />Delivery</a>
<a href="#account"><Icon name="user" />My account</a>
<a href="#warranty"><Icon name="shield" />Warranty</a>
<a href="#workshop"><Icon name="wrench" />Workshop</a>
<a href="#accessories"><Icon name="bag" />Accessories</a>
</div>
</div>
</section>
<section className="sec" style={{ paddingTop: '56px' }}>
<div className="wrap fhub">
<nav className="faqnav" aria-label="FAQ categories">
<div className="h4">Categories</div>
<a href="#buying" className="on">Buying &amp; reserving<i>{counts.buying}</i></a>
<a href="#finance">Finance<i>{counts.finance}</i></a>
<a href="#px">Part-ex &amp; selling<i>{counts.px}</i></a>
<a href="#delivery">Delivery &amp; collection<i>{counts.delivery}</i></a>
<a href="#account">My account<i>{counts.account}</i></a>
<a href="#warranty">Warranty &amp; returns<i>{counts.warranty}</i></a>
<a href="#workshop">Workshop<i>{counts.workshop}</i></a>
<a href="#accessories">Accessories orders<i>{counts.accessories}</i></a>
<div className="stuck"><b>Still stuck?</b><p>Talk to a real person. Monday to Saturday.</p><Link href="/contact" className="btn btn-red">Contact us</Link></div>
</nav>
<div>
<div className="fgrp" id="buying">
<div className="gh"><span className="ic"><Icon name="card" /></span><h2>Buying &amp; reserving</h2><Link href="/used-bikes" className="lnk">Browse bikes <Icon name="right" /></Link></div>
<FaqList section="faq-buying" openFirst />
</div>
<div className="fgrp" id="finance">
<div className="gh"><span className="ic"><Icon name="tag" /></span><h2>Finance</h2><Link href="/finance" className="lnk">Finance options <Icon name="right" /></Link></div>
<FaqList section="faq-finance" />
</div>
<div className="fgrp" id="px">
<div className="gh"><span className="ic"><Icon name="key" /></span><h2>Part-exchange &amp; selling</h2><Link href="/part-exchange" className="lnk">Value my bike <Icon name="right" /></Link></div>
<FaqList section="faq-px" />
</div>
<div className="fgrp" id="delivery">
<div className="gh"><span className="ic"><Icon name="truck" /></span><h2>Delivery &amp; collection</h2><Link href="/contact" className="lnk">Ask for a price <Icon name="right" /></Link></div>
<FaqList section="faq-delivery" />
</div>
<div className="fgrp" id="account">
<div className="gh"><span className="ic"><Icon name="user" /></span><h2>My account</h2><Link href="/account" className="lnk">My account <Icon name="right" /></Link></div>
<FaqList section="faq-account" />
</div>
<div className="fgrp" id="warranty">
<div className="gh"><span className="ic"><Icon name="shield" /></span><h2>Warranty &amp; returns</h2><Link href="/warranty" className="lnk">Warranty details <Icon name="right" /></Link></div>
<FaqList section="faq-warranty" />
</div>
<div className="fgrp" id="workshop">
<div className="gh"><span className="ic"><Icon name="wrench" /></span><h2>Workshop</h2><Link href="/workshop" className="lnk">Book a service <Icon name="right" /></Link></div>
<FaqList section="faq-workshop" />
</div>
<div className="fgrp" id="accessories">
<div className="gh"><span className="ic"><Icon name="bag" /></span><h2>Accessories orders</h2><Link href="/accessories" className="lnk">Shop accessories <Icon name="right" /></Link></div>
<FaqList section="faq-accessories" />
</div>
</div>
</div>
</section>
<section className="sec paper">
<div className="wrap">
<div className="sh"><div><span className="tag">Contact</span><h2 className="disp">Can&apos;t find <em>your answer?</em></h2><p>Talk to a real person at the showroom. Quote your order number if you have one.</p></div><Link href="/contact" className="btn btn-red">Contact page <Icon name="right" /></Link></div>
<div className="cblocks">
<Link href="/contact" className="cblock"><span className="ic"><Icon name="phone" /></span><div><b>Call us</b><span>0744 072 1478</span><span>Monday to Saturday, see hours below</span></div></Link>
<Link href="/contact" className="cblock"><span className="ic"><Icon name="chat" /></span><div><b>WhatsApp</b><span>Message us any time</span><span>We reply in opening hours</span></div></Link>
<Link href="/contact" className="cblock"><span className="ic"><Icon name="mail" /></span><div><b>Email</b><span>sales@gearupmotorcycles.co.uk</span><span>For orders, quote GU-number</span></div></Link>
</div>
</div>
</section>

    </div>
  );
}
