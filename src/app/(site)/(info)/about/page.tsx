/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import '@/styles/pages/about.css';

export const metadata: Metadata = {
  title: 'About GearUp Motorcycles · Independent used bike dealer',
  description: 'A small independent dealer. Every bike hand-picked, prepped in our own workshop and sold UK-wide with delivery and warranty.',
};

export default function AboutPage() {
  return (
    <div className="pg-about" style={{ display: 'contents' }}>


<section className="phero ab-hero">
<div className="bgimg" aria-hidden="true"><img src="/assets/images/lifestyle/rider-street.webp" alt="" /></div>
<div className="wrap">
<div>
<div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>About us</span></div>
<h1 className="disp">Small dealer. <em>Proper bikes.</em></h1>
<p className="lede">GearUp is an independent used motorbike dealer. We hand-pick every bike, prep it in our own workshop and sell it with a warranty. Then we deliver it nationwide.</p>
<div className="ctas"><Link href="/used-bikes" className="btn btn-red">See the 24 bikes in stock <Icon name="right" /></Link><a href="#reviews" className="btn btn-ghost">Read our reviews</a></div>
<span className="stamp">Founded in 20XX · Independent</span>
</div>
</div>
</section>
<section className="sec">
<div className="wrap">
<div className="story">
<div>
<div className="sh" style={{ marginBottom: '6px' }}><div><span className="tag">Our story</span><h2 className="disp">Riders <em>selling bikes</em> to riders</h2></div></div>
<div className="prose">
<p>We started GearUp because buying a used bike should not feel like a gamble.</p>
<p>We are a small team, and we keep stock small on purpose. Around 24 bikes at a time means we know every one of them. We know where it came from, what we have done to it and how it rides.</p>
<p>Every bike goes through our own workshop before it goes on sale. It gets an HPI check, a 120-point inspection and any work it needs. If a bike does not meet our standard, we do not sell it.</p>
<p>You do not have to live nearby. We film a walkaround of every bike, take a £99 reservation online and deliver nationwide.</p>
</div>
<div className="sig"><span className="av">GU</span><span><b>Owner, GearUp Motorcycles</b><small>Name and photo to follow</small></span></div>
</div>
<div className="collage">
<img className="c1" src="/assets/images/lifestyle/mechanic-engine.webp" alt="Mechanic working on a motorbike engine" />
<img src="/assets/images/lifestyle/workshop-tools.webp" alt="Workshop tools laid out on a bench" />
<img src="/assets/images/lifestyle/workshop-sparks.webp" alt="Sparks flying in the workshop" />
<div className="lbl"><small>Prepped in-house</small><b>Our own workshop</b></div>
</div>
</div>
<div className="numbers">
<div><b>24</b><small>Bikes in stock<span>Hand-picked, not bought in bulk</span></small></div>
<div><b>120</b><small>Point inspection<span>On every bike before sale</span></small></div>
<div><b>30</b><small>Day warranty<span>Included on every bike</span></small></div>
<div><b>4.2</b><small>On Trustpilot<span>Rated Great from 22 reviews</span></small></div>
</div>
</div>
</section>
<section className="sec paper">
<div className="wrap">
<div className="sh"><div><span className="tag">Our promises</span><h2 className="disp">What you get <em>every time</em></h2><p>No small print games. This comes with every bike we sell.</p></div><Link href="/warranty" className="btn btn-ink">Warranty details <Icon name="right" /></Link></div>
<div className="grid3 promises">
<div className="icard"><div className="ic red"><Icon name="search" /></div><h3>Hand-picked stock</h3><p>We choose every bike ourselves. No auction job lots, no bikes we would not ride.</p></div>
<div className="icard"><div className="ic red"><Icon name="wrench" /></div><h3>Prepped in our workshop</h3><p>Our own technicians inspect, service and fix each bike. You get the report.</p></div>
<div className="icard"><div className="ic red"><Icon name="shield" /></div><h3>Warranty as standard</h3><p>30 days on every bike. Free extended warranty on selected bikes, marked in red.</p></div>
<div className="icard"><div className="ic"><Icon name="doc" /></div><h3>HPI checked</h3><p>No outstanding finance, not stolen, not written off. Checked before it goes on sale.</p></div>
<div className="icard"><div className="ic"><Icon name="truck" /></div><h3>Delivered UK-wide</h3><p>Mainland UK delivery priced per mile from our showroom. Ask us for a price.<br /><Link href="/contact" className="lnk">Get a delivery price <Icon name="right" /></Link></p></div>
<div className="icard"><div className="ic"><Icon name="left" /></div><h3>14-day money back</h3><p>Bought online and it is not right? Return the bike within 14 days for your money back.</p></div>
</div>
</div>
</section>
<section className="insp-band">
<div className="ib-img"><img src="/assets/images/lifestyle/workshop-stand.webp" alt="Motorbike on a workshop stand" /><div className="big"><b>120</b><small>Point inspection</small></div></div>
<div className="ib-body">
<span className="sh" style={{ margin: 0 }}><span className="tag">How we prep a bike</span></span>
<h2 className="disp" style={{ fontSize: '60px', marginTop: '12px' }}>From trade-in <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>to ready to ride</em></h2>
<p className="muted" style={{ marginTop: '12px', fontSize: '17px' }}>Every bike follows the same route through our workshop before you see it online.</p>
<ol className="prep-steps">
<li><span><b>HPI and history check</b><span>Finance, theft and write-off checks, plus the service book and MOT history.</span></span></li>
<li><span><b>120-point inspection</b><span>Engine, brakes, chassis, electrics and tyres, all signed off by a technician.</span></span></li>
<li><span><b>Service and fix</b><span>Anything that fails gets put right. Fresh MOT where needed.</span></span></li>
<li><span><b>Valet, photos and video</b><span>Cleaned, photographed and filmed, marks and all. Then it goes online.</span></span></li>
</ol>
<Link href="/warranty#inspection" className="lnk mt2">See the full 120-point checklist <Icon name="right" /></Link>
</div>
</section>
<section className="sec">
<div className="wrap">
<div className="sh"><div><span className="tag">The team</span><h2 className="disp">The people <em>behind the bikes</em></h2><p>A small crew who answer the phone, fix the bikes and drive the van.</p></div><Link href="/contact" className="lnk">Get in touch <Icon name="right" /></Link></div>
<div className="team">
<div className="member"><span className="av">OW</span><div><b>Owner</b><small>Buying and sales</small><p>Picks every bike that comes into stock.</p><small className="ph">Name and photo to follow</small></div></div>
<div className="member"><span className="av">SA</span><div><b>Sales</b><small>Sales and finance</small><p>Your first call for viewings, finance and part-exchange.</p><small className="ph">Name and photo to follow</small></div></div>
<div className="member"><span className="av">WT</span><div><b>Workshop technician</b><small>Prep, servicing and MOT</small><p>Runs the 120-point inspection on every bike.</p><small className="ph">Name and photo to follow</small></div></div>
<div className="member"><span className="av">DD</span><div><b>Delivery driver</b><small>UK-wide delivery</small><p>Brings your bike safely to your door.</p><small className="ph">Name and photo to follow</small></div></div>
</div>
</div>
</section>
<section className="sec paper" id="reviews">
<div className="wrap">
<div className="sh"><div><span className="tag">Reviews</span><h2 className="disp">What our <em>customers say</em></h2>
<div className="tpbar"><span className="stars"><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i className="half"><svg><use href="#i-star" /></svg></i></span><span><b>Great</b> · 4.2 out of 5 from 22 reviews on Trustpilot</span></div></div>
<a href="#reviews" className="btn btn-ink">All 22 reviews on Trustpilot <Icon name="right" /></a></div>
<div className="revs"><article className="rq"><span className="stars"><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i></span><p>I was looking for a 125cc sporty style bike and I came across a Lexmoto LXR they had for sale but I was over 200 miles away from them, they offered to deliver the bike the same day I bought it which I was so thrilled about&hellip;</p><footer><b>David L.</b> · 13 Mar 2025 · Trustpilot</footer></article>
<div className="rsm"><article className="rs"><span className="stars"><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i></span><p>Amazing service and people they really made me feel at ease when purchasing my first vehicle they explained in depth everything I need to do and everything about the vehicle&hellip;</p><footer><b>Adeeb R.</b> · 17 Apr 2025 · Trustpilot</footer></article><article className="rs"><span className="stars"><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i></span><p>Very professional, friendly, helpful. Answered my questions about mopeds as I have never bought one before. Sorted all the paperwork out for me. Delivered the same day for me&hellip;</p><footer><b>Sharon A.</b> · 24 May 2024 · Trustpilot</footer></article></div></div>
</div>
</section>
<section className="sec dark">
<div className="wrap">
<div className="visit">
<div>
<div className="sh" style={{ marginBottom: 0 }}><div><span className="tag">Visit us</span><h2 className="disp">Come and see <em>the bikes</em></h2><p>Book a viewing or test ride and we will have the bike out, warmed up and ready. Or just drop in for a look round.</p></div></div>
<div className="addr"><Icon name="pin" /><span><b style={{ color: '#fff' }}>GearUp Motorcycles</b><br />Showroom address here, Town, Postcode</span></div>
<div className="hrs"><b>Mon to Fri</b><span>9:00 to 17:30</span><b>Saturday</b><span>9:00 to 16:00</span><b>Sunday</b><span>Closed</span></div>
<div className="ctas"><Link href="/contact" className="btn btn-red"><Icon name="cal" />Book a viewing</Link><Link href="/contact" className="btn btn-ghost"><Icon name="phone" />0744 072 1478</Link></div>
</div>
<Link href="/contact" className="dt"><img src="/assets/images/lifestyle/bikes-outside-cafe.webp" alt="Motorbikes parked outside a cafe" /><h3>Find the<br />showroom</h3><p>Map, opening hours and every way to reach us.</p><span className="btn btn-white">Contact &amp; map <Icon name="right" /></span></Link>
</div>
</div>
</section>

    </div>
  );
}
