import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LeadControls, NoteForm } from '@/components/admin/CrmForms';
import { activityKinds, leadStages, leadTypes, timeAgo } from '@/lib/crm';
import { db } from '@/server/db';

export const metadata: Metadata = { title: 'Lead' };

const requestTime = () => Date.now();

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const now = requestTime();
  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      customer: { include: { _count: { select: { leads: true } } } },
      bike: { select: { id: true, slug: true, year: true, make: true, model: true, price: true, status: true } },
      activities: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!lead) notFound();

  const [staff, authors] = await Promise.all([
    db.user.findMany({ where: { role: { in: ['sales', 'manager', 'admin'] } }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    db.user.findMany({ where: { id: { in: lead.activities.map((a) => a.byUserId).filter((x): x is string => !!x) } }, select: { id: true, name: true } }),
  ]);
  const author = (uid: string | null) => authors.find((a) => a.id === uid)?.name ?? 'System';
  const c = lead.customer;
  const name = [c.firstName, c.lastName].filter(Boolean).join(' ');
  const data = (lead.data as Record<string, string> | null) ?? {};
  const phone = c.phone?.replace(/[^\d+]/g, '');
  const waNumber = phone?.startsWith('0') ? `44${phone.slice(1)}` : phone?.replace('+', '');

  return (
    <>
      <header className="adm-head">
        <div>
          <Link href="/admin/leads" className="adm-back">
            ← Leads
          </Link>
          <h1>{name}</h1>
          <p className="adm-muted">
            <span className={`adm-type t-${lead.type}`}>{leadTypes[lead.type]}</span> <span className={`adm-stage st-${lead.stage}`}>{leadStages[lead.stage]}</span>{' '}
            received {timeAgo(lead.createdAt, now)} from {lead.sourcePage ?? 'the website'}
          </p>
        </div>
        <div className="adm-inline">
          {phone && (
            <a className="adm-btn adm-btn-sm" href={`tel:${phone}`}>
              Call
            </a>
          )}
          {waNumber && (
            <a className="adm-btn adm-btn-sm adm-btn-wa" href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener">
              WhatsApp
            </a>
          )}
          {c.email && (
            <a className="adm-btn adm-btn-sm" href={`mailto:${c.email}`}>
              Email
            </a>
          )}
        </div>
      </header>

      <div className="adm-edit">
        <div className="adm-edit-main">
          <section className="adm-card adm-sec">
            <h2>What they sent</h2>
            {lead.bike && (
              <p>
                About{' '}
                <Link href={`/admin/stock/${lead.bike.id}`} className="adm-link">
                  {lead.bike.year} {lead.bike.make} {lead.bike.model}
                </Link>{' '}
                (£{(lead.bike.price / 100).toLocaleString('en-GB')}, {lead.bike.status})
              </p>
            )}
            {lead.message && <p className="adm-quote">{lead.message}</p>}
            <table className="adm-table adm-mini adm-kv">
              <tbody>
                {Object.entries(data).map(([k, v]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="adm-card adm-sec">
            <h2>Timeline</h2>
            <NoteForm leadId={lead.id} />
            <ol className="adm-timeline">
              {lead.activities.map((a) => (
                <li key={a.id}>
                  <span className={`adm-act k-${a.kind}`}>{activityKinds[a.kind as keyof typeof activityKinds] ?? a.kind}</span>
                  <div>
                    <p>{a.body}</p>
                    <small className="adm-muted">
                      {author(a.byUserId)} · {timeAgo(a.createdAt, now)}
                    </small>
                  </div>
                </li>
              ))}
              <li>
                <span className="adm-act k-update">Received</span>
                <div>
                  <p>{leadTypes[lead.type]} from the website</p>
                  <small className="adm-muted">{lead.createdAt.toLocaleString('en-GB')}</small>
                </div>
              </li>
            </ol>
          </section>
        </div>

        <aside className="adm-edit-side">
          <LeadControls
            id={lead.id}
            stage={lead.stage}
            assignedToId={lead.assignedToId}
            followUpAt={lead.followUpAt?.toISOString().slice(0, 10) ?? null}
            staff={staff}
          />
          <section className="adm-card adm-sec adm-stack">
            <h2>Customer</h2>
            <p>
              <b>{name}</b>
              <br />
              {c.email && (
                <>
                  {c.email}
                  <br />
                </>
              )}
              {c.phone && (
                <>
                  {c.phone}
                  <br />
                </>
              )}
              {c.postcode}
            </p>
            <p className="adm-muted">
              {c._count.leads} enquir{c._count.leads === 1 ? 'y' : 'ies'} in total
              {c.marketingConsent ? ' · happy to receive offers' : ''}
            </p>
            <Link href={`/admin/customers/${c.id}`} className="adm-link">
              Open customer →
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
