/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadForm } from '@/components/forms/LeadForm';
import { Icon } from '@/components/ui/Icon';
import '@/styles/pages/sell-your-bike.css';

export const metadata: Metadata = {
  title: 'Sell Your Motorbike',
  description: 'Sell your motorbike to GearUp. Free valuation, we inspect it, pay you by bank transfer and can collect from your door. Outstanding finance settled.',
};

export default function SellYourBikePage() {
  return (
    <div className="pg-sell-your-bike" style={{ display: 'contents' }}>


<section className="phero sxh">
<div className="slab" aria-hidden="true"></div>
<div className="wrap">
<div>
<div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Sell your bike</span></div>
<h1 className="disp">Sell your bike <em>to us</em></h1>
<p className="lede">No time-wasters, no test-ride strangers, no haggling in your driveway. Get a free valuation, we check the bike, and you get paid by bank transfer.</p>
<div className="mini">
<div><b>Free</b><small>Valuation</small></div>
<div><b>Bank</b><small>Transfer</small></div>
<div><b>We collect</b><small>Mainland UK</small></div>
</div>
</div>
<LeadForm
  type="sell_bike"
  className="valbox"
  id="value"
  success={
    <>
      <h3>Thanks, we have it.</h3>
      <div className="success mt1">
        <Icon name="check" />
        Our buyer will text your offer, usually the same working day.
      </div>
    </>
  }
>
<h3>What&apos;s my bike worth?</h3>
<label className="sr" htmlFor="sxr">Registration</label>
<div className="plate"><span><i></i>UK</span><input id="sxr" placeholder="ENTER REG" maxLength={8} /></div>
<div className="row">
<div className="sel"><label className="sr" htmlFor="sxm">Mileage</label><input id="sxm" placeholder="Mileage" inputMode="numeric" /></div>
<div className="sel"><label className="sr" htmlFor="sxc">Condition</label><select id="sxc"><option>Condition</option><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs work</option></select><Icon name="down" /></div>
</div>
<div className="row">
<div className="sel"><label className="sr" htmlFor="sxp">Postcode</label><input id="sxp" placeholder="Postcode" style={{ textTransform: 'uppercase' }} /></div>
<div className="sel"><label className="sr" htmlFor="sxf">Finance</label><select id="sxf"><option>Finance owed?</option><option>No finance</option><option>Yes, some owed</option></select><Icon name="down" /></div>
</div>
<div className="row">
<div className="sel"><label className="sr" htmlFor="sxn">Your name</label><input id="sxn" placeholder="Your name" autoComplete="name" /></div>
<div className="sel"><label className="sr" htmlFor="sxt">Mobile</label><input id="sxt" type="tel" placeholder="Mobile" autoComplete="tel" /></div>
</div>
<button className="btn btn-red">Get my offer <Icon name="right" /></button>
<small>Free and no obligation. Buying too? <Link href="/part-exchange" style={{ textDecoration: 'underline', color: 'var(--ink)' }}>Part-exchange it</Link>.</small>
</LeadForm>
</div>
</section>
<section className="sec">
<div className="wrap">
<div className="sh"><div><span className="tag">How it works</span><h2 className="disp">Sold in <em>four steps</em></h2><p>From reg number to money in your account. We do the legwork and the paperwork.</p></div></div>
<ol className="how">
<li><span className="ic"><Icon name="tag" /></span><h4><small>Step 01</small>Get your value</h4><p>Enter your reg and a few details. Add photos and we come back with a real offer.</p></li>
<li><span className="ic"><Icon name="wrench" /></span><h4><small>Step 02</small>We inspect it</h4><p>A quick look over the bike and paperwork, at our showroom or at your door.</p></li>
<li><span className="ic"><Icon name="card" /></span><h4><small>Step 03</small>Get paid</h4><p>Agree the price and we pay by bank transfer. Any finance owed is settled first.</p></li>
<li><span className="ic"><Icon name="truck" /></span><h4><small>Step 04</small>We collect</h4><p>Drop it off, or we pick it up from your door. We handle the V5C change.</p></li>
</ol>
</div>
</section>
<section className="sec paper">
<div className="wrap buy">
<div className="ph"><img src="/assets/images/lifestyle/bike-quiet-road.webp" alt="Motorbike parked on a quiet road" /><div className="big"><b>We&apos;re buying</b><small>All year round</small></div></div>
<div>
<div className="sh" style={{ marginBottom: 0 }}><div><span className="tag">What we buy</span><h2 className="disp">Most bikes, <em>most makes</em></h2><p>We need good used bikes for our forecourt. If it is road legal, or could be, talk to us.</p></div></div>
<div className="wtypes">
<a href="#value"><img src="/assets/images/cutouts/kawasaki-ninja-zx6r.webp" alt="" /><b>Sportsbikes</b></a>
<a href="#value"><img src="/assets/images/cutouts/kawasaki-z900.webp" alt="" /><b>Naked</b></a>
<a href="#value"><img src="/assets/images/cutouts/bmw-r1250gs.webp" alt="" /><b>Adventure</b></a>
<a href="#value"><img src="/assets/images/cutouts/harley-davidson-iron-883.webp" alt="" /><b>Cruisers</b></a>
<a href="#value"><img src="/assets/images/cutouts/triumph-bonneville.webp" alt="" /><b>Classic</b></a>
<a href="#value"><img src="/assets/images/cutouts/honda-forza.webp" alt="" /><b>Scooters &amp; 125s</b></a>
</div>
<ul className="clist cols mt2">
<li><Icon name="check" />All mainstream makes</li>
<li><Icon name="check" />Learner 125s to 1,200cc+</li>
<li><Icon name="check" />Bikes with finance owing</li>
<li><Icon name="check" />High miles considered</li>
<li><Icon name="check" />Non-runners and project bikes</li>
<li><Icon name="check" />Modified bikes</li>
</ul>
<p className="notbuy"><b>What we can&apos;t buy:</b> bikes without a V5C, bikes that fail an HPI check, or bikes you can&apos;t prove you own.</p>
</div>
</div>
</section>
<section className="sec">
<div className="wrap">
<div className="sh"><div><span className="tag">GearUp vs private sale</span><h2 className="disp">Skip the <em>hassle</em></h2><p>A private sale can get you a little more. Here is what it costs you in time and risk.</p></div><a href="#value" className="btn btn-red">Value my bike <Icon name="right" /></a></div>
<div style={{ overflowX: 'auto' }}><table className="compare"><thead><tr><th>Selling your bike</th><th className="us">Sell to GearUp</th><th>Private sale</th></tr></thead><tbody>
<tr><td>Free valuation up front</td><td className="us"><Icon name="check" className="i y" /></td><td>You guess the price</td></tr>
<tr><td>No adverts, calls or no-shows</td><td className="us"><Icon name="check" className="i y" /></td><td><Icon name="x" className="i n" /></td></tr>
<tr><td>No strangers test-riding your bike</td><td className="us"><Icon name="check" className="i y" /></td><td><Icon name="x" className="i n" /></td></tr>
<tr><td>Outstanding finance settled for you</td><td className="us"><Icon name="check" className="i y" /></td><td><Icon name="x" className="i n" /></td></tr>
<tr><td>Safe bank transfer, no payment scams</td><td className="us"><Icon name="check" className="i y" /></td><td>Risky</td></tr>
<tr><td>Collection from your door</td><td className="us"><Icon name="check" className="i y" /></td><td><Icon name="x" className="i n" /></td></tr>
<tr><td>V5C paperwork handled</td><td className="us"><Icon name="check" className="i y" /></td><td>You do it</td></tr>
<tr><td>Time you spend selling</td><td className="us"><b>One form</b></td><td>Adverts, calls, viewings</td></tr>
</tbody></table></div>
</div>
</section>
<section className="sec dark">
<div className="wrap">
<div className="sh"><div><span className="tag">Reviews</span><h2 className="disp">Riders <em>rate us</em></h2>
<div className="tpbar"><span className="stars"><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i className="half"><svg><use href="#i-star" /></svg></i></span><span><b>Great</b> · 4.2 out of 5 from 22 reviews on Trustpilot</span></div></div>
<Link href="/about#reviews" className="lnk" style={{ color: '#fff' }}>Read every review <Icon name="right" /></Link></div>
<div className="revs"><article className="rq"><span className="stars"><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i></span><p>Amazing service and people they really made me feel at ease when purchasing my first vehicle they explained in depth everything I need to do and everything about the vehicle&hellip;</p><footer><b>Adeeb R.</b> · 17 Apr 2025 · Trustpilot</footer></article>
<div className="rsm"><article className="rs"><span className="stars"><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i></span><p>Very professional, friendly, helpful. Answered my questions about mopeds as I have never bought one before. Sorted all the paperwork out for me&hellip;</p><footer><b>Sharon A.</b> · 24 May 2024 · Trustpilot</footer></article><article className="rs"><span className="stars"><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i><i><svg><use href="#i-star" /></svg></i></span><p>I was over 200 miles away from them, they offered to deliver the bike the same day I bought it which I was so thrilled about&hellip;</p><footer><b>David L.</b> · 13 Mar 2025 · Trustpilot</footer></article></div></div>
</div>
</section>
<section className="sec">
<div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.8fr) minmax(0,1.2fr)', gap: '50px' }} id="faqgrid">
<div><span className="sh"><span className="tag">Selling FAQs</span></span><h2 className="disp" style={{ fontSize: '64px', marginTop: '12px' }}>Before <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>you sell</em></h2><p className="muted" style={{ marginTop: '12px', fontSize: '17px' }}>Questions about your bike? WhatsApp us a few photos.</p><Link href="/contact" className="btn btn-ink mt2">Contact us <Icon name="right" /></Link></div>
<div className="faq">
<details open><summary>How do I get paid?</summary><p>By bank transfer once we have agreed the price and checked the bike and paperwork. If there is finance owing, we pay the lender first and send you the rest.</p></details>
<details><summary>Will the price change when you see the bike?</summary><p>Only if the bike is not as described. Be honest about marks and faults, add photos, and the figure we quote is the figure you get.</p></details>
<details><summary>What paperwork do I need?</summary><p>The V5C logbook in your name, photo ID, all keys, and any service history you have. We take care of telling the DVLA.</p></details>
<details><summary>Can you collect the bike?</summary><p>Yes, from anywhere in the UK, nationwide. We will agree a collection time with you when we agree the price.</p></details>
<details><summary>Do you buy bikes with outstanding finance?</summary><p>Yes. Get a settlement figure from your lender. We pay it off and send you any balance.</p></details>
<details><summary>Would I get more by part-exchanging?</summary><p>If you are buying from us too, <Link href="/part-exchange" style={{ textDecoration: 'underline' }}>part-exchange</Link> can be simpler, and your bike becomes the deposit on your next one.</p></details>
</div>
</div>
</section>

    </div>
  );
}
