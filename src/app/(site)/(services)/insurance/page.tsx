import type { Metadata } from 'next';
import { pageMetadata } from '@/server/services/cms';
import { FaqList } from '@/components/cms/FaqList';
import Link from 'next/link';
import { getPublicBikes } from '@/server/services/bikes';
import { StockBikeField } from '@/components/forms/StockBikeField';
import { LeadForm } from '@/components/forms/LeadForm';
import { Icon } from '@/components/ui/Icon';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/insurance', {
  title: 'Motorbike Insurance Quotes',
  description: "Compare motorbike insurance quotes through GearUp's insurance partner and get covered before you collect your bike.",
});
}

export default async function InsurancePage({ searchParams }: { searchParams: Promise<{ bike?: string | string[] }> }) {
  const [bikes, query] = await Promise.all([getPublicBikes(), searchParams]);
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
<StockBikeField bikes={bikes} requestedSlug={query.bike} id="ibike" label="Or the GearUp bike you are buying (optional)" />
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
<FaqList section="insurance" openFirst />
</div>
</section>

    </div>
  );
}
