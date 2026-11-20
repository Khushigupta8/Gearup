import type { Metadata } from 'next';
import { FaqList } from '@/components/cms/FaqList';
import Link from 'next/link';
import { DeliveryQuote } from '@/components/forms/DeliveryQuote';
import { Icon } from '@/components/ui/Icon';
import '@/styles/pages/delivery.css';
import { redirect } from 'next/navigation';
import { PHASE2 } from '@/lib/features';

export const metadata: Metadata = {
  title: 'Delivery and Collection',
  description: 'Collect your bike from our showroom or have it delivered nationwide. Instant price per mile and live GPS tracking on delivery day.',
};

export default function DeliveryPage() {
  // Delivery calculator and live GPS tracking are Phase 2.
  if (!PHASE2) redirect('/contact');
  return (
    <div className="pg-delivery" style={{ display: 'contents' }}>


<section className="phero">
<div className="slab" aria-hidden="true"></div>
<div className="wrap">
<div>
<div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Delivery and collection</span></div>
<h1 className="disp">Collect it or <em>we deliver</em></h1>
<p className="lede">Pick your bike up from the showroom for free. Or we bring it to your door nationwide, priced per mile, and you follow the van live.</p>
<div className="ctas"><Link href="/used-bikes" className="btn btn-red">Find your bike <Icon name="right" /></Link><Link href="/account" className="btn btn-ghost"><Icon name="pin" />Track my bike</Link></div>
</div>
<div className="qbox" id="quote">
<h4>Delivery price, instantly</h4>
<p>Enter your postcode. We work out the road miles from our showroom and show you the price.</p>
<DeliveryQuote inputId="pc" />
</div>
</div>
</section>
<section className="sec">
<div className="wrap">
<div className="sh"><div><span className="tag">Your choice</span><h2 className="disp">Collect <em>or</em> deliver</h2><p>Same bike, same checks, same paperwork. Choose when you reserve, and change your mind any time before the bike is ready.</p></div></div>
<div className="dopts">
<div className="dopt">
<div className="dh"><h3><Icon name="home" />Collect</h3><span>Free</span></div>
<div className="db">
<p>Come to the showroom at a time we agree. Your bike is valeted, checked and waiting out front.</p>
<ul className="clist"><li><Icon name="check" />No charge</li><li><Icon name="check" />We call to book a time, Monday to Saturday</li><li><Icon name="check" />Full walk-round and handover by our team</li><li><Icon name="check" />Pick up new kit from the accessories shop while you are here</li></ul>
<Link href="/contact" className="btn btn-ink">Find the showroom <Icon name="right" /></Link>
</div>
</div>
<div className="dopt on">
<div className="dh"><h3><Icon name="truck" />Deliver</h3><span>Priced per mile</span></div>
<div className="db">
<p>We bring the bike to your door in our own van. You see the price before you pay and you follow the driver live on the day.</p>
<ul className="clist"><li><Icon name="check" />Nationwide delivery</li><li><Icon name="check" />Instant price by postcode, paid with your deposit</li><li><Icon name="check" />Live GPS tracking from the driver&apos;s phone</li><li><Icon name="check" />Same handover checklist at your door</li></ul>
<a href="#quote" className="btn btn-red">Get a delivery price <Icon name="right" /></a>
</div>
</div>
</div>
<table className="compare mt3">
<thead><tr><th>At a glance</th><th>Collect</th><th className="us">Deliver</th></tr></thead>
<tbody>
<tr><td>Cost</td><td>Free</td><td className="us">Per mile, shown upfront</td></tr>
<tr><td>Prep tracked in your account</td><td><Icon name="check" className="i y" /></td><td className="us"><Icon name="check" className="i y" /></td></tr>
<tr><td>Live GPS tracking on the day</td><td><Icon name="x" className="i n" /></td><td className="us"><Icon name="check" className="i y" /></td></tr>
<tr><td>Handover checklist and paperwork</td><td><Icon name="check" className="i y" /></td><td className="us"><Icon name="check" className="i y" /></td></tr>
<tr><td>14-day money back</td><td><Icon name="check" className="i y" /></td><td className="us"><Icon name="check" className="i y" /></td></tr>
</tbody>
</table>
</div>
</section>
<section className="sec paper" id="pricing">
<div className="wrap split">
<div>
<span className="sh" style={{ margin: 0 }}><span className="tag">Delivery pricing</span></span>
<h2 className="disp" style={{ fontSize: '64px', marginTop: '12px' }}>Priced <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>per mile</em></h2>
<p className="muted" style={{ fontSize: '17px', marginTop: '12px', maxWidth: '560px' }}>No zones and no surprises. The price depends on how far your door is from our showroom by road. You see it before you pay.</p>
<div className="rates">
<div><small>Rate per mile</small><b>£1.20</b><span className="samp">Sample</span></div>
<div><small>Minimum charge</small><b>£49</b><span className="samp">Sample</span></div>
<div><small>Coverage</small><b>UK</b><small style={{ textTransform: 'none', letterSpacing: 0, fontFamily: 'var(--sans)', fontWeight: 400 }}>Mainland only</small></div>
</div>
<ol className="how vsteps" style={{ gridTemplateColumns: '1fr', gap: '20px', marginTop: '30px' }}>
<li style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '18px', padding: 0 }}><span className="ic"><Icon name="pin" /></span><div><h4 style={{ marginTop: '4px' }}>We measure the road miles</h4><p>From our showroom to your postcode, by the route the van will drive.</p></div></li>
<li style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '18px', padding: 0 }}><span className="ic"><Icon name="tag" /></span><div><h4 style={{ marginTop: '4px' }}>Miles times the rate</h4><p>One rate per mile, with a minimum charge for short trips.</p></div></li>
<li style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: '18px', padding: 0 }}><span className="ic"><Icon name="card" /></span><div><h4 style={{ marginTop: '4px' }}>Pay it with your deposit</h4><p>Added at checkout next to your £99. Nothing else to pay on the day.</p></div></li>
</ol>
</div>
<div>
<table className="ptable">
<thead><tr><th>Distance by road</th><th>Delivery price</th></tr></thead>
<tbody>
<tr><td>Up to 40 miles<small>Minimum charge</small></td><td><b>£49</b></td></tr>
<tr><td>60 miles<small>e.g. a neighbouring county</small></td><td><b>£72</b></td></tr>
<tr><td>100 miles</td><td><b>£120</b></td></tr>
<tr><td>150 miles</td><td><b>£180</b></td></tr>
<tr><td>250 miles</td><td><b>£300</b></td></tr>
<tr><td>350 miles<small>e.g. the far end of the UK</small></td><td><b>£420</b></td></tr>
</tbody>
</table>
<div className="notice mt1"><Icon name="info" /><span><b>Sample rates for this mockup.</b> Your exact price comes from the postcode check above and is fixed once you pay.</span></div>
</div>
</div>
</section>
<section className="sec dark" id="tracking">
<div className="wrap grid2" style={{ alignItems: 'center' }}>
<div>
<span className="sh" style={{ margin: 0 }}><span className="tag">Live GPS tracking</span></span>
<h2 className="disp" style={{ fontSize: '68px', marginTop: '12px' }}>Follow <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>the van</em></h2>
<p style={{ color: '#b9b9c0', fontSize: '17px', marginTop: '12px', maxWidth: '520px' }}>No waiting in all day. On delivery day you see exactly where your bike is, straight from our driver&apos;s phone.</p>
<ol className="trkpts">
<li><span className="n">1</span><div><b>Link by text and in your account</b><p>When the driver sets off, a tracking link appears in your account and lands on your phone.</p></div></li>
<li><span className="n">2</span><div><b>Live position and arrival time</b><p>The van moves on the map as the driver moves. The arrival time updates with the traffic.</p></div></li>
<li><span className="n">3</span><div><b>Call the driver</b><p>Running late, or need to change where we park? Ring the driver from the tracking page.</p></div></li>
</ol>
<Link href="/account" className="btn btn-red mt3">See the tracking page <Icon name="right" /></Link>
</div>
<div className="map tall" role="img" aria-label="Preview of the live tracking map showing the delivery van on its route">
<svg className="m" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<rect width="800" height="450" fill="#e9eae4" />
<g fill="#dedfd7"><rect x="40" y="30" width="160" height="90" /><rect x="290" y="30" width="110" height="70" /><rect x="600" y="180" width="170" height="90" /><rect x="40" y="170" width="150" height="80" /><rect x="300" y="330" width="200" height="60" /><rect x="620" y="320" width="160" height="70" /></g>
<g fill="#d3e4c6"><rect x="440" y="20" width="90" height="80" rx="4" /><rect x="80" y="370" width="140" height="70" rx="4" /><circle cx="700" cy="60" r="36" /></g>
<path d="M-20 415 C 150 380 260 440 420 410 S 680 380 820 400" fill="none" stroke="#c6dbe9" strokeWidth="24" />
<g fill="none" strokeLinecap="round" strokeLinejoin="round">
<g stroke="#cfd0c7" strokeWidth="12"><path d="M250 -10 V460" /><path d="M560 -10 V460" /><path d="M-10 150 H810" /><path d="M-10 260 H260" /><path d="M380 -10 L420 200" /><path d="M560 300 H810" /><path d="M120 -10 V460" /><path d="M690 -10 V460" /></g>
<g stroke="#fff" strokeWidth="8"><path d="M250 -10 V460" /><path d="M560 -10 V460" /><path d="M-10 150 H810" /><path d="M-10 260 H260" /><path d="M380 -10 L420 200" /><path d="M560 300 H810" /><path d="M120 -10 V460" /><path d="M690 -10 V460" /></g>
<path d="M-10 330 L250 300 L430 220 L600 140 L810 110" stroke="#d9a93a" strokeWidth="17" />
<path d="M-10 330 L250 300 L430 220 L600 140 L810 110" stroke="#f3cf6a" strokeWidth="12" />
<path d="M250 262 L250 300 L430 220" stroke="#E1141B" strokeWidth="8" />
<path d="M430 220 L560 159 L560 112" stroke="#E1141B" strokeWidth="6" strokeDasharray="2 12" />
</g>
<g transform="translate(250 262)"><rect x="-14" y="-14" width="28" height="28" fill="#09090B" /><text y="5" textAnchor="middle" fontFamily="Arial" fontWeight="700" fontSize="12" fill="#fff">GU</text></g>
<g transform="translate(430 220)"><circle r="34" fill="#E1141B" opacity=".18" /><circle r="22" fill="#09090B" stroke="#fff" strokeWidth="4" /><path d="M-11 -5 h13 v10 h-13z M2 -2 h5 l4 4 v3 h-9z" fill="#fff" /><circle cx="-6" cy="7" r="2.6" fill="#E1141B" /><circle cx="6" cy="7" r="2.6" fill="#E1141B" /></g>
<g transform="translate(560 112)"><path d="M0 0 C-4 -12 -16 -20 -16 -32 A16 16 0 1 1 16 -32 C16 -20 4 -12 0 0Z" fill="#E1141B" stroke="#fff" strokeWidth="3" /><circle cy="-32" r="6" fill="#fff" /></g>
</svg>
<div className="eta"><small>Arriving in</small><b>34 min</b></div>
<span className="live">Live</span>
<div className="driver"><div><b>Dan, your GearUp driver</b><small>BMW R 1250 GS · 22 miles away</small></div><Link href="/contact" className="btn btn-red" style={{ height: '42px', padding: '0 18px', fontSize: '14px' }}><Icon name="phone" />Call driver</Link></div>
</div>
</div>
</section>
<section className="sec">
<div className="wrap">
<div className="sh"><div><span className="tag">Delivery day</span><h2 className="disp">What <em>happens</em> on the day</h2><p>Your bike is prepped before it leaves. The day itself is simple.</p></div></div>
<ol className="how">
<li><span className="ic"><Icon name="chat" /></span><h4><small>The day before</small>Time window</h4><p>We text you a delivery window and the driver&apos;s name. Reply if it does not suit.</p></li>
<li><span className="ic"><Icon name="truck" /></span><h4><small>Setting off</small>Tracking goes live</h4><p>The bike is strapped into our van. Your tracking link switches on as the driver leaves.</p></li>
<li><span className="ic"><Icon name="key" /></span><h4><small>At your door</small>Handover</h4><p>The driver unloads the bike and goes through the checklist below with you.</p></li>
<li><span className="ic"><Icon name="doc" /></span><h4><small>Done</small>Sign and ride</h4><p>Sign the handover sheet. Your documents and warranty are saved in your account.</p></li>
</ol>
</div>
</section>
<section className="sec paper" id="handover">
<div className="wrap">
<div className="sh"><div><span className="tag">Handover</span><h2 className="disp">The handover <em>checklist</em></h2><p>The same checklist at the showroom or at your door. Nothing is signed until you are happy.</p></div></div>
<div className="handover">
<div className="icard">
<div className="h4">We go through with you</div>
<ul className="clist cols mt2">
<li><Icon name="check" />Walk-round of the bike against the advert photos</li>
<li><Icon name="check" />Mileage and condition noted on the sheet</li>
<li><Icon name="check" />Keys handed over</li>
<li><Icon name="check" />Controls, dash and any extras explained</li>
<li><Icon name="check" />Service book and history</li>
<li><Icon name="check" />MOT certificate and HPI report</li>
<li><Icon name="check" />120-point inspection sheet</li>
<li><Icon name="check" />Warranty documents</li>
<li><Icon name="check" />V5C new keeper details</li>
<li><Icon name="check" />Handover sheet signed by both of us</li>
</ul>
</div>
<div className="icard dk">
<span className="ic red"><Icon name="info" /></span>
<h3>Have these ready</h3>
<ul className="clist mt2" style={{ color: '#d6d6dc' }}>
<li><Icon name="check" />Photo ID, such as your driving licence</li>
<li><Icon name="check" />Balance paid before the day, or finance signed</li>
<li><Icon name="check" />Insurance in place from the delivery date</li>
<li><Icon name="check" />Space on flat ground to unload</li>
<li><Icon name="check" />Your part-exchange bike, keys and V5C, if you have one</li>
</ul>
</div>
</div>
</div>
</section>
<section className="sec">
<div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.8fr) minmax(0,1.2fr)', gap: '50px' }} id="faqgrid">
<div><span className="sh"><span className="tag">FAQs</span></span><h2 className="disp" style={{ fontSize: '64px', marginTop: '12px' }}>Delivery <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>questions</em></h2><p className="muted" style={{ marginTop: '12px', fontSize: '17px' }}>The ones we get asked most. More answers on our help page.</p><Link href="/faq#delivery" className="lnk mt2">All delivery FAQs <Icon name="right" /></Link></div>
<FaqList section="delivery" openFirst />
</div>
</section>

    </div>
  );
}
