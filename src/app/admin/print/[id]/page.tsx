import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';
import { PrintButton } from '@/components/admin/PrintButton';
import { styleLabels } from '@/lib/bikes';
import { gbp, monthlyPayment } from '@/lib/format';
import { site } from '@/lib/site';
import { requireStaff } from '@/server/auth';
import { db } from '@/server/db';
import { getBusiness } from '@/server/services/cms';
import './print.css';

export const metadata: Metadata = { title: 'Print bike' };

const licence = { cbt: 'CBT / learner', a2: 'A2', full_a: 'Full A' } as const;
const date = (d: Date | null) => (d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null);

/**
 * "Print bike" spec sheet (client, 23 Nov): A4 portrait, hung on the bike in the showroom.
 * Pulls the bike's details and photos and adds a QR code to the bike's page on the website.
 * Print from the browser (or "Save as PDF"). ?light=1 gives an ink-saving white version.
 */
export default async function PrintBikePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ light?: string }> }) {
  await requireStaff();
  const { id } = await params;
  const light = (await searchParams).light === '1';
  const [bike, biz] = await Promise.all([
    db.bike.findUnique({
      where: { id },
      include: { photos: { where: { kind: 'main' }, orderBy: { sortOrder: 'asc' }, take: 4 }, history: { orderBy: { sortOrder: 'asc' }, take: 4 } },
    }),
    getBusiness(true),
  ]);
  if (!bike) notFound();

  const url = `${site.url}/used-bikes/${bike.slug}`;
  const qr = await QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#0b0b0d', light: '#ffffff' } });
  const price = bike.price / 100;
  const monthly = monthlyPayment(price, 48);
  const name = `${bike.make} ${bike.model}`;
  const [hero, ...more] = bike.photos;

  const specs: [string, string | null][] = [
    ['Registration', bike.registration],
    ['Year', bike.plate ?? String(bike.year)],
    ['Mileage', `${bike.mileage.toLocaleString('en-GB')} miles`],
    ['Engine', `${bike.engineCc.toLocaleString('en-GB')}cc`],
    ['Category', styleLabels[bike.style]],
    ['Transmission', bike.gearbox],
    ['Fuel', bike.fuel],
    ['MOT expiry', date(bike.motExpiry)],
    ['Licence', bike.licence ? licence[bike.licence] : null],
    ['Colour', bike.colour],
    ['Previous owners', bike.owners != null ? String(bike.owners) : null],
    ['Keys', bike.keys != null ? String(bike.keys) : null],
  ];
  const shown = specs.filter(([, v]) => v);
  const features = (bike.features.length ? bike.features : bike.highlights).slice(0, 8);
  const warranty = bike.freeWarrantyMonths > 0 ? `${bike.freeWarrantyMonths} months warranty included free` : '30-day warranty included';

  return (
    <div className={light ? 'psheet-wrap light' : 'psheet-wrap'}>
      <div className="ptools">
        <a href={`/admin/stock/${bike.id}`}>← Back to bike</a>
        <a href={light ? '?' : '?light=1'}>{light ? 'Dark version' : 'Ink-saving white version'}</a>
        <PrintButton />
      </div>

      <article className="psheet">
        <header className="ps-top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/logo/gearup-logo.webp" alt="GearUp Motorcycles" className="ps-logo" />
          <div className="ps-contact">
            <b>{biz.phone}</b>
            <span>gearupmotorcycles.co.uk</span>
          </div>
        </header>

        <div className="ps-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {hero ? <img src={hero.url} alt={name} /> : <span>No photo yet</span>}
          {bike.freeWarrantyMonths > 0 && (
            <span className="ps-ribbon">
              {bike.freeWarrantyMonths} months
              <br />
              warranty free
            </span>
          )}
        </div>
        {more.length > 0 && (
          <div className="ps-thumbs">
            {more.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.id} src={p.url} alt="" />
            ))}
          </div>
        )}

        <div className="ps-title">
          <div>
            <small>
              {bike.year} · {styleLabels[bike.style]}
            </small>
            <h1>{name}</h1>
            {bike.variant && <p className="ps-variant">{bike.variant}</p>}
          </div>
          <div className="ps-price">
            <b>{gbp(price)}</b>
            <span>or {gbp(monthly, 2)}/month*</span>
          </div>
        </div>

        <div className="ps-body">
          <div className="ps-specs">
            {shown.map(([k, v]) => (
              <div key={k}>
                <small>{k}</small>
                <b>{v}</b>
              </div>
            ))}
          </div>

          <div className="ps-side">
            <div className="ps-qr">
              <div className="ps-qrcode" dangerouslySetInnerHTML={{ __html: qr }} />
              <div>
                <b>Scan me</b>
                <span>See every photo, the detailed pictures, receipts and finance on your phone.</span>
              </div>
            </div>
            <div className="ps-warranty">{warranty}</div>
          </div>
        </div>

        {(features.length > 0 || bike.history.length > 0) && (
          <div className="ps-lists">
            {features.length > 0 && (
              <div>
                <h2>Key features</h2>
                <ul>
                  {features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
            {bike.history.length > 0 && (
              <div>
                <h2>Service history</h2>
                <ul>
                  {bike.history.map((h) => (
                    <li key={h.id}>
                      {h.title}
                      {h.note ? `: ${h.note}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <ul className="ps-usps">
          <li>No admin fees</li>
          {bike.hpiClearAt && bike.hpiReference && <li>HPI clear · {date(bike.hpiClearAt)}</li>}
          {bike.inspectionCompletedAt && bike.inspectionReference && <li>120-point inspection · {date(bike.inspectionCompletedAt)}</li>}
          <li>Nationwide delivery</li>
          <li>Part-exchange welcome</li>
        </ul>

        <footer className="ps-foot">
          *Representative example: 48 monthly payments of {gbp(monthly, 2)}, £0 deposit, 19.9% APR representative, total payable{' '}
          {gbp(monthly * 48, 2)}. Finance subject to status and affordability. Ask us for details.
        </footer>
      </article>
    </div>
  );
}
