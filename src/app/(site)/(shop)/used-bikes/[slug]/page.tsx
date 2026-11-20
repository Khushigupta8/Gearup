import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BikeBadge, BikeCard } from '@/components/bikes/BikeCard';
import { BikeGallery } from '@/components/bikes/BikeGallery';
import { PhotoGrid } from '@/components/bikes/PhotoGrid';
import { ShareButton } from '@/components/bikes/ShareButton';
import { DeliveryQuote } from '@/components/forms/DeliveryQuote';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Tabs } from '@/components/ui/Tabs';
import { bikeName, similarBikes, styleLabels } from '@/lib/bikes';
import { getPublicBike, getPublicBikes } from '@/server/services/bikes';
import { gbp, monthlyPayment } from '@/lib/format';
import { PHASE2 } from '@/lib/features';
import { site } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublicBikes()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const bike = await getPublicBike((await params).slug);
  if (!bike) return {};
  const warranty = bike.badge?.kind === 'warranty' ? `, ${bike.badge.months} months warranty included free` : '';
  return {
    title: bike.seoTitle ?? `${bikeName(bike)} · ${gbp(bike.price)}`,
    description: bike.seoDescription ?? `${bikeName(bike)}, ${bike.mileage.toLocaleString('en-GB')} miles, HPI clear and 120-point inspected${warranty}. Reserve online for £99.`,
  };
}

const usps: [IconName, string][] = [
  ['undo', '14-Day Money Back Guarantee'],
  ['swap', 'Part Exchange Welcome'],
  ['truck', 'Nationwide UK Delivery'],
  ['bolt', 'Quick Finance Decision'],
  ['shieldcheck', 'Good Or Poor Credit Considered'],
  ['wrench', 'Full PDI & 120-Point Inspection'],
];

const TERM = 48;

export default async function BikePage({ params }: Props) {
  const bike = await getPublicBike((await params).slug);
  if (!bike) notFound();
  const allBikes = await getPublicBikes();

  const name = bikeName(bike);
  const d = bike.detail;
  const monthly = monthlyPayment(bike.price, TERM);
  const styleLabel = styleLabels[bike.style];
  const reserved = bike.status === 'reserved';
  const photos = d?.gallery ?? [{ src: bike.image, label: 'Side view' }];

  const keySpecs: [IconName, string, string][] = [
    ['cal', 'Year', d?.plate ?? String(bike.year)],
    ['gauge', 'Mileage', `${bike.mileage.toLocaleString('en-GB')} miles`],
    ['engine', 'Engine', `${bike.engineCc.toLocaleString('en-GB')}cc`],
    ['bike', 'Body type', styleLabel],
    ['plate', 'Registration', bike.registration ?? 'Shown on viewing'],
    ...(d
      ? ([
          ['users', 'Previous owners', String(d.owners)],
          ['palette', 'Colour', d.colour],
          ['lplate', 'Licence', d.licence],
          ['fuel', 'Fuel', d.fuel],
          ['gear', 'Gearbox', d.gearbox],
        ] satisfies [IconName, string, string][])
      : []),
  ];

  const financeTab = (
    <>
      <table className="spec-t">
        <tbody>
          <tr>
            <th>Cash price</th>
            <td>{gbp(bike.price, 2)}</td>
          </tr>
          <tr>
            <th>Deposit</th>
            <td>£0.00</td>
          </tr>
          <tr>
            <th>{TERM} monthly payments</th>
            <td>{gbp(monthly, 2)}</td>
          </tr>
          <tr>
            <th>Representative APR</th>
            <td>19.9%</td>
          </tr>
          <tr>
            <th>Total payable</th>
            <td>{gbp(monthly * TERM, 2)}</td>
          </tr>
        </tbody>
      </table>
      <p className="muted mt1" style={{ fontSize: 13 }}>
        Representative example. Finance subject to status and affordability.
      </p>
    </>
  );

  const tabs = d
    ? [
        {
          id: 't-ov',
          label: 'Overview',
          className: 'prose',
          content: (
            <>
              <h3 className="h3">{d.headline}</h3>
              {d.overview.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <div className="mt2">
                <ul className="clist cols">
                  {d.features.map((f) => (
                    <li key={f}>
                      <Icon name="check" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ),
        },
        {
          id: 't-spec',
          label: 'Specification',
          content: (
            <table className="spec-t">
              <tbody>
                {d.spec.map(([k, v]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ),
        },
        {
          id: 't-insp',
          label: 'Inspection report',
          content: (
            <>
              <p className="muted" style={{ marginBottom: 16 }}>
                Completed {d.inspection.date} by our workshop. 120 of 120 checks passed.
              </p>
              <div className="insp">
                {d.inspection.results.map(([area, result]) => (
                  <div key={area}>
                    <Icon name="check" />
                    <span>
                      {area}
                      <small>{result}</small>
                    </span>
                  </div>
                ))}
              </div>
            </>
          ),
        },
        {
          id: 't-hist',
          label: 'History',
          content: (
            <>
              <ul className="hist">
                {d.history.map(([title, note]) => (
                  <li key={title}>
                    <b>{title}</b>
                    <small>{note}</small>
                  </li>
                ))}
              </ul>
              {d.receipts.length > 0 && (
                <div className="hist-rc">
                  <h4>Receipts and invoices</h4>
                  <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
                    Every receipt we hold for this bike. Tap one to read it full size.
                  </p>
                  <PhotoGrid photos={d.receipts} kind="receipt" />
                </div>
              )}
            </>
          ),
        },
        { id: 't-fin', label: 'Finance', content: financeTab },
      ]
    : [
        {
          id: 't-ov',
          label: 'Overview',
          className: 'prose',
          content: (
            <p>
              HPI checked, 120-point inspected, fresh MOT and full valet before sale. Ask us for the walkaround video or a live video call.
            </p>
          ),
        },
        { id: 't-fin', label: 'Finance', content: financeTab },
      ];

  return (
    <>
      <section className="sec" style={{ paddingTop: 26 }}>
        <div className="wrap">
          <div className="crumbs" style={{ color: 'var(--mut)' }}>
            <Link href="/">Home</Link>
            <span className="s">/</span>
            <Link href="/used-bikes">Motorbikes</Link>
            <span className="s">/</span>
            <Link href={`/used-bikes?make=${encodeURIComponent(bike.make.toLowerCase())}`}>{bike.make}</Link>
            <span className="s">/</span>
            <span>{bike.model}</span>
          </div>
          <div className="pdp">
            <div className="pdp-gal">
              <BikeGallery photos={photos} alt={name} badge={<BikeBadge bike={bike} />} video={d?.video} />
              <div className="kspecs" aria-label="Key details">
                {keySpecs.map(([icon, label, value]) => (
                  <div key={label}>
                    <span className="ki">
                      <Icon name={icon} />
                    </span>
                    <span>
                      <small>{label}</small>
                      <b>{value}</b>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="stick pdp-buy">
              <div className="buybox">
                <span className="mk">
                  {bike.make} · {styleLabel}
                </span>
                <h1>{bike.model}</h1>
                <div className="keys">
                  <span>
                    <Icon name="cal" />
                    {bike.year}
                  </span>
                  <span>
                    <Icon name="gauge" />
                    {bike.mileage.toLocaleString('en-GB')} miles
                  </span>
                  <span>
                    <Icon name="engine" />
                    {bike.engineCc}cc
                  </span>
                  {d && (
                    <span>
                      <Icon name="users" />
                      {d.owners} owners
                    </span>
                  )}
                </div>
                <div className="pricebox">
                  <div className="c">
                    <small>Cash price</small>
                    {gbp(bike.price)}
                  </div>
                  <div className="m">
                    <b>{gbp(monthly, 2)}</b>
                    <small>a month, £0 deposit</small>
                  </div>
                </div>
                {bike.badge?.kind === 'warranty' && (
                  <div className="wbadge" role="note">
                    <Icon name="shieldcheck" />
                    <span>
                      <b>{bike.badge.months} months warranty free</b>
                      {d?.warrantyWorth && <small>Worth £{d.warrantyWorth}, included with this bike</small>}
                    </span>
                  </div>
                )}
                <div className="acts">
                  {reserved ? (
                    <span className="btn btn-ink" aria-disabled="true">
                      Reserved
                    </span>
                  ) : (
                    <Link href={`/used-bikes/${bike.slug}/reserve`} className="btn btn-red">
                      Reserve online for £99 <Icon name="right" />
                    </Link>
                  )}
                  <div className="row">
                    <Link href="/finance" className="btn btn-ink">
                      Apply for finance
                    </Link>
                    <Link href="/part-exchange" className="btn btn-line">
                      Part-ex my bike
                    </Link>
                  </div>
                  <Link href="/contact" className="btn btn-line">
                    <Icon name="cal" />
                    Book a viewing
                  </Link>
                </div>
                <div className="contact">
                  <a href={site.phone.href} className="ph">
                    <Icon name="phone" />
                    {site.phone.display}
                  </a>
                  <a href={site.whatsapp} className="wa" target="_blank" rel="noopener">
                    <Icon name="wa" />
                    WhatsApp
                  </a>
                  <ShareButton title={name} />
                </div>
              </div>
              {/* Delivery price calculator is Phase 2 */}
              {PHASE2 && (
                <div className="qbox mt1">
                  <h4>Delivered to your door</h4>
                  <p>Enter your postcode for an instant delivery price.</p>
                  <DeliveryQuote />
                </div>
              )}
              <ul className="usp">
                {usps.map(([icon, text]) => (
                  <li key={text}>
                    <span className="ui">
                      <Icon name={icon} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </aside>

            <div className="pdp-tabs">
              <div className="mt3">
                <Tabs tabs={tabs} />
              </div>
              {/* Under the description (client, 19 Nov) */}
              {d && d.detailPhotos.length > 0 && (
                <section className="dpics" aria-labelledby="dpics-h">
                  <h2 id="dpics-h">Detailed pictures</h2>
                  <p className="muted">
                    Close-ups of every mark, scratch and sign of wear, so you know exactly what you are buying.
                  </p>
                  <PhotoGrid photos={d.detailPhotos} />
                </section>
              )}

            </div>
          </div>
        </div>
      </section>

      <section className="sec paper">
        <div className="wrap">
          <div className="sh">
            <div>
              <span className="tag">You might also like</span>
              <h2 className="disp">
                Similar <em>bikes</em>
              </h2>
            </div>
            <Link href="/used-bikes" className="btn btn-ink">
              All motorbikes <Icon name="right" />
            </Link>
          </div>
          <div className="stock">
            {similarBikes(bike, allBikes).map((b) => (
              <BikeCard key={b.slug} bike={b} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
