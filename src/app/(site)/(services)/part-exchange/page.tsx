import type { Metadata } from 'next';
import { pageMetadata } from '@/server/services/cms';
import { FaqList } from '@/components/cms/FaqList';
import Link from 'next/link';
import { LeadForm } from '@/components/forms/LeadForm';
import { StockBikeField } from '@/components/forms/StockBikeField';
import { LeadPhotoUpload } from '@/components/forms/LeadPhotoUpload';
import { JumpForm } from '@/components/info/JumpForm';
import { Icon } from '@/components/ui/Icon';
import { BikeCard } from '@/components/bikes/BikeCard';
import { getPublicBikes } from '@/server/services/bikes';
import { valuationPrefill, type ValuationQuery } from '@/lib/valuation-prefill';
import '@/styles/pages/part-exchange.css';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/part-exchange', {
  title: 'Part-Exchange Your Motorbike',
  description: 'Get a free part-exchange valuation on your motorbike. Use it as the deposit on any bike in stock. Outstanding finance settled for you.',
});
}

export default async function PartExchangePage({ searchParams }: { searchParams: Promise<ValuationQuery & { bike?: string | string[] }> }) {
  const [bikes, query] = await Promise.all([getPublicBikes(), searchParams]);
  const prefill = valuationPrefill(query);
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
<div className="plate"><span><i></i>UK</span><input id="pxr" defaultValue={prefill.registration} placeholder="ENTER REG" maxLength={8} /></div>
<div className="row">
<div className="sel"><label className="sr" htmlFor="pxm">Mileage</label><input id="pxm" defaultValue={prefill.mileage} placeholder="Mileage" inputMode="numeric" /></div>
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
<div className="frow"><div className="fl"><label htmlFor="dr">Registration</label><div className="plate" style={{ height: '52px', border: '2px solid #d8b200' }}><span><i></i>UK</span><input id="dr" defaultValue={prefill.registration} placeholder="AB12 CDE" maxLength={8} /></div></div><div className="fl"><label htmlFor="dm">Mileage</label><input id="dm" defaultValue={prefill.mileage} placeholder="e.g. 8,500" inputMode="numeric" /></div></div>
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
<LeadPhotoUpload />
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
<StockBikeField bikes={bikes} requestedSlug={query.bike} id="dwant" />
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
<div className="sh"><div><span className="tag">Swap it for</span><h2 className="disp">Your next bike <em>is here</em></h2><p>Every one HPI checked, 120-point inspected and sold with warranty. Your part-ex goes towards any of them.</p></div><Link href="/used-bikes" className="btn btn-red">See all {bikes.length} {bikes.length === 1 ? 'bike' : 'bikes'} <Icon name="right" /></Link></div>
<div className="stock">
{bikes.slice(0, 3).map((b) => (
  <BikeCard key={b.slug} bike={b} />
))}
</div>
<p className="rep" style={{ marginTop: '20px' }}>Monthly figures are an example over 48 months, £0 deposit, 19.9% APR representative. Finance subject to status and affordability.</p>
</div>
</section>
<section className="sec paper">
<div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.8fr) minmax(0,1.2fr)', gap: '50px' }} id="faqgrid">
<div><span className="sh"><span className="tag">Part-ex FAQs</span></span><h2 className="disp" style={{ fontSize: '64px', marginTop: '12px' }}>Quick <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>answers</em></h2><p className="muted" style={{ marginTop: '12px', fontSize: '17px' }}>Not sure about something? WhatsApp us a few photos and we will help.</p><Link href="/faq" className="btn btn-ink mt2">All FAQs <Icon name="right" /></Link></div>
<FaqList section="part-exchange" openFirst />
</div>
</section>

    </div>
  );
}
