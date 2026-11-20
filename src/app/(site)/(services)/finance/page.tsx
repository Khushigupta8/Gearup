import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadForm } from '@/components/forms/LeadForm';
import { FinanceSlider } from '@/components/info/FinanceSlider';
import { Icon } from '@/components/ui/Icon';
import '@/styles/pages/finance.css';

export const metadata: Metadata = {
  title: 'Motorbike Finance',
  description: 'Spread the cost of your next used motorbike. Check your eligibility, work out your monthly payments and apply online. 19.9% APR representative, subject to status.',
};

export default function FinancePage() {
  return (
    <div className="pg-finance" style={{ display: 'contents' }}>


<section className="phero">
<div className="slab" aria-hidden="true"></div>
<div className="wrap">
<div>
<div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Finance</span></div>
<h1 className="disp">Motorbike <em>finance</em></h1>
<p className="lede">Spread the cost of any bike in stock over 2 to 5 years. Work out your monthly payment, check your eligibility, then reserve your bike for £99.</p>
<div className="ctas">
<a href="#apply" className="btn btn-red">Check my eligibility <Icon name="right" /></a>
<a href="#calc" className="btn btn-ghost">Work out my payments</a>
</div>
</div>
<div className="pbox"><b>19.9%</b><small>APR representative. Bikes from £2,295, or about £68 a month. Finance subject to status and affordability.</small></div>
</div>
</section>
<section className="sec">
<div className="wrap">
<div className="sh"><div><span className="tag">How it works</span><h2 className="disp">HP or PCP? <em>Plain English.</em></h2><p>Two ways to pay monthly. Both are fixed-rate loans secured on the bike. The difference is what happens at the end.</p></div><a href="#faq" className="lnk">Finance questions <Icon name="right" /></a></div>
<div className="hpcp">
<article className="icard red">
<span className="tagx">Most popular</span>
<h3 className="mt1">Hire purchase <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>(HP)</em></h3>
<p>Pay a deposit, then fixed monthly payments. After the last payment the bike is yours. Simple.</p>
<ul className="clist">
<li><Icon name="check" />Fixed payments that never change</li>
<li><Icon name="check" />No mileage limit</li>
<li><Icon name="check" />You own the bike at the end</li>
<li><Icon name="check" />Your part-exchange can be the deposit</li>
</ul>
<p className="for"><b>Best for:</b> riders who want to keep the bike and pay it off in full.</p>
</article>
<article className="icard ink">
<span className="tagx">Ask about it</span>
<h3 className="mt1">Personal contract purchase <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>(PCP)</em></h3>
<p>Lower monthly payments, with a larger final payment at the end. Then choose: pay it and keep the bike, hand it back, or trade it in.</p>
<ul className="clist">
<li><Icon name="check" />Lower monthly cost than HP</li>
<li><Icon name="check" />Three choices at the end</li>
<li><Icon name="check" />Agreed annual mileage applies</li>
<li><Icon name="check" />Not available on every bike</li>
</ul>
<p className="for"><b>Best for:</b> riders who like to change bikes every few years. Ask us if PCP is available on the bike you want.</p>
</article>
</div>
<ol className="how mt3">
<li><span className="ic"><Icon name="search" /></span><h4><small>Step 01</small>Pick a bike</h4><p>Find your bike and see its monthly price on every stock card.</p></li>
<li><span className="ic"><Icon name="doc" /></span><h4><small>Step 02</small>Check eligibility</h4><p>Fill in the form below. It takes about five minutes.</p></li>
<li><span className="ic"><Icon name="phone" /></span><h4><small>Step 03</small>Get your answer</h4><p>We come back to you with your options. No pressure to go ahead.</p></li>
<li><span className="ic"><Icon name="key" /></span><h4><small>Step 04</small>Sign and ride</h4><p>Sign online, then collect your bike or have it delivered.</p></li>
</ol>
</div>
</section>
<section className="sec dark" id="calc">
<div className="wrap">
<div className="sh"><div><span className="tag">Finance calculator</span><h2 className="disp">What will it <em>cost a month?</em></h2><p>Move the sliders. Figures are a guide based on HP at 19.9% APR representative. Your actual rate depends on your circumstances.</p></div></div>
<div className="fx-calc">
<div>
<FinanceSlider />
<p className="rep">Calculator figures are for illustration only and are not an offer of credit. Finance subject to status and affordability. Over 18s and UK residents only.</p>
</div>
<div className="fx-side">
<div className="icard dk"><div className="ic red"><Icon name="tag" /></div><h3>Part-ex as your deposit</h3><p>Got a bike to trade in? Its value can go straight towards your deposit and bring the monthly figure down.</p><Link href="/part-exchange" className="lnk mt1" style={{ color: '#fff' }}>Value my bike <Icon name="right" /></Link></div>
<div className="icard dk"><div className="ic"><Icon name="search" /></div><h3>Shop by monthly budget</h3><p>Every bike on our site shows a monthly figure, so you can shop by what you want to pay.</p>
<ul className="clist"><li><Icon name="check" />Up to £100 a month: 6 bikes</li><li><Icon name="check" />Up to £150 a month: 9 bikes</li><li><Icon name="check" />Up to £200 a month: 15 bikes</li></ul>
<Link href="/used-bikes" className="lnk mt2" style={{ color: '#fff' }}>Browse bikes <Icon name="right" /></Link></div>
</div>
</div>
</div>
</section>
<section className="sec paper" id="apply">
<div className="wrap">
<div className="sh"><div><span className="tag">Apply online</span><h2 className="disp">Check your <em>eligibility</em></h2><p>Tell us a little about you. We will look at the options available and come back to you, usually the same working day.</p></div></div>
<div className="split">
<LeadForm
  type="finance"
  className="formcard"
  success={
    <>
      <h2>Thanks. We have your details.</h2>
      <div className="success mt2">
        <Icon name="check" />
        Application received. Our finance team will be in touch, usually the same working day.
      </div>
      <Link href="/used-bikes" className="btn btn-ink mt2">
        Keep browsing bikes
      </Link>
    </>
  }
>
<h2>Finance application</h2>
<p>All fields are required unless marked optional.</p>
<div className="softnote mt2"><Icon name="info" /><span><b>Checking your eligibility</b> uses a soft search where the lender offers one, which is not visible to other lenders. A full credit check is only made if you choose to go ahead with an application. We will tell you before that happens.</span></div>
<div className="fsec"><h3><span>01</span>The bike</h3>
<div className="frow mt2">
<div className="fl"><label htmlFor="fb">Bike you are interested in</label><div className="sel"><select id="fb"><option>2019 BMW R 1250 GS · £11,495</option><option>2018 Triumph Street Triple RS · £6,495</option><option>2021 Yamaha MT-07 · £5,295</option><option>2020 Kawasaki Z900 · £6,295</option><option>Not chosen yet</option></select><Icon name="down" /></div></div>
<div className="fl"><label htmlFor="fd">Deposit (optional)</label><input id="fd" placeholder="£0" inputMode="numeric" /><small>Include any part-exchange value.</small></div>
</div>
<div className="mt2"><span className="lbl fxl">Type of finance</span>
<div className="radios"><label className="rcard on"><input type="radio" name="ft" defaultChecked /><span className="dot"></span><span><b>Hire purchase</b><small>Own it at the end</small></span></label><label className="rcard"><input type="radio" name="ft" /><span className="dot"></span><span><b>PCP</b><small>Where available</small></span></label><label className="rcard"><input type="radio" name="ft" /><span className="dot"></span><span><b>Not sure</b><small>Help me choose</small></span></label></div>
</div>
</div>
<div className="fsec"><h3><span>02</span>About you</h3>
<div className="form mt2">
<div className="frow three"><div className="fl"><label htmlFor="ftt">Title</label><div className="sel"><select id="ftt"><option>Mr</option><option>Mrs</option><option>Ms</option><option>Miss</option><option>Mx</option><option>Dr</option></select><Icon name="down" /></div></div><div className="fl"><label htmlFor="ffn">First name</label><input id="ffn" placeholder="First name" /></div><div className="fl"><label htmlFor="fln">Last name</label><input id="fln" placeholder="Last name" /></div></div>
<div className="frow three"><div className="fl"><label htmlFor="fdob">Date of birth</label><input id="fdob" placeholder="DD / MM / YYYY" /></div><div className="fl"><label htmlFor="fem">Email</label><input id="fem" type="email" placeholder="you@example.com" /></div><div className="fl"><label htmlFor="fmb">Mobile</label><input id="fmb" placeholder="07..." /></div></div>
<div className="frow"><div className="fl"><label htmlFor="fms">Marital status</label><div className="sel"><select id="fms"><option>Please choose</option><option>Single</option><option>Married or civil partnership</option><option>Living with partner</option><option>Separated or divorced</option><option>Widowed</option></select><Icon name="down" /></div></div><div className="fl"><label htmlFor="fdep">Dependants</label><div className="sel"><select id="fdep"><option>0</option><option>1</option><option>2</option><option>3</option><option>4 or more</option></select><Icon name="down" /></div></div></div>
<div className="fl"><label htmlFor="flic">Licence held</label><div className="sel"><select id="flic"><option>Full A licence</option><option>A2 licence</option><option>A1 licence</option><option>CBT only</option><option>Provisional, taking test</option></select><Icon name="down" /></div></div>
</div>
</div>
<div className="fsec"><h3><span>03</span>Your address</h3>
<div className="form mt2">
<div className="frow"><div className="fl"><label htmlFor="fpc">Postcode</label><input id="fpc" placeholder="e.g. M1 1AA" style={{ textTransform: 'uppercase' }} /></div><div className="fl"><label>&nbsp;</label><button className="btn btn-ink" type="button" style={{ width: '100%', height: '52px', fontSize: '16px' }}>Find address</button></div></div>
<div className="fl"><label htmlFor="fa1">Address</label><input id="fa1" placeholder="House number and street" /></div>
<div className="frow"><div className="fl"><label htmlFor="fty">Town or city</label><input id="fty" placeholder="Town or city" /></div><div className="fl"><label htmlFor="fres">Residential status</label><div className="sel"><select id="fres"><option>Homeowner</option><option>Renting</option><option>Living with parents</option><option>Council or housing association</option><option>Other</option></select><Icon name="down" /></div></div></div>
<div className="frow"><div className="fl"><label htmlFor="fyy">Time at address: years</label><input id="fyy" placeholder="Years" inputMode="numeric" /></div><div className="fl"><label htmlFor="fmm">Months</label><input id="fmm" placeholder="Months" inputMode="numeric" /><small>Under 3 years? We will ask for your previous address.</small></div></div>
</div>
</div>
<div className="fsec"><h3><span>04</span>Employment and income</h3>
<div className="form mt2">
<div className="frow"><div className="fl"><label htmlFor="fes">Employment status</label><div className="sel"><select id="fes"><option>Full-time employed</option><option>Part-time employed</option><option>Self-employed</option><option>Retired</option><option>Student</option><option>Not working</option></select><Icon name="down" /></div></div><div className="fl"><label htmlFor="foc">Job title</label><input id="foc" placeholder="e.g. Electrician" /></div></div>
<div className="frow"><div className="fl"><label htmlFor="femp">Employer</label><input id="femp" placeholder="Employer name" /></div><div className="fl"><label htmlFor="fet">Time with employer</label><div className="sel"><select id="fet"><option>Under 1 year</option><option>1 to 2 years</option><option>3 to 5 years</option><option>Over 5 years</option></select><Icon name="down" /></div></div></div>
<div className="frow"><div className="fl"><label htmlFor="finc">Monthly take-home pay</label><input id="finc" placeholder="£" inputMode="numeric" /><small>After tax and National Insurance.</small></div><div className="fl"><label htmlFor="fout">Monthly rent or mortgage</label><input id="fout" placeholder="£" inputMode="numeric" /><small>Your share only.</small></div></div>
</div>
</div>
<div className="fsec"><h3><span>05</span>Consent</h3>
<div className="form mt2">
<label className="chk"><input type="checkbox" />I confirm I am 18 or over, a UK resident, and the details I have given are true and complete.</label>
<label className="chk"><input type="checkbox" />I agree that GearUp and its lending partners may check my eligibility using a soft search, and I understand a full credit check will only be made if I choose to apply.</label>
<label className="chk"><input type="checkbox" /><span>I have read the <Link href="/faq" style={{ textDecoration: 'underline' }}>privacy notice</Link> and understand how my details will be used.</span></label>
<label className="chk"><input type="checkbox" />Send me offers and new stock by email or text (optional).</label>
<button className="btn btn-red" type="submit">Check my eligibility <Icon name="right" /></button>
<div className="secure"><Icon name="lock" />Your details are encrypted and sent securely.</div>
</div>
</div>
</LeadForm>
<aside className="stick">
<div className="elig">
<h3>Can I <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>apply?</em></h3>
<p style={{ color: '#b9b9c0', marginTop: '8px', fontSize: '15px' }}>You can check your eligibility if you:</p>
<ul className="clist">
<li><Icon name="check" />Are 18 or over</li>
<li><Icon name="check" />Live in the UK with 3 years of address history</li>
<li><Icon name="check" />Have a UK bank account</li>
<li><Icon name="check" />Have a regular income from work, self-employment or a pension</li>
<li><Icon name="check" />Hold the right licence for the bike, or are working towards it</li>
</ul>
<div className="need"><b>Have these to hand</b>
<ul><li><Icon name="doc" />Driving licence</li><li><Icon name="home" />Address for the last 3 years</li><li><Icon name="card" />Bank details and income</li></ul>
</div>
</div>
<div className="icard mt1"><div className="h4" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ color: 'var(--red)' }} className="icwrap"><Icon name="info" /></span>Poor credit history?</div><p style={{ fontSize: '15px' }}>Talk to us anyway. We will look at the options available to you. Finance is subject to status and affordability.</p></div>
<div className="icard mt1"><div className="h4" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><span style={{ color: 'var(--red)' }} className="icwrap"><Icon name="phone" /></span>Rather talk it through?</div><p style={{ fontSize: '15px' }}>Call or WhatsApp the showroom and we will fill it in with you.</p><Link href="/contact" className="lnk mt1">Contact us <Icon name="right" /></Link></div>
</aside>
</div>
</div>
</section>
<section className="sec">
<div className="wrap repx">
<div>
<div className="sh" style={{ marginBottom: '24px' }}><div><span className="tag">Representative example</span><h2 className="disp">The <em>numbers</em></h2><p>Hire purchase on a 2018 Triumph Street Triple RS, £0 deposit, over 48 months.</p></div></div>
<div style={{ overflowX: 'auto' }}><table className="ptable">
<thead><tr><th>Item</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
<tbody>
<tr><td>Cash price</td><td><b>£6,495.00</b></td></tr>
<tr><td>Deposit</td><td><b>£0.00</b></td></tr>
<tr><td>Total amount of credit</td><td><b>£6,495.00</b></td></tr>
<tr><td>Duration of agreement<small>Monthly payments</small></td><td><b>48 months</b></td></tr>
<tr className="big"><td>Monthly payment</td><td><b>£191.77</b></td></tr>
<tr><td>Total charge for credit</td><td><b>£2,709.73</b></td></tr>
<tr><td>Total amount payable</td><td><b>£9,204.73</b></td></tr>
<tr><td>Fixed rate of interest</td><td><b>18.29% p.a.</b></td></tr>
<tr className="big"><td>Representative APR</td><td><b>19.9% APR</b></td></tr>
</tbody>
</table></div>
</div>
<div>
<div className="notice" style={{ marginTop: '6px' }}><Icon name="info" /><span>Finance is subject to status and affordability. Applicants must be 18 or over and UK residents. Terms and conditions apply. Rates offered depend on your circumstances and may differ from the representative example.</span></div>
<div className="prose" style={{ marginTop: '10px' }}>
<p>GearUp Motorcycles acts as a credit broker, not a lender. We work with a panel of lenders to find finance that suits you. We may receive a commission from the lender, which does not change the amount you pay.</p>
<p style={{ color: 'var(--mut)', fontSize: '15px' }}>Registered company and FCA firm reference details: <b>[to be added]</b>.</p>
</div>
<div className="icard mt2" style={{ background: 'var(--paper)', borderColor: 'var(--paper)' }}>
<h3 style={{ marginTop: 0 }}>Ready when you are</h3>
<p>Found the bike? Reserve it for £99 now and sort finance before you collect.</p>
<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}><Link href="/used-bikes" className="btn btn-red">Browse bikes</Link><Link href="/used-bikes/2019-bmw-r1250gs/reserve" className="btn btn-ink">Reserve for £99</Link></div>
</div>
</div>
</div>
</section>
<section className="sec paper" id="faq">
<div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.8fr) minmax(0,1.2fr)', gap: '50px' }} id="faqgrid">
<div><span className="sh"><span className="tag">Finance FAQs</span></span><h2 className="disp" style={{ fontSize: '64px', marginTop: '12px' }}>Finance, <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>answered</em></h2><p className="muted" style={{ marginTop: '12px', fontSize: '17px' }}>Anything not covered here, call or WhatsApp us and we will talk you through it.</p><Link href="/faq" className="btn btn-ink mt2">All FAQs <Icon name="right" /></Link></div>
<div className="faq">
<details open><summary>Will checking my eligibility affect my credit score?</summary><p>Checking your eligibility uses a soft search where the lender offers one. Soft searches are not visible to other lenders. A full credit check only happens if you choose to go ahead with an application, and we will tell you before it does.</p></details>
<details><summary>Can I get finance with bad credit?</summary><p>Often, yes. Apply and we will look at the options available to you. Finance is always subject to status and affordability.</p></details>
<details><summary>Do I need a deposit?</summary><p>Not always. Many riders pay £0 deposit. A deposit or part-exchange lowers your monthly payment and the total interest you pay.</p></details>
<details><summary>Can I use my old bike as the deposit?</summary><p>Yes. Get a part-exchange valuation and the agreed value goes towards your deposit. If there is finance outstanding on your old bike, tell us and we can settle it as part of the deal.</p></details>
<details><summary>Can I pay it off early?</summary><p>Yes. You can settle a finance agreement early at any time. The lender will give you a settlement figure, which usually includes a reduction in interest.</p></details>
<details><summary>Can I reserve the bike while finance is checked?</summary><p>Yes. Pay the £99 reservation deposit and the bike comes off sale. The £99 comes off the price of the bike.</p></details>
</div>
</div>
</section>

    </div>
  );
}
