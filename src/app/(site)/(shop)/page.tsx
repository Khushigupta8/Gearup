/* eslint-disable @next/next/no-img-element -- images are sized by the existing CSS */
import type { Metadata } from 'next';
import { getBanners, getBusiness, getReviews, pageMetadata } from '@/server/services/cms';
import { FaqList } from '@/components/cms/FaqList';
import Link from 'next/link';
import { BikeCard } from '@/components/bikes/BikeCard';
import { FinanceSlider } from '@/components/finance/FinanceSlider';
import { AlertForm } from '@/components/forms/AlertForm';
import { HeroCarousel, type HeroSlide } from '@/components/home/HeroCarousel';
import { SearchDock } from '@/components/home/SearchDock';
import { ValuationSection } from '@/components/home/ValuationSection';
import { Icon } from '@/components/ui/Icon';
import { RideIn, ScrollReveal } from '@/components/ui/ScrollReveal';
import { Stars } from '@/components/ui/Stars';
import { getPublicBikes } from '@/server/services/bikes';
import { gbp, monthlyPayment } from '@/lib/format';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/', {
  title: { absolute: 'GearUp Motorcycles · Quality Used Motorbikes, Delivered UK-Wide' },
  description:
    'Quality used motorbikes, inspected and warranted. Reserve online for £99, finance and part-exchange welcome, with nationwide delivery.',
});
}



const brands: { key: string; name: string; logo?: string }[] = [
  { key: 'honda', name: 'Honda', logo: 'honda.svg' },
  { key: 'yamaha', name: 'Yamaha', logo: 'yamaha.svg' },
  { key: 'kawasaki', name: 'Kawasaki' },
  { key: 'triumph', name: 'Triumph' },
  { key: 'bmw', name: 'BMW', logo: 'bmw.svg' },
  { key: 'suzuki', name: 'Suzuki', logo: 'suzuki.svg' },
  { key: 'harley', name: 'Harley-Davidson' },
  { key: 'ducati', name: 'Ducati', logo: 'ducati.svg' },
  { key: 'ktm', name: 'KTM', logo: 'ktm.svg' },
  { key: 'royalenfield', name: 'Royal Enfield', logo: 'royalenfield.svg' },
  { key: 'lexmoto', name: 'Lexmoto' },
  { key: 'vespa', name: 'Vespa', logo: 'vespa.svg' },
];

const budgets = [
  { href: '/used-bikes?monthly=100', small: 'Up to', big: '£100', note: 'a month · 6 bikes' },
  { href: '/used-bikes?monthly=150', small: 'Up to', big: '£150', note: 'a month · 9 bikes' },
  { href: '/used-bikes?monthly=200', small: 'Up to', big: '£200', note: 'a month · 15 bikes' },
  { href: '/used-bikes', small: 'From', big: '£200+', note: 'a month · 9 bikes' },
  { href: '/used-bikes?cc=125', small: 'CBT & A2 riders', big: '125cc', note: 'Learner legal · 7 bikes', learner: true },
  { href: '/used-bikes?cc=50', small: 'CBT · age 16+', big: '50cc', note: 'Mopeds & scooters · 3 bikes', learner: true },
];

const styles = [
  { key: 'sports', label: 'Sportsbike', img: 'styles/sportsbike.webp' },
  { key: 'naked', label: 'Naked', img: 'cutouts/kawasaki-z900.webp' },
  { key: 'adventure', label: 'Adventure', img: 'styles/adventure.webp' },
  { key: 'cruiser', label: 'Cruiser', img: 'styles/cruiser.webp' },
  { key: 'classic', label: 'Classic', img: 'cutouts/triumph-bonneville.webp' },
  { key: 'tourer', label: 'Tourer', img: 'styles/tourer.webp' },
  { key: 'scooter', label: 'Scooter/Moped', img: 'styles/scooter-moped.webp' },
  { key: 'enduro', label: 'Enduro', img: 'styles/enduro.webp' },
];

const why = [
  { icon: 'why-choice.png', word: 'Choice', text: "From CBT-friendly 50cc scooters to superbikes, you'll be spoilt for choice." },
  { icon: 'why-service.png', word: 'Service', text: 'Ride it for up to 14 days. Change your mind and return it for a full refund.' },
  { icon: 'why-quality.png', word: 'Quality', text: 'Every bike is warranted as standard, with the option to extend to 12 or 24 months.' },
  { icon: 'why-prices.png', word: 'Prices', text: 'Fair prices matched to age and mileage, with no hidden admin fees.' },
];

/** [feature, private seller, online classifieds]; true = tick, false = cross, string = text */
const compare: [string, string | boolean, string | boolean][] = [
  ['HPI check: not stolen, scrapped or written off', 'You pay for it', 'Sometimes'],
  ['120-point mechanical inspection', false, false],
  ['Fresh MOT and full valet', false, false],
  ['30-day warranty as standard', false, false],
  ['Finance, including poor credit', false, false],
  ['Part-exchange your old bike', false, false],
  ['Reserve online and delivery to your door', false, false],
  ['14-day money back', false, false],
];

const inspectionAreas = [
  ['Engine & drivetrain', 24],
  ['Brakes & ABS', 16],
  ['Suspension & steering', 18],
  ['Wheels & tyres', 14],
  ['Electrics & lights', 20],
  ['Frame, bodywork & road test', 28],
] as const;

const warrantyTiers = [
  { n: 30, unit: 'Days', note: 'Every bike', on: true },
  { n: 3, unit: 'Months', note: 'Selected bikes' },
  { n: 6, unit: 'Months', note: 'Selected bikes' },
  { n: 12, unit: 'Months', note: 'Free or extend' },
  { n: 24, unit: 'Months', note: 'Free or extend' },
];




function Tick({ value }: { value: string | boolean }) {
  if (typeof value === 'string') return <>{value}</>;
  return value ? (
    <svg className="i y" aria-label="Yes">
      <use href="#i-check" />
    </svg>
  ) : (
    <svg className="i n" aria-label="No">
      <use href="#i-x" />
    </svg>
  );
}

function BrandLink({ brand, hidden = false }: { brand: (typeof brands)[number]; hidden?: boolean }) {
  return (
    <Link href={`/used-bikes?make=${brand.key}`} title={brand.name} tabIndex={hidden ? -1 : undefined} aria-hidden={hidden || undefined}>
      {brand.logo ? <img src={`/assets/images/brands/${brand.logo}`} alt={brand.name} /> : <span className={`wm wm-${brand.key}`}>{brand.name}</span>}
    </Link>
  );
}

const tpWord = (r: number) => (r >= 4.5 ? 'Excellent' : r >= 4 ? 'Great' : r >= 3 ? 'Good' : 'Average');
const reviewDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default async function HomePage() {
  const [bikes, biz, banners, reviews] = await Promise.all([getPublicBikes(), getBusiness(), getBanners('home_hero'), getReviews()]);
  // Hero slides come from the CMS. A slide linked to a bike in stock shows that bike's live price.
  const heroSlides: HeroSlide[] = banners
    .filter((b) => b.imageUrl)
    .map((b) => {
      const bike = b.linkUrl?.startsWith('/used-bikes/') ? bikes.find((x) => `/used-bikes/${x.slug}` === b.linkUrl) : undefined;
      return {
        href: b.linkUrl || '/used-bikes',
        image: b.imageUrl!,
        photo: b.imageUrl!.includes('/bikes/'),
        name: b.title,
        kicker: b.subtitle ?? '',
        price: bike ? gbp(bike.price) : undefined,
        monthly: bike ? gbp(monthlyPayment(bike.price, 48), 2) : undefined,
      };
    });
  const tp = biz.trustpilot;
  const tpStars = { full: Math.floor(tp.rating), half: tp.rating % 1 >= 0.5 };
  const featured = bikes.filter((b) => b.featured).slice(0, 5);

  return (
    <>
      <section className="hero">
        <div className="slab" aria-hidden="true"></div>
        <div className="wrap">
          <div>
            <span className="eyebrow">
              <b>GearUp</b>Used motorbike specialists
            </span>
            <h1 className="disp">
              Quality used bikes.<span>At your door.</span>
            </h1>
            <p className="lede">
              Every bike HPI checked, 120-point inspected and sold with warranty. Reserve online, pay on finance or part-ex, then collect or
              have it delivered.
            </p>
            <div className="ctas">
              <Link href="/used-bikes" className="btn btn-red">
                Browse {bikes.length} bikes <Icon name="right" />
              </Link>
              <a href="#value" className="btn btn-ghost">
                Value my bike
              </a>
            </div>
            <div className="trust">
              <span className="tp">
                <Stars {...tpStars} />
                <span>
                  <b>{tp.rating}</b> on Trustpilot
                </span>
              </span>
              <span className="sep"></span>
              <span className="ck">
                <Icon name="check" />
                HPI Clear
              </span>
              <span className="ck">
                <Icon name="check" />
                14-Day Money Back
              </span>
            </div>
            <div className="nofee">
              <span className="nf-ic" aria-hidden="true">
                <Icon name="tag" />
              </span>
              <span>
                <b>No Admin Fees</b>
                <small>What You See Is What You Pay!</small>
              </span>
            </div>
          </div>
          <HeroCarousel slides={heroSlides} />
        </div>
      </section>

      <SearchDock makes={[...new Set(bikes.map((b) => b.make))].sort()} />

      <section className="stats" aria-label="Why buy from GearUp">
        <div className="wrap">
          <div className="stat">
            <b>{bikes.length}</b>
            <span>
              Bikes in stock<small>New arrivals every week</small>
            </span>
          </div>
          <div className="stat">
            <b>120</b>
            <span>
              Point inspection<small>On every bike we sell</small>
            </span>
          </div>
          <div className="stat">
            <b>30</b>
            <span>
              Days warranty<small>Standard, longer on selected bikes</small>
            </span>
          </div>
          <div className="stat">
            <b>£99</b>
            <span>
              To reserve online<small>Taken off the price of the bike</small>
            </span>
          </div>
        </div>
      </section>

      <section className="sec" id="stock">
        <div className="wrap">
          <div className="sh">
            <div>
              <span className="tag">Just arrived</span>
              <h2 className="disp">
                Fresh on the <em>forecourt</em>
              </h2>
              <p>Hand-picked, prepped in our workshop and ready to ride. Reserve online and it is yours.</p>
            </div>
            <Link href="/used-bikes" className="btn btn-ink">
              See all {bikes.length} bikes <Icon name="right" />
            </Link>
          </div>
          <div className="stock">
            {featured.map((bike, i) => (
              <BikeCard key={bike.slug} bike={bike} big={i === 0} />
            ))}
          </div>
          <div className="stock-note">
            <span>Monthly figures are an example over 48 months, £0 deposit, 19.9% APR representative. Finance subject to status and affordability.</span>
            <a href="#alerts" className="lnk">
              Set up a new stock alert <Icon name="right" />
            </a>
          </div>
        </div>
      </section>

      <section className="sec brandsec">
        <div className="wrap">
          <div className="sh" style={{ marginBottom: 22 }}>
            <div>
              <span className="tag">Shop by make</span>
            </div>
            <Link href="/used-bikes" className="lnk">
              All makes <Icon name="right" />
            </Link>
          </div>
        </div>
        <div className="marquee">
          <div className="mq-track">
            {brands.map((b) => (
              <BrandLink key={b.key} brand={b} />
            ))}
            {/* second copy makes the scrolling loop seamless */}
            {brands.map((b) => (
              <BrandLink key={`${b.key}-2`} brand={b} hidden />
            ))}
          </div>
        </div>
      </section>

      <section className="sec paper" id="budget">
        <div className="wrap">
          <div className="sh">
            <div>
              <span className="tag">Shop by budget</span>
              <h2 className="disp">
                What can you <em>afford?</em>
              </h2>
              <p>Start with a monthly figure. We will show you every bike that fits it.</p>
            </div>
          </div>
          <div className="budget">
            {budgets.map((b) => (
              <Link key={b.big} href={b.href} className={b.learner ? 'bud lrn' : 'bud'}>
                <small>{b.small}</small>
                <b>{b.big}</b>
                <span>{b.note}</span>
                <em>
                  View bikes <Icon name="right" />
                </em>
              </Link>
            ))}
          </div>

          <div className="fincta">
            <div>
              <span className="fc-k">GearUp Finance</span>
              <h3 className="disp">
                Good credit, poor credit.
                <br />
                <em>We&apos;ve got you covered.</em>
              </h3>
              <p>
                Tell us a little about yourself and our finance partner will come back with options. Once approved, pick any bike and ride it
                away on monthly payments.
              </p>
            </div>
            <div className="fc-a">
              <Link href="/finance#apply" className="btn btn-red">
                Apply for finance <Icon name="right" />
              </Link>
              <small>Finance subject to status and affordability.</small>
            </div>
          </div>
        </div>
      </section>

      <ValuationSection />

      <section className="sec" id="styles">
        <div className="wrap">
          <div className="sh">
            <div>
              <span className="tag">Shop by style</span>
              <h2 className="disp">
                Pick your <em>ride</em>
              </h2>
            </div>
            <Link href="/used-bikes" className="lnk">
              All motorbikes <Icon name="right" />
            </Link>
          </div>
          <div className="styles2">
            {styles.map((s) => (
              <Link key={s.key} href={`/used-bikes?style=${s.key}`} className="sty2">
                <span className="si">
                  <img src={`/assets/images/${s.img}`} alt="" loading="lazy" />
                </span>
                <b>{s.label}</b>
                <small>
                  View bikes <Icon name="right" />
                </small>
              </Link>
            ))}
          </div>
          <div className="styles-cta">
            <Link href="/used-bikes" className="btn btn-ink">
              Browse all motorbikes <Icon name="right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="sec paper why2" id="why">
        <div className="wrap">
          <div className="sh why-h">
            <div>
              <span className="tag">Why GearUp?</span>
              <h2 className="disp">
                Buying made <em>simple</em>
              </h2>
            </div>
          </div>
          <div className="why-g">
            {why.map((w) => (
              <div key={w.word} className="why-i">
                <span className="ico">
                  <img src={`/assets/images/icons/${w.icon}`} alt="" />
                </span>
                <h3>
                  GearUp <b>{w.word}</b>
                </h3>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sh">
            <div>
              <span className="tag">Compare</span>
              <h2 className="disp">
                Buy it right <em>the first time</em>
              </h2>
              <p>A cheap private sale can cost you more. Here is what comes with every GearUp bike.</p>
            </div>
            <Link href="/about" className="btn btn-ink">
              About GearUp <Icon name="right" />
            </Link>
          </div>
          <div className="compare-wrap" style={{ overflowX: 'auto' }}>
            <table className="compare">
              <thead>
                <tr>
                  <th>What you get</th>
                  <th className="us">GearUp</th>
                  <th>Private seller</th>
                  <th>Online classifieds</th>
                </tr>
              </thead>
              <tbody>
                {compare.map(([feature, priv, online]) => (
                  <tr key={feature}>
                    <td>{feature}</td>
                    <td className="us">
                      <Tick value={true} />
                    </td>
                    <td>
                      <Tick value={priv} />
                    </td>
                    <td>
                      <Tick value={online} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="insp-band">
        <div className="ib-img">
          <img src="/assets/images/lifestyle/mechanic-engine.webp" alt="Close-up of engine valve train" />
          <div className="big">
            <b>120</b>
            <small>Point inspection</small>
          </div>
        </div>
        <div className="ib-body">
          <span className="sh">
            <span className="tag">Inside the workshop</span>
          </span>
          <h2 className="disp" style={{ fontSize: 64, marginTop: 12 }}>
            Checked by <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>riders,</em>
            <br />
            not robots.
          </h2>
          <p className="muted" style={{ fontSize: 17, marginTop: 14, maxWidth: 520 }}>
            Before a bike goes on sale our technicians work through 120 checks across every system. If something is not right, we fix it or
            the bike does not go on sale.
          </p>
          <div className="cats">
            {inspectionAreas.map(([area, n]) => (
              <div key={area}>
                {area}
                <span>{n}</span>
              </div>
            ))}
          </div>
          <Link href="/warranty#inspection" className="lnk" style={{ marginTop: 26 }}>
            See the full checklist <Icon name="right" />
          </Link>
        </div>
      </section>

      <section className="wty2" id="warranty">
        <div className="w2-top">
          <div>
            <span className="sh">
              <span className="tag" style={{ background: 'var(--red)' }}>
                GearUp warranty
              </span>
            </span>
            <h2 className="disp">
              Peace of mind
              <br />
              <em>comes standard.</em>
            </h2>
            <p>
              Every bike leaves us with 30 days&apos; cover. Selected bikes include longer warranty free, and you can extend any bike to 12 or 24
              months at checkout.
            </p>
            <div className="note">
              <span>3 months warranty free</span>Spot this badge on a bike? Extra cover is already included.
            </div>
            <Link href="/warranty" className="btn btn-white mt2">
              Warranty explained <Icon name="right" />
            </Link>
          </div>
          <div className="tiers">
            {warrantyTiers.map((t) => (
              <div key={`${t.n}${t.unit}`} className={t.on ? 'tier on' : 'tier'}>
                <b>{t.n}</b>
                <i>{t.unit}</i>
                <small>{t.note}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="w2-hist">
          <div>
            <h3 className="disp">Bike history checks</h3>
            <p>Every bike is checked on its registration before it goes on sale.</p>
          </div>
          <div className="hchecks">
            {['Not reported stolen', 'Not scrapped', 'Not written off', 'No outstanding finance'].map((c) => (
              <span key={c}>
                <Icon name="check" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sh">
            <div>
              <span className="tag">Walkaround videos</span>
              <h2 className="disp">
                See it <em>before</em> you buy
              </h2>
              <p>Every bike gets a video: cold start, walkaround and close-ups of any marks. Ask for a live video call any time.</p>
            </div>
            <Link href="/contact" className="btn btn-ink">
              <Icon name="chat" />
              Book a video call
            </Link>
          </div>
          <div className="vids">
            {bikes.slice(0, 5).map((b) => (
              <Link key={b.slug} href={`/used-bikes/${b.slug}`} className="vid">
                <img src={b.image} alt="" />
                <span className="dur">{b.detail?.video ? 'Video' : `${b.detail?.gallery.length ?? 1} photos`}</span>
                <span className="pl">
                  <Icon name="play" />
                </span>
                <span>
                  <b>
                    {b.year} {b.make} {b.model}
                  </b>
                  <small>
                    {b.mileage.toLocaleString('en-GB')} miles · {gbp(b.price)}
                  </small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="fin" id="finance">
        <div className="fin-img">
          <img src="/assets/images/lifestyle/rider-helmet-leather.webp" alt="Rider in a helmet and leather jacket on a motorbike" />
        </div>
        <div className="fin-body">
          <span className="sh">
            <span className="tag" style={{ background: 'var(--red)' }}>
              Finance
            </span>
          </span>
          <h2 className="disp">
            Your bike,
            <br />
            <em>your budget.</em>
          </h2>
          <p>Spread the cost over 2 to 5 years. Good credit, bad credit or first bike, talk to us about your options.</p>
          <FinanceSlider />
          <p className="rep">
            Representative example: cash price £6,495, deposit £0, 48 monthly payments of £191.77, total payable £9,204.73, 19.9% APR
            representative. Finance subject to status and affordability.
          </p>
        </div>
      </section>

      <section className="sec paper">
        <div className="wrap">
          <div className="sh">
            <div>
              <span className="tag">Reviews</span>
              <h2 className="disp">
                Don&apos;t take <em>our word</em> for it
              </h2>
              <div className="tpbar">
                <Stars {...tpStars} />
                <span>
                  <b>{tpWord(tp.rating)}</b> · {tp.rating} out of 5 from {tp.count} reviews on Trustpilot
                </span>
              </div>
            </div>
            <Link href="/about#reviews" className="lnk">
              Read every review <Icon name="right" />
            </Link>
          </div>
          {reviews.length > 0 && (
            <div className="revs">
              <article className="rq">
                <Stars full={reviews[0].rating} />
                <p>{reviews[0].body}</p>
                <footer>
                  <b>{reviews[0].author}</b> · {reviewDate(reviews[0].date)} · {reviews[0].source}
                </footer>
              </article>
              <div className="rsm">
                {reviews.slice(1, 3).map((r) => (
                  <article key={r.id} className="rs">
                    <Stars full={r.rating} />
                    <p>{r.body}</p>
                    <footer>
                      <b>{r.author}</b> · {reviewDate(r.date)} · {r.source}
                    </footer>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="sec" id="more">
        <div className="wrap">
          <div className="duo">
            <Link href="/accessories" className="dt">
              <img src="/assets/images/lifestyle/rider-full-kit-sportsbike.webp" alt="Rider in full kit on a sportsbike" />
              <h3>
                Kit up
                <br />
                for the road
              </h3>
              <p>Helmets, jackets, gloves, locks and parts. Posted anywhere in the UK.</p>
              <span className="btn btn-red">
                Shop accessories <Icon name="right" />
              </span>
            </Link>
            <Link href="/workshop" className="dt">
              <img src="/assets/images/lifestyle/headlight-closeup.webp" alt="Close-up of a motorbike headlight" />
              <h3>
                Workshop
                <br />
                &amp; MOT
              </h3>
              <p>Servicing, MOTs and repairs on all makes, by the team that preps our stock.</p>
              <span className="btn btn-white">
                Book a service <Icon name="right" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="sec paper">
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.8fr) minmax(0,1.2fr)', gap: 50 }} id="faqgrid">
          <div>
            <span className="sh">
              <span className="tag">FAQs</span>
            </span>
            <h2 className="disp" style={{ fontSize: 64, marginTop: 12 }}>
              Good to <em style={{ fontStyle: 'normal', color: 'var(--red)' }}>know</em>
            </h2>
            <p className="muted" style={{ marginTop: 12, fontSize: 17 }}>
              The questions we get asked most. Anything else, just WhatsApp us.
            </p>
            <Link href="/faq" className="btn btn-ink mt2">
              All FAQs <Icon name="right" />
            </Link>
          </div>
          <FaqList section="home" openFirst />
        </div>
      </section>

      <section className="alertband" id="alerts">
        <div className="wrap">
          <div>
            <h2 className="disp">
              Not found <em>the one</em> yet?
            </h2>
            <p>Tell us what you are after. We will message you the moment a match lands, before it goes online.</p>
          </div>
          <AlertForm />
        </div>
      </section>

      <ScrollReveal selector=".why-i, .budget .bud, .stock .bc, .tiers .tier" />
      <RideIn selector=".styles2" />
    </>
  );
}
