/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { pageMetadata } from '@/server/services/cms';
import { FaqList } from '@/components/cms/FaqList';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import '@/styles/pages/warranty.css';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/warranty', {
  title: 'Warranty and 120-Point Inspection',
  description: 'Every GearUp bike comes with 30 days warranty and a 120-point inspection. Selected bikes include 3, 6, 12 or 24 months cover free.',
});
}

export default function WarrantyPage() {
  return (
    <div className="pg-warranty" style={{ display: 'contents' }}>


<section className="phero">
<div className="slab" aria-hidden="true"></div>
<div className="wrap">
<div>
<div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Warranty &amp; inspection</span></div>
<h1 className="disp">Warranty <em>&amp; inspection</em></h1>
<p className="lede">Every bike we sell passes a 120-point inspection and an HPI check, and leaves with 30 days&apos; warranty. Selected bikes include up to 24 months free.</p>
<div className="ctas">
<a href="#inspection" className="btn btn-red">See the 120 checks <Icon name="right" /></a>
<a href="#claim" className="btn btn-ghost">Make a claim</a>
</div>
</div>
<div className="pbox"><b>30 days</b><small>Warranty on every bike as standard. Look for the red badge for longer cover included free.</small></div>
</div>
</section>
<section className="sec">
<div className="wrap">
<div className="sh"><div><span className="tag">Warranty levels</span><h2 className="disp">How long <em>are you covered?</em></h2><p>Every bike gets the standard 30 days. Bikes with the red badge include longer cover at no extra cost.</p></div><Link href="/used-bikes" className="btn btn-ink">Bikes with free warranty <Icon name="right" /></Link></div>
<div className="tiers">
<div className="tier std"><span className="n">30</span><span className="u">Days</span><span className="who">Every bike</span><p>Standard on every bike we sell. Engine, gearbox and electrics covered.</p><div className="ft">Included in the price</div></div>
<div className="tier"><span className="n">3</span><span className="u">Months</span><span className="who r">Red badge</span><p>Included free on selected bikes. Shown on the stock card.</p><div className="ft">Free where shown</div></div>
<div className="tier"><span className="n">6</span><span className="u">Months</span><span className="who r">Red badge</span><p>Included free on selected bikes. Shown on the stock card.</p><div className="ft">Free where shown</div></div>
<div className="tier"><span className="n">12</span><span className="u">Months</span><span className="who r">Red badge</span><p>Free on selected bikes, or ask to extend any bike.</p><div className="ft">Free or extend</div></div>
<div className="tier"><span className="n">24</span><span className="u">Months</span><span className="who r">Red badge</span><p>Free on selected bikes, or ask to extend any bike.</p><div className="ft">Free or extend</div></div>
</div>
<p className="muted" style={{ fontSize: '13px', marginTop: '16px' }}>Extension prices depend on the bike&apos;s age, mileage and engine size. Ask us for a price when you reserve.</p>
</div>
</section>
<section className="sec paper">
<div className="wrap">
<div className="sh"><div><span className="tag">The cover</span><h2 className="disp">What&apos;s <em>covered</em></h2><p>Our warranty covers mechanical and electrical failure. It does not cover parts that wear out with normal riding. Full terms come with your bike.</p></div></div>
<div className="cov">
<div className="icard" style={{ borderTop: '4px solid var(--red)' }}>
<h3 className="h3"><span className="ic red" style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--red)', color: '#fff', clipPath: 'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)' }}><Icon name="check" /></span>Covered</h3>
<ul className="clist cols">
<li><Icon name="check" />Engine internal parts</li>
<li><Icon name="check" />Gearbox and selector</li>
<li><Icon name="check" />Clutch mechanism</li>
<li><Icon name="check" />Final drive and shaft</li>
<li><Icon name="check" />Fuel system and pump</li>
<li><Icon name="check" />Cooling system and water pump</li>
<li><Icon name="check" />Starter motor</li>
<li><Icon name="check" />Alternator and regulator</li>
<li><Icon name="check" />ECU and wiring</li>
<li><Icon name="check" />ABS pump and sensors</li>
<li><Icon name="check" />Instruments and switches</li>
<li><Icon name="check" />Parts and labour</li>
</ul>
</div>
<div className="icard" style={{ borderTop: '4px solid var(--ink)' }}>
<h3 className="h3"><span style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink)', color: '#fff', clipPath: 'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)' }}><Icon name="x" /></span>Not covered</h3>
<ul className="xlist">
<li><Icon name="x" />Wear items: tyres, brake pads, discs, chain and sprockets, clutch plates</li>
<li><Icon name="x" />Routine servicing, bulbs, fuses and batteries</li>
<li><Icon name="x" />Accident damage, theft or vandalism</li>
<li><Icon name="x" />Damage from neglect, missed services or running low on oil</li>
<li><Icon name="x" />Faults caused by modifications after you buy</li>
<li><Icon name="x" />Paint, plastics and cosmetic marks</li>
<li><Icon name="x" />Track days, racing or courier use</li>
</ul>
</div>
</div>
<div className="notice mt2"><Icon name="info" /><span>This is a summary. Your warranty booklet sets out the full terms, claim limits and what you need to do to keep cover valid. Your legal rights are not affected.</span></div>
</div>
</section>
<section className="sec dark">
<div className="wrap badge">
<div>
<div className="sh" style={{ marginBottom: 0 }}><div><span className="tag">The red badge</span><h2 className="disp">Spot the badge, <em>get the cover</em></h2><p>Some bikes come with longer warranty included free. We mark them with a red corner badge on the stock card and the bike page.</p></div></div>
<ol>
<li><span>1</span><div><b>Look for the corner badge</b><p>It shows the months of cover included, for example 3, 6, 12 or 24 months.</p></div></li>
<li><span>2</span><div><b>It&apos;s in the price</b><p>No add-on at checkout. The cover starts the day you collect or take delivery.</p></div></li>
<li><span>3</span><div><b>No badge? Still covered</b><p>Every other bike has our standard 30 days. Ask us about extending it when you reserve.</p></div></li>
</ol>
<Link href="/used-bikes" className="btn btn-red mt3">Free warranty bikes <Icon name="right" /></Link>
</div>
<div className="demo">
<span className="arrow">Example: 6 months free</span>
<article className="bc">
<Link href="/used-bikes/2019-bmw-r1250gs" className="im"><img src="/assets/images/bikes/kawasaki-ninja-zx6r.webp" alt="2020 Kawasaki Ninja ZX-6R" loading="lazy" /><span className="ribbon">6 months<br />warranty free</span><span className="pricechip"><b>£7,995</b><span>£236/mo</span></span></Link>
<div className="bd"><h3><small>Kawasaki</small><Link href="/used-bikes/2019-bmw-r1250gs">Ninja ZX-6R</Link></h3>
<div className="sp"><span><Icon name="cal" />2020</span><span><Icon name="gauge" />5,640 miles</span><span><Icon name="engine" />636cc</span></div>
<div className="ft"><Link href="/used-bikes/2019-bmw-r1250gs/reserve" className="lnk">Reserve for £99 <Icon name="right" /></Link><span className="heart"><Icon name="heart" /></span></div></div>
</article>
</div>
</div>
</section>
<section className="sec claim" id="claim">
<div className="wrap">
<div className="sh"><div><span className="tag">Making a claim</span><h2 className="disp">Something wrong? <em>Here&apos;s what to do</em></h2><p>Stop riding if it is not safe, then get in touch. Do not book repairs elsewhere before speaking to us, or the claim may not be covered.</p></div><Link href="/contact" className="btn btn-red"><Icon name="phone" />Contact the workshop</Link></div>
<ol className="how">
<li><span className="ic"><Icon name="phone" /></span><h4><small>Step 01</small>Tell us</h4><p>Call, email or WhatsApp with your order number and what the bike is doing.</p></li>
<li><span className="ic"><Icon name="search" /></span><h4><small>Step 02</small>We diagnose</h4><p>Bring it to our <Link href="/workshop">workshop</Link>, or we arrange an approved garage near you.</p></li>
<li><span className="ic"><Icon name="doc" /></span><h4><small>Step 03</small>We confirm cover</h4><p>We tell you what is covered before any work starts. No surprises.</p></li>
<li><span className="ic"><Icon name="wrench" /></span><h4><small>Step 04</small>We fix it</h4><p>Covered parts and labour are paid by the warranty. You get back on the road.</p></li>
</ol>
<div className="grid3 mt3">
<div className="icard"><div className="ic red"><Icon name="doc" /></div><h3>Keep your paperwork</h3><p>Hold on to your service receipts. You may be asked for them when you claim.</p></div>
<div className="icard"><div className="ic"><Icon name="clock" /></div><h3>Report it early</h3><p>Tell us as soon as you notice a fault. Riding on can turn a small fix into a big one.</p></div>
<div className="icard"><div className="ic"><Icon name="shield" /></div><h3>14-day money back</h3><p>Changed your mind? Return the bike within 14 days as set out in our terms.</p></div>
</div>
</div>
</section>
<section className="sec paper" id="inspection">
<div className="wrap">
<div className="sh"><div><span className="tag">120-point inspection</span><h2 className="disp">Every check, <em>in full</em></h2><p>Before a bike goes on sale our technicians work through all 120 checks. If something fails, we fix it or the bike does not go on sale. Your bike&apos;s report is in your account.</p></div><Link href="/used-bikes/2019-bmw-r1250gs" className="lnk">See an example report <Icon name="right" /></Link></div>
<div className="ibar">
<a href="#c1"><b>24</b><small>Engine &amp; drivetrain</small></a>
<a href="#c2"><b>16</b><small>Brakes &amp; ABS</small></a>
<a href="#c3"><b>18</b><small>Suspension &amp; steering</small></a>
<a href="#c4"><b>14</b><small>Wheels &amp; tyres</small></a>
<a href="#c5"><b>20</b><small>Electrics &amp; lights</small></a>
<a href="#c6"><b>28</b><small>Frame, body &amp; road test</small></a>
</div>
<div className="clgrid">
<div className="cgrp wide" id="c1"><div className="cgh"><span className="ci"><Icon name="engine" /></span><b>Engine &amp; drivetrain</b><em>24 checks</em></div><ol><li><i>001</i>Engine oil level and condition</li><li><i>002</i>Oil filter and service due date</li><li><i>003</i>Oil leaks from cases and gaskets</li><li><i>004</i>Coolant level and strength</li><li><i>005</i>Radiator, hoses and clips</li><li><i>006</i>Cooling fan switches on</li><li><i>007</i>Cold start and idle quality</li><li><i>008</i>Throttle response and return</li><li><i>009</i>Throttle cables or ride-by-wire</li><li><i>010</i>Air filter condition</li><li><i>011</i>Spark plugs, where accessible</li><li><i>012</i>Valve train and top-end noise</li><li><i>013</i>Exhaust system and mounts</li><li><i>014</i>Exhaust joints for blowing</li><li><i>015</i>Fuel tank, cap and fuel lines</li><li><i>016</i>Fuel leaks and fuel smell</li><li><i>017</i>Clutch operation and free play</li><li><i>018</i>Clutch cable or hydraulics</li><li><i>019</i>Gear selection, every gear</li><li><i>020</i>Neutral finding and neutral light</li><li><i>021</i>Chain wear and stretch</li><li><i>022</i>Chain tension and lubrication</li><li><i>023</i>Front and rear sprocket wear</li><li><i>024</i>Shaft or belt drive, where fitted</li></ol></div>
<div className="cgrp" id="c2"><div className="cgh"><span className="ci"><Icon name="shield" /></span><b>Brakes &amp; ABS</b><em>16 checks</em></div><ol><li><i>025</i>Front pad thickness</li><li><i>026</i>Rear pad thickness</li><li><i>027</i>Front disc thickness and run-out</li><li><i>028</i>Rear disc thickness and wear</li><li><i>029</i>Front caliper pistons and seals</li><li><i>030</i>Rear caliper pistons and seals</li><li><i>031</i>Brake fluid level and age</li><li><i>032</i>Brake fluid leaks</li><li><i>033</i>Front brake hoses and lines</li><li><i>034</i>Rear brake hoses and lines</li><li><i>035</i>Front lever feel and adjustment</li><li><i>036</i>Rear pedal feel and return</li><li><i>037</i>Master cylinders and reservoirs</li><li><i>038</i>ABS warning light self-test</li><li><i>039</i>ABS sensors and reluctor rings</li><li><i>040</i>Front and rear brake light switches</li></ol></div>
<div className="cgrp" id="c3"><div className="cgh"><span className="ci"><Icon name="wrench" /></span><b>Suspension &amp; steering</b><em>18 checks</em></div><ol><li><i>041</i>Fork seals for leaks</li><li><i>042</i>Fork stanchions for pitting</li><li><i>043</i>Fork damping action</li><li><i>044</i>Fork alignment and twist</li><li><i>045</i>Front preload and damping adjusters</li><li><i>046</i>Rear shock for leaks</li><li><i>047</i>Rear shock damping</li><li><i>048</i>Rear preload and adjusters</li><li><i>049</i>Rear linkage bearings</li><li><i>050</i>Swingarm pivot bearings</li><li><i>051</i>Swingarm condition</li><li><i>052</i>Head bearings for free play</li><li><i>053</i>Head bearings for notchiness</li><li><i>054</i>Handlebars straight and secure</li><li><i>055</i>Full lock both ways, cables free</li><li><i>056</i>Steering damper, where fitted</li><li><i>057</i>Yokes and clamp bolts torqued</li><li><i>058</i>Wheel alignment</li></ol></div>
<div className="cgrp" id="c4"><div className="cgh"><span className="ci"><Icon name="gauge" /></span><b>Wheels &amp; tyres</b><em>14 checks</em></div><ol><li><i>059</i>Front tyre tread depth</li><li><i>060</i>Rear tyre tread depth</li><li><i>061</i>Tyre age from DOT date</li><li><i>062</i>Sidewalls for cracks and damage</li><li><i>063</i>Tyre pressures set</li><li><i>064</i>Correct tyre size and rating</li><li><i>065</i>Front wheel bearings</li><li><i>066</i>Rear wheel bearings</li><li><i>067</i>Front rim run-out and damage</li><li><i>068</i>Rear rim run-out and damage</li><li><i>069</i>Spoke tension, where fitted</li><li><i>070</i>Valves and valve caps</li><li><i>071</i>Wheel spindles and pinch bolts</li><li><i>072</i>Cush drive rubbers</li></ol></div>
<div className="cgrp" id="c5"><div className="cgh"><span className="ci"><Icon name="key" /></span><b>Electrics &amp; lights</b><em>20 checks</em></div><ol><li><i>073</i>Battery health test</li><li><i>074</i>Battery terminals and mounting</li><li><i>075</i>Charging system output</li><li><i>076</i>Starter motor and relay</li><li><i>077</i>Headlight dipped beam</li><li><i>078</i>Headlight main beam</li><li><i>079</i>Headlight aim</li><li><i>080</i>Sidelight or daytime running light</li><li><i>081</i>Tail light</li><li><i>082</i>Brake light</li><li><i>083</i>Front indicators</li><li><i>084</i>Rear indicators</li><li><i>085</i>Hazard lights, where fitted</li><li><i>086</i>Number plate light</li><li><i>087</i>Horn</li><li><i>088</i>Dash warning lights self-test</li><li><i>089</i>Speedo, rev counter and gauges</li><li><i>090</i>Kill switch and side-stand cut-out</li><li><i>091</i>Ignition switch and all keys</li><li><i>092</i>Diagnostic fault code scan</li></ol></div>
<div className="cgrp wide" id="c6"><div className="cgh"><span className="ci"><Icon name="cal" /></span><b>Frame, bodywork &amp; road test</b><em>28 checks</em></div><ol><li><i>093</i>Frame for cracks or damage</li><li><i>094</i>Frame for weld repairs</li><li><i>095</i>Subframe condition</li><li><i>096</i>Frame number matches V5C</li><li><i>097</i>Engine number checked</li><li><i>098</i>HPI check: stolen, scrapped, written off, finance</li><li><i>099</i>Fairings and panels fit and secure</li><li><i>100</i>Paintwork and scratches recorded</li><li><i>101</i>Seat and seat lock</li><li><i>102</i>Mirrors</li><li><i>103</i>Footpegs and hangers</li><li><i>104</i>Side stand and spring</li><li><i>105</i>Centre stand, where fitted</li><li><i>106</i>Levers for damage</li><li><i>107</i>Grips and bar ends</li><li><i>108</i>Number plate legal and secure</li><li><i>109</i>Luggage, screens and accessories secure</li><li><i>110</i>Corrosion and fasteners</li><li><i>111</i>Road test: warm-up from cold</li><li><i>112</i>Road test: clutch take-up</li><li><i>113</i>Road test: gear changes up and down</li><li><i>114</i>Road test: straight-line stability</li><li><i>115</i>Road test: braking performance</li><li><i>116</i>Road test: ABS operation</li><li><i>117</i>Road test: steering and handling</li><li><i>118</i>Road test: suspension over bumps</li><li><i>119</i>Road test: unusual noises or vibration</li><li><i>120</i>Post-ride check for leaks</li></ol></div>
</div>
</div>
</section>
<section className="sec">
<div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.8fr) minmax(0,1.2fr)', gap: '50px' }} id="faqgrid">
<div><span className="sh"><span className="tag">Warranty FAQs</span></span><h2 className="disp" style={{ fontSize: '64px', marginTop: '12px' }}>Cover, <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>explained</em></h2><p className="muted" style={{ marginTop: '12px', fontSize: '17px' }}>Questions about a particular bike? Ask us before you reserve.</p><Link href="/faq" className="btn btn-ink mt2">All FAQs <Icon name="right" /></Link></div>
<FaqList section="warranty" openFirst />
</div>
</section>

    </div>
  );
}
