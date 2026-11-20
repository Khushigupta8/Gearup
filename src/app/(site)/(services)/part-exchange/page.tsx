/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadForm } from '@/components/forms/LeadForm';
import { JumpForm } from '@/components/info/JumpForm';
import { Icon } from '@/components/ui/Icon';
import '@/styles/pages/part-exchange.css';

export const metadata: Metadata = {
  title: 'Part-Exchange Your Motorbike',
  description: 'Get a free part-exchange valuation on your motorbike. Use it as the deposit on any bike in stock. Outstanding finance settled for you.',
};

export default function PartExchangePage() {
  return (
    <div className="pg-part-exchange" style={{ display: 'contents' }}>


<section className="phero pxh">
<div className="slab" aria-hidden="true"></div>
<div className="wrap">
<div>
<div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Part-exchange</span></div>
<h1 className="disp">Part-exchange <em>your bike</em></h1>
<p className="lede">Put your reg in for a free valuation. Use your bike as the deposit on anything in stock, and we will settle any finance left on it.</p>
<div className="ticks">
<span><Icon name="check" />Free and no obligation</span>
<span><Icon name="check" />Outstanding finance settled</span>
<span><Icon name="check" />Collected when we deliver</span>
</div>
</div>
<JumpForm className="valbox" copy={[["pxr", "dr"], ["pxm", "dm"]]} target="details">
<h3>Value my bike</h3>
<label className="sr" htmlFor="pxr">Registration</label>
<div className="plate"><span><i></i>UK</span><input id="pxr" placeholder="ENTER REG" maxLength={8} /></div>
<div className="row">
<div className="sel"><label className="sr" htmlFor="pxm">Mileage</label><input id="pxm" placeholder="Mileage" inputMode="numeric" /></div>
<div className="sel"><label className="sr" htmlFor="pxc">Condition</label><select id="pxc"><option>Condition</option><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs work</option></select><Icon name="down" /></div>
</div>
<button className="btn btn-red">Get my valuation <Icon name="right" /></button>
<small>Takes under a minute. Want cash instead? <Link href="/sell-your-bike" style={{ textDecoration: 'underline', color: 'var(--ink)' }}>Sell it to us</Link>.</small>
</JumpForm>
</div>
</section>
<section className="sec">
<div className="wrap">
<div className="sh"><div><span className="tag">How it works</span><h2 className="disp">Swap your bike <em>in four steps</em></h2><p>No haggling on a forecourt. You get a figure up front and it comes straight off your next bike.</p></div></div>
<ol className="how">
<li><span className="ic"><Icon name="search" /></span><h4><small>Step 01</small>Enter your reg</h4><p>Tell us the mileage and condition. Add a few photos for a firmer figure.</p></li>
<li><span className="ic"><Icon name="tag" /></span><h4><small>Step 02</small>Get your offer</h4><p>We look at your bike and come back with a real offer, not a guess.</p></li>
<li><span className="ic"><Icon name="card" /></span><h4><small>Step 03</small>Use it as your deposit</h4><p>Reserve your new bike for £99. Your part-ex value comes off the balance.</p></li>
<li><span className="ic"><Icon name="truck" /></span><h4><small>Step 04</small>Swap on the day</h4><p>Bring your bike to the showroom, or we take it away when we deliver yours.</p></li>
</ol>
</div>
</section>
<section className="sec paper">
<div className="wrap">
<div className="sh"><div><span className="tag">Your valuation</span><h2 className="disp">What affects <em>the value?</em></h2><p>We check the same things every buyer would. Be honest up front and the figure we quote is the figure you get.</p></div></div>
<div className="affect">
<div><b>Mileage <i className="hi">Big</i></b><p>Lower miles for the age means a higher value. Give us the reading off the clock.</p></div>
<div><b>Service history <i className="hi">Big</i></b><p>Stamps, receipts and dealer invoices all add value. Bring everything you have.</p></div>
<div><b>Condition <i className="hi">Big</i></b><p>Scuffs, dents, worn tyres and corrosion. Photos help us price it fairly.</p></div>
<div><b>Demand <i>Medium</i></b><p>Popular models and A2-friendly bikes sell quickly, so they are worth more to us.</p></div>
<div><b>MOT <i>Medium</i></b><p>A long MOT saves us prep work. A recent advisory list is useful too.</p></div>
<div><b>Keys and logbook <i>Medium</i></b><p>Two keys and a V5C in your name. Missing items cost money to replace.</p></div>
<div><b>Modifications <i>Varies</i></b><p>Quality parts can help. Loud pipes and cut tails can lower the value. Keep the originals.</p></div>
<div><b>Time of year <i>Small</i></b><p>Bikes sell faster in spring. We buy all year round and price fairly in winter too.</p></div>
</div>
</div>
</section>
<section className="sec" id="details">
<div className="wrap">
<div className="sh"><div><span className="tag">Firm valuation</span><h2 className="disp">Tell us <em>a bit more</em></h2><p>The more we know, the firmer the offer. Most valuations come back the same working day.</p></div></div>
<div className="split">
<LeadForm
  type="part_exchange"
  className="form"
  success={
    <div className="formcard">
      <h2>Thanks, we have it.</h2>
      <div className="success mt2">
        <Icon name="check" />
        Your bike details are with our buyer. We will text your valuation, usually the same working day.
      </div>
      <Link href="/used-bikes" className="btn btn-ink mt2">
        Browse bikes meanwhile
      </Link>
    </div>
  }
>
<div className="formcard">
<h2>Your bike</h2>
<div className="form mt2">
<div className="frow"><div className="fl"><label htmlFor="dr">Registration</label><div className="plate" style={{ height: '52px', border: '2px solid #d8b200' }}><span><i></i>UK</span><input id="dr" placeholder="AB12 CDE" maxLength={8} /></div></div><div className="fl"><label htmlFor="dm">Mileage</label><input id="dm" placeholder="e.g. 8,500" inputMode="numeric" /></div></div>
<div className="frow three"><div className="fl"><label htmlFor="dsh">Service history</label><div className="sel"><select id="dsh"><option>Full dealer</option><option>Full, mixed</option><option>Part</option><option>None</option></select><Icon name="down" /></div></div><div className="fl"><label htmlFor="dk">Keys</label><div className="sel"><select id="dk"><option>2 keys</option><option>1 key</option></select><Icon name="down" /></div></div><div className="fl"><label htmlFor="dmot">MOT expiry</label><input id="dmot" placeholder="MM / YYYY" /></div></div>
</div>
</div>
<div className="formcard">
<h2>Overall condition</h2>
<p>Pick the one that fits best. We will check it when we see the bike.</p>
<div className="radios mt2" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
<label className="rcard"><input type="radio" name="cond" /><span className="dot"></span><span><b>Excellent</b><small>Like new. No marks, tyres good.</small></span></label>
<label className="rcard on"><input type="radio" name="cond" defaultChecked /><span className="dot"></span><span><b>Good</b><small>Light marks for its age. Rides well.</small></span></label>
<label className="rcard"><input type="radio" name="cond" /><span className="dot"></span><span><b>Fair</b><small>Scuffs or dents. Some parts worn.</small></span></label>
<label className="rcard"><input type="radio" name="cond" /><span className="dot"></span><span><b>Needs work</b><small>Faults, damage or a non-runner.</small></span></label>
</div>
<div className="fl mt2"><label htmlFor="dn">Anything we should know? (optional)</label><textarea id="dn" placeholder="Damage, faults, modifications, recent work..."></textarea></div>
</div>
<div className="formcard">
<h2>Add photos</h2>
<p>Optional, but photos get you a firmer figure. Daylight works best.</p>
<div className="uplgrid mt2">
<label className="upl main"><input type="file" className="sr" multiple accept="image/*" /><Icon name="upload" /><b>Drag photos here</b><small>or tap to choose. Up to 12 photos.</small></label>
<div className="upl"><small>Left side</small></div><div className="upl"><small>Right side</small></div><div className="upl"><small>Front</small></div>
<div className="upl"><small>Clocks</small></div><div className="upl"><small>Tyres</small></div><div className="upl"><small>Any damage</small></div>
</div>
</div>
<div className="formcard">
<h2>Outstanding finance</h2>
<p>Is there still finance owed on the bike? That is fine. We settle it with the lender for you.</p>
<div className="radios mt2">
<label className="rcard on"><input type="radio" name="ofin" defaultChecked /><span className="dot"></span><span><b>No finance</b><small>The bike is fully mine</small></span></label>
<label className="rcard"><input type="radio" name="ofin" /><span className="dot"></span><span><b>Yes, some owed</b><small>We settle it for you</small></span></label>
<label className="rcard"><input type="radio" name="ofin" /><span className="dot"></span><span><b>Not sure</b><small>We can check</small></span></label>
</div>
<div className="frow mt2"><div className="fl"><label htmlFor="dfl">Lender (optional)</label><input id="dfl" placeholder="Finance company" /></div><div className="fl"><label htmlFor="dfs">Settlement figure (optional)</label><input id="dfs" placeholder="£" inputMode="numeric" /><small>Ask your lender for this. It is valid for a set number of days.</small></div></div>
</div>
<div className="formcard">
<h2>Where do we send it?</h2>
<div className="form mt2">
<div className="frow"><div className="fl"><label htmlFor="dnm">Name</label><input id="dnm" placeholder="Your name" /></div><div className="fl"><label htmlFor="dmb">Mobile</label><input id="dmb" placeholder="07..." /></div></div>
<div className="frow"><div className="fl"><label htmlFor="dem">Email</label><input id="dem" type="email" placeholder="you@example.com" /></div><div className="fl"><label htmlFor="dpc">Postcode</label><input id="dpc" placeholder="e.g. M1 1AA" style={{ textTransform: 'uppercase' }} /></div></div>
<div className="fl"><label htmlFor="dwant">Bike you are interested in (optional)</label><div className="sel"><select id="dwant"><option>Not chosen yet</option><option>2019 BMW R 1250 GS · £11,495</option><option>2018 Triumph Street Triple RS · £6,495</option><option>2021 Yamaha MT-07 · £5,295</option></select><Icon name="down" /></div></div>
<label className="chk"><input type="checkbox" defaultChecked />Text me the valuation and any updates.</label>
<button className="btn btn-red" type="submit">Send for valuation <Icon name="right" /></button>
</div>
</div>
</LeadForm>
<aside className="stick">
<div className="pxsum">
<h3>How the numbers work</h3>
<dl>
<dt>Your next bike</dt><dd>£6,495</dd>
<dt>Part-ex value</dt><dd className="neg">−£2,400</dd>
<dt>Finance settled for you</dt><dd>+£600</dd>
<dt className="tot">Left to pay</dt><dd>£4,695</dd>
</dl>
<p>Sample figures for illustration only. Your offer depends on your bike. The balance can go on finance, subject to status.</p>
</div>
<div className="icard mt1"><div className="h4" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ color: 'var(--red)' }} className="icwrap"><Icon name="doc" /></span>Bring on the day</div><ul className="clist mt1" style={{ fontSize: '15px' }}><li><Icon name="check" />V5C logbook in your name</li><li><Icon name="check" />All keys and any alarm fobs</li><li><Icon name="check" />Service book and receipts</li><li><Icon name="check" />Photo ID</li></ul></div>
<div className="icard mt1"><div className="h4" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ color: 'var(--red)' }} className="icwrap"><Icon name="card" /></span>Spread the rest</div><p style={{ fontSize: '15px' }}>Put the balance on finance at 19.9% APR representative. Subject to status.</p><Link href="/finance" className="lnk mt1">Finance options <Icon name="right" /></Link></div>
</aside>
</div>
</div>
</section>
<section className="sec dark">
<div className="wrap">
<div className="sh"><div><span className="tag">Swap it for</span><h2 className="disp">Your next bike <em>is here</em></h2><p>Every one HPI checked, 120-point inspected and sold with warranty. Your part-ex goes towards any of them.</p></div><Link href="/used-bikes" className="btn btn-red">See all 24 bikes <Icon name="right" /></Link></div>
<div className="stock">
<article className="bc">
<Link href="/used-bikes/2019-bmw-r1250gs" className="im"><img src="/assets/images/bikes/triumph-street-triple-rs.webp" alt="2018 Triumph Street Triple RS" loading="lazy" /><span className="ribbon">3 months<br />warranty free</span><span className="pricechip"><b>£6,495</b><span>£192/mo</span></span></Link>
<div className="bd"><h3><small>Triumph</small><Link href="/used-bikes/2019-bmw-r1250gs">Street Triple RS</Link></h3>
<div className="sp"><span><Icon name="cal" />2018</span><span><Icon name="gauge" />9,412 miles</span><span><Icon name="engine" />765cc</span></div>
<div className="ft"><Link href="/used-bikes/2019-bmw-r1250gs/reserve" className="lnk">Reserve for £99 <Icon name="right" /></Link><span className="heart"><Icon name="heart" /></span></div></div>
</article>
<article className="bc">
<Link href="/used-bikes/2019-bmw-r1250gs" className="im"><img src="/assets/images/bikes/yamaha-mt07.webp" alt="2021 Yamaha MT-07" loading="lazy" /><span className="flag">A2 compatible</span><span className="pricechip"><b>£5,295</b><span>£156/mo</span></span></Link>
<div className="bd"><h3><small>Yamaha</small><Link href="/used-bikes/2019-bmw-r1250gs">MT-07</Link></h3>
<div className="sp"><span><Icon name="cal" />2021</span><span><Icon name="gauge" />4,120 miles</span><span><Icon name="engine" />689cc</span></div>
<div className="ft"><Link href="/used-bikes/2019-bmw-r1250gs/reserve" className="lnk">Reserve for £99 <Icon name="right" /></Link><span className="heart"><Icon name="heart" /></span></div></div>
</article>
<article className="bc">
<Link href="/used-bikes/2019-bmw-r1250gs" className="im"><img src="/assets/images/bikes/kawasaki-ninja-zx6r.webp" alt="2020 Kawasaki Ninja ZX-6R" loading="lazy" /><span className="ribbon">6 months<br />warranty free</span><span className="pricechip"><b>£7,995</b><span>£236/mo</span></span></Link>
<div className="bd"><h3><small>Kawasaki</small><Link href="/used-bikes/2019-bmw-r1250gs">Ninja ZX-6R</Link></h3>
<div className="sp"><span><Icon name="cal" />2020</span><span><Icon name="gauge" />5,640 miles</span><span><Icon name="engine" />636cc</span></div>
<div className="ft"><Link href="/used-bikes/2019-bmw-r1250gs/reserve" className="lnk">Reserve for £99 <Icon name="right" /></Link><span className="heart"><Icon name="heart" /></span></div></div>
</article>
</div>
<p className="rep" style={{ marginTop: '20px' }}>Monthly figures are an example over 48 months, £0 deposit, 19.9% APR representative. Finance subject to status and affordability.</p>
</div>
</section>
<section className="sec paper">
<div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.8fr) minmax(0,1.2fr)', gap: '50px' }} id="faqgrid">
<div><span className="sh"><span className="tag">Part-ex FAQs</span></span><h2 className="disp" style={{ fontSize: '64px', marginTop: '12px' }}>Quick <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>answers</em></h2><p className="muted" style={{ marginTop: '12px', fontSize: '17px' }}>Not sure about something? WhatsApp us a few photos and we will help.</p><Link href="/faq" className="btn btn-ink mt2">All FAQs <Icon name="right" /></Link></div>
<div className="faq">
<details open><summary>Is the online valuation the final price?</summary><p>It is a guide based on what you tell us. We confirm the figure when we see the bike. If it matches your description and photos, the figure stays the same.</p></details>
<details><summary>Can I part-ex a bike with finance on it?</summary><p>Yes. We get a settlement figure from your lender and pay it off as part of the deal. If you owe more than the bike is worth, the difference is added to what you pay.</p></details>
<details><summary>Do you take bikes that need work?</summary><p>Yes, including non-runners. Tell us what is wrong and we will price it fairly.</p></details>
<details><summary>Can you collect my old bike?</summary><p>Yes. If we are delivering your new bike, we can take your part-ex away on the same trip.</p></details>
<details><summary>What if I just want cash?</summary><p>We buy bikes outright too. See <Link href="/sell-your-bike" style={{ textDecoration: 'underline' }}>sell your bike</Link>.</p></details>
</div>
</div>
</section>

    </div>
  );
}
