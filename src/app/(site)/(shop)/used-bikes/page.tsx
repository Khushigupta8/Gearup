import type { Metadata } from 'next';
import { pageMetadata } from '@/server/services/cms';
import Link from 'next/link';
import { Suspense } from 'react';
import { BikeListing } from '@/components/bikes/BikeListing';
import { FilterSelect } from '@/components/bikes/FilterSelect';
import { AlertForm } from '@/components/forms/AlertForm';
import { Icon } from '@/components/ui/Icon';
import {
  applyFilters,
  ccBands,
  countBy,
  extraOptions,
  licenceOf,
  licenceOptions,
  makeKey,
  parseFilters,
  setHref,
  toggleHref,
  type Filters,
  type SearchParams,
} from '@/lib/bike-filters';
import { styleLabels } from '@/lib/bikes';
import { gbp, monthlyPayment } from '@/lib/format';
import { getPublicBikes } from '@/server/services/bikes';
import type { Bike } from '@/types';

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata('/used-bikes', {
  title: 'Motorbikes for Sale',
  description: 'Browse quality used motorbikes. Every bike HPI checked, inspected and warranted, with finance, part-exchange and UK delivery.',
});
}

type Props = { searchParams: Promise<SearchParams> };

function Option({ href, on, label, count }: { href: string; on: boolean; label: string; count: number }) {
  return (
    <Link href={href} scroll={false} className={`fopt${count === 0 && !on ? ' empty' : ''}`} aria-pressed={on} rel="nofollow">
      <span>
        <input type="checkbox" checked={on} readOnly tabIndex={-1} aria-hidden="true" />
        {label}
      </span>
      <i>{count}</i>
    </Link>
  );
}

function Filters({ all, f, sp }: { all: Bike[]; f: Filters; sp: SearchParams }) {
  const makes = [...new Map(all.map((b) => [makeKey(b.make), b.make])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const styles = (Object.keys(styleLabels) as Bike['style'][]).filter((s) => all.some((b) => b.style === s));

  return (
    <>
      <div className="fh">
        <b>
          <Icon name="filter" />
          Filter bikes
        </b>
        <Link href="/used-bikes" scroll={false}>
          Clear all
        </Link>
      </div>
      <div className="fgroup">
        <h4>Make</h4>
        {makes.map(([key, name]) => (
          <Option key={key} href={toggleHref(sp, 'make', key)} on={f.make.includes(key)} label={name} count={countBy(all, f, 'make', (b) => makeKey(b.make) === key)} />
        ))}
      </div>
      <div className="fgroup">
        <h4>Style</h4>
        {styles.map((s) => (
          <Option key={s} href={toggleHref(sp, 'style', s)} on={f.style.includes(s)} label={styleLabels[s]} count={countBy(all, f, 'style', (b) => b.style === s)} />
        ))}
      </div>
      <div className="fgroup">
        <h4>Budget</h4>
        <div className="two">
          <FilterSelect name="min" label="Min £" options={[['2000', '£2,000'], ['4000', '£4,000'], ['6000', '£6,000'], ['8000', '£8,000']]} />
          <FilterSelect name="max" label="Max £" options={[['3000', '£3,000'], ['5000', '£5,000'], ['8000', '£8,000'], ['12000', '£12,000'], ['20000', '£20,000']]} />
        </div>
        <div style={{ marginTop: 8 }}>
          <FilterSelect name="monthly" label="Max per month" options={[['100', 'Up to £100 a month'], ['150', 'Up to £150 a month'], ['200', 'Up to £200 a month'], ['300', 'Up to £300 a month']]} />
        </div>
      </div>
      <div className="fgroup">
        <h4>Engine size</h4>
        {ccBands.map((band) => (
          <Option key={band.key} href={toggleHref(sp, 'cc', band.key)} on={f.cc.includes(band.key)} label={band.label} count={countBy(all, f, 'cc', (b) => band.test(b.engineCc))} />
        ))}
      </div>
      <div className="fgroup">
        <h4>Licence</h4>
        {licenceOptions.map((l) => (
          <Option key={l.key} href={toggleHref(sp, 'licence', l.key)} on={f.licence.includes(l.key)} label={l.label} count={countBy(all, f, 'licence', (b) => licenceOf(b) === l.key)} />
        ))}
      </div>
      <div className="fgroup">
        <h4>Year and mileage</h4>
        <div className="two">
          <FilterSelect name="year" label="Year from" options={[['2016', '2016'], ['2018', '2018'], ['2020', '2020'], ['2022', '2022']]} />
          <FilterSelect name="miles" label="Max miles" options={[['5000', '5,000'], ['10000', '10,000'], ['20000', '20,000']]} />
        </div>
      </div>
      <div className="fgroup">
        <h4>Extras</h4>
        {extraOptions.map((x) => (
          <Option
            key={x.key}
            href={toggleHref(sp, 'extra', x.key)}
            on={f.extra.includes(x.key)}
            label={x.label}
            count={countBy(all, f, 'extra', (b) =>
              x.key === 'warranty'
                ? b.badge?.kind === 'warranty'
                : x.key === 'drop'
                  ? Boolean(b.wasPrice)
                  : x.key === 'new'
                    ? b.badge?.kind === 'flag' && /just arrived/i.test(b.badge.text)
                    : b.status !== 'reserved',
            )}
          />
        ))}
      </div>
    </>
  );
}

/** Labels for the "applied filters" pills. */
function appliedPills(f: Filters, sp: SearchParams, all: Bike[]): { label: string; href: string }[] {
  const pills: { label: string; href: string }[] = [];
  const makeName = (k: string) => all.find((b) => makeKey(b.make).startsWith(k))?.make ?? k;
  for (const m of f.make) pills.push({ label: makeName(m), href: toggleHref(sp, 'make', m) });
  for (const s of f.style) pills.push({ label: styleLabels[s as Bike['style']] ?? s, href: toggleHref(sp, 'style', s) });
  for (const c of f.cc) pills.push({ label: ccBands.find((b) => b.key === c)?.label ?? c, href: toggleHref(sp, 'cc', c) });
  for (const l of f.licence) pills.push({ label: licenceOptions.find((o) => o.key === l)?.label ?? l, href: toggleHref(sp, 'licence', l) });
  for (const x of f.extra) pills.push({ label: extraOptions.find((o) => o.key === x)?.label ?? x, href: toggleHref(sp, 'extra', x) });
  if (f.condition) pills.push({ label: f.condition === 'new' ? 'New' : 'Used', href: toggleHref(sp, 'condition') });
  if (f.min) pills.push({ label: `From ${gbp(f.min)}`, href: toggleHref(sp, 'min') });
  if (f.max) pills.push({ label: `Up to ${gbp(f.max)}`, href: toggleHref(sp, 'max') });
  if (f.monthly) pills.push({ label: `Up to £${f.monthly} a month`, href: toggleHref(sp, 'monthly') });
  if (f.year) pills.push({ label: `${f.year} or newer`, href: toggleHref(sp, 'year') });
  if (f.miles) pills.push({ label: `Under ${f.miles.toLocaleString('en-GB')} miles`, href: toggleHref(sp, 'miles') });
  return pills;
}

const quick: { label: string; key: string; value?: string }[] = [
  { label: 'Under £5,000', key: 'max', value: '5000' },
  { label: '125cc & learner', key: 'cc', value: '125' },
  { label: '50cc moped', key: 'cc', value: '50' },
  { label: 'A2 compatible', key: 'licence', value: 'a2' },
  { label: 'Free warranty', key: 'extra', value: 'warranty' },
  { label: 'Price drops', key: 'extra', value: 'drop' },
  { label: 'Just arrived', key: 'extra', value: 'new' },
];

export default async function UsedBikesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const all = await getPublicBikes();
  const f = parseFilters(sp);
  const bikes = applyFilters(all, f);
  const pills = appliedPills(f, sp, all);
  const cheapest = all.length ? Math.min(...all.map((b) => b.price)) : 0;
  const isOn = (key: string, value?: string) => {
    const v = sp[key];
    return (Array.isArray(v) ? v : v ? v.split(',') : []).includes(value ?? '');
  };
  const usedCount = countBy(all, f, 'condition', (b) => (b.condition ?? 'used') === 'used');
  const newCount = countBy(all, f, 'condition', (b) => b.condition === 'new');

  return (
    <>
      <section className="phero">
        <div className="slab" aria-hidden="true"></div>
        <div className="wrap">
          <div>
            <div className="crumbs">
              <Link href="/">Home</Link>
              <span className="s">/</span>
              <span>Motorbikes</span>
            </div>
            <h1 className="disp">
              Motorbikes <em>in stock</em>
            </h1>
            <p className="lede">
              {all.length} bikes ready to ride. Every one HPI checked, 120-point inspected and sold with warranty. Reserve any bike online for £99.
            </p>
          </div>
          <div className="pbox">
            <b>{all.length}</b>
            <small>
              bikes in stock today, from {gbp(cheapest)} or {gbp(Math.round(monthlyPayment(cheapest, 48)))}/month
            </small>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="ntabs" role="tablist" aria-label="New or used">
            <Link href={toggleHref(sp, 'condition')} scroll={false} className={!f.condition ? 'on' : undefined}>
              All bikes <i>{usedCount + newCount}</i>
            </Link>
            <Link href={setHref(sp, 'condition', 'used')} scroll={false} className={f.condition === 'used' ? 'on' : undefined}>
              Used <i>{usedCount}</i>
            </Link>
            <Link href={setHref(sp, 'condition', 'new')} scroll={false} className={f.condition === 'new' ? 'on' : undefined}>
              New <i>{newCount}</i>
            </Link>
          </div>
          <div className="chips" style={{ marginBottom: 26 }}>
            <Link href="/used-bikes" scroll={false} className={`chip${pills.length === 0 ? ' on' : ''}`}>
              All bikes
            </Link>
            {quick.map((q) => (
              <Link key={q.label} href={q.key === 'max' ? (isOn('max', q.value) ? toggleHref(sp, 'max') : setHref(sp, 'max', q.value!)) : toggleHref(sp, q.key, q.value)} scroll={false} className={`chip${isOn(q.key, q.value) ? ' on' : ''}`} rel="nofollow">
                {q.label}
              </Link>
            ))}
          </div>
          <Suspense>
            <BikeListing
              key={JSON.stringify(sp)}
              bikes={bikes}
              filters={<Filters all={all} f={f} sp={sp} />}
              applied={pills.map((p) => (
                <Link key={p.label} href={p.href} scroll={false} rel="nofollow">
                  {p.label} <Icon name="x" />
                </Link>
              ))}
              promo={promoTile}
            />
          </Suspense>
        </div>
      </section>

      <section className="alertband">
        <div className="wrap">
          <div>
            <h2 className="disp">
              Can&apos;t see <em>the one?</em>
            </h2>
            <p>Set an alert and we will message you the moment a match arrives, before it goes online.</p>
          </div>
          <AlertForm doneText="Alert set. We will be in touch." />
        </div>
      </section>
    </>
  );
}

const promoTile = (
  <div className="promo-tile">
    <div>
      <span className="lab" style={{ fontSize: 13 }}>
        Part exchange
      </span>
      <h3>What&apos;s your bike worth?</h3>
      <p>Use your current bike as the deposit on any of these.</p>
    </div>
    <Link href="/part-exchange" className="btn btn-white">
      Value my bike <Icon name="right" />
    </Link>
  </div>
);
