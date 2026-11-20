/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { pageMetadata } from '@/server/services/cms';
import Link from 'next/link';
import { LeadForm } from '@/components/forms/LeadForm';
import { Icon } from '@/components/ui/Icon';
import '@/styles/pages/workshop.css';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/workshop', {
  title: 'Motorcycle Servicing, MOT and Repairs',
  description: 'Motorcycle MOTs, servicing, tyres and repairs on all makes, by the team that preps every GearUp bike. Book online.',
});
}

export default function WorkshopPage() {
  return (
    <div className="pg-workshop" style={{ display: 'contents' }}>


<section className="phero ws">
<div className="slab" aria-hidden="true" style={{ width: '22%' }}></div>
<div className="wrap">
<div>
<div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Workshop and MOT</span></div>
<h1 className="disp">Servicing, MOT <em>and repairs</em></h1>
<p className="lede">All makes and models. The same technicians who prep every GearUp bike look after yours. Clear prices, and we call before doing any extra work.</p>
<div className="ctas"><a href="#book" className="btn btn-red"><Icon name="cal" />Book an MOT or service</a><a href="#prices" className="btn btn-ghost">See prices</a></div>
<div className="wfacts"><span><Icon name="check" />All makes</span><span><Icon name="check" />Book online</span><span><Icon name="check" />Tyres fitted</span></div>
</div>
<div className="wphoto">
<img src="/assets/images/lifestyle/workshop-stand.webp" alt="The GearUp workshop with benches and tools" />
<div className="big"><b>All makes</b><small>Bikes, scooters and 125s</small></div>
</div>
</div>
</section>
<section className="sec" id="prices">
<div className="wrap">
<div className="sh"><div><span className="tag">Workshop prices</span><h2 className="disp">Prices <em>upfront</em></h2><p>Starting prices for most bikes. We confirm the exact price for your bike when you book, before we pick up a spanner.</p></div><a href="#book" className="btn btn-ink"><Icon name="cal" />Book now</a></div>
<table className="ptable">
<thead><tr><th>Service</th><th>What&apos;s included</th><th className="pr">Price</th></tr></thead>
<tbody>
<tr className="hl"><td><b>Motorcycle MOT</b></td><td>Class 1 and 2 MOT test on any make of motorcycle.<small>We tell you about any fails or advisories before you collect.</small></td><td className="pr"><span className="from">Up to</span><b>£29.65</b></td></tr>
<tr><td><b>MOT collection &amp; return</b></td><td>We collect your bike in our van, take it for its MOT and bring it back to your door.<small>Charged on top of the MOT fee. Price depends on distance.</small></td><td className="pr"><span className="from">From</span><b>£20</b></td></tr>
<tr><td><b>Pre-MOT check</b></td><td>Lights, tyres, brakes, chain and horn checked so there are no surprises on the day.</td><td className="pr"><span className="from">From</span><b>£25</b></td></tr>
<tr><td><b>Interim service</b></td><td>Oil and filter change, chain adjust and lube, brakes, lights and fluid levels checked.<small>Ideal every 3,000 to 4,000 miles.</small></td><td className="pr"><span className="from">From</span><b>£119</b></td></tr>
<tr><td><b>Full service</b></td><td>Everything in the interim service plus air filter, plugs, brake fluid and a full safety inspection. Service book stamped.</td><td className="pr"><span className="from">From</span><b>£229</b></td></tr>
<tr><td><b>Tyre fitting</b></td><td>Fit and balance, new valve. Supply your own or let us order them.<small>Price per wheel, wheel off the bike.</small></td><td className="pr"><span className="from">From</span><b>£20</b></td></tr>
<tr><td><b>Chain and sprocket kit</b></td><td>Supply and fit. Price depends on your bike and the kit.</td><td className="pr"><span className="from">From</span><b>£139</b></td></tr>
<tr><td><b>Brake pads</b></td><td>Supply and fit, per axle. Discs and fluid checked.</td><td className="pr"><span className="from">From</span><b>£55</b></td></tr>
<tr><td><b>Diagnostics and repairs</b></td><td>Warning lights, electrics, running problems and crash repairs. We quote before we fix.</td><td className="pr"><span className="from">Per hour</span><b>£60</b></td></tr>
</tbody>
</table>
<p className="muted mt1" style={{ fontSize: '13px' }}><span className="samp">Sample prices</span> Mockup figures, apart from the MOT, which is the government maximum fee for a motorcycle. GearUp to confirm workshop rates.</p>
</div>
</section>
<section className="sec paper" id="book">
<div className="wrap split">
<LeadForm
  type="workshop"
  className="formcard"
  success={
    <div className="success">
      <Icon name="check" />
      <span>Request sent. We will text you to confirm your slot.</span>
    </div>
  }
>
<h2>Book your bike in</h2>
<p>Takes two minutes. We text to confirm your slot.</p>
<div className="bsec" style={{ borderTop: 0, paddingTop: 0 }}>
<div className="h4"><i>1</i>Your bike</div>
<div className="frow">
<div className="fl"><label htmlFor="wreg">Registration</label><div className="plate"><span><i></i>UK</span><input id="wreg" placeholder="AB12 CDE" maxLength={8} /></div></div>
<div className="fl"><label htmlFor="wml">Mileage</label><input id="wml" placeholder="e.g. 8,500" inputMode="numeric" /><small>Roughly is fine.</small></div>
</div>
</div>
<div className="bsec">
<div className="h4"><i>2</i>What do you need?</div>
<div className="radios">
<label className="rcard on"><input type="radio" name="wsv" defaultChecked /><span className="dot"></span><span><b>MOT</b><small>Up to £29.65</small></span></label>
<label className="rcard"><input type="radio" name="wsv" /><span className="dot"></span><span><b>MOT and service</b><small>Save a second trip</small></span></label>
<label className="rcard"><input type="radio" name="wsv" /><span className="dot"></span><span><b>MOT with collection</b><small>We collect and return it, from £20 + MOT</small></span></label>
<label className="rcard"><input type="radio" name="wsv" /><span className="dot"></span><span><b>Service only</b><small>Interim or full</small></span></label>
<label className="rcard"><input type="radio" name="wsv" /><span className="dot"></span><span><b>Tyres</b><small>Fit and balance</small></span></label>
<label className="rcard"><input type="radio" name="wsv" /><span className="dot"></span><span><b>Repair</b><small>Tell us below</small></span></label>
<label className="rcard"><input type="radio" name="wsv" /><span className="dot"></span><span><b>Not sure</b><small>We will call you</small></span></label>
</div>
</div>
<div className="bsec">
<div className="h4"><i>3</i>Day and time</div>
<div className="form">
<div className="fl" style={{ maxWidth: '320px' }}><label htmlFor="wdt">Date</label><div className="sel"><select id="wdt" defaultValue="Wed 18 Nov"><option>Tue 17 Nov</option><option>Wed 18 Nov</option><option>Thu 19 Nov</option><option>Fri 20 Nov</option><option>Sat 21 Nov</option><option>Mon 23 Nov</option></select><Icon name="down" /></div></div>
<div className="fl"><span className="lbl">Drop-off time</span>
<div className="slots"><label><input type="radio" name="wtm" /><span><s>9:00</s></span></label><label><input type="radio" name="wtm" defaultChecked /><span>10:00</span></label><label><input type="radio" name="wtm" /><span>11:30</span></label><label><input type="radio" name="wtm" /><span>13:30</span></label><label><input type="radio" name="wtm" /><span>15:00</span></label></div>
</div>
</div>
<label className="chk mt1"><input type="checkbox" />Text me if an earlier slot comes up</label>
</div>
<div className="bsec">
<div className="h4"><i>4</i>Your details</div>
<div className="form">
<div className="frow"><div className="fl"><label htmlFor="wn">Name</label><input id="wn" placeholder="Full name" /></div><div className="fl"><label htmlFor="wm">Mobile</label><input id="wm" placeholder="07..." inputMode="tel" /></div></div>
<div className="fl"><label htmlFor="we">Email</label><input id="we" type="email" placeholder="you@example.com" /></div>
<div className="fl"><label htmlFor="wx">Anything we should know?</label><textarea id="wx" placeholder="Noises, warning lights, parts you want fitted"></textarea></div>
<button className="btn btn-red" type="submit"><Icon name="cal" />Request this slot</button>
</div>
</div>
</LeadForm>
<aside className="stick" style={{ display: 'grid', gap: '18px' }}>
<div className="icard">
<div className="h4" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ color: 'var(--red)' }} className="icwrap"><Icon name="info" /></span>How booking works</div>
<ul className="clist mt2" style={{ fontSize: '15px' }}>
<li><Icon name="check" />Pick a slot and we text you to confirm</li>
<li><Icon name="check" />Drop your bike off at the time you chose</li>
<li><Icon name="check" />We call before any work beyond what you booked</li>
<li><Icon name="check" />Pay when you collect</li>
</ul>
</div>
<div className="icard dk">
<span className="ic red"><Icon name="clock" /></span>
<h3>Workshop hours</h3>
<table className="hours mt1">
<tr><td>Monday to Friday</td><td>9:00 to 17:30</td></tr>
<tr><td>Saturday</td><td>9:00 to 16:00</td></tr>
<tr className="c"><td>Sunday</td><td>Closed</td></tr>
</table>
<p style={{ marginTop: '14px' }}>Rather talk? Call <b style={{ color: '#fff' }}>0744 072 1478</b>.</p>
</div>
</aside>
</div>
</section>
<section className="sec dark">
<div className="wrap">
<div className="sh"><div><span className="tag">Why GearUp</span><h2 className="disp">Why use <em>our workshop</em></h2><p>We are a dealer, so our workshop is busy every day. That is good news for your bike.</p></div></div>
<div className="grid4b">
<div className="icard dk"><span className="ic red"><Icon name="wrench" /></span><h3>The team that preps our stock</h3><p>Every bike we sell gets a 120-point inspection here. Yours gets the same eyes.</p></div>
<div className="icard dk"><span className="ic"><Icon name="engine" /></span><h3>All makes</h3><p>Japanese, European and American bikes, scooters and 125s. Bought from us or not.</p></div>
<div className="icard dk"><span className="ic"><Icon name="phone" /></span><h3>No surprises</h3><p>We quote first. If we find something extra, we call you before we touch it.</p></div>
<div className="icard dk"><span className="ic"><Icon name="doc" /></span><h3>Proper records</h3><p>Service book stamped and a written note of what we did. Good for when you sell.</p></div>
</div>
</div>
</section>
<section className="sec">
<div className="wrap">
<div className="tyre">
<div className="ti"><img src="/assets/images/lifestyle/workshop-tools.webp" alt="Socket set in the GearUp workshop" /></div>
<div className="tb">
<span className="sh" style={{ margin: 0 }}><span className="tag" style={{ background: 'var(--red)' }}>Tyres</span></span>
<h2 className="disp" style={{ fontSize: '60px', marginTop: '12px' }}>Tyres <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>fitted</em></h2>
<p>Worn tyres are the most common MOT fail we see. Bring your own or let us order the right pair for your bike and how you ride.</p>
<ul className="clist">
<li><Icon name="check" />Road, sport, touring and adventure tyres</li>
<li><Icon name="check" />Fit, balance and new valves</li>
<li><Icon name="check" />Wheels in, or bike in for removal and refit</li>
<li><Icon name="check" />Tread and pressures checked while you are in</li>
</ul>
<div className="ctas" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '26px' }}><a href="#book" className="btn btn-red">Book tyres</a><Link href="/accessories" className="btn btn-ghost">Shop parts and kit</Link></div>
</div>
</div>
</div>
</section>
<section className="insp-band" id="inspection">
<div className="ib-img"><img src="/assets/images/lifestyle/mechanic-engine.webp" alt="Close-up of an engine being inspected" /><div className="big"><b>120</b><small>Point inspection</small></div></div>
<div className="ib-body">
<span className="sh" style={{ margin: 0 }}><span className="tag">Built in our workshop</span></span>
<h2 className="disp" style={{ fontSize: '60px', marginTop: '12px' }}>The <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>120-point</em> inspection</h2>
<p className="muted" style={{ fontSize: '17px', marginTop: '12px' }}>Every bike we sell goes through it before it goes on sale. It is the same workshop and the same standard you get when you book your own bike in.</p>
<div className="cats">
<div>Engine &amp; drivetrain<span>24</span></div><div>Brakes<span>16</span></div>
<div>Suspension &amp; steering<span>18</span></div><div>Wheels &amp; tyres<span>14</span></div>
<div>Electrics &amp; lights<span>20</span></div><div>Frame, bodywork &amp; road test<span>28</span></div>
</div>
<Link href="/warranty#inspection" className="lnk" style={{ marginTop: '26px' }}>See the full checklist <Icon name="right" /></Link>
</div>
</section>

    </div>
  );
}
