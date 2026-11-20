import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadForm } from '@/components/forms/LeadForm';
import { Icon } from '@/components/ui/Icon';

export const metadata: Metadata = {
  title: 'Motorbike Insurance Quotes',
  description: "Compare motorbike insurance quotes through GearUp's insurance partner and get covered before you collect your bike.",
};

export default function InsurancePage() {
  return (
    <div className="pg-insurance" style={{ display: 'contents' }}>

<section className="phero">
<div className="slab" aria-hidden="true"></div>
<div className="wrap">
<div>
<div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Insurance</span></div>
<h1 className="disp">Bike insurance <em>sorted</em></h1>
<p className="lede">Compare motorbike insurance quotes from leading UK insurers in minutes, through our trusted insurance partner. Get covered before you collect your bike.</p>
<div className="ctas"><a href="#quote" className="btn btn-red">Get a quote <Icon name="right" /></a><Link href="/contact" className="btn btn-ghost">Ask our team</Link></div>
</div>
<div className="pbox"><b>2 min</b><small>to compare quotes from UK insurers. Free, no obligation.</small></div>
</div>
</section>
<section className="sec" id="quote">
<div className="wrap">
<div className="split">
<div>
<div className="sh"><div><span className="tag">Get a quote</span><h2 className="disp">Tell us about <em>you &amp; the bike</em></h2><p>We pass your details to our insurance partner, who compares the market and shows you live prices.</p></div></div>
<LeadForm
  type="insurance"
  className="formcard"
  success={
    <div className="success">
      <Icon name="check" />
      Thanks. We have your details and will be in touch with your insurance quotes.
    </div>
  }
>
<div className="form">
<div className="fl"><label htmlFor="ireg">Bike registration</label><div className="plate" style={{ height: '56px', border: '2px solid #d8b200' }}><span><i></i>UK</span><input id="ireg" placeholder="AB12 CDE" maxLength={8} /></div><small>Buying from GearUp? Leave it blank and pick the bike below.</small></div>
<div className="fl sel"><label htmlFor="ibike">Or the GearUp bike you are buying</label><select id="ibike"><option>Choose a bike in stock</option><option>2019 BMW R 1250 GS</option><option>2021 Yamaha MT-07</option><option>2020 Kawasaki Z900</option><option>2023 Lexmoto LXR 125</option></select><Icon name="down" /></div>
<div className="frow"><div className="fl"><label htmlFor="idob">Date of birth</label><input id="idob" placeholder="DD / MM / YYYY" /></div><div className="fl sel"><label htmlFor="ilic">Licence</label><select id="ilic"><option>CBT</option><option>A1</option><option>A2</option><option>Full A</option></select><Icon name="down" /></div></div>
<div className="frow"><div className="fl"><label htmlFor="ipc">Postcode where the bike is kept</label><input id="ipc" placeholder="e.g. M1 1AA" style={{ textTransform: 'uppercase' }} /></div><div className="fl sel"><label htmlFor="icov">Cover</label><select id="icov"><option>Fully comprehensive</option><option>Third party, fire &amp; theft</option><option>Third party only</option></select><Icon name="down" /></div></div>
<div className="frow"><div className="fl"><label htmlFor="iem">Email</label><input id="iem" type="email" placeholder="you@example.com" /></div><div className="fl"><label htmlFor="imb">Mobile</label><input id="imb" placeholder="07..." /></div></div>
<label className="chk"><input type="checkbox" />I agree to my details being shared with GearUp&apos;s insurance partner to provide quotes.</label>
<button className="btn btn-red" type="submit">Compare quotes <Icon name="right" /></button>
</div>
</LeadForm>
</div>
<aside className="stick">
<div className="summary">
<h3 className="disp" style={{ fontSize: '30px' }}>Why get insured through us</h3>
<ul className="clist mt1" style={{ color: '#e2e2e6' }}><li><Icon name="check" />Quotes from leading UK motorbike insurers</li><li><Icon name="check" />Covered before you collect, so you can ride away</li><li><Icon name="check" />Learner, A2 and full-licence riders</li><li><Icon name="check" />Free to compare, no obligation</li></ul>
<p className="note">Insurance is arranged by our insurance partner, not GearUp Motorcycles. GearUp may receive a commission. Partner details to be confirmed.</p>
</div>
</aside>
</div>
</div>
</section>
<section className="sec paper">
<div className="wrap">
<div className="sh"><div><span className="tag">Good to know</span><h2 className="disp">Insurance <em>FAQs</em></h2></div></div>
<div className="faq">
<details open><summary>Do I need insurance before I collect my bike?</summary><p>Yes. You must be insured to ride away or have the bike delivered to the road. Get a quote here and set the start date to your collection or delivery day.</p></details>
<details><summary>Can I insure a 125cc on a CBT?</summary><p>Yes. Most insurers cover learner riders on a valid CBT. Make sure the L plates are on until you pass your test.</p></details>
<details><summary>Does the price depend on where I keep the bike?</summary><p>It does. Postcode, security (garage, ground anchor, alarm) and your riding history all affect the price.</p></details>
</div>
</div>
</section>

    </div>
  );
}
