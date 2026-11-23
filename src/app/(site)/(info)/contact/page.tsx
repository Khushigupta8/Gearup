import type { Metadata } from 'next';
import { getBusiness, pageMetadata } from '@/server/services/cms';
import { FaqList } from '@/components/cms/FaqList';
import Link from 'next/link';
import { LeadForm } from '@/components/forms/LeadForm';
import { Icon } from '@/components/ui/Icon';
import '@/styles/pages/contact.css';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/contact', {
  title: 'Contact GearUp Motorcycles · Call, WhatsApp or visit',
  description: 'Call 0744 072 1478, WhatsApp or email us. Book a viewing or video walkaround, and find our showroom and opening hours.',
});
}

export default async function ContactPage() {
  const biz = await getBusiness();
  const addr = biz.address.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const addrMain = addr[0] ?? 'Leeds, West Yorkshire';
  const addrRest = addr.slice(1).join(', ') || 'Viewings by appointment';
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.length ? addr.join(', ') : 'GearUp Motorcycles Leeds')}`;
  return (
    <div className="pg-contact" style={{ display: 'contents' }}>


<section className="phero ct-hero">
<div className="slab" aria-hidden="true"></div>
<div className="wrap" style={{ paddingBottom: '76px' }}>
<div>
<div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Contact us</span></div>
<h1 className="disp">Talk to <em>a real person</em></h1>
<p className="lede">Questions about a bike, finance or delivery? Call, WhatsApp or send a message. You will get a straight answer from someone who knows the bike.</p>
</div>
<div className="pbox">
<span className="open">Showroom open today</span>
<div><b>0744 072 1478</b><small>Mon to Fri 9:00 to 17:30 · Sat 9:00 to 16:00</small></div>
<div className="row"><a href="tel:07440721478" className="btn btn-red"><Icon name="phone" />Call now</a><a href="#enquiry" className="btn btn-ghost"><Icon name="chat" />WhatsApp</a></div>
</div>
</div>
</section>
<section className="sec" style={{ paddingTop: 0 }}>
<div className="wrap">
<div className="cblocks four">
<div className="cblock"><span className="ic"><Icon name="phone" /></span><div><b>Call us</b><a href="tel:07440721478" className="go">0744 072 1478</a><span>Sales, finance and workshop</span></div></div>
<div className="cblock wa"><span className="ic"><Icon name="chat" /></span><div><b>WhatsApp</b><a href="#enquiry" className="go">0744 072 1478</a><span>Send photos of your part-ex</span></div></div>
<div className="cblock"><span className="ic"><Icon name="mail" /></span><div><b>Email</b><a href="mailto:sales@gearupmotorcycles.co.uk" className="go">sales@gearup&shy;motorcycles.co.uk</a><span>We reply in opening hours</span></div></div>
<div className="cblock"><span className="ic"><Icon name="pin" /></span><div><b>Showroom</b><a href={mapUrl} className="go" target="_blank" rel="noopener">{addrMain}</a><span>{addrRest}</span></div></div>
</div>
</div>
</section>
<section className="sec paper" id="enquiry">
<div className="wrap">
<div className="split">
<LeadForm
  type="contact"
  className="formcard"
  success={
    <>
      <h2>Send us an enquiry</h2>
      <div className="success mt2">
        <Icon name="check" />
        Thanks. Your enquiry is in. We will be in touch during opening hours.
      </div>
    </>
  }
>
<div className="fh"><div><h2>Send us an enquiry</h2><p className="muted" style={{ marginTop: '8px' }}>Tell us what you need and when suits you. We will confirm by text or email.</p></div><span className="rt"><Icon name="clock" />Replies in opening hours</span></div>
<div className="fbody form mt2">
<div><span className="qlbl">What is it about?</span>
<div className="radios etype">
<label className="rcard on"><input type="radio" name="et" defaultChecked /><span className="dot"></span><span><b>Viewing</b><small>See it in person</small></span></label>
<label className="rcard"><input type="radio" name="et" /><span className="dot"></span><span><b>Video call walkaround</b><small>Live, from the showroom</small></span></label>
<label className="rcard"><input type="radio" name="et" /><span className="dot"></span><span><b>Finance</b><small>Subject to status</small></span></label>
<label className="rcard"><input type="radio" name="et" /><span className="dot"></span><span><b>Part-exchange</b><small>Value your bike</small></span></label>
<label className="rcard"><input type="radio" name="et" /><span className="dot"></span><span><b>Something else</b><small>Workshop, kit, anything</small></span></label>
</div>
</div>
<div className="fl"><label htmlFor="bk">Which bike? (optional)</label><div className="sel"><select id="bk"><option>Not sure yet</option><option>2019 BMW R 1250 GS</option><option>Yamaha MT-07</option><option>Kawasaki Z900</option><option>Honda Rebel 500</option><option>Another bike in stock</option></select><Icon name="down" /></div></div>
<div className="frow"><div className="fl"><label htmlFor="cn">Your name</label><input id="cn" placeholder="First and last name" /></div><div className="fl"><label htmlFor="cm">Mobile</label><input id="cm" placeholder="07..." inputMode="tel" /></div></div>
<div className="frow"><div className="fl"><label htmlFor="ce">Email</label><input id="ce" type="email" placeholder="you@example.com" /></div><div className="fl"><label htmlFor="cc">Best way to reply</label><div className="sel"><select id="cc"><option>Phone call</option><option>WhatsApp</option><option>Email</option></select><Icon name="down" /></div></div></div>
<div className="frow"><div className="fl"><label htmlFor="cd">Preferred date</label><input id="cd" type="date" /></div><div className="fl"><label htmlFor="ctm">Preferred time</label><div className="sel"><select id="ctm"><option>Morning (9:00 to 12:00)</option><option>Afternoon (12:00 to 15:00)</option><option>Late afternoon (15:00 to 17:30)</option><option>Saturday (9:00 to 16:00)</option></select><Icon name="down" /></div></div></div>
<div className="fl"><label htmlFor="msg">Message</label><textarea id="msg" placeholder="e.g. I would like to view the MT-07 on Saturday morning."></textarea></div>
<label className="chk"><input type="checkbox" defaultChecked /><span>Text me updates about this enquiry. We never share your details. See our <Link href="/legal/privacy">privacy policy</Link>.</span></label>
<button className="btn btn-red" type="submit">Send enquiry <Icon name="right" /></button>
</div>
</LeadForm>
<div className="side stick">
<div className="hours">
<h3>Opening hours <span>Open now</span></h3>
<dl><dt className="today">Monday to Friday</dt><dd className="today">9:00 to 17:30</dd><dt>Saturday</dt><dd>9:00 to 16:00</dd><dt>Sunday</dt><dd>Closed</dd><dt>Bank holidays</dt><dd>Call ahead</dd></dl>
<p>Viewings by appointment basis only, so the bike is ready when you arrive.</p>
</div>
<div className="mapbox" id="map">
<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<rect width="600" height="400" fill="#e4e5df" />
<rect x="20" y="20" width="150" height="110" fill="#d3dfc8" />
<rect x="420" y="250" width="170" height="140" fill="#d3dfc8" />
<path d="M-20 340 C120 300 220 360 360 330 S560 280 640 300" stroke="#bcd3e3" strokeWidth="22" fill="none" />
<g stroke="#fff" strokeWidth="14" fill="none">
<path d="M0 160 H600" /><path d="M0 250 H600" /><path d="M200 0 V400" /><path d="M380 0 V400" /><path d="M90 0 V400" /><path d="M500 0 V230" />
</g>
<g stroke="#fff" strokeWidth="6" fill="none"><path d="M0 70 H600" /><path d="M290 0 V400" /><path d="M200 210 H380" /><path d="M380 110 H600" /></g>
<path d="M0 400 L260 0" stroke="#f6d36b" strokeWidth="18" fill="none" />
<path d="M0 400 L260 0" stroke="#fff" strokeWidth="2" strokeDasharray="10 10" fill="none" />
<g fill="#d6d6cf"><rect x="210" y="170" width="70" height="32" /><rect x="300" y="170" width="70" height="32" /><rect x="300" y="120" width="70" height="32" /><rect x="390" y="170" width="100" height="70" /><rect x="100" y="170" width="90" height="70" /></g>
<text x="30" y="150" fontFamily="Arial" fontSize="12" fill="#6f7a66">Park</text>
<text x="395" y="154" fontFamily="Arial" fontSize="12" fill="#8a8a84">High Street</text>
<text x="210" y="242" fontFamily="Arial" fontSize="12" fill="#8a8a84">Station Road</text>
</svg>
<span className="mpin" aria-hidden="true"></span>
<span className="pinlab"><Icon name="pin" />GearUp Motorcycles</span>
<div className="mfoot"><span><b>{addrMain}</b><small>{addrRest}</small></span><a href={mapUrl} className="btn btn-ink" target="_blank" rel="noopener">Get directions</a></div>
</div>
</div>
</div>
</div>
</section>
<section className="sec">
<div className="wrap">
<div className="sh"><div><span className="tag">Can&apos;t make it in?</span><h2 className="disp">Buy from <em>anywhere</em> in the UK</h2><p>Most of our customers never visit. Here is how they do it.</p></div></div>
<div className="alt">
<div className="icard"><div className="ic red"><Icon name="play" /></div><h3>Video walkaround</h3><p>Every bike has a filmed walkaround. Want a closer look? Book a live video call and we will start it up for you.</p><Link href="/used-bikes" className="lnk mt1">Watch the videos <Icon name="right" /></Link></div>
<div className="icard"><div className="ic"><Icon name="lock" /></div><h3>Reserve for £99</h3><p>Pay the deposit online and the bike comes off sale. The £99 comes off the price.</p><Link href="/faq#buying" className="lnk mt1">How reserving works <Icon name="right" /></Link></div>
<div className="icard"><div className="ic"><Icon name="truck" /></div><h3>Delivered to your door</h3><p>Nationwide delivery priced per mile from our showroom. Call or message us for a price.</p><a href="#enquiry" className="lnk mt1">Ask for a delivery price <Icon name="right" /></a></div>
</div>
</div>
</section>
<section className="sec paper">
<div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.8fr) minmax(0,1.2fr)', gap: '50px' }} id="faqgrid">
<div><span className="sh"><span className="tag">FAQs</span></span><h2 className="disp" style={{ fontSize: '64px', marginTop: '12px' }}>Before you <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>get in touch</em></h2><p className="muted" style={{ marginTop: '12px', fontSize: '17px' }}>Quick answers to what people ask us most.</p><Link href="/faq" className="btn btn-ink mt2">All FAQs <Icon name="right" /></Link></div>
<FaqList section="contact" openFirst />
</div>
</section>

    </div>
  );
}
