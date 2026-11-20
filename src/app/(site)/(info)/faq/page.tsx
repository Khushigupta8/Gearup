import type { Metadata } from 'next';
import Link from 'next/link';
import { FaqSearch } from '@/components/info/FaqSearch';
import { Icon } from '@/components/ui/Icon';
import '@/styles/pages/faq.css';

export const metadata: Metadata = {
  title: 'Help and FAQs',
  description: 'Answers on reserving a bike, finance, part-exchange, delivery, your account, warranty, the workshop and accessories orders.',
};

export default function FaqPage() {
  return (
    <div className="pg-faq" style={{ display: 'contents' }}>


<section className="phero">
<div className="slab" aria-hidden="true"></div>
<div className="wrap" style={{ alignItems: 'center' }}>
<div>
<div className="crumbs"><Link href="/">Home</Link><span className="s">/</span><span>Help and FAQs</span></div>
<h1 className="disp">Questions <em>answered</em></h1>
<p className="lede">Buying, finance, delivery, warranty and the workshop. Straight answers, no small print games.</p>
<FaqSearch />
<div className="fpop"><span>Popular:</span><a href="#buying">Reserving for £99</a><a href="#delivery">Delivery</a><a href="#warranty">Warranty</a></div>
</div>
<div className="fcats">
<a href="#buying"><Icon name="card" />Buying</a>
<a href="#finance"><Icon name="tag" />Finance</a>
<a href="#px"><Icon name="key" />Part-exchange</a>
<a href="#delivery"><Icon name="truck" />Delivery</a>
<a href="#account"><Icon name="user" />My account</a>
<a href="#warranty"><Icon name="shield" />Warranty</a>
<a href="#workshop"><Icon name="wrench" />Workshop</a>
<a href="#accessories"><Icon name="bag" />Accessories</a>
</div>
</div>
</section>
<section className="sec" style={{ paddingTop: '56px' }}>
<div className="wrap fhub">
<nav className="faqnav" aria-label="FAQ categories">
<div className="h4">Categories</div>
<a href="#buying" className="on">Buying &amp; reserving<i>6</i></a>
<a href="#finance">Finance<i>5</i></a>
<a href="#px">Part-ex &amp; selling<i>5</i></a>
<a href="#delivery">Delivery &amp; collection<i>6</i></a>
<a href="#account">My account<i>3</i></a>
<a href="#warranty">Warranty &amp; returns<i>6</i></a>
<a href="#workshop">Workshop<i>5</i></a>
<a href="#accessories">Accessories orders<i>4</i></a>
<div className="stuck"><b>Still stuck?</b><p>Talk to a real person. Monday to Saturday.</p><Link href="/contact" className="btn btn-red">Contact us</Link></div>
</nav>
<div>
<div className="fgrp" id="buying">
<div className="gh"><span className="ic"><Icon name="card" /></span><h2>Buying &amp; reserving</h2><Link href="/used-bikes" className="lnk">Browse bikes <Icon name="right" /></Link></div>
<div className="faq">
<details open><summary>How does reserving online work?</summary><p>Pay the £99 deposit on the bike&apos;s page. The bike comes off sale straight away and the £99 comes off the price. An account is made for you so you can follow the prep.</p></details>
<details><summary>Is the £99 deposit refundable?</summary><p>Yes, if the bike fails its pre-sale checks. The full reservation terms are shown before you pay.</p></details>
<details><summary>What checks has every bike had?</summary><p>An HPI check, our 120-point inspection, an MOT where needed and a full valet. You can see each stage tick off in your account.</p></details>
<details><summary>Can I see the bike before I buy?</summary><p>Yes. Visit the showroom, watch the walkaround video on the bike&apos;s page, or ask us for a live video call.</p></details>
<details><summary>How do I pay the balance?</summary><p>By bank transfer, card or finance, less any part-exchange. The balance is due before collection or delivery.</p></details>
<details><summary>Do you sell 125cc and learner bikes?</summary><p>Yes. Use the 125cc and learner filter on our <Link href="/used-bikes">motorbikes</Link> page to see what is in stock.</p></details>
</div>
</div>
<div className="fgrp" id="finance">
<div className="gh"><span className="ic"><Icon name="tag" /></span><h2>Finance</h2><Link href="/finance" className="lnk">Finance options <Icon name="right" /></Link></div>
<div className="faq">
<details><summary>What is the representative APR?</summary><p>19.9% APR representative. For example, a £6,495 bike over 48 months with no deposit is £191.77 a month, £9,204.73 in total. Finance is subject to status and affordability.</p></details>
<details><summary>Can I get finance with poor credit?</summary><p>Often, yes. Apply online and we will look at the options available to you. Every application is subject to status.</p></details>
<details><summary>How long can I spread the cost?</summary><p>Usually 2 to 5 years. Use the calculator on the <Link href="/finance">finance page</Link> to see monthly figures.</p></details>
<details><summary>Do I need a deposit for finance?</summary><p>Not always. You can put down cash or use your part-exchange as a deposit to lower the monthly payment.</p></details>
<details><summary>Can I reserve first and apply later?</summary><p>Yes. Reserve for £99, then apply from your account before your collection or delivery date.</p></details>
</div>
</div>
<div className="fgrp" id="px">
<div className="gh"><span className="ic"><Icon name="key" /></span><h2>Part-exchange &amp; selling</h2><Link href="/part-exchange" className="lnk">Value my bike <Icon name="right" /></Link></div>
<div className="faq">
<details><summary>How do I get a part-exchange valuation?</summary><p>Enter your registration and mileage on the <Link href="/part-exchange">part-exchange page</Link> or on any bike page. We confirm the figure when we see the bike.</p></details>
<details><summary>Can I part-exchange if I still owe finance?</summary><p>Usually, yes. Tell us when you ask for a valuation and we will talk you through it.</p></details>
<details><summary>Can I sell you my bike without buying one?</summary><p>Yes. Use <Link href="/sell-your-bike">sell your bike</Link> for a valuation. We buy bikes outright.</p></details>
<details><summary>What happens to my part-exchange on delivery day?</summary><p>Tell us when you reserve and we will agree the handover of your old bike with you.</p></details>
<details><summary>What do I need to bring?</summary><p>All keys, the V5C logbook, the service history and any MOT certificates you have.</p></details>
</div>
</div>
<div className="fgrp" id="delivery">
<div className="gh"><span className="ic"><Icon name="truck" /></span><h2>Delivery &amp; collection</h2><Link href="/contact" className="lnk">Ask for a price <Icon name="right" /></Link></div>
<div className="faq">
<details><summary>Where do you deliver?</summary><p>We deliver nationwide. For islands, call us before you reserve.</p></details>
<details><summary>How much is delivery?</summary><p>It is priced per mile from our showroom by road. Tell us your postcode when you reserve, or <Link href="/contact">ask us</Link>, and we will confirm the price before booking.</p></details>
<details><summary>When do I pay for delivery?</summary><p>With the balance, before your bike is delivered. We confirm the price with you first.</p></details>
<details><summary>Is collection free?</summary><p>Yes. Collect from the showroom at a time we agree. We call you to book it in.</p></details>
<details><summary>Do I need to be in?</summary><p>Yes, or someone you trust. The handover checklist has to be signed and we hand over the keys and paperwork in person.</p></details>
<details><summary>Can I switch between collection and delivery?</summary><p>Yes, any time before your bike is ready. Just call us.</p></details>
</div>
</div>
<div className="fgrp" id="account">
<div className="gh"><span className="ic"><Icon name="user" /></span><h2>My account</h2><Link href="/account" className="lnk">My account <Icon name="right" /></Link></div>
<div className="faq">
<details><summary>What can I see in my account?</summary><p>Your reserved bike with the deposit paid and balance left, your accessories orders, your saved bikes and your part-exchange details.</p></details>
<details><summary>I collected my bike. Can I still use my account?</summary><p>Yes. Your orders and saved bikes stay in your account.</p></details>
<details><summary>I cannot log in. What do I do?</summary><p>Use &quot;Forgot password&quot; on the <a href="/login">sign-in page</a>, or call us and we will sort it.</p></details>
</div>
</div>
<div className="fgrp" id="warranty">
<div className="gh"><span className="ic"><Icon name="shield" /></span><h2>Warranty &amp; returns</h2><Link href="/warranty" className="lnk">Warranty details <Icon name="right" /></Link></div>
<div className="faq">
<details><summary>What warranty comes with every bike?</summary><p>Every bike comes with 30 days&apos; warranty as standard.</p></details>
<details><summary>What does the red warranty badge mean?</summary><p>Bikes with the red badge include longer cover free: 3, 6, 12 or 24 months, as shown on the badge.</p></details>
<details><summary>Can I extend my warranty?</summary><p>Yes. You can add longer cover to any bike at checkout. See the <Link href="/warranty">warranty page</Link> for options.</p></details>
<details><summary>What is the 14-day money back?</summary><p>If the bike is not right for you, you have 14 days to tell us. Call us first and we will explain how the return works.</p></details>
<details><summary>What is the 120-point inspection?</summary><p>Our technicians check engine, brakes, suspension, wheels, electrics and frame, then road test the bike. See the <Link href="/warranty#inspection">full checklist</Link>.</p></details>
<details><summary>How do I make a warranty claim?</summary><p>Call or message us with your order number. Your warranty documents are saved in your account.</p></details>
</div>
</div>
<div className="fgrp" id="workshop">
<div className="gh"><span className="ic"><Icon name="wrench" /></span><h2>Workshop</h2><Link href="/workshop" className="lnk">Book a service <Icon name="right" /></Link></div>
<div className="faq">
<details><summary>Do you work on bikes not bought from you?</summary><p>Yes. We service, MOT and repair all makes, bought from us or not.</p></details>
<details><summary>How do I book an MOT?</summary><p>Use the booking form on the <Link href="/workshop#book">workshop page</Link>. Enter your reg, pick a slot and we text to confirm.</p></details>
<details><summary>Will you do extra work without asking?</summary><p>No. If we find something beyond what you booked, we call you with a price first.</p></details>
<details><summary>Do you fit tyres?</summary><p>Yes. Bring your own or we order the right pair for you.</p></details>
<details><summary>Will you stamp my service book?</summary><p>Yes, and you get a written note of the work done.</p></details>
</div>
</div>
<div className="fgrp" id="accessories">
<div className="gh"><span className="ic"><Icon name="bag" /></span><h2>Accessories orders</h2><Link href="/accessories" className="lnk">Shop accessories <Icon name="right" /></Link></div>
<div className="faq">
<details><summary>Do you post accessories?</summary><p>Yes, anywhere in the UK. Or pick your order up from the showroom.</p></details>
<details><summary>Can I try on a helmet first?</summary><p>Yes. Visit the showroom and our team will help you find the right size and fit.</p></details>
<details><summary>Can I return something?</summary><p>Unused items in their original packaging can be returned. Call us first and quote your order number.</p></details>
<details><summary>Where do I see my accessories order?</summary><p>In your <Link href="/account/orders">account</Link>, under My orders.</p></details>
</div>
</div>
</div>
</div>
</section>
<section className="sec paper">
<div className="wrap">
<div className="sh"><div><span className="tag">Contact</span><h2 className="disp">Can&apos;t find <em>your answer?</em></h2><p>Talk to a real person at the showroom. Quote your order number if you have one.</p></div><Link href="/contact" className="btn btn-red">Contact page <Icon name="right" /></Link></div>
<div className="cblocks">
<Link href="/contact" className="cblock"><span className="ic"><Icon name="phone" /></span><div><b>Call us</b><span>0744 072 1478</span><span>Monday to Saturday, see hours below</span></div></Link>
<Link href="/contact" className="cblock"><span className="ic"><Icon name="chat" /></span><div><b>WhatsApp</b><span>Message us any time</span><span>We reply in opening hours</span></div></Link>
<Link href="/contact" className="cblock"><span className="ic"><Icon name="mail" /></span><div><b>Email</b><span>sales@gearupmotorcycles.co.uk</span><span>For orders, quote GU-number</span></div></Link>
</div>
</div>
</section>

    </div>
  );
}
